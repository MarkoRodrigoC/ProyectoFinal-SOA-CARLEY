class InventoryController {
  constructor({ inventoryService }) {
    this.inventoryService = inventoryService;
    this.list = this.list.bind(this);
    this.reserve = this.reserve.bind(this);
    this.findBySku = this.findBySku.bind(this);
  }

  async list(req, res) {
    const dto = await this.inventoryService.listStocks();
    return res.status(200).json(dto);
  }

  async reserve(req, res) {
    const dto = await this.inventoryService.reserveStock(req.body.items);
    return res.status(200).json(dto);
  }

  async findBySku(req, res) {
    const dto = await this.inventoryService.findStockBySku(req.params.sku);
    return res.status(200).json(dto);
  }
}

module.exports = InventoryController;
