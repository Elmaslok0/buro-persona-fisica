# Especificaciones JSON - Panel Crediticio Profesional

## Resumen de Módulos

Este documento describe los 6 módulos JSON que definen la integración con el buró de crédito. **IMPORTANTE:** No se deben modificar campos, nombres o estructuras. El código debe adaptarse exactamente a estas especificaciones.

### 1. autenticador.json
- **Propósito:** Autenticación y obtención de token
- **Endpoint:** `/credit-report-api/v1/autenticador`
- **Método:** POST
- **Request:** AutenticadorRequest (contiene: consulta -> persona)
- **Response:** CreditReportResponse (contiene: respuesta, respuestaAutenticador)
- **Campos Requeridos:** consulta.persona
- **Estructura Persona:** NombreBC, Direccion, EmpleoBC, NombreBC
- **Token Reuse:** El token obtenido se reutiliza en todos los demás módulos

### 2. prospector.json
- **Propósito:** Prospección de clientes
- **Endpoint:** `/credit-report-api/v1/prospector`
- **Método:** POST
- **Request:** ProspectorRequest (contiene: consulta -> persona)
- **Response:** CreditReportResponse (contiene: respuesta con cuentas y consultas)
- **Campos Requeridos:** consulta.persona
- **Datos Retornados:** Cuentas del cliente, historial de consultas

### 3. monitor.json
- **Propósito:** Monitoreo de crédito con alertas
- **Endpoint:** `/credit-report-api/v1/monitor`
- **Método:** POST
- **Request:** MonitorRequest (contiene: consulta -> persona)
- **Response:** CreditReportResponse (contiene: respuesta con alertas)
- **Campos Requeridos:** consulta.persona
- **Datos Retornados:** Alertas, cambios en el perfil crediticio

### 4. estimador-ingresos.json
- **Propósito:** Estimación de ingresos basada en historial crediticio
- **Endpoint:** `/credit-report-api/v1/estimador-ingresos`
- **Método:** POST
- **Request:** EstimadorIngresosRequest (contiene: consulta -> persona)
- **Response:** CreditReportResponse (contiene: respuesta con estimaciones)
- **Campos Requeridos:** consulta.persona
- **Datos Retornados:** Ingresos estimados, análisis de capacidad de pago

### 5. reporte-de-credito.json
- **Propósito:** Generación de reporte completo de crédito
- **Endpoint:** `/credit-report-api/v1/reporte-de-credito`
- **Método:** POST
- **Request:** ReporteCreditorRequest (contiene: consulta -> persona)
- **Response:** CreditReportResponse (contiene: respuesta con reporte completo)
- **Campos Requeridos:** consulta.persona
- **Datos Retornados:** Reporte completo con todas las cuentas, historial y análisis

### 6. informe-buro.json
- **Propósito:** Informe del buró con score crediticio
- **Endpoint:** `/credit-report-api/v1/informe-buro`
- **Método:** POST
- **Request:** InformeBuroRequest (contiene: consulta -> persona)
- **Response:** CreditReportResponse (contiene: respuesta con score, cuentas, historial)
- **Campos Requeridos:** consulta.persona
- **Datos Retornados:** Score crediticio, resumen de cuentas, declaraciones

## Estructura Común de Persona

Todos los módulos requieren una estructura de Persona con:
- NombreBC (nombre completo)
- Direccion (ciudad, país, código postal)
- EmpleoBC (empresa, puesto, antigüedad)
- Información de contacto

## Manejo de Errores

Todos los módulos retornan:
- **ErrorResp:** Errores generales
- **ErrorRespBC:** Errores específicos del buró
- **AR:** Objeto de respuesta con errores específicos

## Configuración Requerida

- `API_KEY`: Clave de API del buró
- `API_SECRET`: Secreto de API del buró
- `API_URL`: URL base de la API del buró

## Token de Autenticación

1. El token se obtiene del módulo `autenticador.json`
2. El token se reutiliza en TODOS los demás módulos
3. El token se incluye en el header `Authorization: Bearer {token}`
4. El token debe ser almacenado de forma segura en el servidor

## Flujo de Sistema

```
1. Usuario inicia sesión
2. Sistema ejecuta autenticador.json
3. Se obtiene token válido
4. Token se reutiliza en:
   - prospector
   - monitor
   - estimador de ingresos
   - reporte de crédito
   - informe buró
5. Cada módulo usa SOLO sus parámetros definidos
6. Las respuestas se muestran completas sin modificar
```

## Notas Importantes

- **NO inventar campos:** Solo usar los definidos en los JSON
- **NO renombrar propiedades:** Respetar mayúsculas y minúsculas exactas
- **NO eliminar nodos:** Mantener la estructura completa
- **NO simplificar estructuras:** Usar la estructura exacta
- **NO adaptar la API al código:** El código debe adaptarse a la API
- **Usar placeholders:** Para llaves reales usar `process.env.API_KEY`, etc.
- **NO datos de ejemplo:** Solo usar placeholders fuera de los JSON
