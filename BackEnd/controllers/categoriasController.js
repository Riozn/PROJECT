const DAO = require('../models/dao');
const dao = new DAO();

module.exports = {
  obtenerCategorias: async (req, res) => {
    try {
      const filas = await dao.consultar(`
        SELECT id, nombre
        FROM categorialugar
        ORDER BY nombre
      `);
      return res.json(filas);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return res
        .status(500)
        .json({ message: 'Error interno al obtener categorías' });
    }
  }
};
