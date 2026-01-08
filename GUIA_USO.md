# Guía de Uso - Panel Crediticio Profesional

## Introducción

El **Panel Crediticio Profesional** es una herramienta integral para consultar información crediticia de clientes en México. Este documento proporciona instrucciones paso a paso para utilizar cada módulo del sistema.

## Acceso al Sistema

### 1. Página de Login

Al acceder al panel, se presenta un formulario de autenticación con los siguientes campos:

**Campos Obligatorios:**
- **Nombre:** Primer nombre del cliente
- **Apellido Paterno:** Apellido paterno del cliente
- **Ciudad:** Ciudad de residencia (ej: MEXICO)
- **Empresa:** Nombre de la empresa donde trabaja

**Campos Opcionales:**
- **Apellido Materno:** Segundo apellido
- **Código Postal:** Código postal del domicilio
- **Puesto:** Posición laboral
- **Antigüedad:** Años de antigüedad en la empresa
- **Teléfono de Contacto:** Número telefónico

### 2. Autenticación

1. Completa los campos requeridos
2. Haz clic en "Ingresar al Panel"
3. El sistema valida los datos y obtiene un token de autenticación
4. Se redirige automáticamente al dashboard

## Dashboard Principal

Una vez autenticado, el dashboard muestra:

- **Nombre del usuario:** En la esquina superior
- **Botón Cerrar Sesión:** Para salir del sistema
- **Pestañas de Módulos:** Acceso a cada funcionalidad
- **Estadísticas Rápidas:** Resumen de módulos disponibles

## Módulos del Sistema

### Módulo 1: Prospector

**Propósito:** Consultar información de prospección del cliente

**Pasos:**
1. Selecciona la pestaña "Prospector"
2. Haz clic en "Ejecutar Prospección"
3. El sistema consulta la API del buró
4. Se muestran dos secciones:

**Cuentas del Cliente:**
- Tabla con todas las cuentas activas
- Información de saldos, límites y pagos vencidos
- Identificación del otorgante (banco, tienda, etc.)

**Consultas Efectuadas:**
- Historial de consultas realizadas
- Fecha de cada consulta
- Resultado de la consulta

**Interpretación:**
- **Saldo Vencido en rojo:** Indica pagos atrasados
- **Pagos Vencidos > 0:** Número de cuotas sin pagar

---

### Módulo 2: Monitor

**Propósito:** Monitorear cambios y alertas en el perfil crediticio

**Pasos:**
1. Selecciona la pestaña "Monitor"
2. Haz clic en "Ejecutar Monitoreo"
3. Se muestran dos tipos de alertas:

**Alertas de Crédito:**
- Cambios en cuentas
- Nuevas consultas
- Cambios de límite de crédito
- Alertas de fraude (si aplica)

**Alertas de Base de Datos:**
- Cambios en información personal
- Actualizaciones de dirección
- Cambios de empleo

**Interpretación:**
- **Color Amarillo:** Alerta de atención
- **Severidad:** Nivel de importancia (Baja, Media, Alta)
- **Fecha:** Cuándo se detectó el cambio

---

### Módulo 3: Estimador de Ingresos

**Propósito:** Estimar ingresos basados en historial crediticio

**Pasos:**
1. Selecciona la pestaña "Ingresos"
2. Haz clic en "Ejecutar Estimación"
3. Se muestran tres estimaciones:

**Estimación de Ingresos:**
- **Ingreso Mínimo:** Estimación conservadora
- **Ingreso Estimado:** Estimación central (más probable)
- **Ingreso Máximo:** Estimación optimista

**Análisis de Capacidad de Pago:**
- **Capacidad Total:** Máximo que puede pagar mensualmente
- **Capacidad Disponible:** Capacidad sin utilizar
- **% Utilización:** Porcentaje de crédito utilizado
- **Recomendación:** Sugerencia de crédito (Aprobado/Rechazado/Revisar)

**Interpretación:**
- **% Utilización < 50%:** Buen perfil crediticio
- **% Utilización 50-80%:** Perfil aceptable
- **% Utilización > 80%:** Perfil riesgoso

---

### Módulo 4: Reporte de Crédito

**Propósito:** Generar reporte completo del cliente

**Pasos:**
1. Selecciona la pestaña "Reporte"
2. Haz clic en "Generar Reporte"
3. Se muestra tabla con todas las cuentas

