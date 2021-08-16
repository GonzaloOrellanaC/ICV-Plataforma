import passport from 'passport'

import { Users } from '../models'

import { environment } from '../config'
import { EncryptionServices } from '.'

const { error: errorMsg, success: successMsg } = environment.messages.services.user

const createUser = async (user, password) => {
    if (!user || !password) {
        throw new Error(errorMsg.missingParameters)
    }
    const registerUser = new Users(user)
    registerUser.setPassword(password)

    try {
        await registerUser.save()
        return registerUser
    } catch (error) {
        if (error.code === 11000) {
            throw new Error(errorMsg.userExists)
        } else {
            // throw error
            throw new Error(errorMsg.missingParameters)
        }
    }
}

const deleteUser = async (userId) => {
    try {
        await Users.findByIdAndDelete(userId)
        return true
    } catch (error) {
        throw new Error(errorMsg.unableToDelete)
    }
}

const authenticateUser = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('local', { session: false }, async (err, passportUser, info) => {
            if (err) {
                reject(new Error(errorMsg.unauthorized))
            }
            if (passportUser) {
                if (!passportUser.enabled) {
                    reject(new Error(errorMsg.userDisabled))
                }
                resolve(passportUser)
            }
            reject(new Error(errorMsg.badCredentials))
        })(req, res, next)
    })
}

const changePassword = async (userId, password) => {
    const findUser = await Users.findById(userId)
    if (!findUser) {
        throw new Error(errorMsg.userNotFound)
    }

    findUser.setPassword(password)
    await findUser.save()
    return successMsg.savedPassword
}

const forgotPassword = async (email) => {
    const findUser = await Users.findOneAndUpdate({ email }, { updatedAt: new Date() }, { new: true, timestamps: false })
    try {
        const token = findUser.generateResetToken()
        return { token, fullName: findUser.fullName, email: findUser.email }
    } catch (error) {
        throw new Error(errorMsg.resetToken)
    }
}

const resetPassword = async (userId, token, password) => {
    try {
        const findUser = await Users.findById(userId)
        const dataDecrypted = EncryptionServices.decrypt(token)
        const [hash, timestamp] = dataDecrypted.split('-')
        if (hash === findUser?.hash && parseInt(timestamp) === findUser?.updatedAt?.getTime()) {
            findUser.setPassword(password)
            await findUser.save()
            return successMsg.resetPassword
        } else {
            throw new Error(errorMsg.invalidToken)
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

export default {
    createUser,
    deleteUser,
    authenticateUser,
    changePassword,
    forgotPassword,
    resetPassword
}
