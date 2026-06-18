const { Router } = require('express');
const BillingController = require('../controllers/billing.controller');
const InvoicePdfService = require('../services/invoicePdf.service');

const router = Router();
const billingController = new BillingController({
  invoicePdfService: new InvoicePdfService()
});

router.post('/generar', billingController.generateInvoice);

module.exports = router;
