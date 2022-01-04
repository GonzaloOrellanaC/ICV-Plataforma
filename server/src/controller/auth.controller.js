import { environment } from '../config'
import { EmailServices, UserServices } from '../services'

const { error: errorMsg, success: successMsg } = environment.messages.controller.auth

const login = async (req, res, next) => {
    const { body: { user } } = req;
    console.log(user)
    if (!user.email || !user.password) {
        return res.status(400).end(errorMsg.credentialsRequired)
    }
    try {
        const authenticatedUser = await UserServices.authenticateUser(req, res, next);
        res.cookie('jwt', authenticatedUser.generateJWT(), {
            httpOnly: true,
            ...(environment.env === 'production' && { secure: true }),
            ...(environment.env === 'production' && { sameSite: 'strict' })
        })
        console.log(authenticatedUser)
        return res.status(200).json(authenticatedUser);
    } catch (error) {
        console.error(error.message)
        return res.status(401).send(error.message)
    }
}

const logout = async (req, res, next) => {
    console.log('Inicio de revisión de usuario ', req.body.userData)
    const user = req.body.userData;

    if( !user ) {
        return res.status(400).end(errorMsg.missingInfoUser)
    } else {
        const userOut = await UserServices.logout(user._id);
        console.log('Usuario: ', userOut)
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
    //console.log('olvidamos la passw', req)
    const { body: { email } } = req

    if (!email) {
        return res.status(400).end(errorMsg.missingEmail)
    }

    try {
        const { token, fullName, email: sendEmail } = await UserServices.forgotPassword(email);
        console.log(token, fullName, email)

        if(!token) {
            res.status(200).json({status: 'no-email', message: 'Email no encontrado. Verifique si se encuentra escrito correctamente, de lo contrario contacte a su administrador.'})
        }else{
            const message = await EmailServices.forgotPasswordEmail(fullName, token, 'es', sendEmail)
            res.status(200).json({ message })
        }
        
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).end(error.message)
    }
}

const resetPassword = async (req, res, next) => {
    console.log(req)
    const { payload: { id, data }, body: { password } } = req

    try {
        const message = await UserServices.resetPassword(id, data, password)
        res.status(200).json({ message })
    } catch (error) {
        console.log(error.message)
        return res.status(400).end(error.message)
    }
}

export default {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
}
