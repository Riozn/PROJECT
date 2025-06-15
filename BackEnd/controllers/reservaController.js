const ReservaModel = require('../models/reservaModel');
const reservaModel = new ReservaModel();

module.exports = {
  crearReserva: async (req, res) => {
    try {
      const data = req.body;

      const reserva = await reservaModel.crearReserva(data);
      res.json({ success: true, reservaId: reserva.id });
    } catch (error) {
      console.error('Error al crear reserva:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  obtenerReservasPorLugar: async (req, res) => {
    try {
      const lugarId = req.params.lugarId;
      const reservas = await reservaModel.obtenerReservasPorLugar(lugarId);
      res.json(reservas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
  
  async obtenerReservasDelCliente(req, res) {
  try {
    const clienteId = req.usuario.id;
    const reservas = await reservaModel.obtenerPorCliente(clienteId);
    res.json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reservas del cliente' });
  }
}
};
