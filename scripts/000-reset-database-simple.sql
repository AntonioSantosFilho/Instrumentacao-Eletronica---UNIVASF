SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS transports;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS temperature_sensor;
DROP TABLE IF EXISTS door_sensor;
DROP TABLE IF EXISTS gps_sensor;
DROP TABLE IF EXISTS touch_sensor;
DROP TABLE IF EXISTS devices;

CREATE TABLE devices (
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

CREATE TABLE touch_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    value TINYINT(1) NOT NULL,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE TABLE gps_sensor (
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
    INDEX idx_location (latitude, longitude),
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE TABLE door_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    state ENUM('open', 'closed') NOT NULL,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    INDEX idx_state (state),
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE TABLE temperature_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT NOT NULL,
    humidity FLOAT,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    INDEX idx_temperature (temperature),
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    alert_type ENUM('temperature', 'door', 'location', 'touch', 'connection', 'battery') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL,
    resolved TINYINT(1) DEFAULT 0,
    resolved_at DATETIME,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_type (alert_type),
    INDEX idx_severity (severity),
    INDEX idx_resolved (resolved),
    INDEX idx_device (device_id),
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE TABLE transports (
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

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO devices (id, name, description, status) 
VALUES ('default', 'Dispositivo Principal', 'Dispositivo de monitoramento padrão', 'active')
ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP;


