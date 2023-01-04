const db = require('../config/database')

function findOne(id) {
    return db.run('SELECT * FROM `expense` WHERE `id`=?', [id], (results) => results[0])
}

function findOneByUser(id, userId) {
    return db.run('SELECT * FROM `expense` WHERE `id`=? AND `user_id`=?', [id, userId], (results) => results[0])
}

function findByUser(userId) {
    return db.run('SELECT * FROM `expense` WHERE `user_id`=?', [userId], results => results)
}

async function addOne(topic, amount, userId, urgencyId) {
    const insertId = await db.run('INSERT INTO `expense`(`topic`, `amount`, `user_id`, `urgency_id`) VALUES(?,?,?,?)', [topic, amount, userId, urgencyId], results => results.insertId)
    return findOne(insertId)
}

function updateById(id, topic, amount, urgencyId) {
    return db.run('UPDATE `expense` SET `topic`=?, `amount`=?, `urgency_id`=?, `updated_at`=? WHERE `id` = ?', [topic, amount, urgencyId, new Date(), id], results => results.affectedRows)
}

function deleteById(id) {
    return db.run('DELETE FROM `expense` WHERE `id`=?', [id], results => results.affectedRows)
}

function findOnIntervalByUser(userId, { startDate, endDate }) {
    return db.run('SELECT * FROM `expense` WHERE `created_at` BETWEEN ? AND ? AND `user_id`=?', [startDate, endDate, userId], results => results)
}

module.exports = {
    findOne,
    findByUser,
    findOneByUser, 
    addOne,
    updateById,
    deleteById,
    findOnIntervalByUser
}