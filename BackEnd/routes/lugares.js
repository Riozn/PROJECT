const express = require('express');
const router = express.Router();
const lugarController = require('../controllers/lugarController');

router.get('/obtenerLugares', lugarController.obtenerLugares);

router.get('/:id', lugarController.obtenerLugarPorId);

router.get('/:id/resenas', lugarController.obtenerResenasLugar);

module.exports = router;

