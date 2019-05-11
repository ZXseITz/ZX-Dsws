import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navigation from "./components/Navigation"
import Home from "./components/Home"
import Block from "./components/Block";
import Category from "./components/Category";
import Student from "./components/Student";
import Error from "./components/Error"

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation/>
        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/run" component={Block}/>
              <Route path="/category" component={Category}/>
              <Route path="/athlete" component={Student}/>
              <Route component={Error}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
