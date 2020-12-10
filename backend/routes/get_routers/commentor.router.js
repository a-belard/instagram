const router = require('express').Router()
const User = require('../../models/user.model')

router.get('/commentor:id', async(req,res) => {
    try {
        const id = req.params.id.slice(1)
        await User.findById(id)
        .then(user => res.json(user.email))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router