const express = require('express')
const Checkpoint = require('../models/checkpoint')
const UserCheckpoint = require('../models/user-checkpoint');


const oneDay = 1000 * 60 * 60 * 24
const estimatedDiagnosisDelay = Number(process.env['QUARANTINE_DAYS']) * oneDay

const apiRouter = express.Router()

const phoneNumberRegex = /(855|\+855|)(0*)((1[0-9]|2[3-6]|3[12345689]|4[2-4]|5[2-5]|6[0-9]|7[1-9]|8[13456789]|9[02356789])\d{6,7})/;


apiRouter.post('/checkpoints/send', async (req, res) => {
  
  console.log(req.body);
  const { checkpointKey, userUuid} = req.body;
  
  if (!checkpointKey || !userUuid) {
    res.status(200).json({ message: 'invalid data'});
    return;
  }

  const { phone } = req.body;
  
  if (!phone || typeof phone !== 'string' || !phoneNumberRegex.test(phone)) {
    delete req.body.phone;
  }

  try {
    const createdCheckpoint = await UserCheckpoint.create(req.body);
    console.log({ createdCheckpoint });
    res.status(201).json({ message: 'success' });
  } catch(e) {
    res.status(201).json({ message: 'failed' });
  }
});

apiRouter.get('/checkpoints', (req, res) => {
  const startSearchTimestamp = Date.now() - estimatedDiagnosisDelay
  Checkpoint.find({ timestamp: { $gte: startSearchTimestamp } }, function (err, checkpoints) {
    if (err || !checkpoints) {
      if (err) {
        console.error(err)
      }
      res.send({ error: true })
    } else {
      res.send({ error: false, checkpoints })
    }
  })
})

module.exports = apiRouter
