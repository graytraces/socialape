import { Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Scream from "../component/scream/Scream";
import Profile from "../component/profile/Profile";
import ScreamSkeleton from "../util/ScreamSkeleton";

import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

const Home = (props) => {
  useEffect(() => {
    props.getScreams();
  }, []);

  const { screams, loading } = props.data;

  let recentScreamsMarkup = !loading ? (
    screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    <ScreamSkeleton />
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {/*sm : small size screen, xs : extra small size screen*/}
        {recentScreamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

Home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getScreams })(Home);
