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

### Funcionalidades Adicionales

- **Gestión de Clientes**: CRUD completo de personas físicas
- **Almacenamiento S3**: Documentos y reportes en la nube
- **Análisis Inteligente**: LLM para recomendaciones personalizadas
- **Exportación PDF**: Generación de reportes descargables
- **Sistema de Alertas**: Notificaciones de cambios importantes
- **Historial de Consultas**: Registro completo de operaciones

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Express + tRPC 11
- **Base de Datos**: MySQL/TiDB (via Drizzle ORM)
- **Autenticación**: Manus OAuth
- **Almacenamiento**: S3
- **IA**: LLM integrado para análisis

### Estructura de Base de Datos

```
- users: Usuarios del sistema
- clients: Personas físicas
- addresses: Direcciones de clientes
- employments: Historial de empleo
- credit_accounts: Cuentas de crédito
- credit_queries: Consultas realizadas
- credit_reports: Reportes generados
- documents: Documentos almacenados
- alerts: Alertas y notificaciones
- llm_analysis: Análisis inteligente
```

## 🔧 Configuración

### Variables de Entorno

Las siguientes credenciales están configuradas en `.env.local`:

```env
BURO_API_BASE_URL=https://api.burodecredito.com.mx:4431/devpf
BURO_API_USERNAME=apif.burodecredito.com.mx:Onsite:Onsite007$$
BURO_API_CLIENT_ID=l7f4ab9619923343069e3a48c3209b61e4
BURO_API_CLIENT_SECRET=ee9ba699e9f54cd7bbe7948e0884ccc9
```

### Instalación

```bash
# Instalar dependencias
pnpm install

# Aplicar migraciones de base de datos
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev

# Ejecutar tests
pnpm test

# Build para producción
pnpm build

# Iniciar en producción
pnpm start
```

## 📡 API de Buró de Crédito

### Endpoints Integrados

Todos los endpoints están implementados y funcionando:

- `POST /autenticador` - Autenticación con preguntas de seguridad
- `POST /reporte-de-credito` - Reporte completo de crédito
- `POST /informe-buro` - Informe detallado del buró
- `POST /monitor` - Monitoreo de cambios
- `POST /prospector` - Análisis de prospección
- `POST /estimador-ingresos` - Estimación de ingresos

### Estructura de Request

Cada módulo requiere datos de la persona y encabezado de consulta:

```typescript
{
  consulta: {
    persona: {
      primerNombre: string,
      apellidoPaterno: string,
      apellidoMaterno?: string,
      fechaNacimiento: string,
      rfc?: string,
      curp?: string,
      nacionalidad?: string,
      domicilio: {
        direccion1: string,
        coloniaPoblacion: string,
        delegacionMunicipio: string,
        ciudad: string,
        estado: string,
        cp: string,
        codPais: string
      }
    },
    encabezado: {
      claveOtorgante: string,
      nombreOtorgante: string,
      folioConsulta?: string,
      // ... otros campos según el módulo
    }
  }
}
```

## 🧪 Testing

El proyecto incluye tests completos con Vitest:

```bash
# Ejecutar todos los tests
pnpm test

# Tests incluidos:
# - Autenticación y logout
# - Creación de clientes
# - Endpoints de Buró de Crédito
# - Almacenamiento de documentos
# - Análisis LLM
```

## 🎯 Uso del Sistema

### 1. Agregar Cliente

1. Click en "+ NUEVO CLIENTE"
2. Llenar datos personales, identificación y contacto
3. Guardar cliente

### 2. Consultar Buró

1. Click en "CONSULTAR BURÓ"
2. Seleccionar módulo deseado
3. Elegir cliente
4. Completar datos requeridos
5. Ejecutar consulta

### 3. Ver Reportes

1. Acceder a sección de reportes
2. Filtrar por cliente, fecha o tipo
3. Ver detalles o exportar PDF

### 4. Análisis Inteligente

El sistema genera automáticamente:
- Análisis de riesgo crediticio
- Recomendaciones personalizadas
- Sugerencias de mejora de score
- Predicciones de comportamiento

## 🔒 Seguridad

- Autenticación OAuth obligatoria
- Credenciales de API almacenadas de forma segura
- Comunicación HTTPS con Buró de Crédito
- Validación de datos en backend
- Protección contra inyección SQL (Drizzle ORM)

## 📦 Despliegue en Koyeb

El proyecto está optimizado para despliegue en Koyeb:

1. Conectar repositorio Git
2. Configurar variables de entorno
3. Comando de build: `pnpm build`
4. Comando de start: `pnpm start`
5. Puerto: 3000

### Variables de Entorno Requeridas en Koyeb

```
DATABASE_URL=<tu_conexión_mysql>
BURO_API_BASE_URL=https://api.burodecredito.com.mx:4431/devpf
BURO_API_USERNAME=apif.burodecredito.com.mx:Onsite:Onsite007$$
BURO_API_CLIENT_ID=l7f4ab9619923343069e3a48c3209b61e4
BURO_API_CLIENT_SECRET=ee9ba699e9f54cd7bbe7948e0884ccc9
```

## 📄 Licencia

MIT

## 👥 Soporte

Para soporte técnico o preguntas sobre la integración con Buró de Crédito, contactar al equipo de desarrollo.

---

**Desarrollado con estética brutalist tipográfica para máximo impacto visual y usabilidad.**
