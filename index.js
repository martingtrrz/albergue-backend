const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializar Express
const app = express();


// index.js
const allowedOrigins = [
    'https://martin.utportfolio.cloud',
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como las de herramientas tipo Postman o CURL)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const residentesRoutes = require('./routes/residentesRoutes');
const familiasRoutes = require('./routes/familiasRoutes');

// Asignar las rutas a la API (Prefijo /api asegurado)
app.use('/api/auth', authRoutes);
app.use('/api/residentes', residentesRoutes);
app.use('/api/familias', familiasRoutes);

// Ruta base para verificar conexión
app.get('/', (req, res) => {
    res.json({ mensaje: 'API del Albergue Municipal conectada correctamente.' });
});

// Manejo de rutas 404 (Para depuración)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada en la API' });
});

// Manejo de errores global
// Manejo de errores global - pon esto al final de index.js, antes de app.listen
app.use((err, req, res, next) => {
    console.error("--- ERROR DETECTADO ---");
    console.error(err); // Esto imprimirá el stack completo
    res.status(500).json({ 
        mensaje: "Error interno del servidor", 
        detalle: err.message 
    });
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});