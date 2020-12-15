import Axios from 'axios';
import React, { Component } from 'react'
import './profile.css'

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state ={
            followers: [],
            following: [],
            posts: [],
        }
    }
    async componentDidMount(){
        await Axios.get(`/followers:${this.props.user._id}`)
        .then(result => this.setState({followers: result.data}))
        .catch(error => console.log(error.response.data.msg))
        await Axios.get(`/following:${this.props.user._id}`)
        .then(result => this.setState({following: result.data}))
        .catch(error => console.log(error.response.data.msg))
        await Axios.get(`/posts:${localStorage.email}`)
        .then(result => this.setState({posts:result.data}))
        .catch(error => console.log(error.response.data.msg))
        this.setState({posts: this.state.posts.sort((a,b) => {
            var newpost = new Date(a.createdAt)
            var oldpost = new Date(b.createdAt)
            return oldpost - newpost
        })})
    }

    editprofile = () => {
        localStorage.setItem("page","edit_profile")
        window.location.reload()
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
    render() {
        return (
            <div>
                <div id="profile_content">
                    <div id="info">
                        <img src={this.props.user.url} alt="profile" id="prof_pic"/>
                        <div id="inner_info">
                            <span id="username">{this.props.user.username}</span>
                            <button onClick={this.editprofile}>Edit Profile</button>
                            <br/>
                            <p>
                                <section>
                                    {this.props.user.posts} <span>posts</span> 
                                </section>
                                <section>
                                    <span id="followers_nbr">{this.props.user.followers.length}</span> <span>followers</span>
                                    <div id="followers_dropdown">
                                        {this.state.followers && this.state.followers.map(follower => (
                                            <span onClick={() => this.userRedirect(follower.email)}>
                                                <img src={follower.url} alt="profile" width="100" height="100" className="profile_avatar"/>
                                                <span>{follower.username}
                                                    <button>{this.state.following.includes({email: follower.email}) ? "Following":"Follow"}</button><br/>
                                                    <span>{follower.fullname}</span>
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <span id="following_nbr">{this.props.user.following.length}</span> <span>following</span>
                                    <div id="following_dropdown">
                                        {this.state.following && this.state.following.map(following => (
                                            <span onClick={() => this.userRedirect(following.email)}>
                                                <img src={following.url} alt="profile" width="100" height="100" className="profile_avatar"/>
                                                <span>{following.username}<br/>
                                                    <span>{following.fullname}</span>
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </p>
                            <br/>
                            <p id="fullname">{this.props.user.fullname}</p>
                            <p id="bio">{this.props.user.bio}</p>
                        </div>
                    </div>
                    <br/>
                    <hr/>
                    <h5>POSTS</h5>
                    <div id="posts">
                        {this.state.posts && this.state.posts.map(post => (
                            <div className="post_handler" onClick={() => this.postRedirect(post._id)}>
                                <img src={post.url} alt="me" width="290" height="290" className="post_item"/>
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
