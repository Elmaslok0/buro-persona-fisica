# Panel Crediticio Profesional - Sistema de Buró de Crédito en México

## Descripción General

El **Panel Crediticio Profesional** es un sistema completo de integración con APIs de buró de crédito en México. Implementa una arquitectura full-stack que sigue estrictamente los 6 módulos JSON especificados, permitiendo autenticación, prospección, monitoreo, estimación de ingresos, generación de reportes e informes crediticios.

## Arquitectura del Sistema

### Backend - Estructura Modular

```
server/
├── config/
│   └── autenticador.ts          # Configuración de autenticación
├── modules/
│   ├── prospector.ts             # Módulo de prospección
│   ├── monitor.ts                # Módulo de monitoreo
│   ├── estimadorIngresos.ts      # Módulo de estimación de ingresos
│   ├── reporteCredito.ts         # Módulo de reporte de crédito
│   └── informeBuro.ts            # Módulo de informe buró
├── services/
│   └── apiClient.ts              # Cliente de API del buró
└── routers.ts                    # Procedimientos tRPC
```

### Frontend - Vistas Separadas

```
client/src/pages/
├── Login.tsx                     # Autenticación del usuario
├── Dashboard.tsx                 # Panel principal
├── Prospector.tsx                # Prospección de clientes
├── Monitor.tsx                   # Monitoreo de crédito
├── Ingresos.tsx                  # Estimación de ingresos
├── Reporte.tsx                   # Reporte de crédito
└── Buro.tsx                      # Informe del buró
```

## Módulos del Buró de Crédito

### 1. Autenticador (`autenticador.json`)

**Propósito:** Obtener token de autenticación para reutilizar en todos los módulos.

**Endpoint:** `POST /credit-report-api/v1/autenticador`

**Request:**
```json
{
  "consulta": {
    "persona": {
      "nombre": {
        "apellidoPaterno": "García",
        "apellidoMaterno": "López",
        "nombre": "Juan"
      },
      "direccion": {
        "ciudad": "MEXICO",
        "codPais": "MX",
        "codigoPostal": "28001"
      },
      "empleo": {
        "empresa": "Empresa S.A.",
        "puesto": "Analista"
      }
    }
  }
}
```

**Response:**
```json
{
  "respuestaAutenticador": "TOKEN_AQUI",
  "respuesta": { ... }
}
```

### 2. Prospector (`prospector.json`)

**Propósito:** Consultar información de prospección del cliente.

**Endpoint:** `POST /credit-report-api/v1/prospector`

**Retorna:** Cuentas activas, historial de consultas y resumen del reporte.

### 3. Monitor (`monitor.json`)

**Propósito:** Monitorear cambios y alertas en el perfil crediticio.

**Endpoint:** `POST /credit-report-api/v1/monitor`

**Retorna:** Alertas de consulta, alertas de base de datos y cambios detectados.

### 4. Estimador de Ingresos (`estimador-ingresos.json`)

**Propósito:** Estimar ingresos basados en historial crediticio.

**Endpoint:** `POST /credit-report-api/v1/estimador-ingresos`

**Retorna:** Estimación de ingresos, análisis de capacidad de pago, histórico.

### 5. Reporte de Crédito (`reporte-de-credito.json`)

**Propósito:** Generar reporte completo del cliente.

**Endpoint:** `POST /credit-report-api/v1/reporte-de-credito`

**Retorna:** Todas las cuentas, consultas efectuadas, declaraciones, histórico completo.

### 6. Informe Buró (`informe-buro.json`)

**Propósito:** Obtener informe del buró con score crediticio.

**Endpoint:** `POST /credit-report-api/v1/informe-buro`

**Retorna:** Score crediticio, cuentas, declaraciones, consultas efectuadas.

## Flujo de Autenticación

1. Usuario ingresa datos personales en el formulario de login
2. Sistema ejecuta `autenticador.json` para obtener token
3. Token se almacena en el cliente y se reutiliza en todas las solicitudes
4. Cada módulo utiliza el token para autenticarse con la API del buró
5. Las respuestas se muestran sin modificación en el panel

## Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API del Buró de Crédito
BURO_API_URL=https://api.buro.com.mx
BURO_API_KEY=l7f4ab9619923343069e3a48c3209b61e4
BURO_API_SECRET=ee9ba699e9f54cd7bbe7948e0884ccc9
BURO_API_USER=Laure88*
BURO_API_PASSWORD=PeTrolero88L*

