# VaccineTrack - Sistema de Monitoramento de Transporte de Vacinas

Sistema completo para monitoramento em tempo real do transporte de vacinas e medicamentos sensíveis à temperatura.

## Características

- **Monitoramento de Temperatura**: Acompanhamento em tempo real com alertas automáticos
- **Rastreamento GPS**: Localização em tempo real do transporte
- **Sensor de Porta**: Detecção de abertura/fechamento da caixa térmica
- **Sensor Touch**: Autenticação do operador autorizado
- **Sistema de Alertas**: Notificações automáticas para desvios de temperatura e eventos críticos
- **Dashboard Web**: Interface moderna e responsiva para monitoramento

## Tecnologias

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: MySQL 8
- **Containerização**: Docker, Docker Compose
- **UI Components**: shadcn/ui

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local sem Docker)
- MySQL 8+ (para desenvolvimento sem Docker)

## Instalação e Execução

### Opção 1: Docker (Recomendado)

\`\`\`bash
# Clonar o repositório
git clone <url-do-repositorio>
cd vaccine-monitoring

# Criar arquivo de ambiente
cp .env.example .env

# Iniciar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Ou iniciar em modo produção
docker-compose up --build
\`\`\`

### Opção 2: Desenvolvimento Local

\`\`\`bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações de banco de dados

# Executar migrations do banco
# Execute o script scripts/001-create-tables.sql no seu MySQL

# Iniciar servidor de desenvolvimento
npm run dev
\`\`\`

### Opção 3: Com Banco de Dados em Nuvem

\`\`\`bash
# Configurar variáveis de ambiente para banco em nuvem
export MYSQL_HOST=seu-host-do-banco.db.ondigitalocean.com
export MYSQL_PORT=25060
export MYSQL_USER=doadmin
export MYSQL_PASSWORD=sua_senha
export MYSQL_DATABASE=defaultdb

# Iniciar aplicação
docker-compose -f docker-compose.cloud.yml up --build
\`\`\`

## Acessando a Aplicação

- **Dashboard**: http://localhost:3000
- **phpMyAdmin** (apenas desenvolvimento): http://localhost:8080

## Estrutura da API

### Endpoints dos Sensores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/sensors/temperature` | Enviar dados de temperatura |
| GET | `/api/sensors/temperature` | Obter histórico de temperatura |
| POST | `/api/sensors/gps` | Enviar dados GPS |
| GET | `/api/sensors/gps` | Obter histórico GPS |
| POST | `/api/sensors/door` | Enviar estado da porta |
| GET | `/api/sensors/door` | Obter histórico da porta |
| POST | `/api/sensors/touch` | Enviar dados do sensor touch |
| GET | `/api/sensors/touch` | Obter histórico do touch |

### Outros Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/dashboard` | Dados agregados do dashboard |
| GET/POST | `/api/alerts` | Gerenciar alertas |
| PATCH | `/api/alerts` | Resolver alerta |
| GET/POST | `/api/devices` | Gerenciar dispositivos |
| GET/POST/PATCH | `/api/transports` | Gerenciar transportes |

## Exemplo de Integração com Microcontrolador

\`\`\`cpp
// Exemplo para ESP32/Arduino
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendTemperature(float temp) {
  HTTPClient http;
  http.begin("http://seu-servidor:3000/api/sensors/temperature");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> doc;
  doc["temperature"] = temp;
  doc["device_id"] = "esp32-001";
  
  String json;
  serializeJson(doc, json);
  
  int httpCode = http.POST(json);
  http.end();
}
\`\`\`

## Estrutura do Projeto

\`\`\`
├── app/
│   ├── api/
│   │   ├── alerts/
│   │   ├── dashboard/
│   │   ├── devices/
│   │   ├── sensors/
│   │   │   ├── door/
│   │   │   ├── gps/
│   │   │   ├── temperature/
│   │   │   └── touch/
│   │   └── transports/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── alerts-list.tsx
│   │   ├── gps-map.tsx
│   │   ├── header.tsx
│   │   ├── sensor-status.tsx
│   │   ├── stats-cards.tsx
│   │   └── temperature-chart.tsx
│   └── ui/
├── lib/
│   ├── db.ts
│   └── hooks/
│       └── use-dashboard.ts
├── scripts/
│   └── 001-create-tables.sql
├── docker-compose.yml
├── docker-compose.dev.yml
├── Dockerfile
└── README.md
\`\`\`

## Limites de Temperatura

Por padrão, o sistema está configurado para vacinas que devem ser mantidas entre **2°C e 8°C**. Alertas são gerados automaticamente quando:

- Temperatura abaixo de 2°C: Alerta de severidade **alta**
- Temperatura acima de 8°C: Alerta de severidade **alta**
- Temperatura abaixo de 0°C ou acima de 12°C: Alerta **crítico**

## Licença

MIT License
