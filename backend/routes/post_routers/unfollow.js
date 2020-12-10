const router = require('express').Router()
const User = require('../../models/user.model')

router.post('/unfollow:id',async(req,res) => {
    try {
        const email = req.body.email
        const id = req.params.id.slice(1)
    
        const user = await User.findOne({email})
        
        await User.updateOne({email},{
            $pull: {
                followers: {id}
            }
        })
        
        await User.updateOne({_id:id},{
            $pull: {
                following: {id:user._id}
            }
        })
        .then(() => res.json({msg: "Stopped following"}))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router