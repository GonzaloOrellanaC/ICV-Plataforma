import passport from 'passport'

import { Users } from '../models'

import { environment } from '../config'
import { EncryptionServices } from '.'

const { error: errorMsg, success: successMsg } = environment.messages.services.user

/**
 * Creates an user with data and password, it's important that the user object follows
 * the template given by the user model, needs some type of verification for that. Password
 * is set apart.
 * @param {*} user User data, should follow User model schema
 * @param {*} password User password, can not be falsy
 * @returns Users, newly created user document
 */
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

/**
 * Deletes an user using it's id.
 * @param {*} userId ID of the user to delete in DB
 * @returns Users, the deleted user document
 */
const deleteUser = async (userId) => {
    try {
        const deleted = await Users.findByIdAndDelete(userId)
        if (!deleted) {
            throw new Error(errorMsg.userNotFound)
        }
        return deleted
    } catch (error) {
        throw new Error(errorMsg.unableToDelete)
    }
}

/**
 * Authentication middleware, uses req, res, next from the express request that applies it
 * to authenticate via local strategy of passport.
 * @param {*} req Expres request
 * @param {*} res Express response
 * @param {*} next Express next
 * @returns resolves or rejects the request, on resolve returns passportUser
 */
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

/**

 */
 const logout = (userId) => {
    return new Promise( async (resolve, reject) => {
        const findUser = await Users.findById(userId);
        if(findUser) {
            resolve(findUser)
        }
    })
}

/**
 * Allows to change password through the user ID.
 * @param {*} userId ID of the User in DB
 * @param {*} password New password to change
 * @returns Message, success or error message
 */
const changePassword = async (userId, password) => {
    const findUser = await Users.findById(userId)
    if (!password) {
        throw new Error(errorMsg.missingParameters)
    }
    if (!findUser) {
        throw new Error(errorMsg.userNotFound)
    }

    findUser.setPassword(password)
    await findUser.save()
    return successMsg.savedPassword
}

/**
 * Initiates reset password process for a given email
 * @param {*} email Email for which to initiate the reset password process
 * @returns Object, data to generate email to send (reset token, fullname, email)
 */
const forgotPassword = async (email) => {
    const findUser = await Users.findOneAndUpdate({ email }, { updatedAt: new Date() }, { new: true, timestamps: false })
    try {
        const token = findUser.generateResetToken()
        return { token, fullName: findUser.fullName, email: findUser.email }
    } catch (error) {
        throw new Error(errorMsg.resetToken)
    }
}

/**
 * Resets password given a valid reset token, userId and new password
 * @param {*} userId ID of the user in DB
 * @param {*} token Password reset token
 * @param {*} password New password
 * @returns Message, success or error depending the outcome
 */
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
    logout,
    changePassword,
    forgotPassword,
    resetPassword
}
