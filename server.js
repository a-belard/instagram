async function server(){
    const express = require('express')
    const cors = require('cors')
    const mongoose = require('mongoose')
    const path = require('path')

    const app = express()

    //middlewares
    app.use(cors())
    app.use(express.json({limit:"50mb"}))
    app.use(express.urlencoded({limit:"50mb",extended:true}))

    app.use(require('./routes/post_routers/signup_login.router'))
    app.use(require('./routes/post_routers/edit_accountinfo.router'))
    app.use(require('./routes/post_routers/new_post.router'))
    app.use(require('./routes/post_routers/comment_and_like_on_post.router'))
    app.use(require('./routes/post_routers/uncomment_unlike.router'))
    app.use(require('./routes/post_routers/update_profile_pic.router'))
    app.use(require('./routes/get_routers/followers.router'))
    app.use(require('./routes/delete_routers/delete_post.router'))
    app.use(require('./routes/get_routers/users.router'))
    app.use(require('./routes/post_routers/follow.router'))
    app.use(require('./routes/get_routers/following.router'))
    app.use(require('./routes/post_routers/unfollow'))
    app.use(require('./routes/get_routers/posts.router'))
    app.use(require('./routes/get_routers/user.router'))
    app.use(require('./routes/get_routers/commentor.router'))
    app.use(require("./routes/get_routers/post.router"))

    app.get('/', (req, res) => res.send('Hello from Express!'))

    //MONGODB connection 
    const uri = 'mongodb+srv://Belix:Belard2004@cluster0.v27v1.mongodb.net/?retryWrites=true&w=majority'
    await mongoose.connect(uri,{
        useFindAndModify: false,
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("MongoDB Connection Successful"))
    .catch((error) => console.log(error.message))

    if(process.env.NODE_ENV === "production"){
        app.use(express.static('client.build'))

        app.get('*', (req,res) => {
            res.sendFile(path.resolve(__dirname,'client','build','index.html'))
        })
    }

    const port = process.env.PORT || 5000

    app.listen(port, () => console.log(`The server started on port ${port}`))
}
server()