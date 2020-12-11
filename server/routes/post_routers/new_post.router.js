const router = require('express').Router()
const cloudinary = require('../../utils/cloudinary')
const Post = require("../../models/post.model")
const User = require('../../models/user.model')

router.post('/post',async(req,res) => {
    try {
        const email = req.body.email
        const encodedImage = req.body.encodedImage
        const desc = req.body.desc
        
        const imageInfo = await cloudinary.uploader.upload(encodedImage,{upload_preset:"posts"})

        const user = await User.findOne({email})

        const newPost = new Post({
            email,
            public_id: imageInfo.public_id,
            url: imageInfo.url,
            username: user.username,
            userimage: user.url,
            desc,
            type: `${imageInfo.resource_type}/${imageInfo.format}`,
            bytes: imageInfo.bytes
        })
        await User.updateOne({email},{
            $set: {
                posts: user.posts+1
            }
        })
        await newPost.save()
        .then(() => {
            res.json({msg: "posted"})})
        .catch(error => {
            res.status(400).json({msg: error.message})})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router