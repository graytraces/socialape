import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./util/theme";
import jwtDecode from "jwt-decode";
import AuthRoute from "./util/AuthRoute";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

//Components
import Navbar from "./component/layout/Navbar";

//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import User from "./pages/User";

import axios from "axios";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL =
  "https://asia-northeast3-socialape-3cf82.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
              <Route exact path="/users/:handle" component={User} />
              <Route
                exact
                path="/users/:handle/scream/:screamId"
                component={User}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;
