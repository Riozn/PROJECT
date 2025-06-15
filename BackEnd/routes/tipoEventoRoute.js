const express = require('express');
const router = express.Router();
const tipoEventoController = require('../controllers/tipoEventoController');

router.get('/', tipoEventoController.obtenerTiposEvento);

module.exports = router;
