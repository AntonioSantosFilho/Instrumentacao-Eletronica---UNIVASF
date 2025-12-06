#include "temp_module.h"
#include "http_module.h"
#include "driver/i2c.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <stdio.h>

#define I2C_MASTER_SCL_IO 22
#define I2C_MASTER_SDA_IO 21
#define I2C_MASTER_NUM 0
#define I2C_MASTER_FREQ_HZ 100000
#define I2C_MASTER_TX_BUF_DISABLE 0
#define I2C_MASTER_RX_BUF_DISABLE 0
#define MLX90614_ADDR 0x5A
#define MLX90614_TOBJ1 0x07

static esp_err_t i2c_master_init(void) {
    int i2c_master_port = I2C_MASTER_NUM;
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = I2C_MASTER_SDA_IO,
        .scl_io_num = I2C_MASTER_SCL_IO,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = I2C_MASTER_FREQ_HZ,
    };
    i2c_param_config(i2c_master_port, &conf);
    return i2c_driver_install(i2c_master_port, conf.mode, I2C_MASTER_RX_BUF_DISABLE, I2C_MASTER_TX_BUF_DISABLE, 0);
}

float read_mlx90614() {
    uint8_t data_low, data_high, pec;
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (MLX90614_ADDR << 1) | I2C_MASTER_WRITE, true);
    i2c_master_write_byte(cmd, MLX90614_TOBJ1, true);
    
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (MLX90614_ADDR << 1) | I2C_MASTER_READ, true);
    i2c_master_read_byte(cmd, &data_low, I2C_MASTER_ACK);
    i2c_master_read_byte(cmd, &data_high, I2C_MASTER_ACK);
    i2c_master_read_byte(cmd, &pec, I2C_MASTER_NACK);
    i2c_master_stop(cmd);
    
    esp_err_t ret = i2c_master_cmd_begin(I2C_MASTER_NUM, cmd, 1000 / portTICK_PERIOD_MS);
    i2c_cmd_link_delete(cmd);

    if (ret == ESP_OK) {
        uint16_t temp_raw = (data_high << 8) | data_low;
        return (float)temp_raw * 0.02 - 273.15;
    } else {
        return -999.0;
    }
}

void temp_task(void *pvParameters) {
    while (1) {
        float temp = read_mlx90614();
        if (temp > -900) {
            printf("Temp: %.2f C. Sending data...\n", temp);
            char json_data[128];
            snprintf(json_data, sizeof(json_data), "{\"temperature\": %.2f}", temp);
            http_send_data("/api/sensors/temperature", json_data);
        } else {
            printf("Temp Sensor Error\n");
        }
        vTaskDelay(4000 / portTICK_PERIOD_MS);
    }
}

void temp_init(void) {
    i2c_master_init();
}

void temp_start_task(void) {
    xTaskCreate(temp_task, "temp_task", 8192, NULL, 5, NULL);
}
