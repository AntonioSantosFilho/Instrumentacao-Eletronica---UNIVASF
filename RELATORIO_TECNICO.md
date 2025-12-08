# Relatório Técnico - Sistema de Monitoramento de Transporte de Vacinas

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias e Linguagens](#tecnologias-e-linguagens)
4. [Bibliotecas e Dependências Principais](#bibliotecas-e-dependências-principais)
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Componentes Principais](#componentes-principais)
7. [API REST](#api-rest)
8. [Banco de Dados](#banco-de-dados)
9. [Firmware ESP32](#firmware-esp32)
10. [Fluxo de Dados](#fluxo-de-dados)
11. [Funcionalidades Principais](#funcionalidades-principais)
12. [Containerização e Deploy](#containerização-e-deploy)

---

## 1. Visão Geral

O **PharmaTrack** (também conhecido como **PharmaTrackX**) é um sistema completo de monitoramento em tempo real para transporte seguro de vacinas e medicamentos sensíveis à temperatura. O sistema foi desenvolvido para garantir que produtos farmacêuticos sejam transportados dentro de condições ideais de temperatura, com rastreamento GPS e detecção de eventos críticos.

### Objetivo Principal
Garantir a integridade de vacinas durante o transporte, monitorando continuamente:
- **Temperatura**: Mantida entre 2°C e 8°C (faixa ideal para vacinas)
- **Localização GPS**: Rastreamento em tempo real
- **Estado da Porta**: Detecção de abertura/fechamento da caixa térmica
- **Autenticação**: Sensor touch para identificação do operador

### Casos de Uso
- Transporte de vacinas entre unidades de saúde
- Distribuição de medicamentos termolábeis
- Logística farmacêutica com rastreabilidade
- Auditoria de condições de transporte

---

## 2. Arquitetura do Sistema

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE HARDWARE                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Sensor   │  │ Sensor   │  │ Sensor   │  │ Sensor   │   │
│  │ Temp     │  │ GPS      │  │ Porta    │  │ Touch    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       └─────────────┴─────────────┴─────────────┘          │
│                          │                                  │
│                    ┌─────▼─────┐                            │
│                    │  ESP32    │                            │
│                    │ Firmware  │                            │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS/WiFi
┌──────────────────────────▼──────────────────────────────────┐
│                  CAMADA DE APLICAÇÃO                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Next.js Application (Full-Stack)           │     │
│  │  ┌──────────────┐  ┌──────────────┐               │     │
│  │  │   Frontend  │  │   Backend    │               │     │
│  │  │   React     │  │  API Routes  │               │     │
│  │  └──────────────┘  └──────┬───────┘               │     │
│  └───────────────────────────┼───────────────────────┘     │
└──────────────────────────────┼──────────────────────────────┘
                               │ SQL
┌──────────────────────────────▼──────────────────────────────┐
│                  CAMADA DE DADOS                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │              MySQL 8 Database                      │     │
│  │  • Sensores (temp, gps, door, touch)               │     │
│  │  • Alertas                                          │     │
│  │  • Dispositivos                                     │     │
│  │  • Transportes                                      │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Padrão Arquitetural

O sistema utiliza uma **arquitetura de três camadas**:

1. **Camada de Apresentação (Frontend)**
   - Interface React com Next.js
   - Componentes reutilizáveis (shadcn/ui)
   - Visualização em tempo real com atualização automática

2. **Camada de Aplicação (Backend)**
   - API RESTful com Next.js API Routes
   - Lógica de negócio e validação
   - Geração automática de alertas

3. **Camada de Dados**
   - MySQL 8 para persistência
   - Pool de conexões para performance
   - Índices otimizados para consultas frequentes

### Comunicação

- **ESP32 → Backend**: HTTPS POST requests (JSON)
- **Frontend → Backend**: Fetch API via SWR (data fetching)
- **Backend → Database**: MySQL2 com prepared statements

---

## 3. Tecnologias e Linguagens

### Frontend
- **TypeScript** (5.x): Tipagem estática para segurança de tipos
- **React** (19.2.0): Biblioteca para construção de interfaces
- **Next.js** (16.0.3): Framework React com SSR/SSG e API Routes
- **Tailwind CSS** (4.1.9): Framework CSS utility-first
- **PostCSS** (8.5): Processamento de CSS

### Backend
- **Node.js** (20+): Runtime JavaScript
- **Next.js API Routes**: Endpoints RESTful integrados
- **TypeScript**: Mesma linguagem para frontend e backend

### Banco de Dados
- **MySQL 8**: Sistema de gerenciamento de banco de dados relacional
- **MySQL2**: Driver Node.js para MySQL com suporte a promises

### Firmware (Hardware)
- **C**: Linguagem de programação para ESP32
- **ESP-IDF**: Framework oficial da Espressif para ESP32
- **FreeRTOS**: Sistema operacional em tempo real

### DevOps e Infraestrutura
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de containers
- **pnpm**: Gerenciador de pacotes Node.js

---

## 4. Bibliotecas e Dependências Principais

### UI Components (Radix UI)
O projeto utiliza extensivamente componentes do **Radix UI**, uma biblioteca de componentes acessíveis e não-estilizados:

- `@radix-ui/react-*`: Componentes base (Dialog, Dropdown, Tabs, Toast, etc.)
- **shadcn/ui**: Sistema de componentes construído sobre Radix UI
- `lucide-react`: Ícones SVG modernos
- `class-variance-authority`: Gerenciamento de variantes de componentes
- `tailwind-merge`: Merge inteligente de classes Tailwind

### Data Fetching e Estado
- **SWR** (latest): Biblioteca para data fetching com cache, revalidação e sincronização
  - Atualização automática a cada 5 segundos no dashboard
  - Cache inteligente e sincronização entre abas

### Visualização de Dados
- **Recharts** (latest): Biblioteca de gráficos React
  - Gráficos de linha para temperatura e GPS
  - Responsivo e interativo

### Formulários e Validação
- **React Hook Form** (7.60.0): Gerenciamento de formulários performático
- **Zod** (3.25.76): Validação de schemas TypeScript-first
- `@hookform/resolvers`: Integração entre React Hook Form e Zod

### Utilitários
- `date-fns` (4.1.0): Manipulação de datas
- `clsx`: Construção condicional de classes CSS
- `sonner`: Sistema de notificações toast
- `next-themes`: Suporte a temas claro/escuro

### Analytics
- `@vercel/analytics`: Analytics da Vercel (opcional)

### Outras Bibliotecas Importantes
- `cmdk`: Interface de comando (Command Palette)
- `embla-carousel-react`: Carrossel de imagens
- `react-resizable-panels`: Painéis redimensionáveis
- `vaul`: Drawer component

---

## 5. Estrutura do Projeto

```
vaccine-transport-monitoring/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── alerts/               # Gerenciamento de alertas
│   │   ├── dashboard/            # Dados agregados do dashboard
│   │   ├── devices/              # Gerenciamento de dispositivos
│   │   ├── sensors/              # Endpoints dos sensores
│   │   │   ├── door/             # Sensor de porta
│   │   │   ├── gps/              # Sensor GPS
│   │   │   ├── temperature/      # Sensor de temperatura
│   │   │   └── touch/            # Sensor touch
│   │   └── transports/           # Gerenciamento de transportes
│   ├── layout.tsx                # Layout raiz da aplicação
│   ├── page.tsx                  # Página principal (Dashboard)
│   └── globals.css               # Estilos globais
│
├── components/                   # Componentes React
│   ├── dashboard/                # Componentes do dashboard
│   │   ├── alerts-list.tsx       # Lista de alertas
│   │   ├── door-sensor-card.tsx  # Card do sensor de porta
│   │   ├── gps-chart.tsx         # Gráfico de histórico GPS
│   │   ├── gps-map.tsx           # Mapa de localização
│   │   ├── gps-sensor-card.tsx   # Card do sensor GPS
│   │   ├── header.tsx            # Cabeçalho do dashboard
│   │   ├── sensor-status.tsx     # Status dos sensores
│   │   ├── temperature-chart.tsx # Gráfico de temperatura
│   │   ├── temperature-sensor-card.tsx # Card de temperatura
│   │   ├── touch-card.tsx        # Card do sensor touch
│   │   └── vaccine-status.tsx    # Status das vacinas
│   └── ui/                       # Componentes UI reutilizáveis (shadcn/ui)
│       ├── card.tsx
│       ├── chart.tsx
│       ├── button.tsx
│       └── ... (40+ componentes)
│
├── lib/                          # Bibliotecas e utilitários
│   ├── db.ts                     # Configuração do banco de dados
│   ├── hooks/                    # Custom hooks
│   │   └── use-dashboard.ts      # Hook para dados do dashboard
│   └── utils.ts                  # Funções utilitárias
│
├── scripts/                      # Scripts SQL
│   ├── 001-create-tables.sql     # Criação das tabelas
│   ├── 010-insert-sample-data.sql # Dados de exemplo
│   └── ... (migrations)
│
├── FIRMWARE ESP32/               # Código do firmware
│   ├── main/                     # Código principal
│   │   ├── main.c                # Ponto de entrada
│   │   ├── temp_module.c         # Módulo de temperatura
│   │   ├── gps_module.c          # Módulo GPS
│   │   ├── door_module.c         # Módulo de porta
│   │   ├── touch_module.c        # Módulo touch
│   │   ├── wifi_module.c         # Módulo WiFi
│   │   └── http_module.c         # Módulo HTTP/HTTPS
│   └── CMakeLists.txt            # Configuração de build
│
├── docker-compose.yml            # Docker Compose produção
├── docker-compose.dev.yml        # Docker Compose desenvolvimento
├── docker-compose.cloud.yml      # Docker Compose para nuvem
├── Dockerfile                    # Imagem Docker produção
├── Dockerfile.dev                # Imagem Docker desenvolvimento
├── package.json                  # Dependências Node.js
├── tsconfig.json                 # Configuração TypeScript
├── next.config.mjs               # Configuração Next.js
└── README.md                     # Documentação do projeto
```

---

## 6. Componentes Principais

### 6.1 Frontend (React/Next.js)

#### Dashboard Principal (`app/page.tsx`)
- **Função**: Página principal que exibe todos os dados de monitoramento
- **Características**:
  - Layout responsivo com grid
  - Atualização automática via SWR (5 segundos)
  - Estados de loading e erro
  - Integração com todos os componentes de sensores

#### Componentes de Sensores

**TemperatureSensorCard** (`components/dashboard/temperature-sensor-card.tsx`)
- Exibe temperatura atual
- Indica se está dentro da faixa ideal (2-8°C)
- Mostra status online/offline
- Calcula tempo desde última leitura
- Cores dinâmicas: verde (OK), amarelo (atenção), vermelho (crítico)

**DoorSensorCard** (`components/dashboard/door-sensor-card.tsx`)
- Estado atual da porta (aberta/fechada)
- Histórico de eventos
- Alertas quando porta é aberta

**GPSSensorCard** (`components/dashboard/gps-sensor-card.tsx`)
- Coordenadas GPS atuais
- Precisão do sinal
- Número de satélites

**TouchSensorCard** (`components/dashboard/touch-card.tsx`)
- Estado do sensor touch
- Autenticação do operador

#### Visualizações

**TemperatureChart** (`components/dashboard/temperature-chart.tsx`)
- Gráfico de linha temporal (Recharts)
- Área destacada para faixa ideal (2-8°C)
- Linhas de referência para limites
- Tooltip interativo
- Últimas 24 horas de dados

**GPSChart** (`components/dashboard/gps-chart.tsx`)
- Visualização do histórico de posições GPS
- Gráfico de coordenadas ao longo do tempo

**GPSMap** (`components/dashboard/gps-map.tsx`)
- Mapa interativo (placeholder para Google Maps/Leaflet)
- Link para abrir no Google Maps
- Histórico de posições recentes
- Coordenadas formatadas

**AlertsList** (`components/dashboard/alerts-list.tsx`)
- Lista de alertas recentes
- Filtros por severidade
- Ação para resolver alertas
- Badges coloridos por tipo

### 6.2 Custom Hooks

**useDashboard** (`lib/hooks/use-dashboard.ts`)
- Hook principal para dados do dashboard
- Utiliza SWR para cache e revalidação
- Atualização automática a cada 5 segundos
- Retorna: stats, tempHistory, gpsHistory, recentAlerts

**useTemperatureHistory**
- Histórico de temperatura com filtro por horas
- Limite configurável de registros

**useAlerts**
- Lista de alertas com filtros
- Suporte a resolved/unresolved
- Filtro por device_id

**useGPSHistory**
- Histórico de posições GPS
- Limite configurável

### 6.3 Backend (API Routes)

#### Estrutura de API Routes

Cada endpoint segue o padrão Next.js 13+ App Router:
- Arquivo `route.ts` exporta funções HTTP (GET, POST, PATCH, etc.)
- TypeScript para type safety
- Validação de entrada
- Tratamento de erros padronizado

---

## 7. API REST

### 7.1 Endpoints de Sensores

#### POST `/api/sensors/temperature`
**Função**: Receber dados de temperatura do ESP32

**Request Body**:
```json
{
  "temperature": 5.2,
  "device_id": "default"
}
```

**Resposta**:
```json
{
  "success": true,
  "message": "Dados de temperatura salvos com sucesso"
}
```

**Lógica**:
- Valida temperatura (deve ser número)
- Arredonda para 2 casas decimais
- Insere no banco de dados
- **Gera alerta automático** se temperatura < 2°C ou > 8°C
- Atualiza `last_seen` do dispositivo

#### GET `/api/sensors/temperature`
**Query Parameters**:
- `device_id`: ID do dispositivo (default: "default")
- `limit`: Número de registros (default: 100, max: 1000)
- `hours`: Filtrar últimas X horas

**Resposta**:
```json
{
  "data": [
    {
      "id": 1,
      "temperature": 5.2,
      "timestamp": "2024-01-15T10:30:00Z",
      "device_id": "default"
    }
  ]
}
```

#### POST `/api/sensors/gps`
**Função**: Receber dados GPS do ESP32

**Request Body**:
```json
{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "satellites": 8,
  "fix_quality": "3D",
  "device_id": "default"
}
```

**Campos Opcionais**: `latitude_dir`, `longitude_dir`, `hdop`, `altitude`, `speed`, `course`, `date`

#### GET `/api/sensors/gps`
Similar ao GET de temperatura, retorna histórico GPS.

#### POST `/api/sensors/door`
**Função**: Receber estado da porta (aberta/fechada)

**Request Body**:
```json
{
  "state": "open",
  "device_id": "default"
}
```

**Lógica**:
- Valida estado (deve ser "open" ou "closed")
- **Gera alerta** se porta for aberta (severidade: medium)

#### POST `/api/sensors/touch`
**Função**: Receber dados do sensor touch (autenticação)

**Request Body**:
```json
{
  "value": true,
  "device_id": "default"
}
```

### 7.2 Endpoints de Dashboard

#### GET `/api/dashboard`
**Função**: Dados agregados para o dashboard

**Query Parameters**:
- `device_id`: ID do dispositivo (default: "default")

**Resposta**:
```json
{
  "stats": {
    "totalAlerts": 5,
    "unresolvedAlerts": 2,
    "criticalAlerts": 1,
    "lastTemperature": {
      "temperature": 5.2,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "avgTemperature": 5.1,
    "lastDoorState": {
      "state": "closed",
      "timestamp": "2024-01-15T10:25:00Z"
    },
    "lastGPS": {
      "latitude": -23.5505,
      "longitude": -46.6333,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "lastTouch": {
      "value": true,
      "timestamp": "2024-01-15T10:20:00Z"
    },
    "status": "active"
  },
  "tempHistory": [...],
  "gpsHistory": [...],
  "recentAlerts": [...]
}
```

**Lógica**:
- Agrega dados de múltiplas tabelas
- Calcula estatísticas (média de temperatura, contagem de alertas)
- Retorna últimos registros de cada sensor
- Histórico das últimas 24 horas para gráficos
- Determina status do dispositivo (ativo se última leitura < 5 minutos)

### 7.3 Endpoints de Alertas

#### POST `/api/alerts`
**Função**: Criar alerta manualmente

**Request Body**:
```json
{
  "alert_type": "temperature",
  "severity": "high",
  "description": "Temperatura fora da faixa",
  "device_id": "default"
}
```

**Tipos válidos**: `temperature`, `door`, `location`, `touch`, `connection`, `battery`
**Severidades**: `low`, `medium`, `high`, `critical`

#### GET `/api/alerts`
**Query Parameters**:
- `device_id`: Filtrar por dispositivo
- `resolved`: true/false
- `severity`: Filtrar por severidade
- `limit`: Número de registros (default: 100)

#### PATCH `/api/alerts`
**Função**: Resolver alerta

**Request Body**:
```json
{
  "id": 1,
  "resolved": true
}
```

### 7.4 Endpoints de Transportes

#### POST `/api/transports`
**Função**: Criar novo transporte

**Request Body**:
```json
{
  "device_id": "default",
  "origin": "Hospital Central",
  "destination": "Posto de Saúde 1",
  "operator_name": "João Silva",
  "vaccine_type": "COVID-19",
  "quantity": 100,
  "min_temp": 2.0,
  "max_temp": 8.0,
  "notes": "Transporte urgente"
}
```

#### GET `/api/transports`
**Query Parameters**:
- `status`: Filtrar por status (`in_progress`, `completed`, `cancelled`, `alert`)
- `device_id`: Filtrar por dispositivo
- `limit`: Número de registros

#### PATCH `/api/transports`
**Função**: Atualizar status do transporte

**Request Body**:
```json
{
  "id": 1,
  "status": "completed",
  "end_time": "2024-01-15T12:00:00Z"
}
```

---

## 8. Banco de Dados

### 8.1 Estrutura do Banco

O banco de dados MySQL 8 armazena todos os dados do sistema. A estrutura foi projetada para:
- **Performance**: Índices em colunas frequentemente consultadas
- **Escalabilidade**: Suporte a múltiplos dispositivos
- **Rastreabilidade**: Timestamps em todas as tabelas
- **Integridade**: Foreign keys e constraints

### 8.2 Tabelas Principais

#### `temperature_sensor`
Armazena leituras de temperatura.

```sql
CREATE TABLE temperature_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT NOT NULL,
    humidity FLOAT,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    INDEX idx_temperature (temperature)
);
```

**Campos**:
- `id`: Chave primária auto-incrementada
- `timestamp`: Data/hora da leitura (automático)
- `temperature`: Temperatura em °C (FLOAT)
- `humidity`: Umidade (opcional, FLOAT)
- `device_id`: Identificador do dispositivo

**Índices**:
- `idx_timestamp`: Consultas por data
- `idx_device`: Filtro por dispositivo
- `idx_temperature`: Consultas por faixa de temperatura

#### `gps_sensor`
Armazena dados de localização GPS.

```sql
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
    INDEX idx_location (latitude, longitude)
);
```

**Campos Especiais**:
- `latitude`/`longitude`: Coordenadas com precisão de 8 casas decimais
- `satellites`: Número de satélites visíveis
- `hdop`: Horizontal Dilution of Precision (qualidade do sinal)
- `fix_quality`: Tipo de fix (2D, 3D, etc.)
- `speed`: Velocidade em km/h
- `course`: Direção em graus

#### `door_sensor`
Armazena estado da porta (aberta/fechada).

```sql
CREATE TABLE door_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    state ENUM('open', 'closed') NOT NULL,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id),
    INDEX idx_state (state)
);
```

**ENUM**: Garante que apenas valores válidos sejam inseridos.

#### `touch_sensor`
Armazena dados do sensor touch (autenticação).

```sql
CREATE TABLE touch_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    value BOOLEAN NOT NULL,
    device_id VARCHAR(50) DEFAULT 'default',
    INDEX idx_timestamp (timestamp),
    INDEX idx_device (device_id)
);
```

#### `alerts`
Armazena alertas gerados pelo sistema.

```sql
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
    INDEX idx_resolved (resolved)
);
```

**Tipos de Alerta**:
- `temperature`: Temperatura fora da faixa
- `door`: Porta aberta
- `location`: Problema de localização
- `touch`: Evento de autenticação
- `connection`: Problema de conexão
- `battery`: Bateria baixa

**Severidades**:
- `low`: Informacional
- `medium`: Atenção necessária
- `high`: Ação imediata
- `critical`: Crítico, intervenção urgente

#### `devices`
Armazena informações sobre os dispositivos IoT.

```sql
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
```

**Status**:
- `active`: Dispositivo ativo e funcionando
- `inactive`: Dispositivo inativo (sem comunicação recente)
- `maintenance`: Em manutenção

#### `transports`
Armazena informações sobre transportes de vacinas.

```sql
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
```

**Status do Transporte**:
- `in_progress`: Transporte em andamento
- `completed`: Transporte concluído com sucesso
- `cancelled`: Transporte cancelado
- `alert`: Transporte com alertas críticos

### 8.3 Configuração do Banco (`lib/db.ts`)

O arquivo `lib/db.ts` configura a conexão com o banco de dados:

**Características**:
- **Pool de Conexões**: Máximo de 10 conexões simultâneas
- **SSL Suportado**: Configuração para conexões seguras (DigitalOcean)
- **Prepared Statements**: Proteção contra SQL injection
- **TypeScript Types**: Interfaces para type safety

**Variáveis de Ambiente**:
- `MYSQL_HOST`: Host do banco de dados
- `MYSQL_PORT`: Porta (default: 3306)
- `MYSQL_USER`: Usuário
- `MYSQL_PASSWORD`: Senha
- `MYSQL_DATABASE`: Nome do banco
- `MYSQL_SSL`: Habilitar SSL (true/false)
- `MYSQL_CA_CERT`: Caminho do certificado CA

**Função `query`**:
```typescript
export async function query<T>(sql: string, params?: any[]): Promise<T>
```
- Executa queries preparadas
- Type-safe com generics
- Tratamento de erros centralizado

---

## 9. Firmware ESP32

### 9.1 Arquitetura do Firmware

O firmware ESP32 é desenvolvido em **C** usando o **ESP-IDF** (Espressif IoT Development Framework) e **FreeRTOS** para multitarefa.

**Estrutura Modular**:
- Cada sensor possui seu próprio módulo (`.c` e `.h`)
- Comunicação via I2C para sensores
- Comunicação HTTP/HTTPS para backend
- WiFi para conectividade

### 9.2 Módulos Principais

#### `main.c` - Ponto de Entrada
```c
void app_main(void) {
    wifi_init();
    wifi_wait_for_connection();
    
    gps_init();
    touch_init();
    temp_init();
    door_init();

    gps_start_task();
    touch_start_task();
    temp_start_task();
    door_start_task();
}
```

**Fluxo**:
1. Inicializa WiFi e aguarda conexão
2. Inicializa todos os módulos de sensores
3. Inicia tasks FreeRTOS para cada sensor

#### `temp_module.c` - Módulo de Temperatura

**Sensor**: MLX90614 (sensor infravermelho sem contato)

**Características**:
- Comunicação I2C
- Endereço: 0x5A
- Leitura a cada 4 segundos
- Envio automático via HTTP POST

**Código Principal**:
```c
void temp_task(void *pvParameters) {
    while (1) {
        float temp = read_mlx90614();
        if (temp > -900) {
            char json_data[128];
            snprintf(json_data, sizeof(json_data), 
                     "{\"temperature\": %.2f}", temp);
            http_send_data("/api/sensors/temperature", json_data);
        }
        vTaskDelay(4000 / portTICK_PERIOD_MS);
    }
}
```

**Conversão de Temperatura**:
- Sensor retorna valor em Kelvin (raw * 0.02)
- Conversão para Celsius: `(raw * 0.02) - 273.15`

#### `gps_module.c` - Módulo GPS

**Sensor**: Módulo GPS NMEA (comunicação serial)

**Características**:
- Parse de mensagens NMEA
- Extração de coordenadas, velocidade, satélites
- Envio periódico de dados

#### `door_module.c` - Módulo de Porta

**Sensor**: Sensor magnético (reed switch) ou sensor de proximidade

**Características**:
- Detecção de estado aberto/fechado
- Geração de alerta quando porta é aberta
- Envio imediato de estado

#### `touch_module.c` - Módulo Touch

**Sensor**: Sensor capacitivo touch

**Função**: Autenticação do operador autorizado

#### `wifi_module.c` - Módulo WiFi

**Função**: Gerenciamento de conexão WiFi

**Características**:
- Configuração de SSID e senha
- Reconexão automática
- Status de conexão

#### `http_module.c` - Módulo HTTP/HTTPS

**Função**: Comunicação com o backend

**Características**:
- HTTPS seguro (SSL/TLS)
- URL base configurável: `https://www.pharmatrackx.dev`
- Envio de JSON
- Tratamento de erros

**Função Principal**:
```c
void http_send_data(const char *endpoint, const char *json_data)
```

**Configuração**:
- Transport: `HTTP_TRANSPORT_OVER_SSL`
- Certificado bundle: `esp_crt_bundle_attach`
- Content-Type: `application/json`
- Método: POST

### 9.3 FreeRTOS Tasks

Cada sensor roda em uma **task separada** do FreeRTOS:

- **Prioridade**: 5 (configurável)
- **Stack Size**: 8192 bytes (8KB)
- **Delay**: 4 segundos entre leituras (configurável)

**Vantagens**:
- Execução paralela de sensores
- Não bloqueia outros sensores
- Fácil adicionar novos sensores

---

## 10. Fluxo de Dados

### 10.1 Fluxo Completo: Sensor → Dashboard

```
1. ESP32 lê sensor (ex: temperatura)
   ↓
2. Dados são formatados em JSON
   ↓
3. HTTPS POST para /api/sensors/temperature
   ↓
4. API Route valida e salva no MySQL
   ↓
5. API verifica limites e gera alerta (se necessário)
   ↓
6. Frontend faz GET /api/dashboard (via SWR)
   ↓
7. SWR atualiza cache e re-renderiza componentes
   ↓
8. Usuário vê dados atualizados no dashboard
```

### 10.2 Fluxo de Alertas

```
1. Sensor detecta condição anormal (ex: temp > 8°C)
   ↓
2. ESP32 envia dados para API
   ↓
3. API detecta violação de limite
   ↓
4. API insere registro em `alerts` table
   ↓
5. Próxima requisição do dashboard inclui alerta
   ↓
6. Componente AlertsList exibe alerta
   ↓
7. Usuário pode resolver alerta (PATCH /api/alerts)
```

### 10.3 Atualização em Tempo Real

**SWR (Stale-While-Revalidate)**:
- **Refresh Interval**: 5 segundos (dashboard)
- **Revalidate on Focus**: Sim (atualiza ao focar na aba)
- **Cache**: Dados ficam em cache enquanto revalida em background

**Vantagens**:
- Interface sempre responsiva (mostra cache imediatamente)
- Dados atualizados automaticamente
- Menos carga no servidor (cache inteligente)

---

## 11. Funcionalidades Principais

### 11.1 Monitoramento de Temperatura

**Funcionalidades**:
- Leitura contínua a cada 4 segundos
- Armazenamento histórico (últimas 24h no dashboard)
- Gráfico temporal interativo
- Alertas automáticos:
  - **Alta**: Temperatura < 2°C ou > 8°C
  - **Crítico**: Temperatura < 0°C ou > 12°C
- Indicadores visuais:
  - Verde: Dentro da faixa (2-8°C)
  - Amarelo: Próximo dos limites
  - Vermelho: Fora da faixa

**Limites Configuráveis**:
- Mínimo: 2°C (padrão)
- Máximo: 8°C (padrão)
- Configurável por transporte

### 11.2 Rastreamento GPS

**Funcionalidades**:
- Localização em tempo real
- Histórico de posições
- Visualização em mapa (Google Maps)
- Dados de qualidade do sinal:
  - Número de satélites
  - HDOP (precisão)
  - Tipo de fix (2D/3D)
- Velocidade e direção (se disponível)

### 11.3 Detecção de Porta

**Funcionalidades**:
- Estado atual (aberta/fechada)
- Histórico de aberturas
- Alerta automático quando porta é aberta
- Rastreamento de eventos

### 11.4 Autenticação Touch

**Funcionalidades**:
- Sensor touch para identificação do operador
- Registro de eventos de toque
- Integração com sistema de transportes

### 11.5 Sistema de Alertas

**Tipos de Alerta**:
1. **Temperatura**: Fora da faixa ideal
2. **Porta**: Porta aberta
3. **Localização**: Problema de GPS
4. **Touch**: Evento de autenticação
5. **Conexão**: Dispositivo offline
6. **Bateria**: Bateria baixa

**Severidades**:
- **Low**: Informativo
- **Medium**: Atenção necessária
- **High**: Ação imediata
- **Critical**: Crítico, intervenção urgente

**Funcionalidades**:
- Geração automática
- Resolução manual
- Filtros por tipo, severidade, dispositivo
- Histórico completo

### 11.6 Dashboard em Tempo Real

**Componentes**:
- Cards de sensores (4 cards principais)
- Gráficos temporais (temperatura e GPS)
- Mapa de localização
- Lista de alertas
- Estatísticas agregadas

**Atualização**:
- Automática a cada 5 segundos
- Manual via botão refresh
- Sincronização entre abas (SWR)

### 11.7 Gerenciamento de Transportes

**Funcionalidades**:
- Criação de transporte
- Rastreamento de status
- Informações do operador
- Tipo e quantidade de vacinas
- Origem e destino
- Notas e observações
- Limites de temperatura personalizados

**Status**:
- `in_progress`: Em andamento
- `completed`: Concluído
- `cancelled`: Cancelado
- `alert`: Com alertas críticos

---

## 12. Containerização e Deploy

### 12.1 Docker

O projeto utiliza **Docker** para containerização e **Docker Compose** para orquestração.

#### Dockerfile (Produção)

**Multi-stage Build**:
1. **Stage 1 (builder)**: Build da aplicação Next.js
   - Base: `node:20-alpine`
   - Instala dependências com pnpm
   - Executa `pnpm run build`
   - Gera output standalone

2. **Stage 2 (runner)**: Imagem de produção
   - Base: `node:20-alpine`
   - Usuário não-root (nextjs:1001)
   - Copia apenas arquivos necessários
   - Expõe porta 3000

**Características**:
- Imagem otimizada (alpine)
- Segurança (usuário não-root)
- Build standalone do Next.js
- Tamanho reduzido

#### Docker Compose

**Arquivos**:
- `docker-compose.yml`: Produção (banco em nuvem)
- `docker-compose.dev.yml`: Desenvolvimento (banco local)
- `docker-compose.cloud.yml`: Nuvem (DigitalOcean)

**Serviços**:
- `app`: Aplicação Next.js
- `db`: MySQL (apenas em dev)
- `phpmyadmin`: Interface web MySQL (apenas em dev)

**Variáveis de Ambiente**:
- Configuração via `.env`
- Suporte a SSL para banco em nuvem
- Certificado CA opcional

### 12.2 Deploy

**Opções de Deploy**:
1. **Vercel**: Deploy automático do Next.js
2. **Docker**: Container em servidor próprio
3. **DigitalOcean**: App Platform ou Droplet
4. **AWS/Azure/GCP**: Qualquer plataforma que suporte Docker

**Requisitos**:
- Node.js 20+
- MySQL 8+
- Variáveis de ambiente configuradas
- Certificado SSL (para produção)

---

## 13. Segurança

### 13.1 Medidas Implementadas

1. **Prepared Statements**: Proteção contra SQL injection
2. **HTTPS**: Comunicação criptografada (ESP32 → Backend)
3. **SSL/TLS**: Conexão segura com banco de dados
4. **Validação de Entrada**: Validação de tipos e valores
5. **Limites de Query**: Proteção contra DoS (max 1000 registros)
6. **Usuário Não-Root**: Container Docker roda como usuário não-privilegiado

### 13.2 Melhorias Futuras

- Autenticação e autorização (JWT)
- Rate limiting
- CORS configurado
- Sanitização de inputs
- Logs de auditoria

---

## 14. Performance

### 14.1 Otimizações Implementadas

1. **Pool de Conexões**: MySQL pool com 10 conexões
2. **Índices**: Índices em colunas frequentemente consultadas
3. **SWR Cache**: Cache inteligente no frontend
4. **Next.js Standalone**: Build otimizado
5. **Lazy Loading**: Componentes carregados sob demanda
6. **Image Optimization**: Next.js Image component

### 14.2 Escalabilidade

- Suporte a múltiplos dispositivos (`device_id`)
- Queries otimizadas com LIMIT
- Paginação implícita
- Cache de dados frequentes

---

## 15. Conclusão

O **VaccineTrack** é um sistema completo e robusto para monitoramento de transporte de vacinas, combinando:

- **Hardware IoT** (ESP32) para coleta de dados
- **Backend moderno** (Next.js) com API RESTful
- **Frontend reativo** (React) com atualização em tempo real
- **Banco de dados relacional** (MySQL) para persistência
- **Containerização** (Docker) para deploy fácil

O sistema garante a integridade de vacinas durante o transporte através de monitoramento contínuo de temperatura, rastreamento GPS e geração automática de alertas.

---

## 16. Referências Técnicas

### Documentação
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [ESP-IDF Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [MySQL 8 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [SWR Documentation](https://swr.vercel.app)
- [Recharts Documentation](https://recharts.org)

### Bibliotecas Principais
- Next.js 16.0.3
- React 19.2.0
- TypeScript 5.x
- MySQL2
- SWR
- Recharts
- Radix UI
- Tailwind CSS 4.1.9

---

**Versão do Relatório**: 1.0  
**Data**: 2024  
**Autor**: Análise Técnica do Projeto VaccineTrack



