import db from '../config/dbConfig.js';

const User = {
    create: (userData)=>{
        const query = `INSERT INTO USERS (username, fullname, email, password, age ) VALUES(?, ?, ?, ?, ?)`;
        return db.query(query, [userData.username, userData.fullname, userData.email, userData.password, userData.age]);
    },
    getByUsername: (username)=>{
        const query = `SELECT * FROM USERS WHERE USERNAME=?`;
        return db.query(query, [username]);
    },
    getByEmail: (email)=>{
        const query = `SELECT * FROM USERS WHERE EMAIL=?`;
        return db.query(query, [email]);
    },
    gettopprofiles: ()=>{
        const query = `SELECT fullname, username, followers FROM users ORDER BY followers DESC, date DESC LIMIT 3;`;
        return db.query(query);
    }
}

export default User;