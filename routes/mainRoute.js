import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

const mainRoute = express.Router();

mainRoute.get('/', authMiddleware, async (req, res) => {
    const [posts] = await postModel.getPosts(req.user.username, 0);
    const [user] = await userModel.getByUsername(req.user.username);
    const [topProfiles] = await userModel.gettopprofiles();
    res.render('index',{user: user[0], posts: posts, topProfiles: topProfiles});
})

mainRoute.post('/newpost', authMiddleware, async (req, res) => {
    const {content, image} = req.body;
    try{
        await postModel.create(req.user.username, content, image);
        res.redirect('/');
    }
    catch(err){
        console.log(err);
    }
})

export default mainRoute;