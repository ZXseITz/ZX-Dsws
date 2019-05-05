import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navigation from "./components/Navigation"
import Home from "./components/Home"
import Run from "./components/Run";
import Category from "./components/Category";
import Athlete from "./components/Athlete";
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
              <Route path="/run" component={Run}/>
              <Route path="/category" component={Category}/>
              <Route path="/athlete" component={Athlete}/>
              <Route component={Error}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
