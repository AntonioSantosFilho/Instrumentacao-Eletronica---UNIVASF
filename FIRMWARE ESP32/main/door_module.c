#include "door_module.h"
#include "http_module.h"
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <stdio.h>

#define DOOR_PIN 18

void door_task(void *pvParameters) {
    int last_state = -1;
    while (1) {
        int door_state = gpio_get_level(DOOR_PIN);
        if (door_state != last_state) {
            if (door_state == 0) {
                printf("Porta fechada. Enviando dados...\n");
                http_send_data("/api/sensors/door", "{\"state\": \"closed\"}");
            } else {
                printf("Porta aberta. Enviando dados...\n");
                http_send_data("/api/sensors/door", "{\"state\": \"open\"}");
            }
            last_state = door_state;
        }
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}

void door_init(void) {
    gpio_config_t io_conf = {};
    io_conf.intr_type = GPIO_INTR_DISABLE;
    io_conf.mode = GPIO_MODE_INPUT;
    io_conf.pin_bit_mask = (1ULL << DOOR_PIN);
    io_conf.pull_down_en = 0;
    io_conf.pull_up_en = 1;
    gpio_config(&io_conf);
}

void door_start_task(void) {
    xTaskCreate(door_task, "door_task", 8192, NULL, 5, NULL);
}
