import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from "./routes";
import { connect } from "react-redux";

import "antd/dist/antd.css";
import ScrollToTop from "./components/ScrollToTop";
import * as actions from "./store/actions/auth";

import { createBrowserHistory } from "history";
import axios from "axios";
import Favicon from "react-favicon";
import logo from "./logo.svg";

// Create history object.
let history = createBrowserHistory();

// if testing
// axios.defaults.baseURL = "http://127.0.0.1:8000";
// if deployed
axios.defaults.baseURL = 'https://plateplan-backend.herokuapp.com/';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <div>
        <Favicon url={logo} />
        <Router history={history}>
          <ScrollToTop />
          <BaseRouter {...this.props} />
        </Router>
      </div>
    );
  }
}

// turns the state into a prop so we can use it in our application
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
    type: state.type,
  };
};

// automatic authentication check
// every time the app is rendered, the app will check if we are authenticated
const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
