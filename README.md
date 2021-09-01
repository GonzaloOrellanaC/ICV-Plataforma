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

