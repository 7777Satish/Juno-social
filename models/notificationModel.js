import db from '../config/dbConfig.js';

const Notification = {
    create: async (notificationData) => {

        if(notificationData.type == 'follow' || notificationData.type == 'like'){
            const query = `SELECT * FROM notifications WHERE username=? AND type=? AND content=? AND link=?`;
            const [result] = await db.query(query, [notificationData.username, notificationData.type, notificationData.content, notificationData.link]);
            if(result.length > 0){
                return;
            }
        }

        const query = `INSERT INTO notifications (username, content, link, type) VALUES(?, ?, ?, ?)`;
        return db.query(query, [notificationData.username, notificationData.content, notificationData.link, notificationData.type]);
    },
    get: async (username) => {
        const query = `SELECT * FROM notifications WHERE username=? ORDER BY created_at DESC limit 100`;
        return db.query(query, [username]);
    },
    delete: async (id) => {
        const query = `DELETE FROM notifications WHERE id=?`;
        return db.query(query, [id]);
    },
    deleteAll: async (username) => {
        const query = `DELETE FROM notifications WHERE username=?`;
        return db.query(query, [username]);
    }
}

export default Notification;