# Arquitectura plataforma

La plataforma está armada en NodeJS, ReactJs, MongoDB. Utiliza API REST para la autenticación de usuarios y GraphQL para el manejo de datos en base  de datos. La arquitectura de carpetas es la siguiente

```
|--> server (backend folder)  
|     |--> src  
|           |--> config (backend configuration, language and env variables parser)  
|           |--> controller (API controller functions for each type)  
|           |--> language (languaje dictionaries for backend messaging)  
|           |--> loaders (service initializers e.g. express init, mongodb init)  
|           |--> middleware (express middlewares, e.g. express-jwt middleware for token verification)  
|           |--> models (database models)  
|           |--> routes (express routes for each endpoint)  
|           |--> schema (GraphQL schema, folders inside indicate data types)  
|           |--> services (business layer, connection between controller and database, or schema and database)  
|     |--> test (unit testing file examples)  
|--> client (frontend folder)  
|     |--> src  
|           |--> assets (static assets, e.g. background image, logo)    
|           |--> components (stateless reusable react components)    
|           |--> config (client configuration, e.g. theme)    
|           |--> container (stateful reusable react components, e.g. forms, navbar, header)    
|           |--> context (global state store, e.g. language configuration)    
|           |--> graphql (graphql queries and mutations available)    
|           |--> language (language dictionaries to feed to language global context)    
|           |--> pages (react pages, e.g. welcome, login)    
|           |--> routes (API Rest routes, e.g. auth routes) 
```

# Deployment

Para iniciar el stack en deployment se deben seguir los siguientes pasos:

1. ```npm run install``` en root folder, este código instalara las dependencias necesarias para ejecutar simultáneamente frontend y backend, y una vez terminado iniciará un postinstall script que ejecuta ```npm install``` en las subcarpetas client y server, por lo que no es necesario instalar los paquetes npm en cada uno por separado.
2. ```npm run dev``` en root folder ejecuta en forma simultanea los script de start para desarrollo de cliente y servidor.

En producción se ocupa ```npm run start``` el cual automáticamente ejecuta un script de prestart que instala los paquetes necesarios y hace un ```npm run build``` del cliente, por lo que está listo para funcionar inmediatamente.

Explicación de los npm scripts en package.json:

- ```server```: inicia el script start-dev disponible en package.json de server
- ```client```: inicia el script start disponible en package.json de client
- ```dev```: usa concurrently para correr los scripts server y client anteriores de forma simultánea
- ```build:client```: inicia el script build disponible en package.json de client
- ```install:server```: inicia npm install en server
- ```install:client```: inicia npm install en client
- ```postinstall```: script post npm install del root folder, ejecuta los install de server y client anteriores
- ```prestart```: script pre npm run start, el cual ejecuta npm install y el script de build:client
- ```start```: inicia el servidor en produccion (se debe cambiar npm run start-dev en este script una vez se pase a producción)

## Carpeta server

Acá se debe crear un archivo ```.env```

```properties
STATE='development'
NODE_ENV='development'
# MongoDB Connection
DB_URL='mongodb://localhost:27017/icvmantencion'
#DB_URL='mongodb+srv://azure:CcqMmYgR6xqUN3x@cluster0.qtnw7.mongodb.net/mantencion?retryWrites=true&w=majority'
# Port Server
PORT=5001
#Sentry
SENTRY_DSN='https://85bd356928264d658825f95e5601c085@o939500.ingest.sentry.io/6390186'
# SuperAdmin Test
EMAIL='gonzalo.orellana@kauel.com'
NOMBRE='ADMINISTRADOR'
APELLIDO='PLATAFORMA'
PASSWORD='kauelicv2021'
# Storage Azure
AZURE_ACCOUNT='icvmantencion'
STORAGE_URL='https://icvmantencion.blob.core.windows.net'
TOKEN_SAS_BLOB='sp=racwdli&st=2022-01-10T00:14:05Z&se=2022-01-10T08:14:05Z&spr=https&sv=2020-08-04&sr=c&sig=D8MVsycwMtEXXvscpnkpEussrqUujrbMUjplXCwU0HQ%3D'
URL_SAS_BLOB='https://icvmantencion.blob.core.windows.net/plataforma-mantencion?sp=racwdli&st=2022-01-10T00:14:05Z&se=2022-01-10T08:14:05Z&spr=https&sv=2020-08-04&sr=c&sig=D8MVsycwMtEXXvscpnkpEussrqUujrbMUjplXCwU0HQ%3D'
ACCESS_KEYS='DefaultEndpointsProtocol=https;AccountName=icvmantencion;AccountKey=cz+hJzm3PrM0bYun7IU1OjlFJH7xrHcrgqtI4pGxPBmyT0PEl/+fc+o32YKZRzYt68H/zrTFKJ3HyY+zk9eC0A==;EndpointSuffix=core.windows.net'
REPORT_IMAGES_CONTAINER='reports-images'
PDF_CONTAINER='pdf-dev'
# API ICV
ICV_URL='https://apmv2.icv.cl/api/apm/'
ICV_API_TOKEN='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
# Sandbox
MAIL_KEY='faea6105f3ea3029c6b2b511c56e4bb7-b2f5ed24-0daf1a56'
MAIL_DOMAIN='mantencion.icv.cl'
MAIL_SENDER='postmaster@mantencion.icv.cl'
# KEY
JWT_KEY='secret1'
RESET_KEY='secret2'
# Mail Settings
PLATFORM_NAME='ICV Plataforma Inspección y Mantenimiento'
PLATFORM_LOGO_ROUTE='https://icvmantencion.blob.core.windows.net/plataforma-mantencion/assets/ICV.jpg'
PLATFORM_LOGO_ALT='LOGO'
PLATFORM_BASE_URL='https://icv-plataforma-mantencion.azurewebsites.net'
ROUTE_RESET_PASS='/restore-password/'
```

