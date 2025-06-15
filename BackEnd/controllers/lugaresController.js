const { v4: uuidv4 } = require('uuid');
const DAO = require('../models/dao');
const dao = new DAO();
const db = dao.getDb(); 
module.exports = {
  crearLugar: async (req, res) => {
    const {
      titulo,
      descripcion,
      ciudad,
      calle,
      numero,
      referencia,
      capacidad,
      tamano_m2,
      precio,
      modalidad,
      url,
      propietario_id,
      latitud,
      longitud,
      categoria 
    } = req.body;

    
    if (
      !titulo ||
      !descripcion ||
      !ciudad ||
      !calle ||
      !numero ||
      !capacidad ||
      !tamano_m2 ||
      !precio ||
      !modalidad ||
      !propietario_id ||
      !latitud ||
      !longitud ||
      !categoria
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    try {
      await db.transaccion(async (t) => {
        const direccion_id = uuidv4();
        await t.none(
          `
            INSERT INTO direccion (id, ciudad, calle, numero, referencia)
            VALUES ($[id], $[ciudad], $[calle], $[numero], $[referencia])
          `,
          {
            id: direccion_id,
            ciudad,
            calle,
            numero,
            referencia: referencia || null
          }
        );

        const lugar_id = uuidv4();
        await t.none(
          `
            INSERT INTO lugar (
              id,
              usuario_id,
              titulo,
              descripcion,
              capacidad,
              tamano_m2,
              categoria_id,
              latitud,
              longitud,
              direccion_id,
              created_at
            ) VALUES (
              $[id], $[usuario_id], $[titulo], $[descripcion],
              $[capacidad], $[tamano_m2], $[categoria_id],
              $[latitud], $[longitud], $[direccion_id],
              CURRENT_DATE
            )
          `,
          {
            id: lugar_id,
            usuario_id: propietario_id,
            titulo,
            descripcion,
            capacidad,
            tamano_m2,
            categoria_id: categoria,
            latitud,
            longitud,
            direccion_id
          }
        );

        const filaModalidad = await t.oneOrNone(
          `
            SELECT id
            FROM modalidadprecio
            WHERE nombre = $[modalidad]
          `,
          { modalidad }
        );
        if (!filaModalidad) {
          throw new Error('Modalidad no válida');
        }
        const modalidad_id = filaModalidad.id;

        const detallePrecioId = uuidv4();
        await t.none(
          `
            INSERT INTO detalleprecio (id, lugar_id, modalidad_id, precio)
            VALUES ($[id], $[lugar_id], $[modalidad_id], $[precio])
          `,
          {
            id: detallePrecioId,
            lugar_id,
            modalidad_id,
            precio
          }
        );

        if (url && url.trim() !== '') {
          const fotoId = uuidv4();
          await t.none(
            `
              INSERT INTO fotolugar (id, lugar_id, url, descripcion)
              VALUES ($[id], $[lugar_id], $[url], $[descripcion])
            `,
            {
              id: fotoId,
              lugar_id,
              url,
              descripcion: 'Imagen principal'
            }
          );
        }

        return { lugar_id };
      })
      .then((resultado) => {
        return res.json({
          success: true,
          message: 'Lugar creado correctamente',
          lugar_id: resultado.lugar_id
        });
      })
      .catch((error) => {
        console.error('Rollback transacción crearLugar:', error.message);
        return res
          .status(400)
          .json({ success: false, message: error.message || 'Error al crear lugar' });
      });
    } catch (err) {
      console.error('Error inesperado en crearLugar:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Error interno del servidor.' });
    }
  }
};
