import express from 'express';
const logoutRoute = express.Router();

logoutRoute.get('/', (req, res) => {
    res.clearCookie('jwtToken');
    res.redirect('/login');
})

export default logoutRoute;