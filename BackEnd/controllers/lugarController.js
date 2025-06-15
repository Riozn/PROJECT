const LugarModel = require('../models/lugarModel');
const lugarModel = new LugarModel();

module.exports = {
  obtenerLugares: async (req, res) => {
    try {
      const lugares = await lugarModel.obtenerLugares();
      return res.json(lugares);
    } catch (error) {
      console.error('Error al obtener lugares:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  obtenerLugarPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const lugar = await lugarModel.obtenerLugarPorId(id);
      if (!lugar) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }
      return res.json(lugar);
    } catch (error) {
      console.error('Error al obtener lugar:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  crearLugar: async (req, res) => {
    try {
      const data = req.body;
      if (req.files && req.files.length > 0) {
        data.urls = req.files.map(f => `/uploads/lugares/${f.filename}`);
      } else if (req.file) {
        data.urls = [`/uploads/lugares/${req.file.filename}`];
      }
      const nuevoId = await lugarModel.crearLugar(data);
      return res.json({ success: true, lugarId: nuevoId });
    } catch (error) {
      console.error('Error al crear lugar:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  // 🔧 Esta función faltaba y es la que causaba el error
  obtenerResenasLugar: async (req, res) => {
    try {
      const lugarId = req.params.id;
      const resenas = await lugarModel.obtenerResenasPorLugar(lugarId);
      return res.json(resenas);
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
