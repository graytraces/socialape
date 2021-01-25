import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Scream from "../component/scream/Scream";

import StaticProfile from "../component/profile/StaticProfile";
import ScreamSkeleton from "../util/ScreamSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";

import { Grid } from "@material-ui/core";

import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

const User = (props) => {
  const [profileScream, setProfileScream] = useState({
    profile: null,
    screamIdParam: null,
  });

  useEffect(() => {
    const handle = props.match.params.handle;
    const screamId = props.match.params.screamId;

    if (screamId) setProfileScream({ screamIdParam: screamId });

    props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        setProfileScream({
          profile: res.data,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const { screams, loading } = props.data;
  const { screamIdParam } = profileScream;
  const screamsMarkup = loading ? (
    <ScreamSkeleton />
  ) : screams === null ? (
    <p>No screams from this user</p>
  ) : !screamIdParam ? (
    screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    screams.map((scream) => {
      if (scream.screamId !== screamIdParam) {
        return <Scream key={scream.screamId} scream={scream} />;
      } else {
        return <Scream key={scream.screamId} scream={scream} openDialog />;
      }
    })
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {screamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profileScream.profile === null ? (
          <ProfileSkeleton />
        ) : (
          <StaticProfile profile={profileScream.profile} />
        )}
      </Grid>
    </Grid>
  );
};

const mapStatToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  getUserData,
};

User.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default connect(mapStatToProps, mapActionsToProps)(User);
