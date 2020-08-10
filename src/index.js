// import app from './app'
const app = require('./app')


app.listen(app.get('port'))
console.log(`Listening on http://localhost:${app.get('port')}`)