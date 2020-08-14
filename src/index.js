// import app from './app'

require('dotenv').config()
const app = require('./app')


app.listen(app.get('port'))
console.log(`Listening on http://localhost:${app.get('port')}`)