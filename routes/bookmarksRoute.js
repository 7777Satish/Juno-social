import express from 'express';
import bookmarkModel from '../models/bookmarkModel.js';
import userModel from '../models/userModel.js';
import postModel from '../models/postModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const Bookmarks = express.Router();

Bookmarks.get('/', authMiddleware, async (req, res) => {
    try {
        const [bookmarks] = await bookmarkModel.get(req.user.username, 0);
        
        // Fetch all posts asynchronously and wait for them
        const posts = await Promise.all(bookmarks.map(async (bookmark) => {
            const p = await postModel.getPostById(req.user.username, bookmark.post_id);
            return p[0][0]; // Assuming p is an array and we need the first element
        }));
        const [user] = await userModel.getByUsername(req.user.username);
        const topProfiles = await userModel.gettopprofiles(req.user.username);
        res.render('bookmarks', { user: user[0], topProfiles: topProfiles, posts: posts?posts:[] });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default Bookmarks;
