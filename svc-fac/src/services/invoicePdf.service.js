const PDFDocument = require('pdfkit');
const HttpError = require('../utils/httpError');

class InvoicePdfService {
  generateInvoiceStream(payload) {
    this.validatePayload(payload);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 48,
      info: {
        Title: `Factura CARLEY ${payload.orderId}`,
        Author: 'SVC-FAC CARLEY'
      }
    });

    this.renderHeader(doc);
    this.renderCustomerData(doc, payload);
    this.renderItemsTable(doc, payload.items);
    this.renderTotals(doc, payload.items);
    this.renderFooter(doc);

    doc.end();
    return doc;
  }

  validatePayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new HttpError(400, 'Bad Request', 'Request body is required');
    }

    const missingFields = ['orderId', 'cliente', 'fecha'].filter((field) => !payload[field]);
    if (missingFields.length > 0) {
      throw new HttpError(400, 'Bad Request', 'Invoice payload is missing required fields', { missingFields });
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new HttpError(400, 'Bad Request', 'Invoice payload must include at least one item');
    }

    const invalidItem = payload.items.find((item) => (
      !item.sku
      || !item.name
      || !Number.isFinite(Number(item.qty))
      || Number(item.qty) <= 0
      || !Number.isFinite(Number(item.price))
      || Number(item.price) < 0
    ));

    if (invalidItem) {
      throw new HttpError(400, 'Bad Request', 'Each item must include sku, name, qty and price');
    }
  }

  renderHeader(doc) {
    const logoX = 48;
    const logoY = 48;

    doc
      .roundedRect(logoX, logoY, 120, 54, 8)
      .strokeColor('#cbd8f3')
      .lineWidth(1)
      .stroke();

    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#294cc7')
      .text('CARLEY', logoX, logoY + 12, { width: 120, align: 'center' })
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#58708f')
      .text('Siempre Soluciones', logoX, logoY + 34, { width: 120, align: 'center' });

    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor('#122033')
      .text('FACTURA DE TRANSPORTE - CARLEY LOGÍSTICA', 205, 52, {
        width: 340,
        align: 'right'
      });

    doc
      .moveTo(48, 125)
      .lineTo(547, 125)
      .strokeColor('#dce5f1')
      .stroke();
  }

  renderCustomerData(doc, payload) {
    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor('#122033')
      .text('Datos del Cliente', 48, 148);

    const rows = [
      ['Cliente', payload.cliente],
      ['Orden', payload.orderId],
      ['Fecha de emision', payload.fecha]
    ];

    let y = 174;
    rows.forEach(([label, value]) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#58708f')
        .text(`${label}:`, 48, y, { width: 110 })
        .font('Helvetica')
        .fillColor('#122033')
        .text(String(value), 160, y, { width: 380 });
      y += 20;
    });
  }

  renderItemsTable(doc, items) {
    const startY = 260;
    const columns = [
      { label: 'SKU', x: 48, width: 76 },
      { label: 'PRODUCTO', x: 124, width: 190 },
      { label: 'CANTIDAD', x: 314, width: 72 },
      { label: 'PRECIO UNIT.', x: 386, width: 82 },
      { label: 'TOTAL', x: 468, width: 79 }
    ];

    doc
      .rect(48, startY, 499, 28)
      .fillColor('#294cc7')
      .fill();

    columns.forEach((column) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#ffffff')
        .text(column.label, column.x + 6, startY + 10, { width: column.width - 12 });
    });

    let y = startY + 28;
    items.forEach((item, index) => {
      const rowHeight = 32;
      const total = Number(item.qty) * Number(item.price);

      doc
        .rect(48, y, 499, rowHeight)
        .fillColor(index % 2 === 0 ? '#f8fbff' : '#ffffff')
        .fill()
        .strokeColor('#dce5f1')
        .rect(48, y, 499, rowHeight)
        .stroke();

      [
        item.sku,
        item.name,
        Number(item.qty).toString(),
        this.money(item.price),
        this.money(total)
      ].forEach((value, columnIndex) => {
        const column = columns[columnIndex];
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#122033')
          .text(String(value), column.x + 6, y + 10, {
            width: column.width - 12,
            align: columnIndex >= 2 ? 'right' : 'left'
          });
      });

      y += rowHeight;
    });

    doc.y = y + 24;
  }

  renderTotals(doc, items) {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    const x = 350;
    let y = Math.max(doc.y, 540);

    [
      ['Subtotal', subtotal],
      ['IGV (18%)', igv],
      ['Monto Total Neto', total]
    ].forEach(([label, amount], index) => {
      doc
        .font(index === 2 ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(index === 2 ? 12 : 10)
        .fillColor('#122033')
        .text(label, x, y, { width: 100 })
        .text(this.money(amount), x + 110, y, { width: 88, align: 'right' });
      y += index === 1 ? 24 : 20;
    });
  }

  renderFooter(doc) {
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#58708f')
      .text(
        'Comprobante emitido de forma automática tras confirmación de entrega por SVC-TRA',
        48,
        760,
        { width: 499, align: 'center' }
      );
  }

  money(value) {
    return `S/ ${Number(value).toFixed(2)}`;
  }
}

module.exports = InvoicePdfService;
