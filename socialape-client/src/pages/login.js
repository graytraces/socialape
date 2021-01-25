import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/favicon.ico";

import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.custom,
});

const Login = (props) => {
  const [inputState, setInputState] = useState({
    email: "",
    password: "",
  });

  const [errState, setErrorState] = useState({});

  const { UI } = props;

  useEffect(() => {
    if (UI.errors) {
      setErrorState(UI.errors);
    }
  }, [UI]);

  useEffect(() => {
    setInputState({
      email: "",
      password: "",
    });
    setErrorState({});
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const userData = {
      email: inputState.email,
      password: inputState.password,
    };
    props.loginUser(userData, props.history);
  };

  const handleChange = (event) => {
    setInputState({ ...inputState, [event.target.name]: event.target.value });
  };

  const {
    classes,
    UI: { loading },
  } = props;
  const errors = errState;

  return (
    <Grid container className={classes.form}>
      <Grid item sm></Grid>
      <Grid item sm>
        <img src={AppIcon} alt="bloomstick" className={classes.image} />
        <Typography variant="h2" className={classes.pageTitle}>
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.TextField}
            value={inputState.email}
            helperText={errors.email}
            error={errors.email ? true : false}
            onChange={handleChange}
            fullWidth
          ></TextField>
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            className={classes.TextField}
            value={inputState.password}
            helperText={errors.password}
            error={errors.password ? true : false}
            onChange={handleChange}
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
            Login
            {loading && (
              <CircularProgress className={classes.progress} size={30} />
            )}
          </Button>
          <br />
          <small>
            don't have an account ? signup <Link to="/signup"> here </Link>
          </small>
        </form>
      </Grid>
      <Grid item sm></Grid>
    </Grid>
  );
};

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Login));
