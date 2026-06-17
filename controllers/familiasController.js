const db = require('../db');

const getFamilias = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM familias ORDER BY codigo_familia ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener familias:', error);
        res.status(500).json({ mensaje: 'Error interno al obtener familias' });
    }
};

const crearFamilia = async (req, res) => {
    const { codigo_familia, notes } = req.body;

    if (!codigo_familia) {
        return res.status(400).json({ mensaje: 'El codigo de familia es obligatorio' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO familias (codigo_familia, notas) VALUES (?, ?)',
            [codigo_familia, notes || null]
        );
        
        res.status(201).json({ 
            mensaje: 'Familia creada con exito', 
            id: result.insertId, 
            codigo_familia 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'Ese codigo de familia ya esta registrado' });
        }
        console.error('Error al crear familia:', error);
        res.status(500).json({ mensaje: 'Error interno al crear familia' });
    }
};

module.exports = { getFamilias, crearFamilia };