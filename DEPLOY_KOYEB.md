# Despliegue en Koyeb - Panel de Buró de Crédito

## Requisitos Previos

1. ✅ Base de datos PostgreSQL configurada (ya tienes una en Koyeb)
2. ✅ Código del proyecto listo
3. ✅ Credenciales de API de Buró de Crédito

## Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Subir código a GitHub

```bash
cd /home/ubuntu/buro_persona_fisica
git init
git add .
git commit -m "Initial commit - Panel Buró de Crédito"
git remote add origin https://github.com/TU_USUARIO/buro-persona-fisica.git
git push -u origin main
```

### Paso 2: Crear servicio en Koyeb

1. Ve a https://app.koyeb.com/services
2. Click en "Create Service"
3. Selecciona "GitHub" como source
4. Conecta tu repositorio
5. Configura:
   - **Name**: `buro-persona-fisica`
   - **Branch**: `main`
   - **Build command**: `pnpm install && pnpm db:push && pnpm build`
   - **Start command**: `pnpm start`
   - **Port**: `3000`
   - **Instance type**: `nano` o superior

### Paso 3: Configurar Variables de Entorno

En la sección "Environment variables", agrega:

```
DATABASE_URL=postgres://koyeb-adm:npg_Peb9lw0RKQEX@ep-floral-mouse-agfp728w.c-2.eu-central-1.pg.koyeb.app/koyebdb?sslmode=require

BURO_API_BASE_URL=https://api.burodecredito.com.mx:4431/devpf
BURO_API_USERNAME=apif.burodecredito.com.mx:Onsite:Onsite007$$
BURO_API_CLIENT_ID=l7f4ab9619923343069e3a48c3209b61e4
BURO_API_CLIENT_SECRET=ee9ba699e9f54cd7bbe7948e0884ccc9

# OAuth (necesitas crear una app en Manus)
JWT_SECRET=tu_secreto_jwt_seguro_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=tu_app_id_de_manus
```

### Paso 4: Deploy

Click en "Deploy" y espera a que se complete el despliegue (2-5 minutos).

---

## Opción 2: Despliegue desde Docker

### Crear Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Aplicar migraciones y build
RUN pnpm db:push && pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

### Desplegar en Koyeb

1. Sube la imagen a Docker Hub
2. En Koyeb, selecciona "Docker" como source
3. Ingresa la URL de tu imagen
4. Configura las variables de entorno (igual que arriba)
5. Deploy

---

## Opción 3: Despliegue ZIP (Más Simple)

1. Comprime el proyecto: `zip -r buro-pf.zip . -x "node_modules/*" -x ".git/*"`
2. Ve a Koyeb → Create Service → Upload ZIP
3. Sube el archivo `buro-pf.zip`
4. Configura variables de entorno
5. Deploy

---

## Verificación Post-Despliegue

1. **Verifica la URL**: Koyeb te dará una URL como `https://buro-persona-fisica-XXXXX.koyeb.app`
2. **Prueba el login**: Accede a la URL y haz login
3. **Prueba los módulos**: Crea un cliente y prueba cada módulo de Buró
4. **Verifica la base de datos**: Revisa que los datos se guarden correctamente

---

## Troubleshooting

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` tenga `?sslmode=require` al final
- Confirma que la base de datos esté activa en Koyeb

### Error 502 Bad Gateway
- Revisa los logs en Koyeb Dashboard
- Verifica que el puerto sea 3000
- Confirma que el build command se ejecutó correctamente

### API de Buró no responde
- Verifica las credenciales en variables de entorno
- Confirma que la URL base sea correcta
- Revisa los logs del servidor

---

## Configuración de Dominio Personalizado

1. Ve a tu servicio en Koyeb
2. Click en "Domains"
3. Agrega tu dominio personalizado
4. Configura los DNS según las instrucciones de Koyeb

---

## Monitoreo y Logs

- **Logs en tiempo real**: Koyeb Dashboard → Tu Servicio → Logs
- **Métricas**: Koyeb Dashboard → Tu Servicio → Metrics
- **Alertas**: Configura notificaciones en Settings

---

## Costos Estimados

- **Nano instance**: ~$5/mes
- **Small instance**: ~$10/mes
- **Database**: Incluida en plan gratuito de Koyeb

---

## Soporte

Si tienes problemas con el despliegue:
1. Revisa los logs en Koyeb
2. Verifica las variables de entorno
3. Confirma que la base de datos esté conectada
4. Prueba localmente primero con `pnpm dev`
