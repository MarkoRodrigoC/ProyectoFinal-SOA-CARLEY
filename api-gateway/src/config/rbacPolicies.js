module.exports = [
  {
    prefix: '/api/inventario',
    roles: ['OPERADOR_ALMACEN', 'ADMINISTRADOR']
  },
  {
    prefix: '/api/pedidos',
    roles: ['ADMINISTRADOR']
  },
  {
    prefix: '/api/transporte',
    roles: ['ADMINISTRADOR']
  }
];
