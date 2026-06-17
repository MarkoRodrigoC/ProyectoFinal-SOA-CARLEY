SELECT datname
FROM pg_database
WHERE datname IN ('carley_inventario', 'carley_pedidos')
ORDER BY datname;
