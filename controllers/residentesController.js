const db = require('../db');

// 1. Obtener Residentes Activos
const getActivos = async (req, res) => {
    try {
        const [residentes] = await db.query('SELECT * FROM Residentes WHERE estado = "activo" ORDER BY fecha_ingreso DESC');
        res.json(residentes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al consultar residentes activos' });
    }
};

// 2. Obtener Residentes Archivados
const getArchivados = async (req, res) => {
    try {
        const [residentes] = await db.query('SELECT * FROM Residentes WHERE estado = "archivado" ORDER BY fecha_ingreso DESC');
        res.json(residentes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al consultar el historial' });
    }
};

// 3. Registrar Nuevo Residente
const registrar = async (req, res) => {
    try {
        // CORRECCIÓN: Leer las variables con los mismos nombres que envía React (camelCase)
        const { 
            nombre, sexo, edad, nacionalidad, familiaId, 
            fechaIngreso, contactoEmergencia, condicion, destino, viajeProgramado 
        } = req.body;
        
        const usuario_id = req.usuario.id;
        const foto_url = req.file ? req.file.path : null;

        const [rows] = await db.query(
            `CALL sp_registrar_residente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado);`,
            [
                usuario_id, nombre, sexo, edad, nacionalidad, 
                familiaId || null, fechaIngreso, contactoEmergencia || null, 
                condicion || null, destino || null, viajeProgramado || null, foto_url
            ]
        );

        const [resultadoQuery] = await db.query('SELECT @resultado AS mensaje');
        const mensaje = resultadoQuery[0].mensaje;

        if (mensaje.startsWith('ERROR')) return res.status(400).json({ mensaje });
        res.status(201).json({ mensaje });
    } catch (error) {
        console.error('ERROR REAL AL REGISTRAR:', error);
        res.status(500).json({ mensaje: 'Error interno al registrar residente' });
    }
};

// 4. Actualizar Residente (Editar Ficha)
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        // CORRECCIÓN: Leer las variables en camelCase
        const { 
            nombre, sexo, edad, nacionalidad, familiaId, 
            fechaIngreso, contactoEmergencia, condicion, destino, viajeProgramado 
        } = req.body;
        
        let queryExtra = '';
        let valores = [
            nombre, sexo, edad, nacionalidad, familiaId || null, 
            fechaIngreso, contactoEmergencia || null, condicion || null, 
            destino || null, viajeProgramado || null
        ];

        if (req.file) {
            queryExtra = ', foto_url = ?';
            valores.push(req.file.path);
        }

        valores.push(id); 

        const query = `UPDATE Residentes SET nombre=?, sexo=?, edad=?, nacionalidad=?, familia_id=?, fecha_ingreso=?, contacto_emergencia=?, condicion=?, destino=?, viaje_programado=? ${queryExtra} WHERE id=?`;
        
        await db.query(query, valores);
        await db.query('INSERT INTO Auditoria (usuario_id, accion, residente_id, detalles) VALUES (?, "EDICION", ?, "Edición de ficha de residente")', [req.usuario.id, id]);

        res.json({ mensaje: 'Residente actualizado correctamente' });
    } catch (error) {
        console.error('ERROR AL ACTUALIZAR:', error);
        res.status(500).json({ mensaje: 'Error al actualizar residente' });
    }
};

// 5. Archivar Residente (Dar de baja)
const archivar = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        await db.query(`CALL sp_archivar_residente(?, ?, @resultado);`, [usuario_id, id]);
        const [resultadoQuery] = await db.query('SELECT @resultado AS mensaje');
        const mensaje = resultadoQuery[0].mensaje;

        if (mensaje.startsWith('ERROR')) return res.status(400).json({ mensaje });
        res.json({ mensaje });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al archivar residente' });
    }
};

// 6. Reingresar Residente
const reingresar = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        await db.query(`CALL sp_reingresar_residente(?, ?, @resultado);`, [usuario_id, id]);
        const [resultadoQuery] = await db.query('SELECT @resultado AS mensaje');
        const mensaje = resultadoQuery[0].mensaje;

        if (mensaje.startsWith('ERROR')) return res.status(400).json({ mensaje });
        res.json({ mensaje });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al reingresar residente' });
    }
};

module.exports = { getActivos, getArchivados, registrar, actualizar, archivar, reingresar };