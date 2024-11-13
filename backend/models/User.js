const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    title: String,
    information: String,
    likeUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikeUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    photos: [String]
})

const User = mongoose.model('User', userSchema)

module.exports = User