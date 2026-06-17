const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Buscar si el usuario existe y está activo
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ? AND activo = 1', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado o cuenta inactiva' });
        }

        const usuario = rows[0];

        // 2. Comparar la contraseña ingresada con la encriptada
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // 3. Generar el Token de seguridad (válido por 8 horas)
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: { nombre: usuario.nombre_completo, rol: usuario.rol }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { login };