-- Script para criar as tabelas do sistema de monitoramento de vacinas
-- Execute este script no banco de dados MySQL

-- Tabela: touch_sensor
-- Armazena as informações sobre a ativação do transporte (toque na caixa)
CREATE TABLE IF NOT EXISTS touch_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    value BOOLEAN NOT NULL,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id)
);

-- Tabela: gps_sensor
-- Armazena os dados de localização geográfica
CREATE TABLE IF NOT EXISTS gps_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    latitude_dir VARCHAR(2),
    longitude_dir VARCHAR(2),
    fix_quality VARCHAR(10),
    satellites INT,
    hdop FLOAT,
    altitude FLOAT,
    speed FLOAT,
    course FLOAT,
    date DATE,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    INDEX idx_location (latitude, longitude)
);

-- Tabela: door_sensor
-- Armazena informações sobre o estado da porta (aberta ou fechada)
CREATE TABLE IF NOT EXISTS door_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    state ENUM('open', 'closed') NOT NULL,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    INDEX idx_state (state)
);

-- Tabela: temperature_sensor
-- Armazena os dados de temperatura da caixa térmica
CREATE TABLE IF NOT EXISTS temperature_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT NOT NULL,
    humidity FLOAT,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    INDEX idx_temperature (temperature)
);

-- Tabela: alerts
-- Armazena os alertas gerados pelo sistema
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    alert_type ENUM('temperature', 'door', 'location', 'touch', 'connection', 'battery') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_type (alert_type),
    INDEX idx_severity (severity),
    INDEX idx_resolved (resolved)
);

-- Tabela: devices
-- Armazena informações sobre os dispositivos de monitoramento
CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    battery_level INT,
    firmware_version VARCHAR(20),
    INDEX idx_status (status),
    INDEX idx_last_seen (last_seen)
);

-- Tabela: transports
-- Armazena informações sobre os transportes de vacinas
CREATE TABLE IF NOT EXISTS transports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50),
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    origin VARCHAR(255),
    destination VARCHAR(255),
    status ENUM('in_progress', 'completed', 'cancelled', 'alert') DEFAULT 'in_progress',
    operator_name VARCHAR(100),
    vaccine_type VARCHAR(100),
    quantity INT,
    min_temp FLOAT DEFAULT 2.0,
    max_temp FLOAT DEFAULT 8.0,
    notes TEXT,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_device (device_id),
    INDEX idx_start_time (start_time)
);

-- Inserir dispositivo padrão para testes
INSERT INTO devices (id, name, description, status) 
VALUES ('default', 'Dispositivo Principal', 'Dispositivo de monitoramento padrão', 'active')
ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP;
