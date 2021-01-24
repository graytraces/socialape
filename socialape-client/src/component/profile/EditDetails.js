import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions/userActions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import MyButton from "../../util/MyButton";

const styles = (theme) => ({
  ...theme.custom,
  button: {
    float: "right",
  },
});

const EditDetails = (props) => {
  const [editInfo, setEditInfo] = useState({
    bio: "",
    website: "",
    location: "",
  });
  const [dialogOpen, setOpen] = useState(false);

  useEffect(() => {
    const { credentials } = props;
    mapUserDetailsToState(props.credentials);
  }, []);

  const handleOpen = () => {
    setOpen( true );
    mapUserDetailsToState(props.credentials);
  };

  const handleClose = () => {
    setOpen( false );
  };

  const mapUserDetailsToState = (credentials) => {
    setEditInfo({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
    });
  };

  const handleChange = (event) => {
    setEditInfo({
      ...editInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    const userDetails = {
      bio: editInfo.bio,
      website: editInfo.website,
      location: editInfo.location,
    };
    props.editUserDetails(userDetails);
    handleClose();
  };

  const { classes } = props;
  return (
    <Fragment>
      <MyButton
        tip="Edit detils"
        onClick={handleOpen}
        btnClassName={classes.button}
      >
        <EditIcon color="primary" />
      </MyButton>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              type="text"
              label="Bio"
              multiline
              rows="3"
              placeholder="A short bio about yourself"
              className={classes.textField}
              value={editInfo.bio}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="website"
              type="text"
              label="Website"
              placeholder="Your personal/professional website"
              className={classes.textField}
              value={editInfo.website}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="location"
              type="text"
              label="Location"
              placeholder="where you live"
              className={classes.textField}
              value={editInfo.location}
              onChange={handleChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const mapStatToProps = (state) => ({
  credentials: state.user.credentials,
});

const mapActionsToProps = {
  editUserDetails,
};

EditDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStatToProps,
  mapActionsToProps
)(withStyles(styles)(EditDetails));
