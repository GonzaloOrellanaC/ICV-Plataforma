import { environment } from '../config'
import { Users } from '../models';
import { EmailServices, UserServices } from '../services'
import { Sentry } from '../services/sentry.services'

/* Crypto */
import crypto from 'crypto'

const { error: errorMsg, success: successMsg } = environment.messages.controller.auth

const login = async (req, res, next) => {
    Sentry.captureMessage('Login por email solicitado', 'info')
    const { body: { user } } = req;
    if (!user.email || !user.password) {
        Sentry.captureException(errorMsg)
        return res.status(400).end(errorMsg.credentialsRequired)
    }
    try {
        const userFind = await Users.findOne({email: user.email}).populate('obras')
        if (userFind) {
            const hash = crypto.pbkdf2Sync(user.password, userFind.salt, 200000, 64, 'sha512').toString('hex')
            if (userFind.hash === hash) {
                Sentry.captureMessage('Login por email ' + user.rut + ' aceptado', 'info')
                return res.status(200).json(userFind);
            }
        }
        /* const authenticatedUser = await UserServices.authenticateUser(req, res, next);
        res.cookie('jwt', authenticatedUser.generateJWT(), {
            httpOnly: true,
            ...(environment.env === 'production' && { secure: true }),
            ...(environment.env === 'production' && { sameSite: 'strict' })
        })
        Sentry.captureMessage('Login por email ' + user.email + ' aceptado', 'info')
        return res.status(200).json(authenticatedUser); */
    } catch (error) {
        Sentry.captureException(error)
        console.error(error.message)
        return res.status(401).send(error.message)
    }
}

const loginRut = async (req, res, next) => {
    Sentry.captureMessage('Login por rut solicitado', 'info')
    const { body: { user } } = req;
    if (!user.rut || !user.password) {
        Sentry.captureException(errorMsg)
        return res.status(400).end(errorMsg.credentialsRequired)
    }
    try {
        const userFind = await Users.findOne({rut: user.rut}).populate('obras')
        if (userFind) {
            const hash = crypto.pbkdf2Sync(user.password, userFind.salt, 200000, 64, 'sha512').toString('hex')
            if (userFind.hash === hash) {
                Sentry.captureMessage('Login por rut ' + user.rut + ' aceptado', 'info')
                return res.status(200).json(userFind);
            }
        }
    } catch (error) {
        Sentry.captureException(error)
        console.error(error.message)
        return res.status(401).send(error.message)
    }
}

const logout = async (req, res, next) => {
    const user = req.body.userData;

    if( !user ) {
        return res.status(400).end(errorMsg.missingInfoUser)
    } else {
        const userOut = await UserServices.logout(user._id);
        return res.send(userOut);
    }
    
}

const register = async (req, res, next) => {
    const { body: { userData, password } } = req

    if (!userData.email || !password) {
        return res.status(400).end(errorMsg.informationMissing)
    }

    try {
        const registerUser = await UserServices.createUser(userData, password)
        return res.status(200).json({ user: registerUser.generateJWT() })
    } catch (error) {
        return res.status(400).end(error.message)
    }
}

const forgotPassword = async (req, res, next) => {
    const { body: { email } } = req

    console.log(email)
    if (!email) {
        return res.status(400).end(errorMsg.missingEmail)
    }

    try {
        const { token, fullName, email: sendEmail } = await UserServices.forgotPassword(email);

        if(!token) {
            res.status(200).json({status: 'no-email', message: 'Email no encontrado. Verifique si se encuentra escrito correctamente, de lo contrario contacte a su administrador.'})
        }else{
            const message = await EmailServices.forgotPasswordEmail(fullName, token, 'es', sendEmail)
            res.status(200).json({ message })
        }
        
        
    } catch (error) {
        return res.status(400).end(error.message)
    }
}

const resetPassword = async (req, res, next) => {
    const { payload: { id, data }, body: { password } } = req

    try {
        const message = await UserServices.resetPassword(id, data, password);
        console.log(message)
        res.status(200).json({ message })
    } catch (error) {
        return res.status(400).end(error.message)
    }
}

export default {
    login,
    loginRut,
    register,
    logout,
    forgotPassword,
    resetPassword
}
