const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

module.exports = () => {
    const authenticateUser = async (jwtPayload, done) => {
        const user = await User.findOne({ email: jwtPayload.email })
        if (user) {
            return done(null, user)
        }
        return done(null, false)
    }
    passport.use(new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET
        },
        authenticateUser
    ))
}