import React from "react";
import "../App.css";
import ChannelCard from "./channelCard";
import QRScan from "./qrScan";
import QRIcon from "mdi-material-ui/QrcodeScan";
import SendIcon from "@material-ui/icons/Send";
import ReceiveIcon from "@material-ui/icons/SaveAlt";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { Fab, Grid, withStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { getOwedBalanceInDAI } from "../utils/currencyFormatting";

const styles = {};

class Home extends React.Component {
  state = {
    modals: {
      scan: false
    },
    sendScanArgs: null
  };

  scanQRCode = async data => {
    const { publicUrl } = this.props;
    // potential URLs to scan and their params
    const urls = {
      "/send?": ["recipient", "amount"],
      "/redeem?": ["secret", "amountToken"]
    };
    let args = {};
    let path = null;
    for (let [url, fields] of Object.entries(urls)) {
      const strArr = data.split(url);
      if (strArr.length === 1) {
        // incorrect entry
        continue;
      }

      if (strArr[0] !== publicUrl) {
        throw new Error("incorrect site");
      }

      // add the chosen url to the path scanned
      path = url + strArr[1];

      // get the args
      const params = strArr[1].split("&");
      fields.forEach((field, i) => {
        args[field] = params[i].split("=")[1];
      });
    }

    if (args === {}) {
      console.log("could not detect params");
    }

    await this.props.scanURL(path, args);
    this.props.history.push(path);
    this.setState({
      modals: { scan: false }
    });
  };

  render() {
    const { modals } = this.state;
    const { address, channelState, connextState } = this.props;
    const balance = getOwedBalanceInDAI(connextState);

    if (balance != "0.00") {
      localStorage.removeItem("paymentPending");
    }

    return (
      <>
        <Grid container direction="row" style={{ marginBottom: "-7.5%" }}>
          <Grid item xs={12} style={{ flexGrow: 1 }}>
            <ChannelCard
              channelState={channelState}
              address={address}
              connextState={connextState}
            />
          </Grid>
        </Grid>
        <Grid container direction="column">
          <Grid item xs={12} style={{ marginRight: "5%", marginLeft: "80%" }}>
            <Fab
              style={{
                color: "#FFF",
                backgroundColor: "#fca311",
                size: "large"
              }}
              onClick={() =>
                this.setState({ modals: { ...modals, scan: true } })
              }
            >
              <QRIcon />
            </Fab>
            <Modal
              id="qrscan"
              open={this.state.modals.scan}
              onClose={() =>
                this.setState({ modals: { ...modals, scan: false } })
              }
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                position: "absolute",
                top: "10%",
                width: "375px",
                marginLeft: "auto",
                marginRight: "auto",
                left: "0",
                right: "0"
              }}
            >
              <QRScan
                handleResult={this.scanQRCode}
                history={this.props.history}
              />
            </Modal>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={16}
          direction="column"
          style={{ paddingLeft: "2%", paddingRight: "2%", textAlign: "center" }}
        >
          <Grid item xs={12} style={{ paddingTop: "10%" }}>
            <Grid
              container
              spacing={8}
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  style={{
                    color: "#FFF",
                    backgroundColor: "#FCA311"
                  }}
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/receive"
                >
                  Request
                  <ReceiveIcon style={{ marginLeft: "5px" }} />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  style={{
                    color: "#FFF",
                    backgroundColor: "#FCA311"
                  }}
                  size="large"
                  variant="contained"
                  component={Link}
                  to="/send"
                >
                  Send
                  <SendIcon style={{ marginLeft: "5px" }} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              style={{ marginBottom: "20%" }}
              fullWidth
              color="primary"
              variant="outlined"
              size="large"
              component={Link}
              to="/cashout"
            >
              Cash Out
            </Button>
          </Grid>
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ textAlign: "center" }}
          >
            {localStorage.getItem("paymentPending") ? (
              <Typography
                variant="body1"
                style={{ width: "90%", color: "red", marginBottom:"10px" }}
              >
                We've received your payment request! Please bear with us while we
                crunch some numbers.
              </Typography>
            ) : null}
            <Typography
              variant="body1"
              style={{ width: "90%", color: "#282b2e" }}
            >
              Meet us at the MakerDAO booth M31 (Hall 2) for technical support
              or more information on Dai.
            </Typography>
          </Grid>
          <Grid
            container
            justify="center"
            style={{
              flexWrap: "wrap",
              justifyContent: "center",
              textAlign: "center",
              paddingTop: "5%",
              color: "#282b2e"
            }}
          >
            <Typography
              variant="body1"
              style={{ width: "100%", paddingBottom: "2%" }}
            >
              Read more about: &nbsp;
            </Typography>
            <Link
              to="https://connext.network"
              style={{ textDecoration: "none", marginRight: "2%" }}
            >
              <Button variant="outlined" color="primary" size="small">
                Connext
              </Button>
            </Link>
            <Link
              to="https://makerdao.com"
              style={{ textDecoration: "none", marginLeft: "2%" }}
            >
              <Button variant="outlined" color="primary" size="small">
                DAI
              </Button>
            </Link>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withStyles(styles)(Home);
