import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import {
  withStyles,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  Typography,
  DialogContentText,
  LinearProgress,
  Tooltip
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "@material-ui/icons/FileCopy";
import * as Connext from 'connext';

const { Currency, CurrencyConvertable, CurrencyType } = Connext
const { getExchangeRates } = new Connext.Utils()

const styles = theme => ({
  icon: {
    width: "40px",
    height: "40px"
  }
});

const screens = (classes, minEth, minDai, maxEth, maxDai) => [
  {
    title: "Welcome to Your Dai Card!",
    message: "Here are some helpful tips to get you started with the next generation of payments."
  },
  {
    title: "Beta Software",
    message:
      `This is beta software, and there are still bugs. Don't hesitate to contact us by going to Settings > Support if you find any!`
  },
  {
    title: "Your Mnemonic",
    message:
      "This mnemonic is required to access your card's funds. It's available anytime via the settings page, be sure to write it down somewhere before you deposit money.",
    extra: (
      <Grid container style={{ padding: "2% 2% 2% 2%" }}>
        <CopyToClipboard
          text={localStorage.getItem("mnemonic")}
          color="primary"
        >
          <Button
            fullWidth
            className={classes.button}
            variant="outlined"
            color="primary"
            size="small"
          >
            <CopyIcon style={{ marginRight: "5px" }} />
            <Typography noWrap variant="body1" color="primary">
              <Tooltip
                disableFocusListener
                disableTouchListener
                title="Click to Copy"
              >
                <span>{localStorage.getItem("mnemonic")}</span>
              </Tooltip>
            </Typography>
          </Button>
        </CopyToClipboard>
      </Grid>
    )
  },
  {
    title: "Deposit Boundaries",
    message: `The card needs a minimum deposit of ${
      minEth || "?.??"} eth (${
      minDai || "?.??"}) to cover the gas costs of getting setup. Cards only accept deposits of ${
      maxEth || "?.??"} eth (${
      maxDai || "?.??"}) or less, with any excess eth getting refunded.`
  },
  {
    title: "Depositing Tokens",
    message: `If you want to deposit dai directly, there are no deposit maximums enforced! Just make sure to send at least ${
      minEth || "?.??"} eth (${
      minDai || "?.??"}) for gas to your new wallet.`
  }
];

class SetupCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      open: !localStorage.getItem("hasBeenWarned")
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickNext = () => {
    const { index } = this.state;
    this.setState({ index: index + 1 });
  };

  handleClickPrevious = () => {
    const { index } = this.state;
    this.setState({ index: index - 1 });
  };

  handleClose = () => {
    localStorage.setItem("hasBeenWarned", "true");
    this.setState({ open: false });
  };

  render() {
    const {
      classes,
      connextState,
      browserMinimumBalance,
      maxTokenDeposit
    } = this.props;
    const { index, open } = this.state;

    // get proper display values
    // max token in BEI, min in wei and DAI
    let minDai, minEth;
    let maxDai, maxEth;
    if (connextState && browserMinimumBalance) {
      const minConvertable = new CurrencyConvertable(
        CurrencyType.WEI,
        browserMinimumBalance.wei,
        () => getExchangeRates(connextState)
      );

      const maxConvertable = new CurrencyConvertable(
        CurrencyType.BEI,
        maxTokenDeposit,
        () => getExchangeRates(connextState)
      );

      minEth = minConvertable
        .toETH()
        .format({
          decimals: 2,
          withSymbol: false,
        })
      minDai = Currency.USD(browserMinimumBalance.dai).format({});
      maxEth = maxConvertable
        .toETH()
        .format({
          decimals: 2,
          withSymbol: false,
        })
      maxDai = Currency.USD(maxConvertable.toUSD().amountBN).format({});
    }

    const display = screens(classes, minEth, minDai, maxEth, maxDai);

    const isFinal = index === display.length - 1;

    const progress = 100 * ((index + 1) / display.length);

    return (
      <Grid
        container
        spacing={16}
        direction="column"
        style={{
          paddingLeft: "10%",
          paddingRight: "10%",
          paddingTop: "10%",
          paddingBottom: "10%",
          textAlign: "center"
        }}
        zeroMinWidth={true}
      >
        {display.length !== 0 && (
          <Dialog open={open} fullWidth>
            <Grid container justify="center">
              <Grid item xs={12} style={{ padding: "2% 2% 2% 2%" }}>
                <LinearProgress variant="determinate" value={progress} />
              </Grid>

              <Grid item xs={12}>
                <DialogTitle variant="h5">{display[index].title}</DialogTitle>
              </Grid>

              {display[index].extra && (
                <Grid item xs={12}>
                  {display[index].extra}
                </Grid>
              )}

              <DialogContent>
                <Grid item xs={12} style={{ padding: "2% 2% 2% 2%" }}>
                  <DialogContentText variant="body1">
                    {display[index].message}
                  </DialogContentText>
                </Grid>

                <Grid item xs={12}>
                  <DialogActions style={{ padding: "2% 2% 2% 2%" }}>
                    {index !== 0 && (
                      <Button
                        onClick={this.handleClickPrevious}
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Back
                      </Button>
                    )}
                    {isFinal ? (
                      <Button
                        onClick={this.handleClose}
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Got it!
                      </Button>
                    ) : (
                      <Button
                        onClick={this.handleClickNext}
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Next
                      </Button>
                    )}
                  </DialogActions>
                </Grid>
              </DialogContent>
            </Grid>
          </Dialog>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(SetupCard);
