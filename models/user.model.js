const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {type:String,unique:true},
    fullname: {type:String},
    username: {type:String},
    password: {type:String},
    bio: {type:String},
    profilePic: {type:String},
    url: {type:String},
    posts: {type:Number},
    followers: {type:Array},
    following: {type:Array}
},
{timestamps: true})

const User = mongoose.model("Users",userSchema)
module.exports = User