#include "touch_module.h"
#include "http_module.h"
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <stdio.h>

#define TOUCH_PIN 2

void touch_task(void *pvParameters) {
    int last_state = 0;
    while (1) {
        int touch_state = gpio_get_level(TOUCH_PIN);
        if (touch_state == 1 && last_state == 0) {
            printf("Touch detected! Sending data...\n");
            http_send_data("/api/sensors/touch", "{\"value\": true}");
        }
        last_state = touch_state;
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

void touch_init(void) {
    gpio_set_direction(TOUCH_PIN, GPIO_MODE_INPUT);
}

void touch_start_task(void) {
    xTaskCreate(touch_task, "touch_task", 8192, NULL, 5, NULL);
}
