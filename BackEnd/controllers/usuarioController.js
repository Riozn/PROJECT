const UsuarioModel = require('../models/usuarioModel');
const usuarioModel = new UsuarioModel();

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.obtenerTodos();
    res.json({ success: true, data: usuarios });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al cargar usuarios' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const usuario = await usuarioModel.crear(req.body);
    res.json({ success: true, data: usuario });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const usuario = await usuarioModel.actualizar(req.params.id, req.body);
    res.json({ success: true, data: usuario });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    await usuarioModel.eliminar(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
};
