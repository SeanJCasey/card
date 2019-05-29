import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { withStyles, Button, Dialog, Typography } from "@material-ui/core";
import Maker from "../assets/Maker.svg";
import ConnextHorizontal from "../assets/ConnextHorizontal.svg";
import money2020 from "../assets/money2020.svg";

const styles = () => ({
  icon: {
    width: "40px",
    height: "40px"
  }
});

class Money2020Confirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };
  }

  handleClose = () => {
    localStorage.setItem("paymentPending", "true");
    localStorage.setItem("hasBeenWarned", "true");
    this.props.history.push("/")
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid
        container
        spacing={16}
        direction="column"
        style={{
          // paddingLeft: "2%",
          // paddingRight: "2%",
          paddingTop: "2%",
          paddingBottom: "2%",
          textAlign: "center"
        }}
        zeroMinWidth={true}
      >
        <Dialog open={true} style={{ width: "100%" }}>
          <Grid
            container
            wrap="wrap"
            justify="center"
            alignItems="center"
            spacing={32}
            style={{ padding: "5% 5% 5% 5%" }}
          >
            <Grid
              container
              wrap="nowrap"
              direction="row"
              justify="space-evenly"
              alignItems="center"
              style={{ padding: "5% 5% 5% 5%" }}
            >
              <object
                data={money2020}
                type="image/svg+xml"
                style={{ width: "60px" }}
                aria-label="money2020 logo"
              />
              <object
                data={ConnextHorizontal}
                type="image/svg+xml"
                style={{ width: "100px" }}
                aria-label="connext horizontal logo"
              />
              <object
                data={Maker}
                type="image/svg+xml"
                style={{ width: "80px" }}
                aria-label="maker logo"
              />
            </Grid>
            <Typography
              style={{ width: "80%", paddingTop: "5%", textAlign: "left" }}
              variant="h5"
              color="#282b2e"
            >
              We're processing your request!
            </Typography>
            <Typography
              style={{ width: "80%", paddingBottom: "5%", textAlign: "left" }}
              variant="body1"
              color="#282b2e"
            >
              This may take a short time. Check your account balance in a few
              minutes.
            </Typography>
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              size="small"
              onClick={this.handleClose}
            >
              <Typography noWrap variant="body1" color="primary">
                View balance
              </Typography>
            </Button>

            <Typography
              variant="body1"
              style={{ paddingTop: "5%", width: "80%", color: "#282b2e" }}
            >
              Feel free to stop by the MakerDAO booth at M31 (Hall 2) to hear
              more about DAI and how to use it as a payment method. We are also
              there to support you in retrieving your DAI.
            </Typography>

            <Grid
              container
              nowrap
              style={{
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                textAlign: "center",
                paddingTop: "5%",
                paddingBottom: "5%",
                width: "80%",
                color: "#282b2e"
              }}
            >
              <Typography
                item
                variant="h6"
                style={{ width: "100%", paddingBottom: "2%" }}
              >
                Learn more about:
              </Typography>
              <a
                href="https://connext.network"
                style={{ textDecoration: "none" }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Connext
                </Button>
              </a>
              <a
                href="https://makerdao.com"
                style={{ textDecoration: "none" }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  DAI
                </Button>
              </a>
            </Grid>
            {/* <Button
                onClick={() => this.props.history.push("/")}
                className={classes.button}
                variant="outlined"
                color="primary"
                size="small"
              >
                Home
              </Button> */}
          </Grid>
        </Dialog>
      </Grid>
    );
  }
}

export default withStyles(styles)(Money2020Confirmation);
