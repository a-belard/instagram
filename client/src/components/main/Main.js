import Axios from 'axios'
import React, { Component } from 'react'
import "./main.css"
import Home from './parts/home/Home'
import Nav from './parts/nav/Nav'
import Profile from './parts/profile/Profile'
import Editprofile from './parts/edit_profile/Editprofile'
import User from './parts/user_page/User'
import Post from './parts/post_preview/Post'
import Newpost from './parts/new_post/Newpost'

export default class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            page: "",
            user: {}
        }
    }
    async componentDidMount(){
        if(localStorage.email !== ""){
            await Axios.get("/user:"+localStorage.email)
            .then(user => {
                this.setState({user: user.data})
            })
            switch(localStorage.page){
                case "home": this.setState({page: <Home user={this.state.user}/>})
                break
                case "profile": this.setState({page: <Profile user={this.state.user}/>})
                break
                case "edit_profile": this.setState({page: <Editprofile user={this.state.user}/>})
                break
                case "userInPreview": this.setState({page: <User user={this.state.user}/>})
                break
                case "postInPreview": this.setState({page: <Post user={this.state.user}/>})
                break
                case "newpost": this.setState({page: <Newpost/>})
                break
                default: this.setState({page: <Home user={this.state.user}/>})
                break
            }
        }
        else{
            this.props.history.push("/")
        }
    }
    render() {
        if(localStorage.email !== ""){
            return (
                <div>
                    <Nav active_component="home" profilePic={this.state.user.url}/>
                    <br/><br/>
                    {this.state.page}
                </div>
            )
        }
        else{
            return (
                <div> </div>
            )
        }
    }
}
