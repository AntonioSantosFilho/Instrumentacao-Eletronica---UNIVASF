/**
 * Exemplo de payload que o microcontrolador deve enviar para cada sensor
 *
 * Este arquivo serve como documentação para a integração com o hardware
 */

// Exemplo de payload para sensor de temperatura
export const temperaturePayload = {
  temperature: 4.5, // Temperatura em Celsius (obrigatório)
  humidity: 65.2, // Umidade relativa % (opcional)
  device_id: "esp32-001", // ID do dispositivo (opcional, default: 'default')
}

// Exemplo de payload para sensor GPS
export const gpsPayload = {
  latitude: -23.55052, // Latitude (obrigatório)
  longitude: -46.633308, // Longitude (obrigatório)
  latitude_dir: "S", // Direção da latitude (opcional)
  longitude_dir: "W", // Direção da longitude (opcional)
  fix_quality: "1", // Qualidade do fix GPS (opcional)
  satellites: 8, // Número de satélites (opcional)
  hdop: 1.2, // Horizontal Dilution of Precision (opcional)
  altitude: 760.5, // Altitude em metros (opcional)
  speed: 45.2, // Velocidade em km/h (opcional)
  course: 180.5, // Direção em graus (opcional)
  date: "2024-01-15", // Data do GPS (opcional)
  device_id: "esp32-001", // ID do dispositivo (opcional)
}

// Exemplo de payload para sensor de porta
export const doorPayload = {
  state: "closed", // Estado: 'open' ou 'closed' (obrigatório)
  device_id: "esp32-001", // ID do dispositivo (opcional)
}

// Exemplo de payload para sensor touch
export const touchPayload = {
  value: true, // True = toque detectado (obrigatório)
  device_id: "esp32-001", // ID do dispositivo (opcional)
}

// Exemplo de registro de dispositivo
export const devicePayload = {
  id: "esp32-001", // ID único do dispositivo (obrigatório)
  name: "Caixa Térmica #1", // Nome do dispositivo (obrigatório)
  description: "Caixa térmica para vacinas COVID-19", // Descrição (opcional)
  firmware_version: "1.0.0", // Versão do firmware (opcional)
}

/**
 * Código de exemplo para ESP32 (Arduino)
 *
 * ```cpp
 * #include <WiFi.h>
 * #include <HTTPClient.h>
 * #include <ArduinoJson.h>
 *
 * const char* serverUrl = "http://seu-servidor:3000";
 * const char* deviceId = "esp32-001";
 *
 * void sendTemperature(float temp, float humidity) {
 *   if (WiFi.status() == WL_CONNECTED) {
 *     HTTPClient http;
 *     http.begin(String(serverUrl) + "/api/sensors/temperature");
 *     http.addHeader("Content-Type", "application/json");
 *
 *     StaticJsonDocument<200> doc;
 *     doc["temperature"] = temp;
 *     doc["humidity"] = humidity;
 *     doc["device_id"] = deviceId;
 *
 *     String jsonString;
 *     serializeJson(doc, jsonString);
 *
 *     int httpResponseCode = http.POST(jsonString);
 *
 *     if (httpResponseCode > 0) {
 *       Serial.println("Temperatura enviada com sucesso");
 *     } else {
 *       Serial.println("Erro ao enviar temperatura");
 *     }
 *
 *     http.end();
 *   }
 * }
 *
 * void sendDoorState(bool isOpen) {
 *   if (WiFi.status() == WL_CONNECTED) {
 *     HTTPClient http;
 *     http.begin(String(serverUrl) + "/api/sensors/door");
 *     http.addHeader("Content-Type", "application/json");
 *
 *     StaticJsonDocument<200> doc;
 *     doc["state"] = isOpen ? "open" : "closed";
 *     doc["device_id"] = deviceId;
 *
 *     String jsonString;
 *     serializeJson(doc, jsonString);
 *
 *     http.POST(jsonString);
 *     http.end();
 *   }
 * }
 * ```
 */
