const express = require('express');
const router = express.Router();
const lugarController = require('../controllers/lugarController');
const upload = require('../middlewares/upload'); // asegúrate de que esta ruta es correcta

router.get('/obtenerLugares', lugarController.obtenerLugares);
router.get('/:id', lugarController.obtenerLugarPorId);
router.get('/:id/resenas', lugarController.obtenerResenasLugar);

// Nuevo endpoint para crear lugar con subida de múltiples imágenes
// Permitir hasta 20 imágenes por lugar
router.post('/', upload.array('photos', 20), lugarController.crearLugar);

module.exports = router;
