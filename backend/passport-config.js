const LogalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const initialize = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user === null) {
            return done(null, false)
        }
        try {
            const boolean = await bcrypt.compare(password, user.password)
            if (boolean) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LogalStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        const user = getUserById(id)
        return done(null, user)
    })
}

module.exports = initialize