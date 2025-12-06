-- Script COMPLETO de migração para corrigir todas as tabelas
-- Execute este script no seu banco de dados MySQL
-- Este script tenta adicionar todas as colunas faltantes

-- ============================================
-- 1. CORRIGIR TABELA gps_sensor
-- ============================================
-- Adicionar coluna device_id se não existir
ALTER TABLE gps_sensor 
ADD COLUMN device_id VARCHAR(50) DEFAULT 'default' AFTER date;

-- Criar índice (ignore erro se já existir)
CREATE INDEX idx_device ON gps_sensor (device_id);

-- ============================================
-- 2. CORRIGIR TABELA alerts
-- ============================================
-- Adicionar coluna alert_type se não existir
ALTER TABLE alerts 
ADD COLUMN alert_type ENUM('temperature', 'door', 'location', 'touch', 'connection', 'battery') NOT NULL AFTER timestamp;

-- Adicionar coluna severity se não existir
ALTER TABLE alerts 
ADD COLUMN severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium' AFTER alert_type;

-- Adicionar coluna resolved se não existir
ALTER TABLE alerts 
ADD COLUMN resolved BOOLEAN DEFAULT FALSE AFTER description;

-- Adicionar coluna resolved_at se não existir
ALTER TABLE alerts 
ADD COLUMN resolved_at DATETIME AFTER resolved;

-- Adicionar coluna device_id se não existir
ALTER TABLE alerts 
ADD COLUMN device_id VARCHAR(50) DEFAULT 'default' AFTER resolved_at;

-- Criar índices (ignore erros se já existirem)
CREATE INDEX idx_type ON alerts (alert_type);
CREATE INDEX idx_severity ON alerts (severity);
CREATE INDEX idx_resolved ON alerts (resolved);
CREATE INDEX idx_device_alerts ON alerts (device_id);

-- ============================================
-- NOTA: Se você receber erros sobre colunas NOT NULL sem valores padrão,
-- pode ser necessário primeiro adicionar valores padrão ou recriar a tabela.
-- Nesse caso, use o script 003-recreate-alerts-table.sql (faz backup primeiro!)
-- ============================================


