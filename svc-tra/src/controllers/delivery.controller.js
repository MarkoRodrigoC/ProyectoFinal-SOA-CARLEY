class DeliveryController {
  constructor({ deliveryService }) {
    this.deliveryService = deliveryService;
    this.confirm = this.confirm.bind(this);
  }

  async confirm(req, res) {
    const event = await this.deliveryService.confirmDelivery(req.body, {
      userId: req.header('X-CARLEY-USER-ID'),
      role: req.header('X-CARLEY-ROLE')
    });

    return res.status(202).json({
      status: 'EVENT_PUBLISHED',
      event
    });
  }
}

module.exports = DeliveryController;
