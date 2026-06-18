class BillingController {
  constructor({ invoicePdfService }) {
    this.invoicePdfService = invoicePdfService;
  }

  generateInvoice = (req, res, next) => {
    try {
      const pdfStream = this.invoicePdfService.generateInvoiceStream(req.body);
      const fileName = `factura-carley-${req.body.orderId || 'pedido'}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

      pdfStream.pipe(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = BillingController;
