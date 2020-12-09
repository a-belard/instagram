const router = require('express').Router()
const User = require('../../models/user.model')

router.get("/following:id",async(req,res) => {
    try {
        const id = req.params.id.slice(1)
        const user = await User.findById(id)
        const followings = user.following
        
        const followingsInfo = []
        var followingInfo
        for(i=0;i<followings.length;i++){
            await User.findOne({_id:followings[i].id}).then(result => followingInfo=result)
            followingsInfo.push(followingInfo)
        }
        res.json(followingsInfo)        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router