const router = require('express').Router()
const Post = require('../../models/post.model')
const User = require('../../models/user.model')

router.post('/uncomment:id',async(req,res) => {
    try {
        const id = req.params.id.slice(1)
        const email = req.body.email
        const user = await User.findOne({email})
        await Post.updateOne({_id:id},{
            $pull : {
                comments: {id:user._id}
            }
        })
        .then(() => res.json({msg: "Comment removed"}))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.post('/unlike:id',async(req,res) => {
    try {
        const id = req.params.id.slice(1)
        const email = req.body.email
        const user = await User.findOne({email})
        await Post.updateOne({_id:id},{
            $pull : {
                likes: {id:user._id}
            }
        })
        .then(() => res.json({msg: "like removed"}))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router