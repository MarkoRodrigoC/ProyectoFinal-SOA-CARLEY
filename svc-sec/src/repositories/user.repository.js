const users = new Map([
  [
    'operador@carley.local',
    {
      userId: '8e6b37a2-2d9c-4a8c-9c9f-0d3b3e232b13',
      username: 'operador@carley.local',
      password: 'Operador123!',
      role: 'OPERADOR_ALMACEN'
    }
  ],
  [
    'admin@carley.local',
    {
      userId: '45da52d3-14b0-4233-a8f0-cce6fb556f98',
      username: 'admin@carley.local',
      password: 'Admin123!',
      role: 'ADMINISTRADOR'
    }
  ]
]);

class UserRepository {
  async findByUsername(username) {
    return users.get(username) || null;
  }
}

module.exports = UserRepository;