**Información Incluida:**
- Nombre del otorgante
- Tipo de contrato (Tarjeta, Crédito, Hipoteca, etc.)
- Saldo actual
- Saldo vencido
- Límite de crédito
- Número de pagos vencidos

**Uso:**
- Exportar para análisis
- Adjuntar a solicitudes de crédito
- Archivo para auditoría

---

### Módulo 5: Informe Buró

**Propósito:** Obtener informe del buró con score crediticio

**Pasos:**
1. Selecciona la pestaña "Buró"
2. Haz clic en "Obtener Informe"
3. Se muestra el score crediticio

**Score Crediticio:**
- **Número:** Valor entre 300 y 850
- **Categoría:** Clasificación del score
- **Interpretación:** Descripción del perfil
- **Fecha:** Cuándo se calculó

**Clasificación de Scores:**
- **800-850:** Excelente (Verde)
- **700-799:** Muy Bueno (Azul)
- **600-699:** Bueno (Amarillo)
- **500-599:** Aceptable (Naranja)
- **< 500:** Deficiente (Rojo)

**Cuentas Asociadas:**
- Lista de todas las cuentas
- Saldos actuales
- Información del acreedor

## Manejo de Errores

### Error: "Error en la autenticación"

**Causa:** Datos personales incorrectos o API no disponible

**Solución:**
1. Verifica que los datos sean correctos
2. Intenta de nuevo
3. Si persiste, contacta al administrador

### Error: "Error en la prospección"

**Causa:** Cliente no encontrado en la base de datos del buró

**Solución:**
1. Verifica que el nombre y apellido sean correctos
2. Asegúrate de que el cliente tenga historial crediticio
3. Intenta con datos alternativos

### Error: "Conexión perdida"

**Causa:** Problema de conectividad con la API del buró

**Solución:**
1. Verifica tu conexión a internet
2. Espera unos segundos e intenta de nuevo
3. Si el problema persiste, contacta al soporte

## Mejores Prácticas

### Seguridad

1. **Nunca compartas tu sesión** - Cada usuario debe tener su propia cuenta
2. **Cierra sesión al terminar** - Usa el botón "Cerrar Sesión"
3. **No dejes el navegador abierto** - La sesión expira automáticamente
4. **Verifica URLs** - Asegúrate de estar en el sitio correcto

### Precisión de Datos

1. **Nombres exactos** - Usa los nombres tal como aparecen en el INE
2. **Ciudades correctas** - Usa mayúsculas (ej: MEXICO, GUADALAJARA)
3. **Información actual** - Actualiza datos de empresa si cambió
4. **Teléfono válido** - Proporciona un teléfono de contacto activo

### Interpretación de Resultados

1. **Revisa todas las secciones** - Cada módulo proporciona información diferente
2. **Compara con el score** - El score del buró es el indicador principal
3. **Considera el contexto** - Nuevos clientes pueden tener scores bajos
4. **Documenta decisiones** - Guarda reportes para auditoría

## Exportación de Datos

### Reporte de Crédito

1. Genera el reporte en la pestaña "Reporte"
2. Usa las herramientas del navegador para:
   - **Copiar:** Selecciona y copia la tabla
   - **Imprimir:** Usa Ctrl+P para imprimir
   - **Guardar:** Guarda como PDF desde el navegador

### Informe Buró

1. Obtén el informe en la pestaña "Buró"
2. Captura de pantalla del score
3. Copia la información de cuentas

## Preguntas Frecuentes

**P: ¿Cuánto tiempo tarda una consulta?**
R: Generalmente 2-5 segundos, dependiendo de la API del buró

**P: ¿Puedo consultar a menores de edad?**
R: No, solo se pueden consultar mayores de 18 años con historial crediticio

**P: ¿Qué significa "Cliente no encontrado"?**
R: El cliente no tiene historial crediticio en el buró

**P: ¿Con qué frecuencia se actualizan los datos?**
R: Los datos se actualizan en tiempo real desde la API del buró

**P: ¿Puedo descargar los reportes?**
R: Sí, usa las opciones de impresión/exportación del navegador

## Soporte Técnico

Para reportar problemas o solicitar ayuda:

1. Documenta el error exacto
2. Proporciona el nombre del cliente
3. Describe los pasos que realizaste
4. Contacta al equipo de soporte

## Próximas Características

- Exportación a PDF automática
- Historial de consultas
- Alertas por correo electrónico
- Dashboard analítico
- Integración con CRM

---

**Versión:** 1.0  
**Última actualización:** Enero 2026  
**Autor:** Equipo de Desarrollo - Manus
