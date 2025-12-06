-- Script para DROPAR todas as tabelas do banco de dados
-- Execute este script PRIMEIRO para limpar o banco completamente
-- ATENÇÃO: Isso vai apagar TODOS os dados! Faça backup se necessário.

-- Desabilitar verificação de foreign keys temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- Dropar todas as tabelas na ordem correta
DROP TABLE IF EXISTS transports;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS temperature_sensor;
DROP TABLE IF EXISTS door_sensor;
DROP TABLE IF EXISTS gps_sensor;
DROP TABLE IF EXISTS touch_sensor;
DROP TABLE IF EXISTS devices;

-- Reabilitar verificação de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar se todas as tabelas foram removidas
SELECT 'Todas as tabelas foram removidas com sucesso!' AS status;


