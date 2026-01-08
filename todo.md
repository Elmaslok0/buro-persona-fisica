# Panel Crediticio Profesional - TODO

## Fase 1: Configuración y Estructura Backend
- [x] Crear estructura de directorios backend (config, modules, services, routes)
- [x] Implementar autenticador.js con obtención y reutilización de token
- [x] Crear apiClient.js para comunicación con APIs del buró
- [x] Configurar variables de entorno (API_KEY, API_SECRET, API_URL)

## Fase 2: Módulos Backend
- [x] Implementar prospector.js siguiendo prospector.json exactamente
- [x] Implementar monitor.js siguiendo monitor.json exactamente
- [x] Implementar estimadorIngresos.js siguiendo estimador-ingresos.json exactamente
- [x] Implementar reporteCredito.js siguiendo reporte-de-credito.json exactamente
- [x] Implementar informeBuro.js siguiendo informe-buro.json exactamente

## Fase 3: Rutas Backend
- [x] Crear auth.routes.js con endpoints de autenticación
- [x] Crear prospector.routes.js con endpoints de prospección
- [x] Crear monitor.routes.js con endpoints de monitoreo
- [x] Crear ingresos.routes.js con endpoints de estimación de ingresos
- [x] Crear reporte.routes.js con endpoints de reportes
- [x] Crear buro.routes.js con endpoints de informe buró
- [x] Integrar todas las rutas en server.js

## Fase 4: Procedimientos tRPC
- [x] Crear procedimiento de autenticación en tRPC
- [x] Crear procedimiento de prospección en tRPC
- [x] Crear procedimiento de monitoreo en tRPC
- [x] Crear procedimiento de estimación de ingresos en tRPC
- [x] Crear procedimiento de reporte de crédito en tRPC
- [x] Crear procedimiento de informe buró en tRPC

## Fase 5: Frontend - Vistas
- [x] Crear login.html/componente de login
- [x] Crear dashboard.html/componente de dashboard
- [x] Crear prospector.html/componente de prospección
- [x] Crear monitor.html/componente de monitoreo
- [x] Crear ingresos.html/componente de estimación de ingresos
- [x] Crear reporte.html/componente de reportes
- [x] Crear buro.html/componente de informe buró

## Fase 6: Frontend - Integración
- [x] Integrar llamadas tRPC en componentes de login
- [x] Integrar llamadas tRPC en componentes de prospección
- [x] Integrar llamadas tRPC en componentes de monitoreo
- [x] Integrar llamadas tRPC en componentes de estimación de ingresos
- [x] Integrar llamadas tRPC en componentes de reportes
- [x] Integrar llamadas tRPC en componentes de informe buró
- [x] Implementar navegación entre vistas

## Fase 7: Documentación y Despliegue
- [x] Crear README.md completo con arquitectura
- [x] Documentar flujo del sistema
- [x] Documentar configuración de variables de entorno
- [x] Crear guía de uso del panel
- [x] Crear archivo .env.example con placeholders

## Fase 8: Testing y Validación
- [x] Correcciones de campos del formulario (RFC, Fecha Nacimiento, Estado)
- [x] Validar que todos los campos JSON se respeten exactamente
- [ ] Pruebas de autenticación
- [ ] Pruebas de prospección
- [ ] Pruebas de monitoreo
- [ ] Pruebas de estimación de ingresos
- [ ] Pruebas de reportes
- [ ] Pruebas de informe buró

## Fase 9: Entrega Final
- [ ] Guardar checkpoint final
- [ ] Entregar sistema completo al usuario

## Fase 10: Integración con API Real del Buró
- [x] Conectar Prospector con API real usando token de autenticación
- [ ] Conectar Monitor con API real
- [ ] Conectar Estimador de Ingresos con API real
- [ ] Conectar Reporte de Crédito con API real
- [ ] Conectar Informe Buró con API real

## Fase 11: Mejoras de UX y Validación
- [x] Validación profesional de Fecha de Nacimiento (DD/MM/YYYY sin espacios)
- [x] Búsqueda automática de localidad por Código Postal
- [x] Validación de RFC (13 caracteres, formato correcto)
- [x] Envío de RFC, Fecha Nacimiento y CP a APIs como identificadores
- [x] Máscaras de entrada en campos de fecha y RFC

## Fase 12: Dirección Completa y Profesional
- [x] Agregar campos: Calle, Número, Apartamento, Colonia/Delegación
- [x] Validación de campos de dirección
- [x] Envío de dirección completa a APIs como identificador

## Fase 13: Integración de Autenticación Real
- [x] Conectar procedimiento tRPC de autenticación con API del buró
- [x] Validación de credenciales contra API real
- [x] Obtención de token real de autenticación
- [x] Almacenamiento seguro de token en localStorage
- [x] Manejo de errores de autenticación
