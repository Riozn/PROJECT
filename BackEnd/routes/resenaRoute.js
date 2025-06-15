const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const {
  crearResena,
  obtenerResenas
} = require('../controllers/resenaController');

router.post('/', auth, crearResena);

router.get('/:lugarId', obtenerResenas);

module.exports = router;
