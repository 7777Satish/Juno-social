import dotenv from "dotenv";
dotenv.config();
import mysql from 'mysql2/promise';

const db = mysql.createPool({
   host: process.env.DB_HOST || 'localhost',
   user: process.env.DB_USER || 'root',
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE
});

db.getConnection((err)=>{
    if(err) console.error(err);
    else console.log('Connected to database');
})

export default db;