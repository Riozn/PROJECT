const DAO = require('./dao');
const db = new DAO();

class PagoModel {
  async registrarPago({ reserva_id, monto, imagen_pago, es_pago_completo }) {
    const sql = `
      INSERT INTO Pago (id, reserva_id, imagen_pago, monto, fecha_pago, es_pago_completo)
      VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE, $4)
    `;
    return db.consultar(sql, [reserva_id, imagen_pago, monto, es_pago_completo]);
  }

  async registrarTransacciones(lista) {
    for (const item of lista) {
      const sql = `
        INSERT INTO DetalleTransaccion (id, reserva_id, concepto, monto)
        VALUES (uuid_generate_v4(), $1, $2, $3)
      `;
      await db.consultar(sql, [item.reserva_id, item.concepto, item.monto]);
    }
  }

  async registrarPagoConTransacciones(pagoData, transacciones) {
    return db.transaccion(async t => {
      const sqlPago = `
        INSERT INTO Pago (id, reserva_id, imagen_pago, monto, fecha_pago, es_pago_completo)
        VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE, $4)
      `;
      await t.none(sqlPago, [
        pagoData.reserva_id,
        pagoData.imagen_pago,
        pagoData.monto,
        pagoData.es_pago_completo
      ]);

      for (const item of transacciones) {
        const sql = `
          INSERT INTO DetalleTransaccion (id, reserva_id, concepto, monto)
          VALUES (uuid_generate_v4(), $1, $2, $3)
        `;
        await t.none(sql, [item.reserva_id, item.concepto, item.monto]);
      }
    });
  }
}

module.exports = PagoModel;
