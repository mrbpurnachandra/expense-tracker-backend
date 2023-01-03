const mysql = require('mysql')

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.run = (queryString, values, transformer) => {
    return new Promise((resolve, reject) => {
        connection.query(queryString, values, (err, results) => {
            if (err) reject(err)
            resolve(transformer(results))
        })
    })
}

module.exports = connection