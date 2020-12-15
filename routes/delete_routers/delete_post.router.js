const Post = require('../../models/post.model')
const cloudinary = require('../../utils/cloudinary')
const User = require("./../../models/user.model")
const router = require('express').Router()

router.delete("/delete:id", async(req,res) => {
    try {
        const id = req.params.id.slice(1)

        //deleting post
        const post = await Post.findById(id)
        await cloudinary.uploader.destroy(post.public_id)

        const user = await User.findOne({email: post.email})
        await User.updateOne({email: post.email},{
            $set: {
                posts: user.posts-1
            }
        })
    
        //deleting post in database
        await Post.deleteOne({_id:id})
        .then(() => res.json({msg: "Post deleted successfully"}))
        .catch(error => res.status(400).json({msg: error.message}))
     
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router