const DAO = require('./dao');
const db = new DAO().getDb();
const { v4: uuidv4 } = require('uuid');

class UsuarioModel {
  async obtenerTodos() {
    const sql = `SELECT id, nombre, email, telefono, rol FROM usuario ORDER BY created_at DESC`;
    return await db.any(sql);
  }

  async crear(data) {
    const id = uuidv4();
    const sql = `
      INSERT INTO usuario (id, nombre, email, telefono, contrasena, rol, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
      RETURNING id, nombre, email, telefono, rol
    `;
    const params = [id, data.nombre, data.email, data.telefono, data.contrasena || '', data.rol || 'cliente'];
    const usuario = await db.one(sql, params);
    return usuario;
  }

  async actualizar(id, data) {
    const sql = `
      UPDATE usuario
      SET nombre = $1, email = $2, telefono = $3, rol = $4
      WHERE id = $5
      RETURNING id, nombre, email, telefono, rol
    `;
    const params = [data.nombre, data.email, data.telefono, data.rol, id];
    return await db.one(sql, params);
  }

  async eliminar(id) {
    const sql = `DELETE FROM usuario WHERE id = $1`;
    await db.none(sql, [id]);
    return true;
  }
}

module.exports = UsuarioModel;
