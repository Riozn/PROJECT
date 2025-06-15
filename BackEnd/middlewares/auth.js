const jwt = require('jsonwebtoken');
const db = require('../db'); 

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: 'Falta token de autorización.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    const { rows } = await db.query('SELECT nombre FROM "Usuario" WHERE id = $1', [payload.id]);
    if (!rows.length) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      nombre: rows[0].nombre 
    };

    next();
  } catch (err) {
    console.error('JWT Error:', err);
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
