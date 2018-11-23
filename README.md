<!-- Logos da UDC + FIC (sen marxes brancos) -->
<p><center><img src="https://wiki.fic.udc.es/muei_faq/cabecera.png" width="100%"/></center></p>


# RIWS - Práctica 1

- Alumno 1: **Daniel Núñez Sánchez** (daniel.nunezs@udc.es)
- Alumno 2: **Rodrigo Dopazo Iglesias** (r.dopazo@udc.es)


<br>
## Guía para probar la práctica de manera rápida

##### Para probar esta práctica de manera rápida, sin tener que esperar el tiempo de crawlear y recopilar la información del dominio de Vademecum (en nuestro caso, para recopilar todos los fármacos que son casi 15000, ha tardado en procesar todas las páginas sobre 1 hora y 20 minutos), se deben realizar los siguientes pasos:


1.	Asegurarse de que está habilitada la configuración de ElasticSearch para permitir el CORS - Control de acceso HTTP (ver la nota [*] del apartado 3.4.). Si no se modifica, el servidor no permitirá las peticiones AJAX realizadas desde el navegador web. 
<br>

2.	Antes de seguir, renombrar la carpeta “data” del directorio raíz de ElasticSearch (donde se encuentra “bin”, “config” …) y ponerle “data_backup”, para no sobrescribir tus datos actuales con los datos de nuestra práctica. Descomprimir el archivo “data.zip” y mover esa carpeta descomprimida “data” al directorio raíz de ElasticSearch. 
        
    Este paso evitará tener que volver a crawlear y lanzar el spider de Scrapy para recopilar la información. Ya están los casi 15000 medicamentos en esa carpeta, los cuales cargará ElasticSearch una vez esté lanzado.
<br>

3.	Arrancar el servidor ElasticSearch, ejecutándolo usando el script “bin/elasticsearch” (necesario tener Java (JRE) instalado).
<br>

4.	En la carpeta “web” se encuentran los ficheros de la interfaz web de nuestra aplicación. Abriendo el archivo “index.html” en un navegador web se muestra la interfaz con la que puede interactuar el usuario para realizar consultas a través del formulario.
<br>

5.	Este formulario permite realizar búsquedas por palabras clave, seleccionar cuantos resultados se desean mostrar (10, 20, 50 o 100), especificar el nombre del fármaco, seleccionar el rango de precios de venta al público entre un valor mínimo y otro máximo, si se desea buscar “igual a” o “diferente de” un Principio Activo, lo mismo para la faceta Excipiente. Por último, se filtra qué tipos de alertas por composición se desean ocultar.
