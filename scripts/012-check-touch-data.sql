-- Script para verificar dados do sensor touch
-- Execute este script para ver todos os registros de touch

-- Ver todos os registros de touch
SELECT 
    id,
    timestamp,
    value,
    device_id,
    CASE 
        WHEN value = 1 THEN 'Ativado'
        WHEN value = 0 THEN 'Desativado'
        ELSE 'Desconhecido'
    END as status_text
FROM touch_sensor
ORDER BY timestamp DESC;

-- Contar total de registros
SELECT COUNT(*) as total_registros FROM touch_sensor;

-- Ver último registro
SELECT 
    id,
    timestamp,
    value,
    device_id,
    CASE 
        WHEN value = 1 THEN 'Ativado'
        WHEN value = 0 THEN 'Desativado'
        ELSE 'Desconhecido'
    END as status_text
FROM touch_sensor
ORDER BY timestamp DESC
LIMIT 1;

-- Ver registros por dispositivo
SELECT 
    device_id,
    COUNT(*) as total,
    MAX(timestamp) as ultimo_registro
FROM touch_sensor
GROUP BY device_id;

