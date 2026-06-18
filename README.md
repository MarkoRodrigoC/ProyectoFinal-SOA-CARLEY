# CARLEY - Scaffold SOA con Microservicios

Arquitectura base desacoplada para la transformacion del ecosistema digital de CARLEY, usando Node.js, Express y una organizacion modular por controlador, servicio y repositorio.

## Arbol de directorios

```text
.
|-- api-gateway/
|   |-- package.json
|   |-- .env.example
|   `-- src/
|       |-- app.js
|       |-- server.js
|       |-- config/
|       |   |-- env.js
|       |   `-- rbacPolicies.js
|       |-- middlewares/
|       |   |-- authMiddleware.js
|       |   |-- errorHandler.js
|       |   `-- rbacMiddleware.js
|       |-- routes/
|       |   `-- proxy.routes.js
|       `-- utils/
|           `-- httpError.js
|-- carley-frontend/
|   |-- package.json
|   |-- .env.example
|   |-- index.html
|   `-- src/
|       |-- main.jsx
|       `-- styles.css
|-- svc-sec/
|   |-- package.json
|   |-- .env.example
|   `-- src/
|       |-- app.js
|       |-- server.js
|       |-- config/
|       |   `-- env.js
|       |-- controllers/
|       |   `-- auth.controller.js
|       |-- middlewares/
|       |   |-- errorHandler.js
|       |   `-- requestSignature.middleware.js
|       |-- repositories/
|       |   `-- user.repository.js
|       |-- routes/
|       |   `-- auth.routes.js
|       |-- services/
|       |   `-- auth.service.js
|       `-- utils/
|           |-- asyncHandler.js
|           `-- httpError.js
|-- svc-inv/
|   |-- package.json
|   |-- .env.example
|   `-- src/
|       |-- app.js
|       |-- server.js
|       |-- config/
|       |   `-- env.js
|       |-- controllers/
|       |   `-- inventory.controller.js
|       |-- middlewares/
|       |   `-- errorHandler.js
|       |-- repositories/
|       |   `-- inventory.repository.js
|       |-- routes/
|       |   `-- inventory.routes.js
|       |-- services/
|       |   `-- inventory.service.js
|       `-- utils/
|           |-- asyncHandler.js
|           `-- httpError.js
|-- svc-ped/
|   |-- package.json
|   |-- .env.example
|   `-- src/
|       |-- app.js
|       |-- server.js
|       |-- clients/
|       |   `-- inventory.client.js
|       |-- config/
|       |   `-- env.js
|       |-- controllers/
|       |   `-- orders.controller.js
|       |-- database/
|       |   `-- sequelize.js
|       |-- models/
|       |   |-- order.model.js
|       |   `-- orderItem.model.js
|       |-- repositories/
|       |   `-- orders.repository.js
|       |-- routes/
|       |   `-- orders.routes.js
|       |-- services/
|       |   `-- orders.service.js
|       `-- utils/
|           |-- asyncHandler.js
|           `-- httpError.js
`-- svc-tra/
    |-- package.json
    |-- .env.example
    `-- src/
        |-- app.js
        |-- server.js
        |-- config/
        |   `-- env.js
        |-- controllers/
        |   `-- delivery.controller.js
        |-- messaging/
        |   `-- rabbitmq.publisher.js
        |-- middlewares/
        |   `-- errorHandler.js
        |-- routes/
        |   `-- delivery.routes.js
        |-- services/
        |   `-- delivery.service.js
        `-- utils/
            |-- asyncHandler.js
            `-- httpError.js
`-- svc-fac/
    |-- package.json
    |-- .env.example
    `-- src/
        |-- app.js
        |-- server.js
        |-- config/
        |   `-- env.js
        |-- controllers/
        |   `-- billing.controller.js
        |-- middlewares/
        |   `-- errorHandler.js
        |-- routes/
        |   `-- billing.routes.js
        |-- services/
        |   `-- invoicePdf.service.js
        `-- utils/
            `-- httpError.js
```

## Arranque local

1. Copia cada `.env.example` como `.env`.
2. Usa el mismo `JWT_SECRET` en `svc-sec` y `api-gateway`.
3. Levanta PostgreSQL y RabbitMQ:

```bash
docker compose up -d
```

4. Ejecuta `npm install` dentro de cada componente.
5. Levanta cada servicio:

```bash
cd svc-sec && npm start
cd svc-inv && npm start
cd svc-ped && npm start
cd svc-tra && npm start
cd svc-fac && npm start
cd api-gateway && npm start
cd carley-frontend && npm run dev
```

