#include "gps_module.h"
#include "http_module.h"
#include "driver/uart.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <string.h>
#include <stdio.h>

#define RX_PIN 16
#define TX_PIN 17
#define UART_NUM UART_NUM_2
#define BUF_SIZE 1024

// Helper to parse NMEA comma-separated values
char* next_token(char* src, char* dest) {
    int i = 0;
    while (*src != ',' && *src != '*' && *src != '\0' && *src != '\r' && *src != '\n') {
        dest[i++] = *src++;
    }
    dest[i] = '\0';
    if (*src == ',') return src + 1;
    return src;
}

typedef struct {
    char time[16];
    char lat[16];
    char lat_dir[2];
    char lon[16];
    char lon_dir[2];
    char fix_quality[2];
    char satellites[4];
    char hdop[8];
    char altitude[10];
    char speed[10];
    char course[10];
    char date[10];
} gps_data_t;

gps_data_t current_gps_data;

void parse_nmea(char *line) {
    char token[32];
    char *ptr = line;

    if (strncmp(line, "$GPGGA", 6) == 0) {
        ptr = strchr(ptr, ','); if (!ptr) return; ptr++; // Skip $GPGGA
        ptr = next_token(ptr, current_gps_data.time);
        ptr = next_token(ptr, current_gps_data.lat);
        ptr = next_token(ptr, current_gps_data.lat_dir);
        ptr = next_token(ptr, current_gps_data.lon);
        ptr = next_token(ptr, current_gps_data.lon_dir);
        ptr = next_token(ptr, current_gps_data.fix_quality);
        ptr = next_token(ptr, current_gps_data.satellites);
        ptr = next_token(ptr, current_gps_data.hdop);
        ptr = next_token(ptr, current_gps_data.altitude);
    } else if (strncmp(line, "$GPRMC", 6) == 0) {
        ptr = strchr(ptr, ','); if (!ptr) return; ptr++; // Skip $GPRMC
        ptr = next_token(ptr, current_gps_data.time);
        ptr = next_token(ptr, token); // status
        ptr = next_token(ptr, current_gps_data.lat);
        ptr = next_token(ptr, current_gps_data.lat_dir);
        ptr = next_token(ptr, current_gps_data.lon);
        ptr = next_token(ptr, current_gps_data.lon_dir);
        ptr = next_token(ptr, current_gps_data.speed);
        ptr = next_token(ptr, current_gps_data.course);
        ptr = next_token(ptr, current_gps_data.date);
    }
}

void gps_task(void *pvParameters) {
    uint8_t *data = (uint8_t *) malloc(BUF_SIZE);
    char line_buffer[256];
    int line_pos = 0;
    TickType_t last_send_time = 0;

    memset(&current_gps_data, 0, sizeof(gps_data_t));

    while (1) {
        int len = uart_read_bytes(UART_NUM, data, BUF_SIZE - 1, 100 / portTICK_PERIOD_MS);
        if (len > 0) {
            for (int i = 0; i < len; i++) {
                char c = (char)data[i];
                if (c == '\n' || c == '\r') {
                    if (line_pos > 0) {
                        line_buffer[line_pos] = '\0';
                        parse_nmea(line_buffer);
                        line_pos = 0;
                    }
                } else if (line_pos < sizeof(line_buffer) - 1) {
                    line_buffer[line_pos++] = c;
                }
            }
        }

        // Send data every 10 seconds
        TickType_t now = xTaskGetTickCount();
        if ((now - last_send_time) >= (10000 / portTICK_PERIOD_MS)) {
            if (strlen(current_gps_data.lat) > 0) { // Only send if we have some data
                printf("Sending GPS Data...\n");
                char json_data[512];
                snprintf(json_data, sizeof(json_data), 
                    "{\"latitude\": %s, \"longitude\": %s, \"latitude_dir\": \"%s\", \"longitude_dir\": \"%s\", \"fix_quality\": \"%s\", \"satellites\": %s, \"hdop\": %s, \"altitude\": %s, \"speed\": %s, \"course\": %s, \"date\": \"%s\"}",
                    current_gps_data.lat, current_gps_data.lon, current_gps_data.lat_dir, current_gps_data.lon_dir,
                    current_gps_data.fix_quality, current_gps_data.satellites, current_gps_data.hdop,
                    current_gps_data.altitude, current_gps_data.speed, current_gps_data.course, current_gps_data.date);
                http_send_data("/api/sensors/gps", json_data);
            } else {
                 printf("GPS waiting for fix...\n");
            }
            last_send_time = now;
        }
    }
    free(data);
}

void gps_init(void) {
    const uart_config_t uart_config = {
        .baud_rate = 9600,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
        .source_clk = UART_SCLK_DEFAULT,
    };
    uart_driver_install(UART_NUM, BUF_SIZE * 2, 0, 0, NULL, 0);
    uart_param_config(UART_NUM, &uart_config);
    uart_set_pin(UART_NUM, TX_PIN, RX_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE);
}

void gps_start_task(void) {
    xTaskCreate(gps_task, "gps_task", 8192, NULL, 5, NULL);
}
