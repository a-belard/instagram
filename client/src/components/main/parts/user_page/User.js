import Axios from 'axios';
import React, { Component } from 'react'
import './user.css'

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state ={
            user: {},
            followers: [],
            following: [],
            posts: [],
            follow_unfollow:""
        }
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
    async componentDidMount(){
        await Axios.get("/user:"+localStorage.userInPreview)
        .then(response => this.setState({user: response.data}))
        .catch(error => console.log(error.response.data.msg))
        
        await Axios.get(`/following:${this.state.user._id}`)
        .then(result => this.setState({following: result.data}))
        .catch(error => console.log(error.response.data.msg))
 
        await Axios.get(`/posts:${this.state.user.email}`)
        .then(result => this.setState({posts:result.data}))
        .catch(error => console.log(error.response.data.msg))
        .catch(error => console.log(error.response.data.msg))
        this.setState({posts: this.state.posts.sort((a,b) => {
            var newpost = new Date(a.createdAt)
            var oldpost = new Date(b.createdAt)
            return oldpost - newpost
        })})
        await this.update()
    }
    update = async () => {
        await Axios.get(`/followers:${this.state.user._id}`)
        .then(result => this.setState({followers: result.data}))
        .catch(error => console.log(error.response.data.msg))

        await this.follow()
    }

    follow_unfollow = async(e) => {
        this.follow_unfollow_btn.disabled = true
        this.follow_unfollow_btn.style.opacity = 0.8
        var data = {email: this.state.user.email}
        if(this.state.follow_unfollow==="Follow"){
            await Axios.post("/follow:"+this.props.user._id,data)
            .then(() => {
                this.update()
            })
            .catch(error => console.log(error.response.data.msg))
        }
        if(this.state.follow_unfollow==="Unfollow"){
            await Axios.post("/unfollow:"+this.props.user._id,data)
            .then(() => {
                this.update()
            })
            .catch(error => console.log(error.response.data.msg))
        }
        this.update()
        this.follow_unfollow_btn.style.opacity = 1
        this.follow_unfollow_btn.disabled = false
    }

    follow = async() => {
        var isFollowing = await this.state.followers.some((follower) => follower.email === localStorage.email)
        if(isFollowing){
            this.setState({follow_unfollow: "Unfollow"})
        }
        else{
            this.setState({follow_unfollow: "Follow"})
        }
    }

    postRedirect = (id) => {
        localStorage.setItem("postInPreview",id)
        localStorage.setItem("recent",localStorage.page)
        localStorage.setItem("page","postInPreview")
        window.location.reload()
    }

    render() {
        return (
            <div>
                <div id="profile_content">
                    <div id="info">
                        <img src={this.state.user.url} alt="" id="prof_pic"/>
                        <div id="inner_info">
                            <span id="username">{this.state.user.username}</span>
                            <button onClick={this.follow_unfollow} id="follow_unfollow_btn" ref={ref => this.follow_unfollow_btn = ref}>{this.state.follow_unfollow}</button>
                            <br/>
                            <p>
                                <section>
                                    {this.state.user.posts} <span>posts</span> 
                                </section>
                                <section>
                                    <span id="followers_nbr">{this.state.followers.length}</span> <span>followers</span>
                                    <div id="followers_dropdown">
                                        {this.state.followers && this.state.followers.map(follower => (
                                            <span onClick={() => this.userRedirect(follower.email)}>
                                                <img src={follower.url} alt="" width="100" height="100" className="profile_avatar"/>
                                                <span>{follower.username}<br/>
                                                    <span>{follower.fullname}</span>
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <span id="following_nbr">{this.state.following.length}</span> <span>following</span>
                                    <div id="following_dropdown">
                                        {this.state.following && this.state.following.map(following => (
                                            <span onClick={() => this.userRedirect(following.email)}>
                                                <img src={following.url} alt="" width="100" height="100" className="profile_avatar"/>
                                                <span>{following.username}<br/>
                                                    <span>{following.fullname}</span>
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </p>
                            <br/>
                            <p id="fullname">{this.state.user.fullname}</p>
                            <p id="bio">{this.state.user.bio}</p>
                        </div>
                    </div>
                    <br/>
                    <hr/>
                    <h5>POSTS</h5>
                    <div id="posts">
                        {this.state.posts && this.state.posts.map(post => (
                            <div className="post_handler" onClick={() => this.postRedirect(post._id)}>
                                <img src={post.url} alt="" width="290" height="290" className="post_item"/>
                                <p className="post_details">
                                    <i className="fas fa-heart"></i>
                                    <span>{post.likes.length}</span>
                                    <i className="fas fa-comment"></i>
                                    <span>{post.comments.length}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
