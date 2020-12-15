import React, { Component } from 'react'
import "./signup.css"
import Axios from 'axios'

export default class Signup extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            fullname: "",
            username:"",
            password: "",
            emailError: "",
            usernameError: "",
        }
    }

    componentDidMount(){
        if(!!localStorage.email && localStorage.email !== ""){
            this.props.history.push("/main")
        }
    }

    changehandler = (e) => {
        let name = e.target.name 
        let value = e.target.value
        this.setState({
            [name]: value
        })
    }
    red_login = () => {
        this.props.history.push("/login")
    }
    submithandler = async(e) => {
        e.preventDefault()
        this.setState({
            emailError: "",
            usernameError: ""
        })
        const user = {
            email: this.state.email,
            fullname: this.state.fullname,
            username: this.state.username,
            password: this.state.password
        }

        await Axios.post('/signup',user)
        .then(result => {
            localStorage.setItem("email",user.email)
            localStorage.setItem("page","profile")
            this.props.history.push("/main")
        })
        .catch(error => {
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
        if(!!localStorage.email && localStorage.email !== ""){
            return(<h1> </h1>)
        }
        else{
            return (
                <div id="signup_page">
                    <form className="signup_form" onSubmit={this.submithandler}>
                        <h1>Instagram</h1>
                        <p>Sign up to see photos and videos <br/> from your friends</p>
                        <br/>
                        <input type="email" name="email" id="email" placeholder="Email" required maxLength="25" onChange={this.changehandler}/>
                        <br/>
                        <span className="error">{this.state.emailError}</span>
                        <br/>
                        <input type="text" name="fullname" id="fullname" placeholder="Full Name" required maxLength="50" onChange={this.changehandler}/>
                        <br/>
                        <input type="text" name="username" id="username" placeholder="Username" required maxLength="15" onChange={this.changehandler}/>
                        <br/>
                        <span className="error">{this.state.usernameError}</span>
                        <br/>
                        <input type="password" name="password" id="password" placeholder="Password" maxLength="12" minLength="6" onChange={this.changehandler}/>
                        <br/>
                        <input type="submit" value="Sign Up"/>
                        <br/>
                        <p id="term_data">By signing up, you agree to our <span className="terms">Terms, Data <br/>
                         Policy</span> and <span className="terms">Cookies Policy</span> </p>
                    </form>
                    <div>
                        <p>Have an account? <span onClick={this.red_login}>Log in</span></p>
                    </div>
                    <p id="developer">Cloned by Belix Pro</p>
                </div>
            )    
        }
    }
}
