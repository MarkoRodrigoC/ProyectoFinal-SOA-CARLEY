class AuthController {
  constructor({ authService }) {
    this.authService = authService;
    this.login = this.login.bind(this);
  }

  async login(req, res) {
    const result = await this.authService.login(req.body);
    return res.status(200).json(result);
  }
}

module.exports = AuthController;
