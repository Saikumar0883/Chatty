const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    time: {
        type: Date,
        // default: Date.now 
    }
})

const Message = mongoose.model('Message',messageSchema);
module.exports = Message