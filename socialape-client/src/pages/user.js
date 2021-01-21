import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Scream from "../component/scream/Scream";

import StaticProfile from "../component/profile/StaticProfile";

import { Grid } from "@material-ui/core";

import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends React.Component {
  state = {
    profile: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { screams, loading } = this.props.data;

    const screamsMarkup = loading ? (
      <p>Loading data...</p>
    ) : screams === null ? (
      <p>No screams from this user</p>
    ) : (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) ;

    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {screamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p> Loading ...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

const mapStatToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  getUserData,
};

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default connect(mapStatToProps, mapActionsToProps)(user);
