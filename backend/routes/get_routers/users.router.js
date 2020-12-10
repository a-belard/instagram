const router = require('express').Router()
const User = require('../../models/user.model')

router.get('/users', async(req,res) => {
    try {
        await User.find()
        .then((users) => res.json(users))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router