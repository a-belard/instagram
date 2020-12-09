import Axios from 'axios';
import React, { Component } from 'react'
import './home.css'

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            followers: [],
            posts: [],
            comment: ""
        }
    }
    async componentDidMount(){
        await Axios.get("/followers:"+this.props.user._id)
        .then(response => this.setState({followers: response.data}))
        await this.update()
    }
    update = async () => {
        this.setState({posts: []})
        for(var follower of this.state.followers){
            await Axios.get(`/posts:${follower.email}`)
            .then(async response => this.setState({posts: this.state.posts.concat(response.data)}))
        }
        this.setState({posts: this.state.posts.sort((a,b) => {
            var newpost = new Date(a.createdAt)
            var oldpost = new Date(b.createdAt)
            return oldpost - newpost
        })})
    }

    commentor = async(id) => {
        await Axios.get("/commentor:"+id)
        .then(response => this.userRedirect(response.data))
        .catch(error => console.log(error.response.data.msg))
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

    postRedirect = (id) => {
        localStorage.setItem("postInPreview",id)
        localStorage.setItem("recent",localStorage.page)
        localStorage.setItem("page","postInPreview")
        window.location.reload()
    }

    posttime = (date) => {
        const postdate = new Date(date)
        const today = new Date() 
        var todaytime = Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())
        var posttime = Date.UTC(postdate.getFullYear(),postdate.getMonth(),postdate.getDate())
        var diff = (todaytime-posttime)/1000
        if(diff<60){
            return `${Math.floor(diff)} seconds ago`
        }
        else if(diff>=60 && diff < 3600){
            return `${Math.floor(diff/60)} minutes ago`
        }
        else if(diff>=3600 && diff < (3600*24)){
            return `${Math.floor(diff/(60*60))} hours ago`
        }
        else if(diff>=86400 && diff < (3600*24*7)){
            return `${diff/(60*60*24)} days ago`
        }
        else if(diff>=(3600*24*7) && diff < ((3600*24*7*4)+2)){
            return `${Math.floor(diff/(3600*24*7))} weeks ago`
        }
        else if(diff>=((3600*24*7*4)+2) && diff < (3600*24*7*4*12)){
            return `${Math.floor(diff/(3600*24*7*4))} months ago`
        }
        else {
            return `${Math.floor(diff/(3600*24*7*4*12))} years ago` 
        }
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
        await Axios.post("/comment:"+e.target.id,data)
        .then(async () => await this.update())
        .catch(error => console.log(error.response.data.msg))
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
    }

    render() {
        return (
            <div>
                {this.state.posts && this.state.posts.map(post => {
                    return(
                        <div className="postcontainer">
                            <div className="postcreator">
                                <img src={post.userimage} alt="post creator profile" width="100" height="100" className="profile_avatar"/>
                                <span onClick={() => this.userRedirect(post.email)}>{post.username}</span>
                            </div>
                            <br/>
                            <div className="postinfo">
                                <img src={post.url} alt="post info"/>
                                <div className="postliking">
                                    <span>
                                        <i className={post.likes.some((like) => like.id === this.props.user._id) ? "fas fa-heart" : "far fa-heart"} onClick={this.likeUnlike} id={post._id}></i>
                                        <i className={post.comments.some((comment) => comment.id === this.props.user._id) ? "fas fa-comment" : "far fa-comment"}></i>
                                    </span><br/>
                                    <span>{post.likes.length} likes</span><br/>
                                    <span>
                                        <span>{post.username} </span>
                                        <span>{post.desc && post.desc.split(" ").map(desc => {
                                            if(desc.charAt(0) === "#" || desc.charAt(0) === "@")
                                                return <span className="hashtag lighter">{desc} </span>
                                            return <span className="lighter">{desc} </span>
                                        })}
                                        </span>
                                    </span> 
                                    <br/>
                                    <span className="comments_number" onClick={() => this.postRedirect(post._id)} style={{cursor:"pointer"}}>{post.comments.length > 4 ? `View all ${post.comments.length} comments`:""}</span>
                                    <br/>
                                    {post.comments && post.comments.slice(0,4).map(comment => (
                                        <span style={{display:"block"}}>
                                            <span className="commentor" onClick={() => this.commentor(comment.id)}>{comment.username} </span> 
                                            {comment.comment && comment.comment.split(" ").map(comm => {
                                                if(comm.charAt(0) === "#" || comm.charAt(0) === "@")
                                                    return <span className="hashtag lighter">{comm} </span>
                                                return <span className="lighter">{comm} </span>
                                            })}
                                        </span>
                                    ))}
                                    <br/>
                                    <span className="postduration">{this.posttime(post.createdAt)}</span>
                                </div>
                            </div>
                            <div className="commentform">
                                <form onSubmit={this.submitHandler} id={post._id}>
                                    <input type="text" onChange={this.changeHandler} placeholder="Add a comment..." minLength="1"/>
                                    <input type="submit" value="Post"/>
                                </form>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
