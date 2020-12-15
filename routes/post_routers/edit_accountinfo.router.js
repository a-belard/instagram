const router  = require('express').Router()
const bycryptjs = require('bcryptjs')
const User = require('../../models/user.model')
const Post = require('../../models/post.model')

router.post("/edit:id",async (req,res) => {
    try {
        const id = req.params.id.slice(1)
        const email = req.body.email
        const fullname = req.body.fullname
        const username = req.body.username
        const bio = req.body.bio
        const password = req.body.password

        const user = await User.findOne({_id:id})
        if(user.email!=email){
            const existEmail = await User.findOne({email})
            if(existEmail){
                return res.status(400).json({msg: "1"})
            }
        }
        if(user.username != username){
            const existUsername = await User.findOne({username})
            if(existUsername){
                return res.status(400).json({msg: "2"})
            }
        }

        //update posts with email
        await Post.updateMany({email: user.email},{
            $set: {
                email,
                username
            }
        })
        .then(() => res.json({msg:"Updated Successfully"}))
        .catch(error  => res.status(400).json({msg: error.message}))

        if(password != ""){
            const salt = await bycryptjs.genSalt(5)
            const hashpswd = await bycryptjs.hash(password,salt)
            await User.updateOne({_id:id},{
                $set: {
                    password: hashpswd
                }
            })
        }
        const updatedRecord = {email,fullname, username, bio}
        await User.updateOne({_id:id},{
            $set: updatedRecord
        })
        .then(() => console.log(updatedRecord))
        .catch(error => res.status(400).json({msg: error.message}))

    } catch (error) {
        res.status(500).json({msg: error.message})
    }

    
})

module.exports = router