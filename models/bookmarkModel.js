import db from '../config/dbConfig.js';

const Bookmark = {
    create: async (username, post_id, postBy) => {
        let query = `SELECT * FROM bookmarks WHERE username=? AND post_id=?`;
        const [result] = await db.query(query, [username, post_id]);
        if(result.length > 0){
            Bookmark.delete(username, post_id)
        }
        query = `INSERT INTO bookmarks (username, post_id, postBy) VALUES(?, ?, ?)`;
        return db.query(query, [username, post_id, postBy]);
    },
    get: async (username, i) => {
        const query = `SELECT * FROM bookmarks WHERE username=? ORDER BY created_at DESC`;
        return db.query(query, [username]);
    },
    delete: async (username, id) => {
        const query = `DELETE FROM bookmarks WHERE username=? AND post_id=?`;
        return db.query(query, [username, id]);
    },
    deleteAll: async (username) => {
        const query = `DELETE FROM bookmarks WHERE username=?`;
        return db.query(query, [username]);
    }
}

export default Bookmark;