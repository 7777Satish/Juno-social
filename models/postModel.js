import db from '../config/dbConfig.js';

const Post = {
    create: (username, content)=>{
        const postId = new Date().getTime() + Math.floor(Math.random()*10000);
        const query = `insert into posts (postid, content, username) values (?, ?, ?)`;
        try{
            return db.query(query, [postId, content, username]);
        }
        catch(err){console.log(err)}
    },
    getPosts: (i)=>{
        const query = `SELECT posts.*, users.fullname 
FROM posts 
JOIN users ON posts.username = users.username
ORDER BY date DESC
LIMIT ? OFFSET ?;`
        try{
            return db.query(query, [6, i*6]);
        } catch(err){
            console.log(err);
        }
    },
    incrementLikes: (postId)=>{}
}

export default Post;