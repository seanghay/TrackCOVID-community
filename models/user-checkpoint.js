const mongoose = require('mongoose')

const userCheckpointSchema = new mongoose.Schema({
    userUuid: {
        type: String,
        required: true,
    },
    checkpointKey: {
        type: String,
        required: true,
    }
}, { 
    timestamps: true
});

const UserCheckpoint = mongoose.model('UserCheckpoint', userCheckpointSchema)

module.exports = UserCheckpoint
