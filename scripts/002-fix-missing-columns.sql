-- Script de migração para adicionar colunas faltantes
-- Execute este script se as tabelas já existem mas estão faltando colunas
-- IMPORTANTE: Execute cada comando separadamente e ignore erros se a coluna já existir

-- Adicionar coluna device_id na tabela gps_sensor (ignore erro se já existir)
-- Execute: ALTER TABLE gps_sensor ADD COLUMN device_id VARCHAR(50) DEFAULT 'default' AFTER date;
-- Execute: CREATE INDEX idx_device ON gps_sensor (device_id);

-- Adicionar colunas na tabela alerts (ignore erros se já existirem)
-- Execute: ALTER TABLE alerts ADD COLUMN resolved BOOLEAN DEFAULT FALSE AFTER description;
-- Execute: ALTER TABLE alerts ADD COLUMN resolved_at DATETIME AFTER resolved;
-- Execute: ALTER TABLE alerts ADD COLUMN device_id VARCHAR(50) DEFAULT 'default' AFTER resolved_at;
-- Execute: CREATE INDEX idx_resolved ON alerts (resolved);
-- Execute: CREATE INDEX idx_device_alerts ON alerts (device_id);

-- Script automatizado usando stored procedure (execute tudo de uma vez)
DELIMITER $$

DROP PROCEDURE IF EXISTS add_column_if_not_exists$$

CREATE PROCEDURE add_column_if_not_exists(
    IN table_name VARCHAR(64),
    IN column_name VARCHAR(64),
    IN column_definition TEXT
)
BEGIN
    DECLARE column_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO column_exists
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name
      AND COLUMN_NAME = column_name;
    
    IF column_exists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', table_name, ' ADD COLUMN ', column_name, ' ', column_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- Adicionar colunas usando a procedure
CALL add_column_if_not_exists('gps_sensor', 'device_id', 'VARCHAR(50) DEFAULT ''default'' AFTER date');
CALL add_column_if_not_exists('alerts', 'resolved', 'BOOLEAN DEFAULT FALSE AFTER description');
CALL add_column_if_not_exists('alerts', 'resolved_at', 'DATETIME AFTER resolved');
CALL add_column_if_not_exists('alerts', 'device_id', 'VARCHAR(50) DEFAULT ''default'' AFTER resolved_at');

-- Criar índices se não existirem
SET @index_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'gps_sensor' 
      AND INDEX_NAME = 'idx_device'
);

SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_device ON gps_sensor (device_id)', 
    'SELECT ''Index idx_device already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'alerts' 
      AND INDEX_NAME = 'idx_resolved'
);

SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_resolved ON alerts (resolved)', 
    'SELECT ''Index idx_resolved already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'alerts' 
      AND INDEX_NAME = 'idx_device_alerts'
);

SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_device_alerts ON alerts (device_id)', 
    'SELECT ''Index idx_device_alerts already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Limpar a procedure
DROP PROCEDURE IF EXISTS add_column_if_not_exists;

