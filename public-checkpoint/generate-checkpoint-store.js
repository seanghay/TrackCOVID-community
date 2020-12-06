const QRCode = require('qrcode')
const PDFDocument = require('pdfkit')
const Location = require('../models/location')


module.exports = function (checkpointKey, req, res) {

  const { lat = 0.0, lng = 0.0, phone, name } = req.query;
  if (!phone || !name) {
    return res.status(400).json({ message: 'phone & name must not be empty' });
  }

  Location.create({ 
    checkpoint: checkpointKey,
    latitude: +lat,
    longitude: +lng,
    country: 'KH',
    locale: 'km',
    name,
    phone
  }).then(async data => {

    const doc = new PDFDocument()
    const appDomain = process.env.APP_DOMAIN
    const checkpointLink = `${appDomain}?checkpoint=${checkpointKey}`
    const checkpointQrCodeUrl = await QRCode.toDataURL(checkpointLink, { margin: 0, scale: 20 })
    const checkpointQrCodeImg = Buffer.from(checkpointQrCodeUrl.replace('data:image/png;base64,', ''), 'base64')
    const websiteLink = process.env.ABOUT_URL
    const websiteQRCodeUrl = await QRCode.toDataURL(websiteLink, { margin: 0, scale: 4 })
    const websiteQrCodeImg = Buffer.from(websiteQRCodeUrl.replace('data:image/png;base64,', ''), 'base64')
    doc.image('./public-checkpoint/track-covid.png', 0, 0, { width: 600 })
    doc.image(checkpointQrCodeImg, 55, 325, { width: 300 })
    doc.image(websiteQrCodeImg, 378, 668.5, { width: 37 })
    doc.pipe(res)
    doc.end()
  
  }).catch(error => res.status(500).json({ message: 'error' }));

}


