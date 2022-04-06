# Vank API

Vank API es un proyecto desafio de Xepelin.

Propone disponer una serie de endpoint para vank un cliente ficticio el cual realizara consultas de facturas e ingresara nuevos clientes.

Para la seguridad de la aplicación se implementó Cors y Json Web Token/Json Refresh Token.

---

## Tecnologias empleadas

1.- Node JS vs 16.14.0

2.- NestJs

3.- Typescript

4.- Json Web Token y Json Refresh Token

5.- Cors

6.- Prisma

7.- TypeORM

8.- PostGres 13+

9.- Redis

9.- Mysql 5.7+

10.- Docker

11.- Docker Compose

## Instalación


### Entorno local

Copiar los 2 archivos de variables de entorno en la raiz del proyecto.

Los 2 archivos de variables de entorno se adjuntar en el correo.

Para correr la API localmente necesita ejecutar el siguiente comando:


```bash

yarn
yarn db:dev:restart
yarn start:dev

```

## Swagger

http://localhost:3000/api/

## Creación de usuario para JWT

POST http://localhost:3000/auth/signup

Permite generar un usuario para la apliación.

* **email**: String. Correo para el registro.
* **password**: String. Contraseña para el registro

## Obtención de Token

POST http://localhost:3000/auth/signin

Permite obtener el token del usuario registrado, este es usado para los demas endpoint con llave.

* **email**: String. Correo para el registro.
* **password**: String. Contraseka para el registro


## Utilización

A continuación se detallan los endpoints habilitados

Para consumir los endpoint es necesario generar un usuario para obtener un token de seguridad.


**Clients:**
* GET localhost:3000/clients
Entrega un listado de los clientes

* PATCH localhost:3000/clients/:id
Permite editar los campos taxId y currency de un cliente.

* POST localhost:3000/clients
Permite crear un cliente:
	* **companyName:** String. Nombre del cliente.
	* **internalCode:** String. Código interno del cliente.
	* **taxId**: String. Identificador tributario del cliente.
	* **currency**: String. Moneda en la que opera el cliente. Puede ser CLP, USD o EUR.
	* **apiQuota**: Int. Cantidad de llamadas mensuales que puede hacer el usuario a la API.
	* **allowedBanks**: Array(Int). Lista de bancos a los que el cliente tiene acceso.
* DELETE localhost:3000/clients/:id 
  Permite eliminar a un cliente de la base de datos.

**Invoices**
* GET localhost:3000/invoices
Permite obtener la lista de las facturas. Puede recibir los siguientes filtros opcionales como queryStrings:

	* **vendor**: Int. Id del vendor de la factura.
	* **invoice_date**: String. Fecha mínima en la que puede haberse creado la factura.
	* **targetCurrency**: String. Moneda en la que serán devueltos los montos de las facturas. Puede ser CLP, USD o EUR. De no proporcionar ninguno, las facturas serán devueltas en su moneda original.
---


### Tareas programadas

La tarea programada que actualiza las facturas se encuentra en el archivo **invoices.task.ts**

El horario de ejecución es a la media noche 00:00 horas(dependiendo de la hora de la máquina donde se aloja).

### Pendientes

1.- Desplegar App en Paas.

2.- Implementación de búsqueda avanzada.

3.- Lectura de archivos por trozos.

4.- Limitar endpoint de creación de usuario para JWT con el objetivo de limitar accesos.

5.- Alertar de cargues por algun canal, puede ser slack.

6.- Generar un algoritmo de base de datos que permita hacer rollback por si el cliente realiza un cargue erroneo, puede una tabla de cargues que este relacionada a invoices.

7.- Agregar limitación con respecto a los cors para que solo se ejecute de determinado dominio.
