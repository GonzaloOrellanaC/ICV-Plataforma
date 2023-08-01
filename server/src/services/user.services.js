import passport from 'passport'

import { Users } from '../models'

import { environment } from '../config'
import { EncryptionServices } from '.'
import { Sentry } from './sentry.services'

const { error: errorMsg, success: successMsg } = environment.messages.services.user

/**
 * Creates an user with data and password, it's important that the user object follows
 * the template given by the user model, needs some type of verification for that. Password
 * is set apart.
 * @param {*} user User data, should follow User model schema
 * @param {*} password User password, can not be falsy
 * @returns Users, newly created user document
 */
const createUser =  (user, password) => {
    //console.log(user, password)
    return new Promise(async resolve => {
        if (!user || !password) {
            resolve(false)
            Sentry.captureException(errorMsg)
            throw new Error(errorMsg.missingParameters)
        }
        if (!user.email) {
            user.email = 'x@x.xx'
        }
        const registerUser = new Users(user)
        registerUser.setPassword(password)
        try {
            console.log('Se guarda usuario')
            await registerUser.save()
            resolve(true)
        } catch (error) {
            Sentry.captureException(error)
            if (error.code === 11000) {
                resolve(false)
                throw new Error(errorMsg.userExists)
            } else {
                resolve(false)
                // throw error
                throw new Error(errorMsg.missingParameters)
            }
        }
    })
}

const editUser = async (user, id) => {
    /* console.log('Usuario es: ', user) */
    try {
        /* Users.findByIdAndUpdate(id, user, (err, user) => {
            Sentry.captureException(err)
            console.log('Usuario editado: ', user);
            if(user) {
                return user
            }
        }); */
        const response = await Users.findByIdAndUpdate(id, user, {new: true})
        return response
    } catch (err) {
        Sentry.captureException(err)
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
            Sentry.captureException(errorMsg)
            throw new Error(errorMsg.userNotFound)
        }
        return deleted
    } catch (error) {
        Sentry.captureException(error)
        throw new Error(errorMsg.unableToDelete)
    }
}

/* Obtener usuario */

const getUser = async (userId) => {
    try{
        const user = await Users.findById(userId);
        return user
    }catch (err) {
        console.log(err)
        Sentry.captureException(err)
    }
}

const getUserByRole = (role) => {
    try{
        return new Promise(resolve => {
            Users.find({roles: {$in: [role]}}, (err, user) => {
                Sentry.captureException(err)
                resolve(user)
            });
        })
        
    }catch (err) {
        console.log(err)
        Sentry.captureException(err)
    }
}

const getUserByRoleAndSite = (role, obra) => {
    try{
        return new Promise(resolve => {
            Users.find({obras: [obra], roles: {$in: [role]}}, (err, user) => {
                Sentry.captureException(err)
                resolve(user)
            });
        })
        
    }catch (err) {
        console.log(err)
        Sentry.captureException(err)
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
    /* console.log(req) */
    return new Promise((resolve, reject) => {
        passport.authenticate('local', { session: false }, async (err, passportUser, info) => {
            Sentry.captureException(err)
            if (err) {
                reject(new Error(errorMsg.unauthorized))
            }
            if (passportUser) {
                if (!passportUser.enabled) {
                    Sentry.captureException(errorMsg)
                    reject(new Error(errorMsg.userDisabled))
                }
                resolve(passportUser)
            }
            Sentry.captureException(errorMsg)
            reject(new Error(errorMsg.badCredentials))
        })(req, res, next)
    })
}

const authenticateUserWithRut = (req, res, next) => {
    /* console.log(req) */
    return new Promise((resolve, reject) => {
        passport.authenticate('local', { session: false }, async (err, passportUser, info) => {
            Sentry.captureException(err)
            if (err) {
                reject(new Error(errorMsg.unauthorized))
            }
            if (passportUser) {
                if (!passportUser.enabled) {
                    Sentry.captureException(errorMsg)
                    reject(new Error(errorMsg.userDisabled))
                }
                resolve(passportUser)
            }
            Sentry.captureException(errorMsg)
            reject(new Error(errorMsg.badCredentials))
        })(req, res, next)
    })
}

/**

 */
 const logout = (userId) => {
    return new Promise( async (resolve, reject) => {
        try {
            const findUser = await Users.findById(userId);
            if(findUser) {
                resolve(findUser)
            }
        } catch (error) {
            Sentry.captureException(error)
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
    try {
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
    } catch (error) {
        Sentry.captureException(error)
    }
}

/**
 * Initiates reset password process for a given email
 * @param {*} email Email for which to initiate the reset password process
 * @returns Object, data to generate email to send (reset token, fullname, email)
 */
const forgotPassword = async (email) => {
    const findUser = await Users.findOneAndUpdate({ email }, { updatedAt: new Date() }, { new: true, timestamps: false })
    //console.log(findUser);
    if(!findUser) {
        return { token: null, fullName: null, email: null }
    }
    else{
        try {
            const token = findUser.generateResetToken()
            return { token, fullName: findUser.fullName, email: findUser.email }
        } catch (error) {
            Sentry.captureException(error)
            console.log(errorMsg.resetToken)
            throw new Error(errorMsg.resetToken)
        }
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
            Sentry.captureException(errorMsg)
            throw new Error(errorMsg.invalidToken)
        }
    } catch (error) {
        Sentry.captureException(error)
        throw new Error(error.message)
    }
}

export default {
    createUser,
    editUser,
    deleteUser,
    authenticateUser,
    authenticateUserWithRut,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    getUser,
    getUserByRole,
    getUserByRoleAndSite
}
