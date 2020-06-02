const appName = process.env.REACT_APP_NAME

module.exports = {
  'translation': {
    'menuAboutButton': 'About',
    'menuCheckpointButton': 'Checkpoint',
    'menuAdminButton': 'Admin',
    'checkpointsTab': 'Checkpoints',
    'statusTab': 'Status',
    'settingsTab': 'Settings',
    'welcomeMessage': `Welcome to ${appName}. To participate in the effort to track the spread of the SARS-COV-2 virus, please scan a checkpoint whenever you interact with others in a way that could transmit the virus.`,
    'hostCheckpointButton': 'Host a Checkpoint',
    'joinCheckpointButton': 'Scan a Checkpoint',
    'hostingCheckpointMessage': 'You are now hosting a checkpoint. Others may join using the QR code below.',
    'endCheckpointButton': 'End checkpoint',
    'printCheckpointButton': 'Print',
    'checkpointCreatedMessage': 'Checkpoint created',
    'noCameraPermissionMessage': "This app does not have permission to access your device's camera. Instead, you may take a picture of the QR code.",
    'takePictureButton': 'Take a picture',
    'backButton': 'Back',
    'joinSuccessfulMessage': 'You have joined the checkpoint successfully.',
    'scanErrorMessage': 'The QR code could not be read. Please try again.',
    'statusLoadingMessage': 'Loading your status...',
    'statusNegativeMessage': 'No transmission paths from infected individuals to you have been discovered at this time. However, everyone is at risk and individuals should follow the directives of the Public Health Authority, & local government.',
    'statusPositiveMessage': 'A possible transmission path from an infected individual to you has been discovered. You should take precautionary measures to protect yourself and others, according to the directives of the Public Health authority & local government.',
    'loadingMessage': 'Loading...',
    'standardRiskLevelMessage': 'clear',
    'elevatedRiskLevelMessage': 'elevated',
    'yourRiskLevelMessage': 'Your risk level',
    'aboutReportMessage': 'If you have received a positive test, you may download your recent checkpoints below and share this file with your doctor. This will warn those who may have been exposed of their increased risk. You will remain anonymous.',
    'reportButton': 'Anonymous Report',
    'downloadHistoryButton': 'Download checkpoints',
    'aboutConfirmationCodeMessage': 'Do you have a confirmation code to scan? Scanning a confirmation code will help those that may have been exposed, by letting them know that this is a legitimate risk.',
    'scanConfirmationCodeButton': 'Scan confirmation code',
    'scanWithoutConfirmationCodeButton': "I don't have a code",
    'reportConfirmationMessage': 'This will notify those that may have been exposed of their increased risk. You will remain anonymous. This cannot be undone.',
    'reportCompletedMessage': 'Your positive status was reported anonymously. Those at risk will be notified. Thank you.',
    'cancelReportButton': 'Never mind',
    'confirmReportButton': 'Report now',
    'aboutUseConfirmedDiagnoses': 'Selecting "Use only confirmed diagnoses" will ignore possible transmission paths from unconfirmed reports.',
    'useConfirmedDiagnosesButton': 'Use only confirmed diagnoses',
    'elevatedRiskAlertMessage': 'Your risk level is elevated.',
    'seeStatusTabMessage': 'See the status tab.'
  }
}
