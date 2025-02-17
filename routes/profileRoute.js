import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
const profileRoute = express.Router();
import userModel from '../models/userModel.js';
import postModel from '../models/postModel.js';

profileRoute.get('/:username/post/:id', authMiddleware, async (req, res) => {
    const [post] = await postModel.getPostById(req.user.username, req.params.id);
    if(post.length === 0){
        res.status(404).send('Post not found');
        return;
    }
    const [comments] = await postModel.getComments(req.params.id);
    const [user] = await userModel.getByUsername(req.user.username);
    const topProfiles = await userModel.gettopprofiles(req.user.username);
    res.render('post', { user: user[0], post: post[0], comments, topProfiles: topProfiles });
});

profileRoute.get('/:username', authMiddleware, async (req, res) => {
    const [user] = await userModel.getByUsername(req.user.username);
    const [profile] = await userModel.getByUsername(req.params.username);
    const topProfiles = await userModel.gettopprofiles(req.user.username);
    const [posts] = await postModel.getPostsByUsername(req.user.username, req.params.username, 0);
    const owner = req.user.username === req.params.username? true: false;
    const isFollowed = await userModel.isFollowed(user[0].username, profile[0].username);
    res.render('../views/profile', {profile: profile[0], user: user[0], topProfiles: topProfiles, isFollowed, owner: owner, posts: posts});
});


export default profileRoute;