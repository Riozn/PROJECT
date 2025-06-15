const TipoEventoModel = require('../models/tipoEventoModel');
const tipoEventoModel = new TipoEventoModel();

module.exports = {
  obtenerTiposEvento: async (req, res) => {
    try {
      const tipos = await tipoEventoModel.obtenerTipos();
      res.json(tipos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener tipos de evento' });
    }
  }
};
