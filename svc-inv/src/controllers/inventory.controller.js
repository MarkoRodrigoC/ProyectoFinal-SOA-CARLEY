class InventoryController {
  constructor({ inventoryService }) {
    this.inventoryService = inventoryService;
    this.findBySku = this.findBySku.bind(this);
  }

  async findBySku(req, res) {
    const dto = await this.inventoryService.findStockBySku(req.params.sku);
    return res.status(200).json(dto);
  }
}

module.exports = InventoryController;
