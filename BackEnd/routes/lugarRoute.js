const express = require('express');
const router = express.Router();
const lugarController = require('../controllers/lugarController');
const upload = require('../middlewares/upload'); // asegúrate de que esta ruta es correcta

router.get('/obtenerLugares', lugarController.obtenerLugares);
router.get('/:id', lugarController.obtenerLugarPorId);
router.get('/:id/resenas', lugarController.obtenerResenasLugar);

// Nuevo endpoint para crear lugar con subida de imagen
router.post('/', upload.single('photos'), lugarController.crearLugar); // o upload.array('photos', 4)

module.exports = router;
