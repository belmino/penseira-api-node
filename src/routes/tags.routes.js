// import {Router} from 'express'
const {Router} = require('express')

const {getTags, getTag, addTag, delTag, updateTag, addSubTag} = require('../controllers/tags.controller')


const router = Router()

router.get('/', getTags)
router.get('/:id', getTag)
router.post('/', addTag)
router.post('/subtag', addSubTag)
router.put('/:id', updateTag)
router.delete('/:id', delTag)


// export default router
module.exports = router