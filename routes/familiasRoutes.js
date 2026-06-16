const express = require('express');
const router = express.Router();
const { getFamilias, crearFamilia } = require('../controllers/familiasController');
const verificarToken = require('../middlewares/authMiddleware');

// Proteger las rutas con el token JWT
router.use(verificarToken);

router.get('/', getFamilias);
router.post('/', crearFamilia);

module.exports = router;