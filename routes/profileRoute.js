import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
const profileRoute = express.Router();

profileRoute.get('/', authMiddleware, (req, res) => {
    res.render('../views/profile', { user: req.user });
});

export default profileRoute;