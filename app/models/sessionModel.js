const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema( {
    sessionId: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Session', sessionSchema);