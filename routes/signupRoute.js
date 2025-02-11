import express from 'express';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const signupRoute = express.Router();
signupRoute.get('/', (req, res) => {
    res.render('signup');
});

signupRoute.post('/', async (req, res) => {
    const { username, fullname, email, password, age } = req.body;
    if(!username || !fullname || !email || !password || !age){
        return res.redirect('/signup');
    }
    var [users] = await userModel.getByEmail(email);
    if (users.length > 0) {
        res.send('This email is already registered');
        return;
    }
    var [users] = await userModel.getByUsername(username);
    if (users.length > 0) {
        console.log('Username already taken');
        res.send('Username already exists');
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try{
        await userModel.create({
            username: username,
            fullname: fullname,
            email: email,
            password: hashedPassword,
            age: age
        });
        const jwtToken = jwt.sign({username: username}, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,      // Prevents client-side access to the cookie (better security)
            secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
            maxAge: 36000000,     // 1 hour (token expiry)
            sameSite: 'Strict',  // Restrict the cookie to be sent only from the same site
        });
        res.redirect('/');
    } catch(err){
        console.log(err);
        res.send('Some error occured!');
    }
});
export default signupRoute;