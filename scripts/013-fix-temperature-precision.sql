-- Script para corrigir a precisão das temperaturas no banco de dados
-- Arredonda todas as temperaturas para 2 casas decimais

-- Atualizar todas as temperaturas para 2 casas decimais
UPDATE temperature_sensor 
SET temperature = ROUND(temperature, 2);

-- Verificar se funcionou
SELECT 
    id,
    timestamp,
    temperature,
    ROUND(temperature, 2) as temperatura_arredondada,
    device_id
FROM temperature_sensor
ORDER BY timestamp DESC
LIMIT 10;

-- Verificar se há temperaturas com mais de 2 casas decimais
SELECT 
    COUNT(*) as total_com_muitos_decimais
FROM temperature_sensor
WHERE temperature != ROUND(temperature, 2);

