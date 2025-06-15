const PagoModel = require('../models/pagoModel');
const pagoModel = new PagoModel();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../FrontEnd/public/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `pago_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

module.exports = {
  uploadPago: upload.single('imagen_pago'),

  registrarPago: async (req, res) => {
    try {
      const {
        reserva_id,
        monto,
        es_pago_completo,
        cuotas,
        adelanto
      } = req.body;

      const imagen_pago = `/public/uploads/${req.file.filename}`;
      const pagoCompleto = es_pago_completo === "true";

      const transacciones = [];

      if (pagoCompleto) {
        transacciones.push({
          reserva_id,
          concepto: 'Pago completo',
          monto: parseFloat(monto)
        });
      } else {
        const adelantoMonto = parseFloat(adelanto || 0);
        const total = parseFloat(monto);
        const cuotasNum = parseInt(cuotas || 1);
        const restante = total - adelantoMonto;
        const cuotaMonto = restante / cuotasNum;

        if (adelantoMonto > 0) {
          transacciones.push({
            reserva_id,
            concepto: 'Pago parcial - Adelanto',
            monto: adelantoMonto
          });
        }

        for (let i = 1; i <= cuotasNum; i++) {
          transacciones.push({
            reserva_id,
            concepto: `Cuota ${i} de ${cuotasNum}`,
            monto: parseFloat(cuotaMonto.toFixed(2))
          });
        }
      }

      await pagoModel.registrarPagoConTransacciones(
        {
          reserva_id,
          monto,
          imagen_pago,
          es_pago_completo: pagoCompleto
        },
        transacciones
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Error al registrar pago:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};