# Base de Datos
DATABASE_URL=mysql://user:password@localhost:3306/panel_buro

# JWT
JWT_SECRET=tu_secreto_jwt_aqui

# OAuth
VITE_APP_ID=tu_app_id
OAUTH_SERVER_URL=https://oauth.server.com
VITE_OAUTH_PORTAL_URL=https://oauth.portal.com
```

## Procedimientos tRPC Disponibles

### Autenticación
```typescript
trpc.buro.authenticate.useMutation()      // Autenticar usuario
trpc.buro.isTokenValid.useQuery()          // Verificar token válido
```

### Módulos
```typescript
trpc.buro.prospector.useMutation()         // Prospección
trpc.buro.monitor.useMutation()            // Monitoreo
trpc.buro.estimadorIngresos.useMutation()  // Estimación de ingresos
trpc.buro.reporteCredito.useMutation()     // Reporte de crédito
trpc.buro.informeBuro.useMutation()        // Informe buró
```

## Uso del Panel

### 1. Login
- Acceder a la página de login (`/`)
- Completar los campos de información personal
- El sistema autentica y redirige al dashboard

### 2. Dashboard
- Visualizar módulos disponibles en pestañas
- Cada módulo tiene un botón para ejecutar la consulta
- Los resultados se muestran en tablas formateadas

### 3. Prospector
- Consulta cuentas activas del cliente
- Muestra historial de consultas efectuadas
- Información de saldos, límites y pagos vencidos

### 4. Monitor
- Visualiza alertas de crédito
- Muestra alertas de base de datos
- Detecta cambios en el perfil crediticio

### 5. Estimador de Ingresos
- Estima ingresos basados en historial
- Análisis de capacidad de pago
- Porcentaje de utilización de crédito

### 6. Reporte de Crédito
- Reporte completo del cliente
- Todas las cuentas con detalles
- Historial completo de transacciones

### 7. Informe Buró
- Score crediticio con interpretación
- Clasificación de riesgo
- Recomendación de crédito

## Manejo de Errores

El sistema implementa manejo robusto de errores:

- **Errores de Autenticación:** Redirige al login
- **Errores de API:** Muestra mensaje descriptivo
- **Errores de Validación:** Valida campos requeridos
- **Errores de Conexión:** Reintenta automáticamente

## Seguridad

- **Tokens:** Se almacenan en localStorage (considerar usar sessionStorage para producción)
- **API Keys:** Se almacenan en variables de entorno del servidor
- **HTTPS:** Recomendado para producción
- **CORS:** Configurado para permitir solicitudes del frontend

## Desarrollo

### Instalar Dependencias
```bash
pnpm install
```

### Ejecutar en Desarrollo
```bash
pnpm dev
```

### Build para Producción
```bash
pnpm build
```

### Ejecutar Pruebas
```bash
pnpm test
```

## Estructura de Datos

### Persona (Estructura Común)
```typescript
interface PersonaBC {
  nombre?: {
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    nombre?: string;
  };
  direccion?: {
    ciudad?: string;
    codPais?: string;
    codigoPostal?: string;
    calle?: string;
    numero?: string;
  };
  empleo?: {
    empresa?: string;
    puesto?: string;
    antiguedad?: string;
  };
  telefonoContacto?: string;
}
```

### Respuesta de API
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
```

## Limitaciones y Consideraciones

1. **Token Expiration:** Los tokens expiran después de 1 hora (configurable)
2. **Rate Limiting:** La API del buró puede tener límites de solicitudes
3. **Datos Sensibles:** No almacenar datos sensibles en localStorage
4. **Validación:** Todos los campos de entrada se validan en el servidor

## Próximos Pasos

1. Configurar base de datos MySQL/TiDB
2. Implementar persistencia de datos
3. Agregar auditoría de acciones
4. Implementar notificaciones en tiempo real
5. Agregar exportación de reportes (PDF, Excel)
6. Implementar dashboard analítico

## Soporte

Para soporte técnico, contactar al equipo de desarrollo o revisar la documentación de la API del buró en `/panel-buro/API_ROUTES.md`.

## Licencia

Confidencial - Uso interno únicamente.

## Especificaciones de API

Las especificaciones completas de cada módulo JSON se encuentran en:
- `/panel-buro/api-specs/` - Archivos JSON originales
- `/panel-buro/API_ROUTES.md` - Documentación de rutas
- `/panel-buro/JSON_SPECIFICATIONS.md` - Especificaciones detalladas
