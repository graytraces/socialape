import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

//MUI STUFF
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typhograpy from "@material-ui/core/Typography";

//MUI ICONS
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

import { connect } from "react-redux";
import { getScream } from "../redux/actions/dataActions";
import MyButton from "../util/MyButton";

const styles = (theme) => ({
  ...theme.custom,
  invisibleSeperator: {
    border: "none",
    margin: 4,
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton:{
      position:"absolute",
      left:"90%"
  }
});

class ScreamDialog extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.props.getScream(this.props.screamId);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
      },
      UI: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
      <CircularProgress size={200} />
    ) : (
      <Grid container spacing={6}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typhograpy
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typhograpy>
          <hr className={classes.invisibleSeperator} />
          <Typhograpy variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typhograpy>
          <hr className={classes.invisibleSeperator} />
          <Typhograpy variant="body1">{body}</Typhograpy>
        </Grid>
      </Grid>
    );

    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand Scream"
          tipClassname={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.DialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.protoTypes = {
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
});

const mapActionToProps = {
  getScream,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(ScreamDialog));
