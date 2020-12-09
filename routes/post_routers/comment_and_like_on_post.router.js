const router = require('express').Router()
const Post = require('../../models/post.model')
const User = require('../../models/user.model')

router.post("/comment:id",async (req,res) => {
    try {
        const post_id = req.params.id.slice(1) 
        const email = req.body.email 
        const comment = req.body.comment

        const user = await User.findOne({email})
        await Post.updateOne({_id: post_id},{
            $push: {
                comments: {id:user._id,username: user.username,comment}
            }
        })
        .then(() => res.json({msg: "Comment Added"}))
        .catch((error) => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.post("/like:id",async (req,res) => {
    try {
        const post_id = req.params.id.slice(1)
        const email = req.body.email 
        const user = await User.findOne({email})
        await Post.updateOne({_id: post_id},{
            $push: {
                likes: {id:user._id}
            }
        })
        .then(() => res.json({msg: "Like Added"}))
        .catch((error) => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router