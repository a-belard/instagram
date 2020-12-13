const router = require('express').Router()
const Post = require('../../models/post.model')

router.get('/post:id',async (req,res) => {
    try {
        const id = req.params.id.slice(1)
    
        await Post.findById(id)
        .then(post => res.json(post))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router
