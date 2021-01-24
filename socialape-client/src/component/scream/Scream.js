import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { connect } from "react-redux";
import MyButton from "../../util/MyButton";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";

//MUI import
import withStyles from "@material-ui/core/styles/withStyles";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

const Scream = (props) => {
  dayjs.extend(relativeTime);

  const {
    classes,
    scream: {
      body,
      createdAt,
      userImage,
      userHandle,
      screamId,
      likeCount,
      commentCount,
    },
    user: {
      authenticated,
      credentials: { handle },
    },
  } = props;
  const deleteButton =
    authenticated && userHandle === handle ? (
      <DeleteScream screamId={screamId} />
    ) : null;

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image={userImage}
        title="Profile image"
      />
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          component={Link}
          to={`/users/${userHandle}`}
          color="primary"
        >
          {userHandle}
        </Typography>
        {deleteButton}
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        <LikeButton screamId={screamId} />
        <span>{likeCount} Likes</span>
        <MyButton tip="comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount} comments </span>
        <ScreamDialog
          screamId={screamId}
          userHandle={userHandle}
          openDialog={props.openDialog}
        />
      </CardContent>
    </Card>
  );
};

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStatToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {};

export default connect(
  mapStatToProps,
  mapActionsToProps
)(withStyles(styles)(Scream));
