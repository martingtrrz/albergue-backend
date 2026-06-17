require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function listarTablas() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { ca: fs.readFileSync('./ca.pem') }
        });

        const [rows] = await pool.query('SHOW TABLES');
        console.log("✅ Tablas encontradas en la base de datos:");
        console.table(rows); // Esto te mostrará una lista bonita en la consola
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}
listarTablas();