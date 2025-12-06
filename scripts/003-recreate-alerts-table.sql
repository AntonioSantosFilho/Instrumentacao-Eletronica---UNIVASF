-- Script para recriar a tabela alerts com todas as colunas necessárias
-- ATENÇÃO: Este script vai DROPAR a tabela alerts se ela existir
-- Se você tem dados importantes, faça backup primeiro!

-- Dropar a tabela alerts se existir
DROP TABLE IF EXISTS alerts;

-- Recriar a tabela alerts com todas as colunas corretas
CREATE TABLE alerts (
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
    INDEX idx_resolved (resolved),
    INDEX idx_device_alerts (device_id)
);


