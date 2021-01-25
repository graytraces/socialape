import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { Button, Grid, TextField } from "@material-ui/core";

//Redux Stuff
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.custom,
});

const CommentForm = (props) =>{

  const [bodyState, setBodyState] = useState("");
  const [errorState, setErrorState] = useState({});
  const {UI} = props;

  useEffect( () =>{
    if(UI.errors) {
      setErrorState( UI.errors );
    }
    if (!UI.errors && !UI.loading) {
      setBodyState("")
    }
  }, [UI]);

  const handleChange = (event) => {
    setBodyState( event.target.value );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.submitComment(props.screamId, { body: bodyState });
  };

  const { classes, authenticated } = props;
  const errors = errorState;
  const commentFormMarkup = authenticated ? (
    <Grid item sm={12} style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="body"
          type="text"
          label="Comment on scream"
          error={errors.comment ? true : false}
          helperText={errors.comment}
          value={bodyState}
          onChange={handleChange}
          fullWidth
          className={classes.TextField}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Submit
        </Button>
      </form>
      <hr className={classes.visibleSeperator} />
    </Grid>
  ) : null;

  return commentFormMarkup;
}

CommentForm.protoTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

const mapActionToProps = {
  submitComment,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(CommentForm));
