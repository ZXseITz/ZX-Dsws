import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navigation from "./components/Navigation"
import Home from "./components/Home"
import Blocks from "./components/Blocks";
import Categories from "./components/Categories";
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
              <Route path="/blocks" component={Blocks}/>
              <Route path="/categories" component={Categories}/>
              <Route path="/students" component={Student}/>
              <Route component={Error}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
