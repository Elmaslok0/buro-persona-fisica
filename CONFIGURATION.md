# Configuración del Panel Crediticio Profesional

## Variables de Entorno Requeridas

### API del Buró de Crédito

| Variable | Descripción | Valor Ejemplo |
|----------|-------------|---------------|
| `BURO_API_URL` | URL base de la API del buró | `https://api.buro.com.mx` |
| `BURO_API_KEY` | Client ID para autenticación | `l7f4ab9619923343069e3a48c3209b61e4` |
| `BURO_API_SECRET` | Client Secret para autenticación | `ee9ba699e9f54cd7bbe7948e0884ccc9` |
| `BURO_API_USER` | Usuario del buró | `Laure88*` |
| `BURO_API_PASSWORD` | Contraseña del buró | `PeTrolero88L*` |
| `BURO_API_TIMEOUT` | Timeout en ms | `30000` |

### Base de Datos

| Variable | Descripción | Valor Ejemplo |
|----------|-------------|---------------|
| `DATABASE_URL` | Conexión MySQL/TiDB | `mysql://user:pass@localhost:3306/panel_buro` |

### Autenticación y Seguridad

| Variable | Descripción | Valor Ejemplo |
|----------|-------------|---------------|
| `JWT_SECRET` | Secreto para tokens JWT | `tu_secreto_super_seguro` |
| `JWT_EXPIRATION` | Expiración en horas | `1` |

### OAuth - Manus

| Variable | Descripción |
|----------|-------------|
| `VITE_APP_ID` | ID de aplicación OAuth |
| `OAUTH_SERVER_URL` | URL del servidor OAuth |
| `VITE_OAUTH_PORTAL_URL` | URL del portal OAuth |

### Información del Propietario

| Variable | Descripción |
|----------|-------------|
| `OWNER_OPEN_ID` | OpenID del propietario |
| `OWNER_NAME` | Nombre del propietario |

### APIs Integradas de Manus

| Variable | Descripción |
|----------|-------------|
| `BUILT_IN_FORGE_API_URL` | URL de APIs integradas |
| `BUILT_IN_FORGE_API_KEY` | Token de servidor |
| `VITE_FRONTEND_FORGE_API_KEY` | Token de frontend |
| `VITE_FRONTEND_FORGE_API_URL` | URL para frontend |

### Analytics

| Variable | Descripción |
|----------|-------------|
| `VITE_ANALYTICS_ENDPOINT` | Endpoint de analytics |
| `VITE_ANALYTICS_WEBSITE_ID` | ID del sitio web |

### Aplicación

| Variable | Descripción |
|----------|-------------|
| `VITE_APP_TITLE` | Título de la aplicación |
| `VITE_APP_LOGO` | URL del logo |
| `NODE_ENV` | Ambiente (development/production) |
| `PORT` | Puerto del servidor |

## Configuración en Manus UI

Para configurar las variables de entorno en el panel de Manus:

1. Accede a **Settings → Secrets** en el Management UI
2. Completa los valores requeridos
3. Los valores se inyectarán automáticamente en el servidor

## Credenciales Proporcionadas

Las siguientes credenciales han sido proporcionadas para la integración:

```
Usuario: Laure88*
Contraseña: PeTrolero88L*
API Key: l7f4ab9619923343069e3a48c3209b61e4
API Secret: ee9ba699e9f54cd7bbe7948e0884ccc9
```

## Seguridad en Producción

### Recomendaciones Críticas

1. **Nunca commitear archivos .env** - Use `.gitignore`
2. **Rotar secretos regularmente** - Especialmente `JWT_SECRET`
3. **Usar HTTPS en producción** - Requerido para cookies seguras
4. **Validar todas las entradas** - El servidor valida automáticamente
5. **Auditar accesos** - Registrar todas las consultas al buró
6. **Limitar rate limiting** - Implementar throttling por IP/usuario

### Variables Críticas

- `JWT_SECRET` - Cambiar inmediatamente en producción
- `BURO_API_SECRET` - Mantener confidencial
- `DATABASE_URL` - Usar credenciales fuertes

## Estructura de Configuración

El sistema utiliza un modelo de configuración en capas:

```
1. Variables de Entorno (.env)
   ↓
2. Configuración del Servidor (server/_core/env.ts)
   ↓
3. Contexto de tRPC (server/_core/context.ts)
   ↓
4. Procedimientos (server/routers.ts)
```

## Validación de Configuración

Al iniciar el servidor, se valida automáticamente:

- ✅ Variables de entorno requeridas
- ✅ Conexión a base de datos
- ✅ Conectividad a API del buró
- ✅ Validez de tokens JWT

## Troubleshooting

### Error: "Missing required environment variables"

**Solución:** Verifica que todas las variables en `CONFIGURATION.md` estén configuradas en Manus UI → Settings → Secrets

### Error: "Database connection failed"

**Solución:** Verifica la cadena de conexión `DATABASE_URL` y que el servidor MySQL/TiDB esté accesible

### Error: "API authentication failed"

**Solución:** Verifica las credenciales del buró (`BURO_API_KEY`, `BURO_API_SECRET`) en el panel de Manus

## Próximos Pasos

1. Configurar todas las variables en Manus UI
2. Ejecutar pruebas de conectividad
3. Validar autenticación con el buró
4. Desplegar en producción
