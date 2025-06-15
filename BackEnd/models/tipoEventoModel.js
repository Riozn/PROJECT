const DAO = require('./dao');
const db = new DAO();

class TipoEventoModel {
  async obtenerTipos() {
    const sql = `SELECT id, nombre FROM TipoEvento ORDER BY nombre`;
    return db.consultar(sql);
  }
}

module.exports = TipoEventoModel;
