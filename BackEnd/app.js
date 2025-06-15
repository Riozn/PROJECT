const express = require('express');
const path    = require('path');
const app     = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const lugarRoute      = require('./routes/lugarRoute');
const reservaRoute    = require('./routes/reservaRoute');
const tipoEventoRoute = require('./routes/tipoEventoRoute');
const pagoRoute       = require('./routes/pagoRoute');
const authRoute       = require('./routes/authRoute');
const categoriasRoute = require('./routes/categorias');
const propietarioRoute = require('./routes/propietarioRoute');
const usuarioRoute = require('./routes/usuarioRoute');
app.use('/uploads', express.static(path.join(__dirname, '../FrontEnd/public/uploads')));

app.use('/lugar', lugarRoute);
app.use('/api/reservas', reservaRoute);
app.use('/api/tipos-evento', tipoEventoRoute);
app.use('/api/pagos', pagoRoute);
app.use('/api/auth', authRoute);
app.use('/api/categorias', categoriasRoute);
app.use('/api/propietario', propietarioRoute);
app.use('/api/usuarios', usuarioRoute);

app.use(express.static(path.join(__dirname, '../FrontEnd')));

app.get('/',           (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/index.html')));
app.get('/auth.html',  (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/auth.html')));
app.get('/lugar.html', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/lugar.html')));
app.get('/reserva.html', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/reserva.html')));
app.get('/publicar.html', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/publicar.html')));
app.get('/pago.html', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/pago.html')));
app.get('/misReservas.html', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/misReservas.html')));
app.get('/misReservasCliente.html', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/misReservasCliente.html')));

app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
