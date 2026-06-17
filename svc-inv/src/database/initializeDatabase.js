const sequelize = require('./sequelize');
const InventoryStock = require('../models/inventoryStock.model');
require('../models/processedInventoryEvent.model');

const initialStock = [
  {
    sku: 'SKU123ABC',
    productName: 'Aceite premium CARLEY 1L',
    warehouseSite: 'Santa Clara',
    physicalStock: 120,
    reservedStock: 18,
    availableStock: 102,
    unit: 'UND',
    lastUpdatedAt: new Date('2026-06-09T00:00:00.000Z')
  },
  {
    sku: 'REPUESTO778',
    productName: 'Filtro industrial CARLEY',
    warehouseSite: 'Santa Clara',
    physicalStock: 64,
    reservedStock: 7,
    availableStock: 57,
    unit: 'UND',
    lastUpdatedAt: new Date('2026-06-09T00:00:00.000Z')
  },
  { sku: 'ARROZ001', productName: 'Arroz superior 5 kg', warehouseSite: 'Santa Clara', physicalStock: 220, reservedStock: 25, availableStock: 195, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'AZUCAR002', productName: 'Azucar rubia 1 kg', warehouseSite: 'Santa Clara', physicalStock: 180, reservedStock: 20, availableStock: 160, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'ACEITE003', productName: 'Aceite vegetal 1 L', warehouseSite: 'Santa Clara', physicalStock: 150, reservedStock: 18, availableStock: 132, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'FIDEO004', productName: 'Fideo spaghetti 500 g', warehouseSite: 'Santa Clara', physicalStock: 260, reservedStock: 32, availableStock: 228, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'LECHE005', productName: 'Leche evaporada lata 400 g', warehouseSite: 'Santa Clara', physicalStock: 300, reservedStock: 45, availableStock: 255, unit: 'LAT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'ATUN006', productName: 'Atun en conserva 170 g', warehouseSite: 'Santa Clara', physicalStock: 210, reservedStock: 21, availableStock: 189, unit: 'LAT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'AVENA007', productName: 'Avena tradicional 900 g', warehouseSite: 'Santa Clara', physicalStock: 95, reservedStock: 11, availableStock: 84, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'HARINA008', productName: 'Harina sin preparar 1 kg', warehouseSite: 'Santa Clara', physicalStock: 130, reservedStock: 16, availableStock: 114, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'SAL009', productName: 'Sal yodada 1 kg', warehouseSite: 'Santa Clara', physicalStock: 175, reservedStock: 12, availableStock: 163, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'CAFE010', productName: 'Cafe instantaneo 200 g', warehouseSite: 'Santa Clara', physicalStock: 75, reservedStock: 9, availableStock: 66, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'TE011', productName: 'Te filtrante caja 25 unidades', warehouseSite: 'Santa Clara', physicalStock: 88, reservedStock: 6, availableStock: 82, unit: 'CJA', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'GALLET012', productName: 'Galletas de soda familiar', warehouseSite: 'Santa Clara', physicalStock: 140, reservedStock: 22, availableStock: 118, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'PANMOL013', productName: 'Pan de molde integral', warehouseSite: 'Santa Clara', physicalStock: 60, reservedStock: 8, availableStock: 52, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'MERMEL014', productName: 'Mermelada de fresa 320 g', warehouseSite: 'Santa Clara', physicalStock: 70, reservedStock: 7, availableStock: 63, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'MANTEQ015', productName: 'Mantequilla con sal 200 g', warehouseSite: 'Santa Clara', physicalStock: 65, reservedStock: 10, availableStock: 55, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'QUESO016', productName: 'Queso fresco 500 g', warehouseSite: 'Santa Clara', physicalStock: 48, reservedStock: 5, availableStock: 43, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'YOGURT017', productName: 'Yogurt natural 1 L', warehouseSite: 'Santa Clara', physicalStock: 90, reservedStock: 12, availableStock: 78, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'HUEVO018', productName: 'Huevos pardos docena', warehouseSite: 'Santa Clara', physicalStock: 110, reservedStock: 19, availableStock: 91, unit: 'DOC', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'POLLO019', productName: 'Pollo entero fresco kg', warehouseSite: 'Santa Clara', physicalStock: 55, reservedStock: 9, availableStock: 46, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'CARNE020', productName: 'Carne molida de res kg', warehouseSite: 'Santa Clara', physicalStock: 42, reservedStock: 8, availableStock: 34, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'PESCADO021', productName: 'Filete de pescado congelado kg', warehouseSite: 'Santa Clara', physicalStock: 38, reservedStock: 6, availableStock: 32, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'PAPA022', productName: 'Papa blanca seleccionada kg', warehouseSite: 'Santa Clara', physicalStock: 240, reservedStock: 30, availableStock: 210, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'CEBOLLA023', productName: 'Cebolla roja kg', warehouseSite: 'Santa Clara', physicalStock: 170, reservedStock: 21, availableStock: 149, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'TOMATE024', productName: 'Tomate italiano kg', warehouseSite: 'Santa Clara', physicalStock: 125, reservedStock: 15, availableStock: 110, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'ZANAH025', productName: 'Zanahoria kg', warehouseSite: 'Santa Clara', physicalStock: 115, reservedStock: 12, availableStock: 103, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'PLATANO026', productName: 'Platano de seda kg', warehouseSite: 'Santa Clara', physicalStock: 160, reservedStock: 18, availableStock: 142, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'MANZANA027', productName: 'Manzana roja kg', warehouseSite: 'Santa Clara', physicalStock: 145, reservedStock: 16, availableStock: 129, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'NARANJA028', productName: 'Naranja para jugo kg', warehouseSite: 'Santa Clara', physicalStock: 155, reservedStock: 14, availableStock: 141, unit: 'KG', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'AGUA029', productName: 'Agua mineral sin gas 2.5 L', warehouseSite: 'Santa Clara', physicalStock: 200, reservedStock: 24, availableStock: 176, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'GASEOSA030', productName: 'Gaseosa familiar 3 L', warehouseSite: 'Santa Clara', physicalStock: 135, reservedStock: 15, availableStock: 120, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'JUGO031', productName: 'Jugo de fruta 1 L', warehouseSite: 'Santa Clara', physicalStock: 118, reservedStock: 13, availableStock: 105, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'DETER032', productName: 'Detergente en polvo 4 kg', warehouseSite: 'Santa Clara', physicalStock: 92, reservedStock: 10, availableStock: 82, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'LEJIA033', productName: 'Lejia desinfectante 1 L', warehouseSite: 'Santa Clara', physicalStock: 125, reservedStock: 17, availableStock: 108, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'LAVAV034', productName: 'Lavavajilla liquido 750 ml', warehouseSite: 'Santa Clara', physicalStock: 97, reservedStock: 11, availableStock: 86, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'PAPEL035', productName: 'Papel higienico doble hoja x12', warehouseSite: 'Santa Clara', physicalStock: 185, reservedStock: 23, availableStock: 162, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'TOALLA036', productName: 'Toalla de papel x2 rollos', warehouseSite: 'Santa Clara', physicalStock: 105, reservedStock: 12, availableStock: 93, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'JABON037', productName: 'Jabon de tocador antibacterial', warehouseSite: 'Santa Clara', physicalStock: 190, reservedStock: 26, availableStock: 164, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'SHAMPOO038', productName: 'Shampoo familiar 750 ml', warehouseSite: 'Santa Clara', physicalStock: 76, reservedStock: 8, availableStock: 68, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'PASTA039', productName: 'Pasta dental 90 g', warehouseSite: 'Santa Clara', physicalStock: 155, reservedStock: 18, availableStock: 137, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'CEPILLO040', productName: 'Cepillo dental adulto', warehouseSite: 'Santa Clara', physicalStock: 120, reservedStock: 14, availableStock: 106, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'PANAL041', productName: 'Panal talla M x30', warehouseSite: 'Santa Clara', physicalStock: 58, reservedStock: 7, availableStock: 51, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'TOALLH042', productName: 'Toallas humedas x100', warehouseSite: 'Santa Clara', physicalStock: 70, reservedStock: 9, availableStock: 61, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'ALCOHOL043', productName: 'Alcohol medicinal 70 grados 1 L', warehouseSite: 'Santa Clara', physicalStock: 85, reservedStock: 10, availableStock: 75, unit: 'UND', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'MASCAR044', productName: 'Mascarillas descartables x50', warehouseSite: 'Santa Clara', physicalStock: 65, reservedStock: 6, availableStock: 59, unit: 'CJA', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'BOLSAS045', productName: 'Bolsas de basura 50 L x10', warehouseSite: 'Santa Clara', physicalStock: 110, reservedStock: 13, availableStock: 97, unit: 'PQT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'CONSERV046', productName: 'Conserva de durazno 820 g', warehouseSite: 'Santa Clara', physicalStock: 72, reservedStock: 8, availableStock: 64, unit: 'LAT', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'LENTEJA047', productName: 'Lenteja bebe 500 g', warehouseSite: 'Santa Clara', physicalStock: 145, reservedStock: 20, availableStock: 125, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'FREJOL048', productName: 'Frejol canario 1 kg', warehouseSite: 'Santa Clara', physicalStock: 132, reservedStock: 17, availableStock: 115, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'QUINUA049', productName: 'Quinua perlada 500 g', warehouseSite: 'Santa Clara', physicalStock: 80, reservedStock: 9, availableStock: 71, unit: 'BOL', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') },
  { sku: 'CEREAL050', productName: 'Cereal hojuelas de maiz 500 g', warehouseSite: 'Santa Clara', physicalStock: 95, reservedStock: 11, availableStock: 84, unit: 'CJA', lastUpdatedAt: new Date('2026-06-16T00:00:00.000Z') }
];

async function initializeDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();

  for (const stock of initialStock) {
    await InventoryStock.findOrCreate({
      where: { sku: stock.sku },
      defaults: stock
    });
  }
}

module.exports = initializeDatabase;
