-- Script SEGURO para recriar a tabela alerts
-- Este script preserva os dados existentes antes de recriar a tabela

-- Passo 1: Criar tabela temporária com os dados existentes (se houver)
CREATE TABLE IF NOT EXISTS alerts_backup AS SELECT * FROM alerts;

-- Passo 2: Dropar a tabela alerts
DROP TABLE IF EXISTS alerts;

-- Passo 3: Recriar a tabela alerts com todas as colunas corretas
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

-- Passo 4: Restaurar dados do backup (apenas se o backup existir e tiver dados compatíveis)
-- NOTA: Ajuste este INSERT conforme a estrutura do seu backup
-- Se a tabela backup tiver colunas diferentes, você precisará ajustar manualmente
INSERT INTO alerts (id, timestamp, description, resolved, resolved_at, device_id)
SELECT 
    id,
    timestamp,
    COALESCE(description, 'Alerta sem descrição') as description,
    COALESCE(resolved, FALSE) as resolved,
    resolved_at,
    COALESCE(device_id, 'default') as device_id
FROM alerts_backup
WHERE EXISTS (SELECT 1 FROM alerts_backup LIMIT 1);

-- Passo 5: Se a tabela backup tinha alert_type e severity, atualize:
-- UPDATE alerts a
-- INNER JOIN alerts_backup b ON a.id = b.id
-- SET a.alert_type = COALESCE(b.alert_type, 'temperature'),
--     a.severity = COALESCE(b.severity, 'medium')
-- WHERE b.alert_type IS NOT NULL OR b.severity IS NOT NULL;

-- Passo 6: Dropar a tabela de backup (opcional - comente se quiser manter o backup)
-- DROP TABLE IF EXISTS alerts_backup;


