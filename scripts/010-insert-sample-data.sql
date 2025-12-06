-- Script para inserir dados de exemplo no banco de dados
-- Execute este script após criar as tabelas para ter dados para testes

-- Garantir que o dispositivo padrão existe
INSERT INTO devices (id, name, description, status, battery_level, firmware_version) 
VALUES ('default', 'Dispositivo Principal', 'Dispositivo de monitoramento padrão', 'active', 85, '1.0.0')
ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP;

-- Inserir dados de temperatura (últimas 24 horas simuladas)
INSERT INTO temperature_sensor (temperature, humidity, device_id, timestamp) VALUES
(4.5, 65, 'default', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(5.2, 66, 'default', DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(4.8, 64, 'default', DATE_SUB(NOW(), INTERVAL 21 HOUR)),
(5.5, 67, 'default', DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(4.2, 63, 'default', DATE_SUB(NOW(), INTERVAL 19 HOUR)),
(5.8, 68, 'default', DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(4.9, 65, 'default', DATE_SUB(NOW(), INTERVAL 17 HOUR)),
(5.3, 66, 'default', DATE_SUB(NOW(), INTERVAL 16 HOUR)),
(4.7, 64, 'default', DATE_SUB(NOW(), INTERVAL 15 HOUR)),
(5.1, 67, 'default', DATE_SUB(NOW(), INTERVAL 14 HOUR)),
(4.6, 65, 'default', DATE_SUB(NOW(), INTERVAL 13 HOUR)),
(5.4, 68, 'default', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(4.8, 66, 'default', DATE_SUB(NOW(), INTERVAL 11 HOUR)),
(5.2, 67, 'default', DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(4.9, 65, 'default', DATE_SUB(NOW(), INTERVAL 9 HOUR)),
(5.6, 69, 'default', DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(4.5, 64, 'default', DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(5.3, 66, 'default', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(4.7, 65, 'default', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(5.0, 67, 'default', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(4.8, 66, 'default', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(5.2, 68, 'default', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(4.9, 65, 'default', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(5.1, 67, 'default', NOW());

-- Inserir dados GPS (rota simulada)
INSERT INTO gps_sensor (latitude, longitude, device_id, timestamp) VALUES
(-23.5505, -46.6333, 'default', DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(-23.5510, -46.6340, 'default', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(-23.5515, -46.6345, 'default', DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(-23.5520, -46.6350, 'default', DATE_SUB(NOW(), INTERVAL 21 HOUR)),
(-23.5525, -46.6355, 'default', DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(-23.5530, -46.6360, 'default', DATE_SUB(NOW(), INTERVAL 19 HOUR)),
(-23.5535, -46.6365, 'default', DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(-23.5540, -46.6370, 'default', DATE_SUB(NOW(), INTERVAL 17 HOUR)),
(-23.5545, -46.6375, 'default', DATE_SUB(NOW(), INTERVAL 16 HOUR)),
(-23.5550, -46.6380, 'default', DATE_SUB(NOW(), INTERVAL 15 HOUR)),
(-23.5555, -46.6385, 'default', DATE_SUB(NOW(), INTERVAL 14 HOUR)),
(-23.5560, -46.6390, 'default', DATE_SUB(NOW(), INTERVAL 13 HOUR)),
(-23.5565, -46.6395, 'default', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(-23.5570, -46.6400, 'default', DATE_SUB(NOW(), INTERVAL 11 HOUR)),
(-23.5575, -46.6405, 'default', DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(-23.5580, -46.6410, 'default', DATE_SUB(NOW(), INTERVAL 9 HOUR)),
(-23.5585, -46.6415, 'default', DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(-23.5590, -46.6420, 'default', DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(-23.5595, -46.6425, 'default', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(-23.5600, -46.6430, 'default', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(-23.5605, -46.6435, 'default', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(-23.5610, -46.6440, 'default', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(-23.5615, -46.6445, 'default', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(-23.5620, -46.6450, 'default', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(-23.5625, -46.6455, 'default', NOW());

-- Inserir estados da porta
INSERT INTO door_sensor (state, device_id, timestamp) VALUES
('closed', 'default', DATE_SUB(NOW(), INTERVAL 24 HOUR)),
('closed', 'default', DATE_SUB(NOW(), INTERVAL 20 HOUR)),
('open', 'default', DATE_SUB(NOW(), INTERVAL 19 HOUR)),
('closed', 'default', DATE_SUB(NOW(), INTERVAL 18 HOUR)),
('closed', 'default', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
('open', 'default', DATE_SUB(NOW(), INTERVAL 11 HOUR)),
('closed', 'default', DATE_SUB(NOW(), INTERVAL 10 HOUR)),
('closed', 'default', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
('open', 'default', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
('closed', 'default', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
('closed', 'default', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- Inserir dados do sensor de toque
INSERT INTO touch_sensor (value, device_id, timestamp) VALUES
(1, 'default', DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(0, 'default', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(1, 'default', DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(0, 'default', DATE_SUB(NOW(), INTERVAL 19 HOUR)),
(1, 'default', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(0, 'default', DATE_SUB(NOW(), INTERVAL 11 HOUR)),
(1, 'default', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(0, 'default', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(1, 'default', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- Inserir alertas de exemplo
INSERT INTO alerts (alert_type, severity, description, resolved, device_id, timestamp) VALUES
('temperature', 'high', 'Temperatura acima do limite: 9.5°C (máximo: 8°C)', 0, 'default', DATE_SUB(NOW(), INTERVAL 15 HOUR)),
('door', 'medium', 'Porta da caixa térmica foi aberta', 1, 'default', DATE_SUB(NOW(), INTERVAL 19 HOUR)),
('temperature', 'critical', 'Temperatura crítica: 12.3°C (máximo: 8°C)', 0, 'default', DATE_SUB(NOW(), INTERVAL 10 HOUR)),
('door', 'medium', 'Porta da caixa térmica foi aberta', 0, 'default', DATE_SUB(NOW(), INTERVAL 11 HOUR)),
('temperature', 'low', 'Temperatura abaixo do limite: 1.2°C (mínimo: 2°C)', 1, 'default', DATE_SUB(NOW(), INTERVAL 8 HOUR)),
('door', 'medium', 'Porta da caixa térmica foi aberta', 0, 'default', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
('connection', 'low', 'Perda de conexão temporária com o dispositivo', 1, 'default', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('battery', 'medium', 'Bateria abaixo de 20%', 0, 'default', DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- Inserir transportes de exemplo
INSERT INTO transports (device_id, origin, destination, status, operator_name, vaccine_type, quantity, min_temp, max_temp, start_time) VALUES
('default', 'Centro de Distribuição - SP', 'Hospital Central - SP', 'completed', 'João Silva', 'COVID-19', 500, 2.0, 8.0, DATE_SUB(NOW(), INTERVAL 25 HOUR)),
('default', 'Hospital Central - SP', 'Posto de Saúde - Zona Norte', 'in_progress', 'Maria Santos', 'Influenza', 200, 2.0, 8.0, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('default', 'Centro de Distribuição - SP', 'Clínica Municipal', 'completed', 'Pedro Oliveira', 'Hepatite B', 100, 2.0, 8.0, DATE_SUB(NOW(), INTERVAL 30 HOUR));

-- Atualizar último contato do dispositivo
UPDATE devices SET last_seen = NOW() WHERE id = 'default';

SELECT 'Dados de exemplo inseridos com sucesso!' AS status;


