class OrdersController {
  constructor({ ordersService }) {
    this.ordersService = ordersService;
    this.register = this.register.bind(this);
    this.list = this.list.bind(this);
  }

  async register(req, res) {
    const dto = await this.ordersService.registerOrder(req.body, {
      userId: req.header('X-CARLEY-USER-ID'),
      role: req.header('X-CARLEY-ROLE')
    });

    return res.status(201).json(dto);
  }

  async list(req, res) {
    const orders = await this.ordersService.listOrders();
    return res.status(200).json({
      total: orders.length,
      orders
    });
  }
}

module.exports = OrdersController;
