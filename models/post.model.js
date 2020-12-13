const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    email: {type:String},
    public_id: {type: String},
    url: {type: String},
    username: {type: String},
    userimage: {type:String},
    type: {type: String},
    desc: {type:String},
    bytes: {type:Number},
    likes: {type:Array},
    comments: {type:Array}
},{
    timestamps: true
})

const Post = mongoose.model('posts',postSchema)

module.exports = Post