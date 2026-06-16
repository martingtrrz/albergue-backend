const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // El token llega en los headers como: "Bearer <token>"
    const headerAuth = req.header('Authorization');
    
    if (!headerAuth) {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere un Token.' });
    }

    const token = headerAuth.split(' ')[1];

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado; // Guardamos los datos del usuario para usarlos después
        next(); // Lo dejamos pasar
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token no válido o expirado. Vuelva a iniciar sesión.' });
    }
};

module.exports = verificarToken;