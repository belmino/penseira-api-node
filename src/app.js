// import express from 'express'
// import morgan from 'morgan'
// import cors from 'cors'
// import multer from 'multer'
// import path from 'path'

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

// const imagesRoutes = require('./routes/images.routes')
const tagsRoutes = require('./routes/tags.routes')
const blocksRoutes = require('./routes/blocks.routes')


const app = express()

// Settings
app.set('port', process.env.PORT || 3003)

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())


const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename(req, file, cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname))
    }
})

app.use(multer({ storage }).single('image'))

// Routes
app.get('/', (req, res) => {
    return res.send(`The API is at http://localhost:${app.get('port')}`)
})

app.post('/', (req, res) => {
    return res.send(`The API via POST is at http://localhost:${app.get('port')}`)
})

// app.use('/images', imagesRoutes)
app.use('/tags', tagsRoutes)
app.use('/blocks', blocksRoutes)

// Static Files
app.use(express.static(path.join(__dirname, 'public')));


// export default app
module.exports = app