import { Grid } from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";

import Scream from '../component/Scream';

class home extends Component {
  state = {
    screams: null,
  };
  componentDidMount() {
    axios
      .get("/screams")
      .then((res) => {
        console.log(res.data);
        this.setState({
          screams: res.data
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    let recentScreamsMarkup = this.state.screams ? (
      this.state.screams.map((scream) => <Scream key={scream.screamId} scream={scream}/> )
      //this.state.screams.map((scream) => <p>{scream.body}</p> )
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {/*sm : small size screen, xs : extra small size screen*/}
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
