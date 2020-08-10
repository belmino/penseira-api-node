// import {Router} from 'express'
const {Router} = require('express')

const {getBlocks, getBlock, addBlock, delBlock, updateBlock, getBlocksOrphans, addKeyword, sortBlocksInPage} = require('../controllers/blocks.controller')


const router = Router()


router.get('/', getBlocks)
router.get('/orphans', getBlocksOrphans)
router.get('/:id', getBlock)
router.post('/', addBlock)
router.post('/keyword', addKeyword)
// router.post('/subtag', addSubTag)
router.put('/sort', sortBlocksInPage)
router.put('/:id', updateBlock)
router.delete('/:id', delBlock)


// export default router
module.exports = router