# Actualizaciones
<h3>Semana 16 y 17</h3>

- Se avanza desarrollo de back end.
- Llegan anrchivos JSON para pruebas de base de datos de ICV.
- Se modifica librería visora 3D de A-Frame a Google Model Viewer.


<h3>Semana 15</h3>

- Se avanza desarrollo de front end.
- Se conforma reuniones de seguimiento, ajuste y muestra de funcionamiento de templates 3D.
- Se ajustan vistas según aprobación. Ver a continuación.
- Pantallas

    * Login <br>
    <img src="./pantallas_v2/Login.PNG" style="max-width: 600px">

    * Welcome <br>
    <img src="./pantallas_v2/Welcome.PNG" style="max-width: 600px">

    * Welcome (Side Bar) <br>
    <img src="./pantallas_v2/Welcome-Sidebar.PNG" style="max-width: 600px">

    * Inspeccion-Maquinaria <br>
    <img src="./pantallas_v2/Inspeccion-Maquinaria.PNG" style="max-width: 600px">

    * Reportes <br>
    <img src="./pantallas_v2/Reportes.PNG" style="max-width: 600px">

    * Selección de Obras <br>
    <img src="./pantallas_v2/Sitios.PNG" style="max-width: 600px">

    * Prueba de Vistas 3D con Camión Caterpillar<br>
    <img src="./pantallas_v2/Vista-3D.gif" style="max-width: 600px">

<h3>Semana 14</h3>

- En Backend se corrige gestor de correo electrónico. Se utilizará <a href="https://nodemailer.com">Nodemailer</a>.
- En Frontend se actualiza vistas web respecto a diseño figma.
- Preparación de recepción vistas 3D
- Pantallas

    * Login <br>
    <img src="./pantallas/Login.PNG" style="max-width: 600px">

    * Welcome <br>
    <img src="./pantallas/Welcome.PNG" style="max-width: 600px">

    * Welcome (Side Bar) <br>
    <img src="./pantallas/Welcome-Sidebar.PNG" style="max-width: 600px">

    * Inspeccion-Maquinaria <br>
    <img src="./pantallas/Inspeccion-Maquinaria.PNG" style="max-width: 600px">

    * Prueba de Vistas 3D <br>
    <img src="./pantallas/Vista-3D.gif" style="max-width: 600px">

<h3>Semana 13</h3>

- Se toma conocimiento del proyecto.
- Se agregan Assets a Frontend para eliminar errores
- Se conecta con base de datos en modo local para desarrollo y pruebas
- Se hace revisión UX/UI desarrollado y se planifica reprogramación en base a diseño entregado en <a href="https://www.figma.com/file/grZYy6qrd0msfdjx9JBJuF/Wireframes-en-media-fidelidad?node-id=2%3A5">Figma</a>
- En Backend se realiza revisión del código y se ajusta para ejecución de servidor
- Se hacen pruebas de:
    * Creación de base de datos desde Servidor
    * Creación de Administrador por Defecto
    * Login de Admin
    * Logout de Admin