Los clientes API deben entrar por `http://localhost:8000`.

El frontend corre por defecto en:

```text
http://localhost:5173
```

## Persistencia PostgreSQL

`SVC-INV` usa Sequelize y PostgreSQL en `carley_inventario`.

Tabla creada automaticamente:

```text
inventory_stocks
```

Al iniciar el servicio se insertan datos iniciales de stock si la tabla esta vacia.

`SVC-PED` usa Sequelize y PostgreSQL en `carley_pedidos`.

Tablas creadas automaticamente:

```text
orders
order_items
```

Los pedidos registrados quedan persistidos en PostgreSQL y ya no se pierden al reiniciar `svc-ped`.

Antes de registrar un pedido, `SVC-PED` consulta sincronicamente a `SVC-INV` por HTTP para validar stock disponible por SKU. Si no hay stock suficiente, responde `409 Conflict` y no persiste el pedido.

## Mensajeria RabbitMQ

`SVC-TRA` publica el evento `PedidoEntregado` en RabbitMQ cuando se confirma una entrega fisica.

Cola durable:

```text
carley.pedidos.entregados
```

`SVC-INV` consume esa cola al iniciar. Cuando recibe un evento `PedidoEntregado`, descuenta stock fisico y disponible en PostgreSQL. Tambien registra el `eventId` en `processed_inventory_events` para evitar reprocesar dos veces el mismo evento.

Si `SVC-INV` esta apagado, RabbitMQ conserva el mensaje. Al volver a levantar `SVC-INV`, el consumidor procesa los mensajes pendientes.

## Facturacion PDF

`SVC-FAC` genera comprobantes PDF academicos sobre la marcha con `PDFKit`.

Puerto local:

```text
3004
```

El API Gateway enruta el endpoint protegido:

```text
POST http://localhost:8000/api/facturacion/generar
```

La respuesta es un stream binario con:

```text
Content-Type: application/pdf
```

## Contratos base

### Login seguro

`POST http://localhost:8000/api/auth/login`

Headers:

```text
Content-Type: application/json
X-CARLEY-SIGNATURE: <hmac-sha256-hex-del-body-json>
```

Body:

```json
{
  "username": "admin@carley.local",
  "password": "Admin123!"
}
```

La firma se calcula con HMAC-SHA256 usando `LOGIN_SIGNATURE_SECRET` sobre el JSON canonico del body. Para pruebas locales se puede poner `REQUIRE_LOGIN_SIGNATURE=false` en `svc-sec/.env`.

### Inventario

`GET http://localhost:8000/api/inventario/buscar/SKU123ABC`

Roles permitidos: `OPERADOR_ALMACEN`, `ADMINISTRADOR`.

### Pedidos

`POST http://localhost:8000/api/pedidos/registrar`

Roles permitidos: `ADMINISTRADOR`.

Payload ejemplo:

```json
{
  "customer": {
    "customerId": "CLI-1001",
    "name": "Cliente Industrial Santa Clara",
    "documentNumber": "20600111222"
  },
  "order": {
    "externalReference": "OC-2026-0001",
    "currency": "PEN"
  },
  "items": [
    {
      "sku": "SKU123ABC",
      "quantity": 4
    }
  ]
}
```

`GET http://localhost:8000/api/pedidos`

Lista los pedidos persistidos en PostgreSQL.

### Transporte

`POST http://localhost:8000/api/transporte/confirmar-entrega`

Roles permitidos: `ADMINISTRADOR`.

Payload ejemplo:

```json
{
  "orderId": "dd433a36-0ce4-43c7-813e-bb37e5241db8",
  "items": [
    {
      "sku": "SKU123ABC",
      "quantity": 4
    }
  ]
}
```

### Facturacion

`POST http://localhost:8000/api/facturacion/generar`

Roles permitidos: `ADMINISTRADOR`.

Payload ejemplo:

```json
{
  "orderId": "FAC-2026-001",
  "cliente": "Cencosud Retail Peru / Popeyes Puruchuco / Bembos Puruchuco",
  "fecha": "2026-06-17",
  "items": [
    {
      "sku": "PROD-001",
      "name": "Bandeja Logistica Estandar",
      "qty": 50,
      "price": 12.5
    }
  ]
}
```

## Frontend React

`carley-frontend` implementa la capa de presentacion de la Fase 5 con:

```text
React
Vite
Axios
lucide-react
```

Pantallas disponibles:

```text
Login
Dashboard Principal
Inventario
Pedidos
Transporte / Flota
Facturacion
Reportes
Configuracion
```

Credenciales de demo:

```text
admin@carley.local
Admin123!
```
