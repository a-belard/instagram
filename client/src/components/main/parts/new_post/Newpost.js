import React, { Component } from 'react'
import './newpost.css'
import Axios from 'axios'

export default class Newpost extends Component {
    constructor(props){
        super(props)
        this.state = {
            imagePreview: "",
            desc: ""
        }
    }

    changeHandler = (e) => {
        this.setState({desc: e.target.value})
    }

    imageChange = (e) => {
        var file = e.target.files[0]
        this.preview(file)
    }

    preview = (file) => {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            if(reader.result.slice(5,10) !== "image"){
                alert("Unsupported file format!")
            }
            else{
                this.setState({imagePreview: reader.result})
            }
        }
    }

    submitHandler = (e) => {
        e.preventDefault()
        this.upload(this.state.imagePreview)
    }
    upload = async (encodedImage) => {
        var data = {
            email: this.props.user.email,
            desc: this.state.desc,
            encodedImage
        }
        await Axios.post("/post",data)
        .then(() => {
            localStorage.setItem("page","profile")
            window.location.reload()
        })
        .catch(error => console.log(error.response.data.msg))
    }
    render() {
        return (
            <div id="new_post_div">
                <div className="image_container">
                    <i className="fa fa-upload"></i>
                    <span> Choose your image</span>
                    <br/>
                    <br/>
                    <div className="imagecontainer">
                        <img src={this.state.imagePreview} alt=""/>
                    </div>
                    <form onSubmit={this.submitHandler}>
                        <label htmlFor="imagechoice">Browse..</label>
                        <input type="file" name="imagechoice" id="imagechoice" onChange={this.imageChange}/>
                        <br/>
                        <input type="text" name="desc" id="desc" autoFocus placeholder={`What's on your mind, ${this.props.user.username}?`} onChange={this.changeHandler}/>
                        <br/>
                        <input type="submit" value="POST"/>
                    </form>
                </div>
            </div>
        )
    }
}
