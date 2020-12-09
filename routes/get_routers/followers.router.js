const router = require('express').Router()
const User = require('../../models/user.model')

router.get("/followers:id",async(req,res) => {
    try {
        const id = req.params.id.slice(1)
        const user = await User.findById(id)
        const followers = user.followers
        
        const followersInfo = []
        var followerInfo
        for(i=0;i<followers.length;i++){
            await User.findOne({_id:followers[i].id}).then(result => followerInfo=result)
            followersInfo.push(followerInfo)
        }
        res.json(followersInfo)        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router