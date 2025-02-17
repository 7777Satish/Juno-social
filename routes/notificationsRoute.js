import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';
import notificationModel from '../models/notificationModel.js';
const notificationsRoute = express.Router();


notificationsRoute.get('/', authMiddleware, async (req, res) => {
    const [posts] = await postModel.getPosts(req.user.username, 0);
    const [user] = await userModel.getByUsername(req.user.username);
    const topProfiles = await userModel.gettopprofiles(req.user.username);
    const [notifications] = await notificationModel.get(req.user.username);
    res.render('notifications', { user: user[0], posts: posts, topProfiles: topProfiles, notifications });
});

export default notificationsRoute;