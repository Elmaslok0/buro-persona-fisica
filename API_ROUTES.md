# Rutas y Endpoints de API - Panel Crediticio


## Módulo: autenticador
**Archivo:** autenticador.json

**Título:** Api Autenticador
**Descripción:** Permite obtener datos transaccionales de Autenticador

### Rutas

**Path:** `/credit-report-api/v1/autenticador`

**Método:** POST

**Parámetros:**
- `request` (body) - Requerido: True - Tipo: object

**Request Body Schema:**
- Referencia: `AutenticadorRequest`

**Respuestas:**
- **200:** Datos generados para el reporte de crédito
  - Tipo: `CreditReportResponse`
- **201:** Respuesta de la Autenticación
- **202:** Información requerida no encontrada
  - Tipo: `CreditReportResponse`
- **400:** Los Datos de la solicitud no son válidos
  - Tipo: `ErrorResp`
- **401:** La petición no cuenta con un token válido
- **403:** El servicio requiere de un token
- **500:** Error interno del sistema
  - Tipo: `ErrorResp`

---

### Definiciones Principales

**Request Objects:**
- `AutenticadorRequest`

**Response Objects:**
- `CreditReportResponse`

**Total de definiciones:** 28


## Módulo: estimador-ingresos
**Archivo:** estimador-ingresos.json

**Título:** API Estimador de Ingresos
**Descripción:** Permite obtener datos transaccionales de Estimador de Ingresos

### Rutas

**Path:** `/credit-report-api/v1/estimador-ingresos`

**Método:** POST

**Parámetros:**
- `request` (body) - Requerido: True - Tipo: object

**Request Body Schema:**
- Referencia: `EstimadorIngresosRequest`

**Respuestas:**
- **200:** Datos generados para el modelo
- **202:** Información requerida no encontrada
- **400:** Los Datos de la solicitud no son válidos
- **401:** La petición no cuenta con un token válido
- **403:** El servicio requiere de un token
- **500:** Error interno del sistema

---

### Definiciones Principales

**Request Objects:**
- `EstimadorIngresosRequest`

**Response Objects:**
- `CreditReportResponse`

**Total de definiciones:** 27


## Módulo: informe-buro
**Archivo:** informe-buro.json

**Título:** API Informe Buró
**Descripción:** Permite obtener datos transaccionales de Informe Buró

### Rutas

**Path:** `/credit-report-api/v1/informe-buro`

**Método:** POST

**Parámetros:**
- `request` (body) - Requerido: True - Tipo: object

**Request Body Schema:**
- Referencia: `InformeBuroRequest`

**Respuestas:**
- **200:** Datos generados para el informe buro
- **202:** Informacion requerida no encontrada
- **400:** Los Datos de la solicitud no son validos
- **401:** La petición no cuenta con un token válido
- **403:** El servicio requiere de un token
- **500:** Error interno del sistema

---

### Definiciones Principales

**Request Objects:**
- `InformeBuroRequest`

**Response Objects:**
- `CreditReportResponse`

**Total de definiciones:** 27


## Módulo: monitor
**Archivo:** monitor.json

**Título:** API Monitor
**Descripción:** Permite obtener datos transaccionales de Monitor

### Rutas

**Path:** `/credit-report-api/v1/monitor`

**Método:** POST

**Parámetros:**
- `request` (body) - Requerido: True - Tipo: object

**Request Body Schema:**
- Referencia: `MonitorRequest`

**Respuestas:**
- **200:** Datos generados para el modelo
- **202:** Información requerida no encontrada
- **400:** Los Datos de la solicitud no son válidos
- **401:** La petición no cuenta con un token válido
- **500:** Error interno del sistema

---

### Definiciones Principales

**Request Objects:**
- `MonitorRequest`

**Response Objects:**
- `CreditReportResponse`

**Total de definiciones:** 27


## Módulo: prospector
**Archivo:** prospector(2).json

**Título:** API Prospector
**Descripción:** Permite obtener datos transaccionales de Prospector

### Rutas

**Path:** `/credit-report-api/v1/prospector`

**Método:** POST

**Parámetros:**
- `request` (body) - Requerido: True - Tipo: object

**Request Body Schema:**
- Referencia: `ProspectorRequest`

**Respuestas:**
- **200:** Datos generados para el modelo
- **202:** Información requerida no encontrada
- **400:** Los Datos de la solicitud no son válidos
- **401:** La petición no cuenta con un token válido
- **403:** El servicio requiere de un token
- **500:** Error interno del sistema

---

### Definiciones Principales

**Request Objects:**
- `ProspectorRequest`

**Response Objects:**
- `CreditReportResponse`

**Total de definiciones:** 27


## Módulo: reporte-de-credito
**Archivo:** reporte-de-credito.json

**Título:** API Reporte de crédito
**Descripción:** Permite obtener datos transaccionales de Reporte de crédito

### Rutas

**Path:** `/credit-report-api/v1/reporte-de-credito`

**Método:** POST

**Parámetros:**
- `request` (body) - Requerido: True - Tipo: object

**Request Body Schema:**
- Referencia: `CreditReportRequest`

**Respuestas:**
- **200:** Datos generados para el reporte de crédito
- **202:** Informacion requerida no encontrada
- **400:** Los Datos de la solicitud no son validos
- **401:** La petición no cuenta con un token válido
- **403:** El servicio requiere de un token
- **500:** Error interno del sistema

---

### Definiciones Principales

**Request Objects:**
- `CreditReportRequest`

**Response Objects:**
- `CreditReportResponse`

**Total de definiciones:** 27

