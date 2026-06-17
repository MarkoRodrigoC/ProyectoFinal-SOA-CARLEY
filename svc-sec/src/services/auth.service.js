const jwt = require('jsonwebtoken');
const env = require('../config/env');
const HttpError = require('../utils/httpError');

class AuthService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async login({ username, password }) {
    if (!username || !password) {
      throw new HttpError(400, 'Bad Request', 'Username and password are required');
    }

    const user = await this.userRepository.findByUsername(username);
    if (!user || user.password !== password) {
      throw new HttpError(401, 'Unauthorized', 'Invalid credentials');
    }

    const payload = {
      userId: user.userId,
      role: user.role
    };

    const token = jwt.sign(payload, env.jwt.secret, {
      algorithm: env.jwt.algorithm,
      expiresIn: env.jwt.expiresIn,
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
      subject: user.userId
    });

    return {
      tokenType: 'Bearer',
      accessToken: token,
      expiresInSeconds: 28800
    };
  }
}

module.exports = AuthService;
