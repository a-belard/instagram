import React, { Component } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from './components/login/Login'
import Main from './components/main/Main'
import Signup from './components/signup/Signup'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/" component={Login}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/main" component={Main}/>
        </Switch>
      </Router>
    )
  }
}

