import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

import Link from "react-router-dom/Link";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
    objectFit: "cover",
  },
  content: {
    padding: 25,
  },
};

class Scream extends Component {
  render() {
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
    } = this.props;

    console.log(createdAt);

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
          <Typography variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
          <Typography variant="body1">{body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Scream);
