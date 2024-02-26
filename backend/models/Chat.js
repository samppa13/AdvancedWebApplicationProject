const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    lastDate: Date,
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            date: Date,
            message: String
        }
    ]
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat