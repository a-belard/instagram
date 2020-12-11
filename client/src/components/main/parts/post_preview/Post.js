import Axios from 'axios'
import React, { Component } from 'react'
import './post.css'

export default class Post extends Component {
    constructor(props){
        super(props)
        this.state = {
            post: {},
            comment: "",
            likes: [],
            profileImg: ""
        }
    }

    async componentDidMount(){
        await this.update()
    }

    update = async() => {
        this.setState({
            likes: []
        })
        await Axios.get("/post:"+localStorage.postInPreview)
        .then(async response => this.setState({post: response.data}))
        .catch(error => console.log(error.response.data.msg))
        await this.getlikes()
    }

    getlikes = async() => {
        var likescontainer = []
        for(var like of this.state.post.likes){
            await Axios.post('/userbyid:'+like.id,{})
            .then(async data => await likescontainer.push(data.data))
            .catch(error => console.log(error.response.data.msg))
        }
        this.setState({likes: likescontainer})
    }

    userRedirect = (email) => {
        if(email === localStorage.email){
            localStorage.setItem("page", "profile")
            window.location.reload()
        }
        else{
        localStorage.setItem("userInPreview",email)
        localStorage.setItem("page","userInPreview")
        window.location.reload()
        }
    }

    getProfile = async (e) => {
        await Axios.post("/userbyid:"+e.target.id, {})
        .then((response) => this.setState({profileImg: response.data.url}))
        console.log(this.state.profileImg)
    }

    commentor = async(id) => {
        await Axios.get("/commentor:"+id)
        .then(response => this.userRedirect(response.data))
        .catch(error => console.log(error.response.data.msg))
    }

    closeModal = () => {
        localStorage.setItem("page",localStorage.recent)
        window.location.reload()
    }

    likeUnlike = async(e) => {
        e.preventDefault()
        var recent = e.target.className
        var data = {
            email: localStorage.email
        }
        if(recent==="far fa-heart"){
            await Axios.post("/like:"+e.target.id,data)
            .then(async() => await this.update())
            .catch(error => console.log(error.response.data.msg))
        }
        else if(recent==="fas fa-heart"){
            await Axios.post("/unlike:"+e.target.id,data)
            .then(async () => await this.update())
            .catch(error => console.log(error.response.data.msg))
        }
        else{
            console.log()
        }
        window.location.reload()
    }

    changeHandler = (e) => {
        this.setState({
            comment: e.target.value
        })
    }

    submitHandler = async (e) => {
        e.preventDefault()
        var data = {
            comment: this.state.comment,
            email: localStorage.email,
        }
        await Axios.post("/comment:"+this.state.post._id,data)
        .then(async () => {
            this.commentinput.value = ""
            await this.update()
        })
        .catch(error => console.log(error.response.data.msg))
    }

    descAvailable = () => {
        if(this.state.post.desc !== ""){
            return (
                <div id="desc_container">
                    <span className="commentor">{this.state.post.username} </span> 
                    {this.state.post.desc && this.state.post.desc.split(" ").map(comm => {
                        if(comm.charAt(0) === "#" || comm.charAt(0) === "@")
                            return <span className="hashtag lighter">{comm} </span>
                        return <span className="lighter">{comm} </span>
                    })}
                </div>
            )
        }
    }

    commentorImage = async(id) => {
        var image = ""
        await Axios.post("/userbyid:"+id,{})
        .then(response => image=response.data.url)
        .catch(error => console.log(error.response.data.msg))
        return (
            <div>
                {image && (<img src={image} alt=" "></img>)}
            </div>
        )
    }
    render() {
        return (
            <div id="page_post_container">
                <i className="fa fa-close" style={{fontSize:"30px"}} onClick={this.closeModal}></i>
                <div id="inner_post_container">
                    <img src={this.state.post.url} alt="post preview"/>
                    <div id="inner_post_info">
                        <div className="postcreator">
                            <img src={this.state.post.userimage} alt="post creator profile" width="130" height="130" className="profile_avatar"/>
                            <span onClick={() => this.userRedirect(this.state.post.email)}>{this.state.post.username}</span>
                        </div>
                        <div id="comments_container">
                            {this.descAvailable()}
                            {this.state.post.comments && this.state.post.comments.map(comment => (
                                <span style={{display:"block"}}>
                                    {this.commentorImage(comment.id)}
                                    <span className="commentor" onClick={() => this.commentor(comment.id)}>{comment.username} </span> 
                                    {comment.comment && comment.comment.split(" ").map(comm => {
                                        if(comm.charAt(0) === "#" || comm.charAt(0) === "@")
                                            return <span className="hashtag lighter">{comm} </span>
                                        return <span className="lighter">{comm} </span>
                                    })}
                                </span>
                            ))}
                        </div>
                        <br/>
                        <span>
                            {this.state.post.likes && (
                                <i className={this.state.post.likes.some((like) => like.id === this.props.user._id) ? "fas fa-heart" : "far fa-heart"} onClick={this.likeUnlike} id={this.state.post._id}></i>
                            )}
                            {this.state.post.comments && (
                                <i className={this.state.post.comments.some((comment) => comment.id === this.props.user._id) ? "fas fa-comment" : "far fa-comment"}></i>
                            )}
                        </span><br/>
                        {this.state.likes && (
                            this.state.likes.length !== 0 ? 
                                <div className="likers">
                                {this.state.likes[0] && (<img src={this.state.likes[0].url} style={{cursor:"pointer"}} onClick={() => this.userRedirect(this.state.likes[0].email)} alt="profile like" width="25" height="25"></img>)}
                                <span>
                                    Liked by  
                                    {this.state.likes[0] && (<span onClick={() => this.userRedirect(this.state.likes[0].email)} style={{cursor:"pointer"}}> {this.state.likes[0].username}</span>)}
                                    {this.state.likes.length>1 ? " and ": ""}
                                    <span id="likes_number"> {this.state.likes.length>1 ? this.state.likes.length-1 + " others": ""}</span>
                                    <div id="following_dropdown" className="likers_dropdown">
                                        {this.state.likes && this.state.likes.map(like => (
                                            <span onClick={() => this.userRedirect(like.email)}>
                                                <img src={like.url} alt="profile" width="100" height="100" className="profile_avatar"/>
                                                <span>{like.username}<br/>
                                                    <span>{like.fullname}</span>
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </span>
                            </div>
                            :
                            ""
                        )}
                    {this.state.post && (<span className="postduration durationofpost">{`${new Date(this.state.post.createdAt).toDateString().slice(4,10)}`}</span>)}
                    </div>
                    <br/>
                    <div className="postcommentform">
                        <form onSubmit={this.submitHandler}>
                            <input type="text" placeholder="Add a comment..." minLength="1" onChange={this.changeHandler} ref={ref => this.commentinput = ref}/>
                            <input type="submit" value="Post"/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
