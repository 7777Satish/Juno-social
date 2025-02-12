import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
const profileRoute = express.Router();
import userModel from '../models/userModel.js';
import postModel from '../models/postModel.js';

profileRoute.get('/:username', authMiddleware, async (req, res) => {
    const [user] = await userModel.getByUsername(req.user.username);
    const [profile] = await userModel.getByUsername(req.params.username);
    const [topProfiles] = await userModel.gettopprofiles();
    const [posts] = await postModel.getPostsByUsername(req.user.username, req.params.username, 0);
    const owner = req.user.username === req.params.username? true: false;
    res.render('../views/profile', {profile: profile[0], user: user[0], topProfiles: topProfiles, owner: owner, posts: posts});
});

export default profileRoute;