import Axios from 'axios'
import React, { Component } from 'react'
import "./edit_profile.css"
import {withRouter} from 'react-router'

class Editprofile extends Component {
    constructor(props){
        super(props)
        this.state = {
            fullname: this.props.user.fullname,
            username: this.props.user.username,
            email: this.props.user.email,
            bio: this.props.user.bio,
            password: "",
            emailError: "",
            usernameError: "",
            profileUrl: this.props.user.url
        }
    }

    profileChangeHandler = async(e) => {
        var file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async() => {
            const data = {
                encodedImage: reader.result
            }
            if(reader.result.slice(5,10) === "image"){
            this.setState({profileUrl: reader.result})
            await Axios.post("/edit/profilepic:"+this.props.user._id,data)
            .catch( error => console.log(error.response.data.msg))
            }
            else(alert("Unsupported format!"))
        }
    }

    changeHandler = (e) => {
        var name = e.target.name
        var value = e.target.value
        this.setState({
            [name]: value
        })
    }
    submitHandler = async(e) => {
        e.preventDefault()
        this.setState({
            emailError: "",
            usernameError: ""
        })
        const data = {
            email: this.state.email,
            fullname: this.state.fullname,
            username: this.state.username,
            password: this.state.password,
            bio: this.state.bio
        }
        await Axios.post("/edit:"+this.props.user._id, data)
        .then(() => {
            localStorage.setItem("email",data.email)
            localStorage.setItem("page","profile")
            window.location.reload()
        })
        .catch( error => {
            if(error.response.data.msg === "1"){
                this.setState({
                    emailError: "Email already exists!"
                })
            }
            if(error.response.data.msg === "2"){
                this.setState({
                    usernameError: "Username taken!"
                })
            }
        })
    }
    render() {
        return (
            <div id="editprofile_page">
                <div id="profileInfo">
                <img src={this.state.profileUrl} alt="profile" width="200" height="200" className="profile_avatar"/>
                <p>
                    <span>{this.props.user.username}</span><br/>
                    <span onClick={this.changeProfile}><label htmlFor="profilePicture">Change Profile Photo</label></span>
                    <input type="file" id="profilePicture" onChange={this.profileChangeHandler}/>
                </p>
                </div>
                <form onSubmit={this.submitHandler}>
                    <label htmlFor="fullname">Name</label>
                    <input type="text" defaultValue={this.props.user.fullname} id="fullname" required maxLength="50" minLength="2" name="fullname" onChange={this.changeHandler}/>
                    <br/>
                    <label htmlFor="username">Username</label>
                    <input type="text" defaultValue={this.props.user.username} id="username" required maxLength="12" minLength="2" name="username" onChange={this.changeHandler}/>
                    <br/>
                    <span className="error">{this.state.usernameError}</span>
                    <br/>     
                    <label htmlFor="bio">Bio</label>
                    <textarea name="bio" defaultValue={this.props.user.bio} id="bio" cols="30" rows="3" name="bio" onChange={this.changeHandler}></textarea><br/>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" required defaultValue={this.props.user.email} onChange={this.changeHandler}/>
                    <br/>
                    <span className="error">{this.state.emailError}</span>
                    <br/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" minLength="6" maxLength="12" onChange={this.changeHandler}/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
}

export default withRouter(Editprofile )