#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "gps_module.h"
#include "touch_module.h"
#include "temp_module.h"
#include "door_module.h"
#include "wifi_module.h"

void app_main(void) {
    // Initialize modules
    wifi_init();
    wifi_wait_for_connection();
    
    gps_init();
    touch_init();
    temp_init();
    door_init();

    // Start tasks
    gps_start_task();
    touch_start_task();
    temp_start_task();
    door_start_task();
}
