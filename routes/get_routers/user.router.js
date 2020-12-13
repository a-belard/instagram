const router = require('express').Router()
const User = require('../../models/user.model')

router.get('/user:email', async(req,res) => {
    try {
        const email = req.params.email.slice(1)
        await User.findOne({email})
        .then(user => res.json(user))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.post('/userbyid:id', async(req,res) => {
    try {
        const id = req.params.id.slice(1)
        await User.findById(id)
        .then(user => res.json(user))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router