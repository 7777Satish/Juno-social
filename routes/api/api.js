import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import postModel from '../../models/postModel.js';
import userModel from '../../models/userModel.js';
import notificationModel from '../../models/notificationModel.js';
import bookmarkModel from '../../models/bookmarkModel.js';
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

api.get('/postsByUsername', authMiddleware, async (req, res) => {
    try {
        const username = req.user.username;
        const page = Number.isInteger(parseInt(req.query.page)) ? parseInt(req.query.page) : 0;
        const [posts] = await postModel.getPostsByUsername(username, req.query.username, page);
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

api.post('/posts/delete', authMiddleware, async (req, res)=>{
    const {postid} = req.postid;
    const username = req.user.username;
    const [posts] = await postModel.deletePosts(username, parseInt(postid));
    res.send('Post Deleted');
});

api.post('/likepost', authMiddleware, async (req, res)=>{
    const {postid} = req.body;
    const username = req.user.username;
    const [likes] = await postModel.likePost(username, parseInt(postid));
    
    const [postOwner] = await postModel.getPostOwner(parseInt(postid));
    if(postOwner[0].username!==username){
        const notificationData = {
            username: postOwner[0].username,
            content: `${username} liked your post`,
            link: `/p/${username}/post/${postid}`,
            type: 'like'
        };
        await notificationModel.create(notificationData);
    }

    res.json(likes);
});

api.post('/comment', authMiddleware, async (req, res)=>{
    const {postid, content} = req.body;
    const username = req.user.username;
    const [postOwner] = await postModel.getPostOwner(parseInt(postid));
    await postModel.commentOnPost(username, parseInt(postid), content);
    if(postOwner[0].username!==username){
        const notificationData = {
            username: postOwner[0].username,
            content: `${username} commented on your post`,
            link: `/p/${username}/post/${postid}`,
            type: 'comment'
        };
        await notificationModel.create(notificationData);
    }
    
    res.send('/p/'+ postOwner[0].username +'/post/'+postid);
});

api.post('/follow', authMiddleware, async (req, res)=>{
    const {followed} = req.body;
    const username = req.user.username;
    if(username === followed){
        res.send('Yourself');
        return;
    }
    const result = await userModel.followUser(username, followed);
    
    const notificationData = {
        username: followed,
        content: `${username} started following you`,
        link: `/p/${username}`,
        type: 'follow'
    };
    await notificationModel.create(notificationData);

    res.send(result);
});

api.post('/bookmarkpost', authMiddleware, async (req, res)=>{
    const {postid} = req.body;
    const [postBy] = await postModel.getPostOwner(postid);
    const username = req.user.username;
    const [bookmarks] = await bookmarkModel.create(username, parseInt(postid), postBy[0].username);
    res.json(bookmarks);
});

export default api;