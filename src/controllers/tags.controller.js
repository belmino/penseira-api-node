const pool = require('../database')

const getTags = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        const {type, spid} = req.query
        let params = []

        let query = `SELECT * FROM tags `
        let where = ``

        let supertag = null
        if (typeof spid !== 'undefined') {
            if (where !== ``) {
                where += ` AND `
            }
            where += ` id IN (SELECT id_sub_tag FROM tag_tag WHERE id_super_tag = ?) `
            params.push(spid)

            const query2 = `SELECT * FROM tags WHERE id=?`
            supertag = await conn.query(query2, [spid]) 
        }

        if (typeof type !== 'undefined') {
            if (where !== ``) {
                where += ` AND `
            }
            where += ` type = ? `
            // query += ` WHERE type = ?`
            params.push(type)
        }

        if (where !== ``) {
            query += ` WHERE ` + where
        }

        let rows = null

        rows = await conn.query(query, params) 
        let response = {rows}
        if (supertag !== null) {
            response.supertag = supertag
        }
        res.status(200).json(response) 
        // res.status(200).json({rows, total: count[0].total}) 

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


const getTag = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        const {id} = req.params

        let query = `SELECT * FROM tags WHERE id=?`

        let row = null
        let contexts = null
        // let params = []

        row = await conn.query(query, [id]) 


        const query3 = `SELECT * FROM tags WHERE id IN (SELECT id_super_tag FROM tag_tag WHERE id_sub_tag=?)`
        contexts = await conn.query(query3, [id]) 

        res.status(200).json({row, contexts}) 
        // res.status(200).json({rows, total: count[0].total}) 

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


const addTag = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        const {slug, title, type, spid} = req.body

        const query = 'INSERT INTO tags(slug, title, type) VALUES(?, ?, ?)'
        const result = await conn.query(query, [slug, title, type])   
        const idTag = result.insertId
        
        let sbid = ''
        if (typeof spid !== 'undefined') {
            sbid = idTag
        }

        if (sbid !== '') {
            const query2 = 'INSERT INTO tag_tag(id_super_tag, id_sub_tag) VALUES(?, ?)'
            const result2 = await conn.query(query2, [spid, sbid])  
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

const addSubTag = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        const {id, tag} = req.body
        const lowertag = tag.toLowerCase()
        let query = 'SELECT * FROM tags WHERE LOWER(slug)=?'
        const rows = await conn.query(query, [lowertag])        

        let idTag = 0
        let result = null
        if (rows.length > 0) {
            idTag = rows[0].id
            query = 'SELECT * FROM tag_tag WHERE id_super_tag=? AND id_sub_tag=?'
            result = await conn.query(query, [id, idTag]) 
            if (result.length > 0) {
                idTag = 0
            }
        } else {
            query = 'INSERT INTO tags(slug) VALUES(?)'
            result = await conn.query(query, [tag])   
            idTag = result.insertId
        }

        if (idTag !== 0) {
            query = 'INSERT INTO tag_tag(id_super_tag, id_sub_tag) VALUES(?, ?)'
            result = await conn.query(query, [id, idTag])  
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

const delTag = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        const {id} = req.params

        let query = `DELETE FROM tags WHERE id=?`

        let rows = null
        // let params = []

        rows = await conn.query(query, [id]) 
        res.status(200).json({rows}) 
        // res.status(200).json({rows, total: count[0].total}) 

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


const updateTag = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        const {id} = req.params
        const {slug, title, type} = req.body

        let query = `UPDATE tags SET slug=?, title=?, type=? WHERE id=?`

        let rows = null
        // let params = []

        rows = await conn.query(query, [slug, title, type, id]) 
        res.status(200).json({rows}) 
        // res.status(200).json({rows, total: count[0].total}) 

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
    getTags,
    getTag,
    addTag,
    delTag,
    updateTag,
    addSubTag
}