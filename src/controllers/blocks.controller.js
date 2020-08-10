const pool = require('../database')


const getBlocks = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        let params = []
        const {spid} = req.query

        let query = `SELECT b.* `
        let where = ``
        let join  = ``
        let count = `SELECT COUNT(b.id) AS quant FROM blocks b `

        let supertag = null
        let contexts = null
        if (typeof spid !== 'undefined') {
            if (where !== ``) {
                where += ` AND `
            }
            // where += ` id IN (SELECT id_block FROM block_tag WHERE id_tag = ?) `
            query += `, bt.id AS id_block_page `
            query += ` , COALESCE((SELECT GROUP_CONCAT(kw.slug SEPARATOR ', ') FROM tags kw 
            LEFT OUTER JOIN block_tag bt ON bt.id_tag = kw.id 
            WHERE bt.id_block = b.id AND kw.type='K'), '') AS keywords `
            join += ` LEFT OUTER JOIN block_tag bt ON b.id = bt.id_block `
            where += ` bt.id_tag = ?`
            params.push(spid)

            // const query2 = `SELECT * FROM tags WHERE id=?`
            // supertag = await conn.query(query2, [spid]) 

            // const query3 = `SELECT * FROM tags WHERE id IN (SELECT id_super_tag FROM tag_tag WHERE id_sub_tag=?)`
            // contexts = await conn.query(query3, [spid]) 
        }

        query += ` FROM blocks b`

        if (where !== ``) {
            query += join + ` WHERE ` + where
            count += join + ` WHERE ` + where
        }
        query += ` ORDER BY bt.sort`


        let countRows = null
        countRows = await conn.query(count, params) 

        let rows = null
        rows = await conn.query(query, params) 
        let response = {rows}
        if (countRows !== null) {
            // response.supertag = supertag
            // response.contexts = contexts
            response.countRows = countRows
        }

        res.status(200).json(response) 

    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}



const getBlocksOrphans = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        let params = []
        const {spid} = req.query

        let query = `SELECT * FROM blocks WHERE id NOT IN (SELECT id_block FROM block_tag)`
        
        let rows = null

        rows = await conn.query(query, params) 
        let response = {rows}

        res.status(200).json(response) 

    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}


const getBlock = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        const {id} = req.params

        let query = `SELECT * FROM blocks WHERE id = ?`
        let rows = null
        // let params = []

        rows = await conn.query(query, [id]) 
        res.status(200).json({rows}) 

    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}

const addBlock = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        const {link, paragraph, type, spid} = req.body
        let url = '' 
        
        if (typeof req.file !== 'undefined'){
            url = '/uploads/'+req.file.filename
        }

        const query = 'INSERT INTO blocks(url, link, paragraph, type) VALUES(?, ?, ?, ?)'
        const result = await conn.query(query, [url, link, paragraph, type])   
        const idBlock = result.insertId
        // let sbid = ''
        if (typeof spid !== 'undefined') {

            const query1_5 = 'SELECT COUNT(id) AS blocksCount FROM block_tag WHERE id_tag=?'
            const result1_5 = await conn.query(query1_5, [spid])  
            const sort = result1_5[0].blocksCount

            const query2 = 'INSERT INTO block_tag(id_block, id_tag, sort) VALUES(?, ?, ?)'
            const result2 = await conn.query(query2, [idBlock, spid, sort])  
            result.result2 = result2
        }

        res.status(200).json(result)

    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}



const delBlock = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        const {id} = req.params

        // let query = `DELETE FROM blocks WHERE id=?`
        let query = `DELETE FROM block_tag WHERE id=?`

        let rows = null
        // let params = []

        rows = await conn.query(query, [id]) 
        res.status(200).json({rows}) 
    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}


const updateBlock = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        const {id} = req.params
        const {link, paragraph, type} = req.body
        let url = '' 

        let params = []

        let query = `UPDATE blocks SET `
        
        if (typeof req.file !== 'undefined'){
            url = '/uploads/'+req.file.filename
            query += ` url=?, `
            params.push(url)
        }

        query += ` link=?, paragraph=?, type=? WHERE id=?`

        params.push(link)
        params.push(paragraph)
        params.push(type)
        params.push(id)

        const result = await conn.query(query, params)   
        // const idTag = result.insertId
        res.status(200).json(result)

    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}


const addKeyword = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        const {ids, tag} = req.body
        const lowertag = tag.toLowerCase()
        let query = 'SELECT * FROM tags WHERE LOWER(slug)=?'
        const rows = await conn.query(query, [lowertag])   

        let idArray = []
        let blockArray = []

        if (typeof ids !== 'undefined') {
            idArray = ids.split(',')
        }
            
        let idTag = 0
        let result = null
        if (rows.length > 0) {
            idTag = rows[0].id
            query = 'SELECT * FROM block_tag WHERE id_block=? AND id_tag=?'
            for (let i = 0; i < idArray.length; i++) {
                result = await conn.query(query, [idArray[i], idTag]) 
                if (result.length === 0) {
                    blockArray.push(idArray[i])
                }
            }
        } else {
            blockArray = idArray
            if (blockArray.length > 0) {
                query = 'INSERT INTO tags(slug) VALUES(?)'
                result = await conn.query(query, [tag])   
                idTag = result.insertId
            }
        }

        if (blockArray.length > 0) {
            query = 'INSERT INTO block_tag(id_block, id_tag) VALUES(?, ?)'
            for (let i = 0; i < blockArray.length; i++) {
                result = await conn.query(query, [blockArray[i], idTag])  
            }
            res.status(200).json(result)     
        } else {
            res.status(200).json(result)     
        }

    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}



const sortBlocksInPage = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        const blocksPageIds = req.body.blocksIds

        const query = 'UPDATE block_tag SET sort=? WHERE id=?'
        let result = null

        for (const [i, id] of blocksPageIds.entries()) {
            result = await conn.query(query, [i, id])
        }
        res.status(200).json(result)


    } catch (error) {
        // next(error)
        // throw error
        console.log(error)
    } finally {
        if (conn) {
            conn.end()
        }
    }
}

module.exports = {
    getBlocks,
    getBlock,
    addBlock,
    delBlock,
    updateBlock,
    getBlocksOrphans,
    addKeyword,
    sortBlocksInPage
}