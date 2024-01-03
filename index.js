const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const session = require('express-session')
const User = require('../models/User')

app.use(express.json())

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email: email })
    return user
}

const getUserById = async (id) => {
    const user = await User.findById(id)
    return user
}

const initializePassport = require('../pasport-config')
initializePassport(passport, getUserByEmail, getUserById)

app.use(session({
    secret: 'njflnsdfjnjjnjk',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/api/user/register', async (request, response) => {
    const body = request.body
    const user = await User.findOne({ email: body.email })
    if (user) {
        return response.status(400).json({ error: `${user.email} already in use` })
    }
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const newUser = new User({
        email: body.email,
        password: hashedPassword
    })
    const savedUser = await newUser.save()
    response.json(savedUser)
})

app.post('/api/user/login',
    passport.authenticate('local', { failureMessage: true }),
    async (request, response) => {
        return response.status(200).json({ message: 'Login succesful' })
    }
)

app.listen(3000)