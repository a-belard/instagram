const router = require('express').Router()
const Post = require('../../models/post.model')

router.get('/posts:email',async (req,res) => {
    try {
        const email = req.params.email.slice(1)
        await Post.find({email})
        .then(posts => res.json(posts))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router
