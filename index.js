const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const residentesRoutes = require('./routes/residentesRoutes');
const familiasRoutes = require('./routes/familiasRoutes');

// Asignar las rutas a la API
app.use('/api/auth', authRoutes);
app.use('/api/residentes', residentesRoutes);
app.use('/api/familias', familiasRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.json({ mensaje: 'API del Albergue Municipal conectada.' });
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});