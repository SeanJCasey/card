import React, { Component } from "react";
import QrReader from "react-qr-reader";
import interval from "interval-promise";

import { Typography } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";

class QRScan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delay: 300,
      result: "No result",
      error: null,
      cameraDenied: false
    };
  }

  async componentDidMount() {
    const permissionStatus = await navigator.permissions.query({ name: 'camera' })
    if (permissionStatus.state === 'denied') this.handleCameraDenied();
    else if (permissionStatus.state === 'prompt') this.pollCameraDenied();
  }

  handleCameraDenied() {
    this.setState({ cameraDenied: true });
  }

  handleScan = data => {
    if (data) {
      this.props.handleResult(data);
    }
  };

  async pollCameraDenied() {
    interval(async (iteration, stop) => {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' })
      if (permissionStatus.state === 'denied') {
        this.handleCameraDenied();
        stop();
      }
      else if (permissionStatus.state === 'granted') {
        stop();
      }
    }, 2000);
  }

  render() {

    if (this.state.cameraDenied) {
      return (
        <div>
          <Typography
            style={{
              padding: "2%",
              backgroundColor: "#FFF"
            }}
          >
            You have denied camera access. Please change your settings to use the QR code scanner.
          </Typography>
          <Typography
            style={{
              padding: "2%",
              backgroundColor: "#FFF"
            }}
          >
            In Chrome: click on
            "<LockIcon
              style={{
                width: "16px",
                height: "16px",
                verticalAlign: "text-top"
              }}
            />"
            next to "daicard.io" in the navigation bar and set "camera" to "allow".
          </Typography>
        </div>
      )
    }

    return (
      <div>
        <QrReader
          delay={this.state.delay}
          onError={error => this.setState({ error })}
          onScan={this.handleScan}
          style={{ width: "100%" }}
        />
        <Typography style={{padding: "2%", backgroundColor: "#FFF"}}>
          Not currently supported on Brave and iOS 11 browsers other than Safari.
        </Typography>
      </div>
    );
  }
}

export default QRScan;
