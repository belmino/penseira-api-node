const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE
})

async function getConnection() {
    try{
        const connection = await pool.getConnection()
        // console.log('DB is Connected!!!')
        return connection
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getConnection}