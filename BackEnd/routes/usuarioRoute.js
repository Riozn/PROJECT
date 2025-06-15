const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/listar', usuarioController.listarUsuarios);
router.post('/crear', usuarioController.crearUsuario);
router.put('/actualizar/:id', usuarioController.actualizarUsuario);
router.delete('/eliminar/:id', usuarioController.eliminarUsuario);

module.exports = router;
