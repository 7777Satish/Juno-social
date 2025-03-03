import dotenv from "dotenv";
dotenv.config();
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false,
    },
});


(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connected to database ✅');
        connection.release();
    } catch (err) {
        console.error('Database connection failed ❌', err);
    }
})();

export default db;
