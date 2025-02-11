import db from '../config/dbConfig.js';

const Post = {
    create: (username, content, image)=>{
        const postId = new Date().getTime() + Math.floor(Math.random()*10000);
        const query = `insert into posts (postid, content, username, image) values (?, ?, ?, ?)`;
        try{
            return db.query(query, [postId, content, username, image.length>0?image:'NULL']);
        }
        catch(err){console.log(err)}
    },
    getPosts: (username, i)=>{
        const query = `SELECT posts.*, 
                        users.fullname,
                        EXISTS (
                            SELECT 1 
                            FROM likes 
                            WHERE likes.postid = posts.postid 
                                AND likes.username = ?
                        ) AS liked
                    FROM posts
                    JOIN users ON posts.username = users.username
                    ORDER BY date DESC
                    LIMIT ? OFFSET ?;`
        try{
            return db.query(query, [username, 6, i*6]);
        } catch(err){
            console.log(err);
        }
    },
    deletePost: (username, postid)=>{
        try{
            db.query('delete from posts where username=? and postid=?', [username, postid]);
        } catch(err){
            console.log(err);
        }
    },
    likePost: async (username, postId) => {
        try{
            let [likes] = await db.query('select * from likes where username=? AND postid=?', [username, postId]);
            if(likes.length==0){
                await db.query('insert into likes (username, postid) values (?, ?)', [username, postId]);
                await db.query('update posts set likes=likes+1 where postid=?', [postId]);
            } else {
                await db.query('delete from likes where username=? AND postid=?', [username, postId]);
                await db.query('update posts set likes=likes-1 where postid=?', [postId]);
            }
            [likes] = await db.query('select likes from posts where  postid=?', [postId]);
            return likes;
        } catch(err){
            console.log(err);
        }
    },
    commentOnPost: async (username, postId, content)=>{
        try{
            let [fullname] = await db.query('select fullname from users where username=?',[username]);
            await db.query('insert into comments (fullname, username, postid, content) values (?, ?, ?, ?)', [fullname[0].fullname, username, postId, content]);
            await db.query('update posts set comments=comments+1 where postid=?', [postId]);
        } catch(err){
            console.log(err);
        }
    }
}

export default Post;