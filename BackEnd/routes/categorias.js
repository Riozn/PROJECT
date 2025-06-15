const express = require('express');
const router = express.Router();
const DAO = require('../models/dao');
const db = new DAO().getDb();

router.get('/', async (req, res) => {
  try {
    const categorias = await db.any('SELECT id, nombre FROM categorialugar ORDER BY nombre');
    res.json(categorias);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

module.exports = router;
