-- Script SIMPLIFICADO para inserir dados básicos
-- Use este script para inserir dados específicos manualmente

-- Inserir dispositivo
INSERT INTO devices (id, name, description, status, battery_level) 
VALUES ('default', 'Dispositivo Principal', 'Dispositivo de monitoramento', 'active', 85)
ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP;

-- Inserir uma leitura de temperatura
INSERT INTO temperature_sensor (temperature, humidity, device_id) 
VALUES (5.2, 65, 'default');

-- Inserir uma localização GPS (coordenadas de São Paulo)
INSERT INTO gps_sensor (latitude, longitude, device_id) 
VALUES (-23.5505, -46.6333, 'default');

-- Inserir estado da porta
INSERT INTO door_sensor (state, device_id) 
VALUES ('closed', 'default');

-- Inserir sensor de toque
INSERT INTO touch_sensor (value, device_id) 
VALUES (1, 'default');

-- Inserir um alerta
INSERT INTO alerts (alert_type, severity, description, device_id) 
VALUES ('temperature', 'medium', 'Temperatura dentro dos limites', 'default');

-- Inserir um transporte
INSERT INTO transports (device_id, origin, destination, status, operator_name, vaccine_type, quantity) 
VALUES ('default', 'Origem', 'Destino', 'in_progress', 'Operador', 'COVID-19', 100);

-- Atualizar último contato
UPDATE devices SET last_seen = NOW() WHERE id = 'default';

SELECT 'Dados básicos inseridos!' AS status;


