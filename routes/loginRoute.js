import express from 'express';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const loginRoute = express.Router();

loginRoute.get('/',(req, res) => {
    res.render('login');
});

loginRoute.post('/', async (req, res)=>{
    const {username, password} = req.body;
    const [users] = await userModel.getByUsername(username);
    if(users.length===0){
        return res.send('Invalid username or password');
    }
    const cond = await bcrypt.compare(password, users[0].password);
    if(!cond){
        return res.send('Invalid username or password');
    }

    const jwtToken = jwt.sign({username:username}, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });
    res.cookie('jwtToken', jwtToken, {
        httpOnly: true,      // Prevents client-side access to the cookie (better security)
        secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
        maxAge: 36000000,     // 1 hour (token expiry)
        sameSite: 'Strict',  // Restrict the cookie to be sent only from the same site
    });
    res.redirect('/');
});

export default loginRoute;