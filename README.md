# Panel de Persona Física - Buró de Crédito

Sistema completo de gestión de buró de crédito para personas físicas con actividad empresarial, integrado con la API oficial de Buró de Crédito de México.

## 🎨 Diseño

El sistema utiliza una **estética brutalist tipográfica** con:
- Tipografía pesada sans-serif (Roboto Condensed)
- Alto contraste blanco/negro
- Bordes gruesos y geométricos
- Espaciado generoso y asimétrico
- Diseño limpio y moderno

## 🚀 Características Principales

### Módulos de Buró de Crédito

1. **Autenticador**
   - Autenticación con preguntas de seguridad
   - Basado en historial crediticio real
   - Validación de identidad

2. **Reporte de Crédito**
   - Historial crediticio completo
   - Cuentas activas y cerradas
   - Historial de pagos y MOP ratings
   - Saldos y límites de crédito

3. **Informe Buró**
   - Reporte detallado del buró
   - Consultas realizadas
   - Declaraciones del consumidor
   - Datos de empleo

4. **Monitor**
   - Monitoreo continuo de cambios
   - Alertas de nuevas consultas
   - Seguimiento de cuentas activas
   - Notificaciones automáticas

5. **Prospector**
   - Análisis de clientes potenciales
   - Perfil crediticio
   - Comportamiento de pago
   - Recomendaciones de productos

6. **Estimador de Ingresos**
   - Estimación basada en historial
   - Análisis de límites de crédito
   - Patrones de consumo
   - Capacidad de pago

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Express + tRPC 11
- **Base de Datos**: MySQL/TiDB (via Drizzle ORM) o almacenamiento en memoria
- **API**: Buró de Crédito OAuth2

### URLs de la API de Buró de Crédito

```
https://api.burodecredito.com.mx:4431/devpf/autenticador
https://api.burodecredito.com.mx:4431/devpf/reporte-de-credito
https://api.burodecredito.com.mx:4431/devpf/informe-buro
https://api.burodecredito.com.mx:4431/devpf/monitor
https://api.burodecredito.com.mx:4431/devpf/prospector
https://api.burodecredito.com.mx:4431/devpf/estimador-ingresos
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# API de Buró de Crédito
BURO_API_BASE_URL=https://api.burodecredito.com.mx:4431/devpf
BURO_API_USERNAME=apif.burodecredito.com.mx:Onsite:Onsite007$$
BURO_API_PASSWORD=
BURO_API_CLIENT_ID=l7f4ab9619923343069e3a48c3209b61e4
BURO_API_CLIENT_SECRET=ee9ba699e9f54cd7bbe7948e0884ccc9
BURO_TOKEN_URL=https://apigateway1.burodecredito.com.mx:8443/auth/oauth/v2/token

# Servidor
NODE_ENV=production
PORT=3000

# JWT Secret (generar uno seguro para producción)
JWT_SECRET=tu-clave-secreta-aqui

# Base de datos (opcional)
# DATABASE_URL=mysql://usuario:password@host:puerto/base_de_datos
```

### Instalación Local

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar en producción
pnpm start
```

## 📦 Despliegue en Koyeb

### Opción 1: Desde GitHub

1. Sube el código a un repositorio de GitHub
2. En Koyeb, crea un nuevo servicio
3. Conecta tu repositorio de GitHub
4. Configura las variables de entorno (ver sección anterior)
5. Configura:
   - **Build command**: `pnpm install && pnpm build`
   - **Run command**: `pnpm start`
   - **Port**: `3000`

### Opción 2: Desde Docker

Crea un archivo `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build
RUN pnpm build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "start"]
```

### Variables de Entorno en Koyeb

En el panel de Koyeb, agrega las siguientes variables de entorno:

| Variable | Valor |
|----------|-------|
| `BURO_API_BASE_URL` | `https://api.burodecredito.com.mx:4431/devpf` |
| `BURO_API_USERNAME` | `apif.burodecredito.com.mx:Onsite:Onsite007$$` |
| `BURO_API_CLIENT_ID` | `l7f4ab9619923343069e3a48c3209b61e4` |
| `BURO_API_CLIENT_SECRET` | `ee9ba699e9f54cd7bbe7948e0884ccc9` |
| `BURO_TOKEN_URL` | `https://apigateway1.burodecredito.com.mx:8443/auth/oauth/v2/token` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `JWT_SECRET` | `(genera una clave segura)` |

## 🎯 Uso del Sistema

### 1. Agregar Cliente

1. Click en "+ NUEVO CLIENTE"
2. Llenar datos personales, identificación y contacto
3. Guardar cliente

### 2. Consultar Buró

1. Click en cualquier módulo (Autenticador, Reporte de Crédito, etc.)
2. Seleccionar cliente
3. Completar datos requeridos
4. Ejecutar consulta

### 3. Ver Resultados

Los resultados se muestran en formato JSON con toda la información del buró de crédito.

## 🔒 Seguridad

- Credenciales de API almacenadas en variables de entorno
- Comunicación HTTPS con Buró de Crédito
- Autenticación OAuth2 con la API de Buró
- Validación de datos en backend

## 📄 Licencia

MIT

---

**Panel Nanoeste - Buró de Crédito Persona Física**
