import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from "react-redux";
import { postScream, clearErrors } from "../../redux/actions/dataActions";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import MyButton from "../../util/MyButton";

const styles = (theme) => ({
  ...theme.custom,
  submitButton: {
    position: "relative",
    float: "right",
    marginTop: 10,
  },
  progressSpinner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%",
  },
});

const PostScream = (props) => {
  const [openState, setOpenState] = useState(false);
  const [errorState, setErrorState] = useState({});
  const [bodyState, setBodyState] = useState("");

  const { UI } = props;

  useEffect(() => {
    if (UI.errors) {
      setErrorState(UI.errors);
    }

    if (!UI.errors && !UI.loading) {
      setBodyState("");
      setOpenState(false);
      setErrorState({});
    }
  }, [UI]);

  const handleOpen = () => {
    setOpenState(true);
  };

  const handleClose = () => {
    props.clearErrors();
  };

  const handleChange = (event) => {
    setBodyState(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.postScream({ body: bodyState });
  };

  const errors = errorState;
  const {
    classes,
    UI: { loading },
  } = props;
  return (
    <Fragment>
      <MyButton onClick={handleOpen} tip="Post a Scream!">
        <AddIcon color="primary" />
      </MyButton>
      <Dialog open={openState} onClose={handleClose} fullWidth maxWidth="sm">
        <MyButton
          tip="close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogTitle>Post a new scream</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="body"
              type="text"
              label="Scream"
              multiline
              rows="3"
              placeholder="Scream at your fellow apes"
              error={errors.body ? true : false}
              helperText={errors.body}
              className={classes.textField}
              onChange={handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

PostScream.protoTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
});

export default connect(mapStateToProps, { postScream, clearErrors })(
  withStyles(styles)(PostScream)
);
