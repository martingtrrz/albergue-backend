const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { 
    getActivos, 
    getArchivados, 
    registrar, 
    actualizar, 
    archivar, 
    reingresar 
} = require('../controllers/residentesController');

// Todas las rutas están protegidas por el token de seguridad
router.use(verificarToken);

// Rutas de Lectura (GET)
router.get('/activos', getActivos);
router.get('/archivados', getArchivados);

// Ruta de Creación (POST)
// Permite subir 1 foto con el campo 'foto'
router.post('/registrar', upload.single('foto'), registrar);

// Ruta de Actualización (PUT)
// Permite subir 1 nueva foto si se requiere reemplazar la anterior
router.put('/:id', upload.single('foto'), actualizar);

// Rutas de Cambio de Estado (PATCH)
router.patch('/:id/archivar', archivar);
router.patch('/:id/reingresar', reingresar);

module.exports = router;