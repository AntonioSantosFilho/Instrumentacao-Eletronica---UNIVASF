-- Script de migração SIMPLIFICADO para adicionar colunas faltantes
-- Execute este script no seu banco de dados MySQL
-- Se alguma coluna já existir, o MySQL retornará um erro que pode ser ignorado

-- Adicionar coluna device_id na tabela gps_sensor
ALTER TABLE gps_sensor 
ADD COLUMN device_id VARCHAR(50) DEFAULT 'default' AFTER date;

-- Criar índice para device_id na tabela gps_sensor (ignore erro se já existir)
CREATE INDEX idx_device ON gps_sensor (device_id);

-- Adicionar colunas na tabela alerts (execute uma por vez se houver erro)
-- Primeiro, verificar se a tabela alerts existe e tem as colunas básicas
ALTER TABLE alerts 
ADD COLUMN alert_type ENUM('temperature', 'door', 'location', 'touch', 'connection', 'battery') NOT NULL AFTER timestamp;

ALTER TABLE alerts 
ADD COLUMN severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium' AFTER alert_type;

ALTER TABLE alerts 
ADD COLUMN resolved BOOLEAN DEFAULT FALSE AFTER description;

ALTER TABLE alerts 
ADD COLUMN resolved_at DATETIME AFTER resolved;

ALTER TABLE alerts 
ADD COLUMN device_id VARCHAR(50) DEFAULT 'default' AFTER resolved_at;

-- Criar índices para alerts (ignore erros se já existirem)
CREATE INDEX idx_type ON alerts (alert_type);
CREATE INDEX idx_severity ON alerts (severity);
CREATE INDEX idx_resolved ON alerts (resolved);
CREATE INDEX idx_device_alerts ON alerts (device_id);

