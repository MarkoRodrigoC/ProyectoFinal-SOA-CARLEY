const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requestSignature = require('../middlewares/requestSignature.middleware');
const UserRepository = require('../repositories/user.repository');
const AuthService = require('../services/auth.service');
const AuthController = require('../controllers/auth.controller');

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService({ userRepository });
const authController = new AuthController({ authService });

router.post('/login', requestSignature, asyncHandler(authController.login));

module.exports = router;
