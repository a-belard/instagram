const router = require('express').Router()
const bycryptjs = require('bcryptjs')
const User = require('../../models/user.model')

router.post('/signup',async (req,res) => {
    try {
        const email = req.body.email;
        const fullname = req.body.fullname;
        const username = req.body.username;
        const password = req.body.password;
        const url = "https://res.cloudinary.com/belix-pro/image/upload/v1606477158/profile_pictures/default_image_cwjlca.png"

        //check presence
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({msg: "1"})
        }
        const existUsername = await User.findOne({username})
        if(existUsername){
            return res.status(400).json({msg: "2"})
        }

        //password encryption
        const salt = await bycryptjs.genSalt(5)
        const hashpswd = await bycryptjs.hash(password,salt)

        
        
        //create new user
        const newUser = new User({email,fullname,username,password:hashpswd,url,posts: 0})
        await newUser.save()
        .then(() => res.json({user:newUser.email}))
        .catch(error => res.status(400).json({msg: error.message}))
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.post('/login',async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email})

        //authentication
        if(!user){
            return res.status(400).json({msg: "Incorrect email or password!"})
        }
        var isPassword = await bycryptjs.compare(password,user.password)
        if(isPassword){
            return res.json({user:user.email})
        }
        else{
            return res.status(400).json({msg: "Incorrect email or password!"})
        }
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router