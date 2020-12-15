import Axios from 'axios'
import React, { Component } from 'react'
import "./nav.css"
import {withRouter} from 'react-router'

class Nav extends Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            search: ""
        }
    }
    searchandler = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    async componentDidMount(){
        await Axios.get("/users")
        .then(result => {
            this.setState({users: result.data})
        }, error => console.log(error.response.data.msg))
    }

    focusHandler = () => {
        if(this.state.search.length > 0){
            this.filter_div.style.display = "block"
        }
        else{
            this.filter_div.style.display = "none"
        }
    }

    componentDidUpdate = () => {
        if(this.state.search.length > 0){
            this.filter_div.style.display = "block"
        }
        else{
            this.filter_div.style.display = "none"
        }
    }
    contentHandler = async (e) => {
        var name = e.target.id
        localStorage.setItem("page", name)
        window.location.reload()
    }
    logout = () => {
        localStorage.setItem("email","")
        localStorage.setItem("userInPreview","")
        localStorage.setItem("postInPreview","")
        this.props.history.push("/")
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

    toggleLogout = () => {
        this.profile_logout.style.display = "block"
        setTimeout(() => {
            if(this.profile_logout){
                this.profile_logout.style.display = "none"
            }
        },2000)
    }
    render() {
        return (
            <div id="nav_comp">
                <nav>
                    <h1>Instagram</h1>
                    <div id="search">
                        <div id="dropdown_search">
                            <input type="text" name="search" 
                                id="search_input" placeholder="Search" 
                                onChange={this.searchandler} 
                                ref={ref => this.search_input = ref}
                                onFocus={this.focusHandler}
                                onBlur={() => setTimeout(() => this.filter_div.style.display = "none",500)}
                            />
                            <div id="dropdown_filters" ref={ref => this.filter_div = ref}>
                                {this.state.users && this.state.users
                                .filter(user => (user.username.toLowerCase().indexOf(this.state.search.toLowerCase())!==-1) || (user.fullname.toLowerCase().indexOf(this.state.search.toLowerCase())!==-1))
                                .map(user => (
                                    <span onClick={() => this.userRedirect(user.email)}>
                                        <img src={user.url} alt="profile" width="100" height="100" className="profile_avatar"/>
                                        <span>{user.username}<br/>
                                            <span>{user.fullname}</span>
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <i className="fa fa-search"></i>
                    </div>
                    <div id="nav_btns">
                        <i className="fa fa-home" id="home" onClick={this.contentHandler} style={localStorage.page ==="home" ? {color:"rgba(0,0,0,0.8)"}:{}}></i>
                        <i className="fas fa-plus-square" id="newpost" style={{fontSize:"20px"}} onClick={this.contentHandler}></i>
                        <i className="fa fa-heart"></i>
                        <i><img src={this.props.profilePic} alt="profile" width="100" height="100" id="profile" onClick={this.toggleLogout}/></i>
                        <div id="profile_logout" ref={ref => this.profile_logout = ref}>
                            <span onClick={this.contentHandler} id="profile"><i className="fa fa-user-circle-o"></i>&nbsp;&nbsp;Profile</span>
                            <span onClick={this.logout}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logout</span>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default withRouter(Nav)