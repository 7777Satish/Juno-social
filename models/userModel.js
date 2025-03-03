import db from '../config/dbConfig.js';

const User = {
    create: (userData)=>{
        const query = `INSERT INTO users (username, fullname, email, password, age ) VALUES(?, ?, ?, ?, ?)`;
        return db.query(query, [userData.username, userData.fullname, userData.email, userData.password, userData.age]);
    },
    getByUsername: (username)=>{
        const query = `SELECT * FROM users WHERE USERNAME=?`;
        return db.query(query, [username]);
    },
    getByEmail: (email)=>{
        const query = `SELECT * FROM users WHERE EMAIL=?`;
        return db.query(query, [email]);
    },
    gettopprofiles: async (username) => {
        const query = `SELECT fullname, username, followers FROM users ORDER BY followers DESC, date DESC LIMIT 3;`;
        const [result] = await db.query(query);
    
        // Use map instead of forEach and await all promises
        const profilesWithFollowStatus = await Promise.all(
            result.map(async (user) => {
                const isFollowed = await User.isFollowed(username, user.username);
                user.isFollowed = isFollowed;
                return user;
            })
        );
    
        return profilesWithFollowStatus;
    },
    isFollowed: async(username, followed)=>{
        try{
            let [follows] = await db.query('select * from followers where follower=? and followed=?', [username, followed]);
            if(follows.length>0){
                return 1;
            }
            return 0;
        } catch(err){
            console.log(err);
            return 0;
        }
    },
    followUser: async(username, followed)=>{
        try{
            const [users] = await db.query('select * from users where username=?', [followed]);
            if(users.length==0){
                return 'User not found';
            }
        } catch(err){
            console.log(err);
        }
        try{
            let [follows] = await db.query('select * from followers where follower=? and followed=?', [username, followed]);
            if(follows.length==0){
                await db.query('insert into followers (follower, followed) values (?, ?)', [username, followed]);
                await db.query('update users set followers=followers+1 where username=?', [followed]);
                await db.query('update users set following=following+1 where username=?', [username]);
                return 'Unfollow';
            } else {
                await db.query('delete from followers where follower=? and followed=?', [username, followed]);
                await db.query('update users set followers=followers-1 where username=?', [followed]);
                await db.query('update users set following=following-1 where username=?', [username]);
                return 'Follow';
            }
        } catch(err){
            console.log(err);
            return 'Error';
        }
    }
}

export default User;