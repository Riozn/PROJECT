const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', reservaController.crearReserva);
router.get('/lugar/:lugarId', reservaController.obtenerReservasPorLugar);
router.get('/cliente/mis-reservas', authMiddleware, reservaController.obtenerReservasDelCliente);

module.exports = router;
