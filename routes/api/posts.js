import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import postModel from '../../models/postModel.js';
const api = express.Router();

api.get('/posts', authMiddleware, async (req, res) => {
    try {
        const username = req.user.username;
        const page = Number.isInteger(parseInt(req.query.page)) ? parseInt(req.query.page) : 0;
        const [posts] = await postModel.getPosts(username, page);
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


api.get('/posts/delete', authMiddleware, async (req, res)=>{
    const {postid} = req.postid;
    const username = req.user.username;
    const [posts] = await postModel.deletePosts(username, parseInt(postid));
    res.send('Post Deleted');
});

api.post('/likepost', authMiddleware, async (req, res)=>{
    const {postid} = req.body;
    const username = req.user.username;
    const [likes] = await postModel.likePost(username, parseInt(postid));
    res.json(likes);
});

api.post('/comment', authMiddleware, async (req, res)=>{
    const {postid, content} = req.body;
    const username = req.user.username;
    await postModel.commentOnPost(username, parseInt(postid), content);
    res.redirect('/');
});

export default api;