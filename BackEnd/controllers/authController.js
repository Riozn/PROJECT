const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const DAO = require('../models/dao');
const db = new DAO();

const SECRET = 'CLAVESECRETA';

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }, SECRET, { expiresIn: '2h' });
}

module.exports = {
  registro: async (req, res) => {
    try {
      const { nombre, email, telefono, contrasena } = req.body;

      const existe = await db.consultar('SELECT * FROM Usuario WHERE email = $1', [email]);
      if (existe.length > 0) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      const id = uuidv4();
      const rol = 'cliente';
      await db.consultar(`
        INSERT INTO Usuario (id, nombre, email, telefono, contrasena, rol, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
      `, [id, nombre, email, telefono, contrasena, rol]);

      const usuario = { id, nombre, email, rol };
      const token = generarToken(usuario);
      res.json({ usuario, token });
    } catch (err) {
      console.error('Error en registro:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, contrasena } = req.body;
      const result = await db.consultar('SELECT * FROM Usuario WHERE email = $1 AND contrasena = $2', [email, contrasena]);
      if (result.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const usuario = {
        id: result[0].id,
        nombre: result[0].nombre,
        email: result[0].email,
        rol: result[0].rol
      };
      const token = generarToken(usuario);
      res.json({ usuario, token });
    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};
