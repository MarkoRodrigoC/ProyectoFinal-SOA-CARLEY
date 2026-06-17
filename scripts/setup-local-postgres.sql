CREATE USER carley_user WITH PASSWORD 'CarleyPassword123';

CREATE DATABASE carley_inventario OWNER carley_user;
CREATE DATABASE carley_pedidos OWNER carley_user;

GRANT ALL PRIVILEGES ON DATABASE carley_inventario TO carley_user;
GRANT ALL PRIVILEGES ON DATABASE carley_pedidos TO carley_user;
