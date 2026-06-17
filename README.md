nu# CARLEY - Scaffold SOA con Microservicios

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
`-- svc-ped/
    |-- package.json
    |-- .env.example
    `-- src/
        |-- app.js
        |-- server.js
        |-- config/
        |   `-- env.js
        |-- controllers/
        |   `-- orders.controller.js
        |-- middlewares/
        |   `-- errorHandler.js
        |-- repositories/
        |   `-- orders.repository.js
        |-- routes/
        |   `-- orders.routes.js
        |-- services/
        |   `-- orders.service.js
        `-- utils/
            |-- asyncHandler.js
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
cd api-gateway && npm start
```

Los clientes deben entrar por `http://localhost:8000`.

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
