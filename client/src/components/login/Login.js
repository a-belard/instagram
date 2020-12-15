import Axios from 'axios'
import React, { Component } from 'react'
import './login.css'

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            error: ""
        }
    }

    componentDidMount(){
        if(!!localStorage.email && localStorage.email !== ""){
            this.props.history.push("/main")
        }
    }
    changehandler = (e) => {
        var name = e.target.name
        var value = e.target.value
        this.setState({
            [name]: value
        })
    }
    submithandler = async(e) => {
        e.preventDefault()
        const user = {
            email: this.state.email,
            password: this.state.password
        }
        await Axios.post('/login',user)
        .then(response => {
            localStorage.setItem("email",response.data.user)
            localStorage.setItem("page","home")
            this.props.history.push("/main")
        })
        .catch(error => this.setState({error: <span id="error">{error.response.data.msg}</span>}))
    }
    render() {
        if(!!localStorage.email && localStorage.email !== ""){
            return(<h1> </h1>)
        }
        else{
            return (
                <div id="signup_page">
                    <form className="signup_form login_form" onSubmit={this.submithandler}>
                        <h1>Instagram</h1>
                        {this.state.error}
                        <br/>
                        <input type="email" name="email" id="email" placeholder="Email" required maxLength="25" onChange={this.changehandler}/>
                        <br/>
                        <input type="password" name="password" id="password" placeholder="Password" required maxLength="12" minLength="6" onChange={this.changehandler}/>
                        <br/>
                        <input type="submit" value="Login"/>
                    </form>
                    <div>
                        <p>No account? <span onClick={() => this.props.history.push('/signup')}>Sign up</span></p>
                    </div><br/><br/><br/><br/><br/><br/><br/><br/>
                    <p id="developer">Cloned by Belix Pro</p>
                </div>
            )
        }
    }
}
