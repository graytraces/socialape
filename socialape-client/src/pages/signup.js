import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/favicon.ico";
import axios from "axios";

import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Link } from "react-router-dom";


const styles = (theme) => ({
    ...theme.custom
});

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword:"",
      handle:"",
      loading: false,
      errors: {},
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle : this.state.handle
    };

    axios
      .post("/signup", newUserData)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
        this.setState({
          loading: false,
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        this.setState({
          errors: err.response.data,
          loading: false,
        });
      });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm></Grid>
        <Grid item sm>
          <img src={AppIcon} alt="bloomstick" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.TextField}
              value={this.state.email}
              helperText={errors.email}
              error={errors.email ? true : false}
              onChange={this.handleChange}
              fullWidth
            ></TextField>
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.TextField}
              value={this.state.password}
              helperText={errors.password}
              error={errors.password ? true : false}
              onChange={this.handleChange}
              fullWidth
            ></TextField>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.TextField}
              value={this.state.confirmPassword}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              onChange={this.handleChange}
              fullWidth
            ></TextField>
            <TextField
              id="handle"
              name="handle"
              type="password"
              label="Handle"
              className={classes.TextField}
              value={this.state.handle}
              helperText={errors.handle}
              error={errors.handle ? true : false}
              onChange={this.handleChange}
              fullWidth
            ></TextField>

            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress className={classes.progress} size={30} />
              )}
            </Button>
            <br />
            <small>
              Already have an account ? login <Link to="/login"> here </Link>
            </small>
          </form>
        </Grid>
        <Grid item sm></Grid>
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(signup);
