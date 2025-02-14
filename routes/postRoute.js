import express from 'express';
const postRoute = express.Router();
import postModel from '../models/postModel.js';

postRoute.get('/post/:id', async (req, res) => {
    const [post] = await postModel.getPostById(req.params.id);
    if(post.length === 0){
        res.status(404).send('Post not found');
        return;
    }
    res.render('post', {post: post[0]});
});