const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const propietarioController = require('../controllers/propietarioController');

router.get('/mis-reservas', authMiddleware, propietarioController.obtenerReservasDeMisLugares);

module.exports = router;
