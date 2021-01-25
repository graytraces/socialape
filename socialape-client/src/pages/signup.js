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

//React stuff
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.custom,
});

const Signup = (props) => {
  const [inputState, setInputState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
  });

  const [errorState, setErrorState] = useState({});

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
      confirmPassword: "",
      handle: "",
    });
    setErrorState({});
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newUserData = {
      email: inputState.email,
      password: inputState.password,
      confirmPassword: inputState.confirmPassword,
      handle: inputState.handle,
    };

    props.signupUser(newUserData, props.history);
  };

  const handleChange = (event) => {
    setInputState({
      ...inputState,
      [event.target.name]: event.target.value,
    });
  };

  const { classes, loading } = props;
  const errors = errorState;

  return (
    <Grid container className={classes.form}>
      <Grid item sm></Grid>
      <Grid item sm>
        <img src={AppIcon} alt="bloomstick" className={classes.image} />
        <Typography variant="h2" className={classes.pageTitle}>
          Signup
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
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            className={classes.TextField}
            value={inputState.confirmPassword}
            helperText={errors.confirmPassword}
            error={errors.confirmPassword ? true : false}
            onChange={handleChange}
            fullWidth
          ></TextField>
          <TextField
            id="handle"
            name="handle"
            type="password"
            label="Handle"
            className={classes.TextField}
            value={inputState.handle}
            helperText={errors.handle}
            error={errors.handle ? true : false}
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
};

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, { signupUser })(
  withStyles(styles)(Signup)
);
