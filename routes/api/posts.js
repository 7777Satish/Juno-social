import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import postModel from '../../models/postModel.js';
const api = express.Router();

api.get('/posts', authMiddleware, async (req, res)=>{
    const {page} = req.query;
    const [posts] = await postModel.getPosts(parseInt(page));
    res.json(posts);
});

export default api;