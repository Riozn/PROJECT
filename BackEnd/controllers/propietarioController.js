const DAO = require('../models/dao');
const db = new DAO();

module.exports = {
  obtenerReservasDeMisLugares: async (req, res) => {
    const propietarioId = req.usuario.id;

    try {
      const sql = `
        SELECT 
          r.id AS reserva_id,
          l.titulo AS lugar,
          r.fecha_inicio,
          r.fecha_fin,
          r.estado,
          r.cantidad,
          r.total,
          u.nombre AS cliente
        FROM Reserva r
        JOIN Lugar l ON r.lugar_id = l.id
        JOIN Usuario u ON r.usuario_id = u.id
        WHERE l.usuario_id = $1
        ORDER BY r.fecha_inicio DESC
      `;
      const reservas = await db.consultar(sql, [propietarioId]);
      res.json(reservas);
    } catch (error) {
      console.error('Error obteniendo reservas del propietario:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
};
