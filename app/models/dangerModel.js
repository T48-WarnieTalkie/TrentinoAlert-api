const mongoose = require('mongoose');
const User = require("./userModel");

const Schema = mongoose.Schema;

const dangerSchema = new Schema( {
    category: {
        type: String,
        enum: ['animale-pericoloso', 'calamita-ambientale', 'sentiero-inagibile', 'altro'],
        required: true
    },
    coordinates: {type: [Number],  validate: [coordValidator, '{PATH} doesent have 2 elements']},
    sendTimestamp: {type: Date, required: true},
    description: {type: String, required: true, maxLenght: 120},
    sentBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: {
        type: String,
        enum: ['waitingApproval', 'approved', 'rejected', 'expired'],
        required: true
    },
    expiration: {type: Date, default: null},
    //TTL
    expireAt: {type: Date, default: null}
})

function coordValidator(val) {
    return val.length == 2;
  }

module.exports = mongoose.model('Danger', dangerSchema);