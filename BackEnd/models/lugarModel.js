const DAO = require('./dao');
const db = new DAO().getDb();
const { v4: uuidv4 } = require('uuid');

class LugarModel {
  obtenerLugares() {
    const sql = `
      SELECT 
        l.id, l.titulo, l.descripcion,
        d.ciudad, dp.precio,
        mp.nombre AS modalidad, c.nombre AS categoria,
        COALESCE(f.url, '') AS url
      FROM lugar l
      JOIN direccion d ON l.direccion_id = d.id
      JOIN detalleprecio dp ON dp.lugar_id = l.id
      JOIN modalidadprecio mp ON dp.modalidad_id = mp.id
      JOIN categorialugar c ON l.categoria_id = c.id
      LEFT JOIN fotolugar f ON f.lugar_id = l.id
      GROUP BY l.id, d.ciudad, dp.precio, mp.nombre, c.nombre, f.url
      ORDER BY l.created_at DESC;
    `;
    return db.any(sql);
  }

  async obtenerLugarPorId(id) {
    const sql = `
      SELECT
        l.id, l.titulo, l.descripcion, l.capacidad, l.tamano_m2,
        d.ciudad, d.calle, d.numero, d.referencia,
        dp.precio, mp.nombre AS modalidad, c.nombre AS categoria,
        u.nombre AS propietario, u.email AS propietario_email, u.telefono AS propietario_telefono,
        l.latitud, l.longitud, COALESCE(f.url, '') AS url
      FROM lugar l
      JOIN direccion d ON l.direccion_id = d.id
      JOIN detalleprecio dp ON dp.lugar_id = l.id
      JOIN modalidadprecio mp ON dp.modalidad_id = mp.id
      JOIN categorialugar c ON l.categoria_id = c.id
      JOIN usuario u ON l.usuario_id = u.id
      LEFT JOIN fotolugar f ON f.lugar_id = l.id
      WHERE l.id = $1
      GROUP BY l.id, d.ciudad, d.calle, d.numero, d.referencia,
               dp.precio, mp.nombre, c.nombre, u.nombre, u.email, u.telefono,
               l.latitud, l.longitud, f.url;
    `;
    const results = await db.any(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

 async obtenerResenasPorLugar(lugarId) {
  const sql = `
    SELECT 
      r.puntuacion, 
      r.comentario, 
      r.fecha, 
      u.nombre AS usuario
    FROM reseña r
    JOIN usuario u ON r.usuario_id = u.id
    WHERE r.reserva_id IN (
      SELECT id 
      FROM reserva 
      WHERE lugar_id = $1
    )
    ORDER BY r.fecha DESC;
  `;
  return await db.any(sql, [lugarId]);
}

  async crearLugar(data) {
    return db.transaccion(async t => {
      const direccionId = uuidv4();
      await t.none(`
        INSERT INTO direccion(id, ciudad, calle, numero, referencia)
        VALUES($1, $2, $3, $4, $5)
      `, [direccionId, data.ciudad, data.calle, data.numero, data.referencia || null]);

      const lugarId = uuidv4();
      await t.none(`
        INSERT INTO lugar(id, usuario_id, titulo, descripcion, capacidad, tamano_m2,
                          categoria_id, latitud, longitud, direccion_id, created_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_DATE)
      `, [lugarId, data.propietario_id, data.titulo, data.descripcion, data.capacidad,
          data.tamano_m2, data.categoria, data.latitud, data.longitud, direccionId]);

      const modalidad = await t.one(`SELECT id FROM modalidadprecio WHERE nombre = $1`, [data.modalidad]);
      const detallePrecioId = uuidv4();
      await t.none(`
        INSERT INTO detalleprecio(id, lugar_id, modalidad_id, precio)
        VALUES($1, $2, $3, $4)
      `, [detallePrecioId, lugarId, modalidad.id, data.precio]);

      if (Array.isArray(data.urls)) {
        for (const url of data.urls) {
          if (url && url.trim() !== '') {
            const fotoId = uuidv4();
            await t.none(
              `
                INSERT INTO fotolugar(id, lugar_id, url, descripcion)
                VALUES($1, $2, $3, $4)
              `,
              [fotoId, lugarId, url, 'Imagen']
            );
          }
        }
      }

      return lugarId;
    });
  }
}

module.exports = LugarModel;
