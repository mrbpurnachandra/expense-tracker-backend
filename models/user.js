const db = require('../config/database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function generateToken(user) {
    return new Promise((resolve, reject) => {
        // Here user is spread to make it plain object
        jwt.sign({ ...user }, process.env.JWT_SECRET_KEY, {}, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if(err) reject(err)
            resolve(user)
        })
    })
}

function findOne(id) {
    return db.run('SELECT * FROM `user` WHERE `id`=?', [id], (results) => {
        return results[0]
    })
}

function findOneByUsername(username) {
    return db.run('SELECT * FROM `user` WHERE `username`=?', [username], (results) => {
        return results[0]
    })
}

function hashPassword(password) {
    return bcrypt.hash(password, 10)
}

function matchPassword(password, hash) {
    return bcrypt.compare(password, hash)
}

async function addOne(username, password) {
    password = await hashPassword(password)
    const insertId = await db.run('INSERT INTO `user`(`username`, `password`) VALUES(?,?)', [username, password], results => results.insertId)
    return findOne(insertId)
}

module.exports = {
    findOne,
    findOneByUsername,
    addOne,
    generateToken,
    verifyToken, 
    matchPassword
}