const ResenaModel = require('../models/resenaModel');

exports.crearResena = async (req, res) => {
  try {
    const usuario_id = req.user.id;        
    const { lugar_id, puntuacion, comentario } = req.body;

    if (!lugar_id || !puntuacion || !comentario) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const nueva = await ResenaModel.crear({
      usuario_id,
      lugar_id,
      puntuacion: parseInt(puntuacion, 10),
      comentario
    });

    res.status(201).json(nueva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reseña.' });
  }
};

exports.obtenerResenas = async (req, res) => {
  try {
    const { lugarId } = req.params;
    const lista = await ResenaModel.listarPorLugar(lugarId);
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reseñas.' });
  }
};
