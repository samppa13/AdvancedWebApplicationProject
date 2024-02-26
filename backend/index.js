require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const User = require('./models/User')
const Chat = require('./models/Chat')

const mongoDB = 'mongodb+srv://samppa97:Ujfuplboub@cluster0.xdr7dpw.mongodb.net/recipeApp?retryWrites=true&w=majority'
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const initializePassport = require('./passport-config')
initializePassport()

app.post('/api/user/register/', async (request, response) => {
    const body = request.body
    let user = await User.findOne({ email: body.email })
    if (user) {
        return response.status(400).json({ error: `${user.email} already in use` })
    }
    user = await User.findOne({ username: body.username })
    if (user) {
        return response.status(400).json({ error: `${user.username} already in use` })
    }
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const newUser = new User({
        email: body.email,
        username: body.username,
        password: hashedPassword
    })
    const savedUser = await newUser.save()
    response.json(savedUser)
})

app.post('/api/user/login', upload.none(), async (request, response) => {
    const user = await User.findOne({ email: request.body.email })
    if (!user) {
        return response.status(403).json({ message: 'Login fails' })
    }
    const boolean = await bcrypt.compare(request.body.password, user.password)
    if (boolean) {
        const jwtPayload = {
            id: user._id,
            email: user.email
        }
        jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
                expiresIn: 120
            },
            (error, token) => {
                response.json({ success: true, token: token })
            }
        )
    }
    else {
        return response.status(403).json({ message: 'Login fails' })
    }
})

app.get('/api/users',
    passport.authenticate('jwt', { session: false }),
    async (request, response) => {
        let users = await User.find({})
        users = users.map(({ username, _id, title, information }) => ({ username: username, id: _id, title: title, information: information }))
        response.json({ users: users })
    }
)

app.post('/api/like/user/:id',
    passport.authenticate('jwt', { session: false }),
    async (request, response) => {
        let user = await User.findById(request.params.id)
        user.likeUsers = user.likeUsers.concat(request.body.likeUserId)
        user.dislikeUsers = user.dislikeUsers.filter((id) => id.toHexString() !== request.params.id)
        await user.save()
        user = await User.findById(request.body.likeUserId)
        if (user.likeUsers.find((id) => id.toHexString() === request.params.id)) {
            const newChat = new Chat({
                lastDate: Date.now(),
                user1: request.params.id,
                user2: request.body.likeUserId
            })
            await newChat.save()
            return response.json({ message: 'Created new chat' })
        }
        response.json({ message: 'Succesful' })
    }
)

app.post('/api/dislike/user/:id',
    passport.authenticate('jwt', { session: false }),
    async (request, response) => {
        const user = await User.findById(request.params.id)
        user.dislikeUsers = user.dislikeUsers.concat(request.body.dislikeUserId)
        await user.save()
    }
)

app.get('/api/chats/:userId',
    passport.authenticate('jwt', { session: false }),
    async (request, response) => {
        let chats = await Chat.find({}).populate('user1', { username: 1 }).populate('user2', { username: 1 })
        chats = chats.filter((chat) => (chat.user1._id.toHexString() === request.params.userId || chat.user2._id.toHexString() === request.params.userId))
        chats = chats.map((chat) => {
            if (chat.user1._id.toHexString() === request.params.userId) {
                return {
                    id: chat._id,
                    user: chat.user2,
                    messages: chat.messages,
                    lastDate: chat.lastDate
                }
            }
            if (chat.user2._id.toHexString() === request.params.userId) {
                return {
                    id: chat._id,
                    user: chat.user1,
                    messages: chat.messages,
                    lastDate: chat.lastDate
                }
            }
        })
        response.json({ chats: chats })
    }
)

app.get('/api/chat/:id',
    passport.authenticate('jwt', { session: false }),
    async (request, response) => {
        const chat = await Chat.findById(request.params.id)
        response.json({ chat: chat })
    }
)

app.put('/api/chat/:id',
    passport.authenticate('jwt', { session: false }),
    async (request, response) => {
        let chat = await Chat.findById(request.params.id)
        const date = Date.now()
        chat.messages = chat.messages.concat({ sender: request.body.sender, date: date, message: request.body.message })
        chat.lastDate = date
        await chat.save()
        response.json({ messages: chat.messages })
    }
)

app.listen(1234)