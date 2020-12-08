const express = require('express')
const Checkpoint = require('../models/checkpoint')
const UserCheckpoint = require('../models/user-checkpoint');


const oneDay = 1000 * 60 * 60 * 24
const estimatedDiagnosisDelay = Number(process.env['QUARANTINE_DAYS']) * oneDay

const apiRouter = express.Router()

apiRouter.post('/checkpoints/send', async (req, res) => {
  
  const { checkpointKey, userUuid} = req.body;
  
  if (!checkpointKey || !userUuid) {
    res.status(200).json({ message: 'invalid data'});
    return;
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
