# FrutyfestWeb

## Dev

1. Clonar el proyecto.
2. Ejecutar ```npm install```.
3. Levantar backend ```npm run backend```.
4. Ejecutar la app ```npm start``` o bien ```ng serve -o```.


## Prod

1. Copiar y pegar el archivo ```environments.ts``` para crear una copia.
2. Renombrar la copia a ```environments.prod.ts```.
3. Cambiar el ```baseUrl``` de ```environments.prod.ts``` a la url real donde esté alojada la base de datos.
4. Ejecutar la versión de producción ```npm run build```.
