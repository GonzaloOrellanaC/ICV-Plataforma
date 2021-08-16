import { environment } from '../config'
import { EmailServices, UserServices } from '../services'

const { error: errorMsg, success: successMsg } = environment.messages.controller.auth

const login = async (req, res, next) => {
    const { body: { user } } = req

    if (!user.email || !user.password) {
        return res.status(400).end(errorMsg.credentialsRequired)
    }

    try {
        const authenticatedUser = await UserServices.authenticateUser(req, res, next)
        res.cookie('jwt', authenticatedUser.generateJWT(), {
            httpOnly: true,
            ...(environment.env === 'production' && { secure: true }),
            ...(environment.env === 'production' && { sameSite: 'strict' })
        })
        return res.status(200).end(successMsg.login)
    } catch (error) {
        console.error(error.message)
        return res.status(401).end(error.message)
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

    if (!email) {
        return res.status(400).end(errorMsg.missingEmail)
    }

    try {
        const { token, fullName, email: sendEmail } = await UserServices.forgotPassword(email)
        const message = await EmailServices.forgotPasswordEmail(fullName, token, 'es', sendEmail)
        res.status(200).json({ message })
    } catch (error) {
        console.log(error.message)
        return res.status(400).end(error.message)
    }
}

const resetPassword = async (req, res, next) => {
    const { payload: { id, token }, body: { password } } = req

    try {
        const message = await UserServices.resetPassword(id, token, password)
        res.status(200).json({ message })
    } catch (error) {
        console.log(error.message)
        return res.status(400).end(error.message)
    }
}

export default {
    login,
    register,
    forgotPassword,
    resetPassword
}
