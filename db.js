const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        ca: fs.readFileSync('./ca.pem'),
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificación inicial más clara
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        connection.release();
    } catch (err) {
        console.error('❌ Error crítico conectando a la base de datos:', err.message);
        // Opcional: process.exit(1); si quieres que la API no inicie sin DB
    }
})();

module.exports = pool;