import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CropFreeIcon from '@material-ui/icons/CropFree'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { withTheme } from '@material-ui/core/styles'
import QRReader from 'react-qr-reader'
import { Translation } from 'react-i18next'
import Link from '@material-ui/core/Link'
import virusIcon from './img/virus-icon.png'
import API from './api'

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const checkpointKeyLength = Number(process.env.REACT_APP_CHECKPOINT_KEY_LENGTH)
const aboutUrl = process.env.REACT_APP_ABOUT_URL

const phoneNumberRegex = /(855|\+855|)(0*)((1[0-9]|2[3-6]|3[12345689]|4[2-4]|5[2-5]|6[0-9]|7[1-9]|8[13456789]|9[02356789])\d{6,7})/;

const initialState = {
  mode: 'home',
  checkpointKey: null,
  checkpointTime: null,
  legacyMode: false,
  phoneDialog: false,
  currentData: null,
  phone: '',
  isPhoneValid: false,
}

function userPhoneNumber() {
  const key = '__user_phone_number';
  return localStorage.getItem(key);
}

function setUserPhoneNumber(phone) {
  const key = '__user_phone_number';
  localStorage.setItem(key, phone);
}

class Checkpoints extends React.Component {

  constructor () {
    super()
    this.state = initialState
  }

  async reset () {
    this.setState(initialState)
    this.props.resetUrlScanState()
  }

  async joinCheckpoint () {
    this.setState({
      mode: 'join'
    })
  }

  async handleScan (data) {

    if (!data) {
      return;
    }
  
    this.setState({ currentData: data });

    if (!userPhoneNumber()) {  
      this.setState({ 
        mode: 'scan-success',
        phoneDialog: true
       });

      return;
    }
  
    await this.submitData(data);
  }

  handleScanError () {
    this.setState({ legacyMode: true })
  }

  openImageDialog () {
    this.refs.checkpointQR.openImageDialog()
  }

  handlePhoneChange(e) {
    const phone = e.target.value;
    const isPhoneValid = phoneNumberRegex.test(phone);
    console.log({ isPhoneValid });
    this.setState({ phone, isPhoneValid });
  }

  handlePhoneDialogCancel() {

    this.setState({ 
      phoneDialog: false,
      mode: 'home',
    });
  }

  async handlePhoneDialogClose() {

    this.setState({ phoneDialog: false });
    
    const data = this.state.currentData;

    if (!data) {
      return;
    }

    this.state.phone && setUserPhoneNumber(this.state.phone);
    await this.submitData(data);
  }

  async submitData(data) {
    // QR code is a url
    const urlSplit = data.split('?checkpoint=')
    if ((urlSplit.length === 2) && (urlSplit[1].length === checkpointKeyLength)) {
      await API.joinCheckpoint(urlSplit[1])
      this.setState({ mode: 'scan-success' })
      setTimeout(() => this.reset(), 10000) // automatically go back to main screen after 10 seconds
    } else {
      this.setState({ mode: 'scan-error' })
    }
  }

  render () {
    const { mode, legacyMode } = this.state
    const { status, statusLoaded, urlScanState, theme } = this.props
    const riskLevelLoading = (<Translation>{t => t('statusLoadingMessage')}</Translation>)
    const riskLevelNegative = (<Translation>{t => t('standardRiskLevelMessage')}</Translation>)
    const riskLevelPositive = (<Translation>{t => t('elevatedRiskLevelMessage')}</Translation>)
    const riskLevel = statusLoaded
      ? (status
        ? riskLevelPositive
        : riskLevelNegative)
      : riskLevelLoading
    const riskLevelColor = status
      ? 'error'
      : 'success'
    const computedMode = typeof urlScanState !== 'undefined'
      ? urlScanState
      : mode
    let content
    if (computedMode === 'home') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography variant='h5' style={{ marginTop: 25 }}>
            <Translation>{t => t('slogan')}</Translation>
          </Typography>
          <img src={virusIcon} width={200} style={{ maxWidth: '80px', marginTop: 20 }} />
          <Typography style={{ marginTop: 25 }}>
            <Translation>{t => t('welcomeMessage')}</Translation>
          </Typography>
          <Button onClick={this.joinCheckpoint.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 35 }}>
            <CropFreeIcon />
            <Translation>{t => t('joinCheckpointButton')}</Translation>
          </Button>
          <Typography style={{ marginTop: 35, marginBottom: 25 }}>
            <Translation>
              {t => t('learnMoreText')}
            </Translation>
            <Link href={aboutUrl} target='_blank'>
              {aboutUrl}
            </Link>
            .
          </Typography>
        </Grid>
      )
    } else if (computedMode === 'join') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <QRReader
            ref='checkpointQR'
            delay={300}
            onError={this.handleScanError.bind(this)}
            onScan={this.handleScan.bind(this)}
            style={{ width: legacyMode ? 0 : '100%' }}
            facingMode='environment'
            legacyMode={legacyMode}
          />
          { legacyMode && (
            <Typography style={{ marginTop: 25 }}>
              <Translation>{t => t('noCameraPermissionMessage')}</Translation>
            </Typography>
          ) }
          <Button onClick={this.openImageDialog.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <Translation>{t => t('takePictureButton')}</Translation>
          </Button>
          <Button onClick={this.reset.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <ArrowBackIcon />
            <Translation>{t => t('backButton')}</Translation>
          </Button>
        </Grid>
      )
    } else if (computedMode === 'scan-success') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography style={{ marginTop: 25 }}>
            <Translation>{t => t('joinSuccessfulMessage')}</Translation>
          </Typography>
          <Typography style={{ marginTop: 15, marginBottom: 25 }}>
            <Translation>{t => t('yourRiskLevelMessage')}</Translation>: <span style={{ color: theme.palette[riskLevelColor].main }}>{riskLevel}</span>
          </Typography>
          <Button onClick={this.reset.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <ArrowBackIcon />
            <Translation>{t => t('backButton')}</Translation>
          </Button>
        </Grid>
      )
    } else if (computedMode === 'scan-error') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography style={{ marginTop: 25, marginBottom: 25 }}>
            <Translation>{t => t('scanErrorMessage')}</Translation>
          </Typography>
          <Button onClick={this.reset.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <ArrowBackIcon />
            <Translation>{t => t('backButton')}</Translation>
          </Button>
        </Grid>
      )
    }
    return <div>
        <Dialog open={this.state.phoneDialog} onClose={this.handlePhoneDialogClose.bind(this)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Phone Number</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your phone number
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Phone number"
              type="phone"
              value={this.state.phone}
              onChange={this.handlePhoneChange.bind(this)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handlePhoneDialogCancel.bind(this)} color="primary">
              Cancel
            </Button>
            <Button
            disabled={!this.state.isPhoneValid}
            onClick={this.handlePhoneDialogClose.bind(this)} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        
        {content}
      </div>
  }

}

export default withTheme(Checkpoints)
