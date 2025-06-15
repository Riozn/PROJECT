const db = require('../db'); 

class ResenaModel {
  static async crear({ usuario_id, lugar_id, puntuacion, comentario }) {
    const qrReserva = `
      SELECT id 
      FROM "Reserva" 
      WHERE usuario_id = $1 
        AND lugar_id   = $2 
      LIMIT 1
    `;
    const { rows: rRows } = await db.query(qrReserva, [usuario_id, lugar_id]);
    const reserva_id = rRows[0]?.id || null;

    const qrInsert = `
      INSERT INTO "Reseña"
        (id, reserva_id, usuario_id, puntuacion, comentario, fecha)
      VALUES
        (gen_random_uuid(), $1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const values = [reserva_id, usuario_id, puntuacion, comentario];
    const { rows } = await db.query(qrInsert, values);
    return rows[0];
  }

  static async listarPorLugar(lugar_id) {
    const qr = `
      SELECT 
        r.id,
        r.puntuacion,
        r.comentario,
        r.fecha,
        u.nombre AS usuario
      FROM "Reseña" r
      LEFT JOIN "Reserva" res ON res.id = r.reserva_id
      JOIN "Usuario" u     ON u.id   = r.usuario_id
      WHERE res.lugar_id = $1
      ORDER BY r.fecha DESC
    `;
    const { rows } = await db.query(qr, [lugar_id]);
    return rows;
  }
}

module.exports = ResenaModel;
