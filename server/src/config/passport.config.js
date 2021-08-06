/* Passport */
import passportLocal from 'passport-local'

/* Models */
import { Users } from '../models'

const LocalStrategy = passportLocal.Strategy

/**
 * Estrategia de Passport que permite el uso de cuentas locales en el servidor
 * @param {Object} user - objeto de entrada que define formato de credenciales.
 * @param {callback} verify - Callback that verifies the validity of the credentials.
 * @param {string} verify.email- Credentials email.
 * @param {string} verify.password- Credentials password.
 * @param {callback} verify.done - Callback that returns the result of verification.
 */
export const localStrategy = new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, (email, password, done) => {
    Users.findOne({ email })
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                return done('email or password is invalid', false)
            }
            return done(null, user)
        }).catch((err) => {
            throw err
        })
})
