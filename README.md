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

```
STATE='development'
NODE_ENV='development'

# MongoDB Connection
# DB_URL='mongodb://localhost:27017/icvmantencion'  
DB_URL='mongodb+srv://azure:CcqMmYgR6xqUN3x@cluster0.qtnw7.mongodb.net/mantencion?retryWrites=true&w=majority'
API_EXTERNAL=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

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

# AZURE WEB APP

La rama que carga datos en la plataforma de Azure es ```dev-fase3-node18```
Se recomienda generar una nueva rama para desarrollos desde esta para luego hacer el *merge* correspondiente.

Cualquier cambio en el *front* debe ser anticipado por un build, utilizando en la carpeta raís el siguiente script:

```
npm run build-client
```

# Usuarios de prueba

Revisar las obras a las que están asignados.

## Admin:

Rut:
```
78.827.280-4
```

Password:
```
123456
```
## Jefe De Turno:

<strong>RADOMIRO TOMIC 5</strong>

Rut:
```
76.426.265-4
```

Password:
```
123456
```

<strong>ARRIENDO INTEGRAL MINISTRO HALES 3</strong>

Rut:
```
76.580.036-6
```

Password:
```
123456
```

## Jefe Maquinaria:

<strong>RADOMIRO TOMIC 5</strong>

Rut:
```
77.818.480-K
```

Password:
```
123456
```

<strong>ARRIENDO INTEGRAL MINISTRO HALES 3</strong>

Rut:
```
99.588.680-4
```

Password:
```
123456
```

## Ejecutivo SAP:

<strong>RADOMIRO TOMIC 5</strong>

Rut:
```
76.486.150-7
```

Password:
```
123456
```

## Operario Inspección:

<strong>ARRIENDO INTEGRAL MINISTRO HALES 3</strong>

Rut:
```
59.093.620-0
```

Password:
```
123456
```

<strong>RADOMIRO TOMIC 5</strong>

Rut:
```
77.341.890-K
```

Password:
```
123456
```