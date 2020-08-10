const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: 'localhost',
    port: '3309',
    user: 'pensier',
    password: 'p3nS13r',
    database: 'pensieve'
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