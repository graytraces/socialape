import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Link from "react-router-dom/Link";

//{} 쓰면 전체를 로딩하니 그러지 말자

class Navbar extends Component {
  render() {
    return (
      <AppBar>
        <Toolbar className="nav-container">
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Navbar;
