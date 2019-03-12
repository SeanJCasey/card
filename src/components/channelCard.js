import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import { Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { getChannelBalanceInUSD } from "../utils/currencyFormatting";

const styles = theme => ({
  row: {
    color: "white"
  },
  pending: {
    marginBottom: "3%",
    color: "white"
  },
  clipboard: {
    cursor: "pointer"
  }
});

class ChannelCard extends Component {
  render() {
    const { classes, channelState, connextState } = this.props;
    // only displays token value by default
    const display = getChannelBalanceInUSD(channelState, connextState)
    return (
        <Grid>
          <Grid 
            container
            spacing={16}
            direction="row"
            style={{
              paddingLeft: "10%",
              paddingRight: "10%",
              paddingTop: "10%",
              paddingBottom: "10%",
              backgroundColor: "#282b2e",
              textAlign: "center"
            }}
            alignItems="center"
            justify="center"
          >
          <Grid item xs={12}>
            <span>
              <Typography inline={true} variant="h5" className={classes.row}>
                {"$ "}
              </Typography>
              <Typography inline={true} variant="h1" className={classes.row}>
                <span>{display.substring(1, display.length - 2)}</span>
              </Typography>
              <Typography inline={true} variant="h3" className={classes.row}>
                <span>{display.substr(display.length - 2)}</span>
              </Typography>
            </span>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChannelCard);
