const db = require('../config/database')

const FIND_ONE = `
    SELECT 
        expense.id AS id,
        topic, 
        amount, 
        created_at, 
        updated_at, 
        user_id, 
        urgency_id, 
        name as urgency_text
    FROM expense
    JOIN urgency ON expense.urgency_id = urgency.id
    WHERE expense.id=?
`
const FIND_ONE_BY_USER = `
    SELECT 
        expense.id AS id,
        topic, 
        amount, 
        created_at, 
        updated_at, 
        user_id, 
        urgency_id, 
        name as urgency_text
    FROM expense
    JOIN urgency ON expense.urgency_id = urgency.id
    WHERE expense.id=? AND expense.user_id=?
`
const FIND_BY_USER = `
    SELECT 
        expense.id AS id,
        topic, 
        amount, 
        created_at, 
        updated_at, 
        user_id, 
        urgency_id, 
        name as urgency_text
    FROM expense
    JOIN urgency ON expense.urgency_id = urgency.id
    WHERE expense.user_id=?
`
const FIND_ON_INTERVAL_BY_USER = `
    SELECT 
        expense.id AS id,
        topic, 
        amount, 
        created_at, 
        updated_at, 
        user_id, 
        urgency_id, 
        name as urgency_text
    FROM expense
    JOIN urgency ON expense.urgency_id = urgency.id
    WHERE expense.created_at BETWEEN ? AND ? AND expense.user_id=?
`

function findOne(id) {
    return db.run(FIND_ONE, [id], (results) => results[0])
}

function findOneByUser(id, userId) {
    return db.run(
        FIND_ONE_BY_USER,
        [id, userId],
        (results) => results[0]
    )
}

function findByUser(userId) {
    return db.run(
        FIND_BY_USER,
        [userId],
        (results) => results
    )
}

async function addOne(topic, amount, userId, urgencyId) {
    const insertId = await db.run(
        'INSERT INTO `expense`(`topic`, `amount`, `user_id`, `urgency_id`) VALUES(?,?,?,?)',
        [topic, amount, userId, urgencyId],
        (results) => results.insertId
    )
    return findOne(insertId)
}

function updateById(id, topic, amount, urgencyId) {
    return db.run(
        'UPDATE `expense` SET `topic`=?, `amount`=?, `urgency_id`=?, `updated_at`=? WHERE `id` = ?',
        [topic, amount, urgencyId, new Date(), id],
        (results) => results.affectedRows
    )
}

function deleteById(id) {
    return db.run(
        'DELETE FROM `expense` WHERE `id`=?',
        [id],
        (results) => results.affectedRows
    )
}

function findOnIntervalByUser(userId, { startDate, endDate }) {
    return db.run(
        FIND_ON_INTERVAL_BY_USER,
        [startDate, endDate, userId],
        (results) => results
    )
}

module.exports = {
    findOne,
    findByUser,
    findOneByUser,
    addOne,
    updateById,
    deleteById,
    findOnIntervalByUser,
}
