# Panel de Consulta - Buró de Crédito

Este proyecto es un panel interactivo desarrollado en Java para consultar la API de Buró de Crédito.

## Requisitos
- Java 17 o superior instalado.

## Contenido del ZIP
- `buro-credito-panel-1.0.jar`: Archivo ejecutable que contiene el panel y todas sus dependencias.
- `src/`: Carpeta con el código fuente original.
- `pom.xml`: Archivo de configuración de Maven.

## Cómo ejecutar el Panel Visual
Para abrir la interfaz gráfica, abre una terminal en esta carpeta y ejecuta:
```bash
java -cp buro-credito-panel-1.0.jar api.BuroPanel
```

## Cómo ejecutar el Cliente de Consola
Si prefieres ver la salida directamente en la terminal:
```bash
java -cp buro-credito-panel-1.0.jar api.ReporteCreditoClient
```

## Notas
- Asegúrate de ingresar tu `CLIENT_ID` y `CLIENT_SECRET` en los campos correspondientes de la interfaz.
- El panel utiliza las dependencias `OkHttp 4.11.0` y `Gson 2.10.1` integradas en el JAR.
