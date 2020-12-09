const router = require('express').Router()
const Post = require('../../models/post.model')
const User = require('../../models/user.model')
const cloudinary = require('../../utils/cloudinary')

router.post('/edit/profilepic:id',async(req,res) => {
    try {
        const id = req.params.id.slice(1)
        const profilepic = req.body.encodedImage

        //uploading new image
        const imageInfo = await cloudinary.uploader.upload(profilepic,{upload_preset:"profile_pictures"})
        
        //deleting old image
        const user = await User.findById(id)
        if(user.url != "https://res.cloudinary.com/belix-pro/image/upload/v1606477158/profile_pictures/default_image_cwjlca.png"){
            await cloudinary.uploader.destroy(user.profilePic)
        }

        //updating profilePic in database
        await User.updateOne({_id: id},{
            $set: {
                profilePic: imageInfo.public_id,
                url: imageInfo.url
            }
        })
        await Post.updateMany({email:user.email},{
            $set: {
                userimage: imageInfo.url
            }
        })
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router