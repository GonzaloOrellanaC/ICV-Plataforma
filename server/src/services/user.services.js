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
const createUser =  (user, password) => {
    //console.log(user, password)
    return new Promise(async resolve => {
        if (!user || !password) {
            resolve(false)
            throw new Error(errorMsg.missingParameters)
        }
        const registerUser = new Users(user)
        registerUser.setPassword(password)
        try {
            console.log('Se guarda usuario')
            await registerUser.save()
            resolve(true)
        } catch (error) {
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
    console.log('Usuario es: ', user)
    try {
        Users.findByIdAndUpdate(id, user, (err, user) => {
            console.log('Usuario editado: ', user);
            if(user) {
                return user
            }
        });
    } catch (err) {

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

/* Obtener usuario */

const getUser = async (userId) => {
    try{
        const user = await Users.findById(userId);
        return user
    }catch (err) {
        console.log(err)
    }
}

const getUserByRole = (role) => {
    try{
        return new Promise(resolve => {
            Users.find({role: role}, (err, user) => {
                resolve(user)
            });
        })
        
    }catch (err) {
        console.log(err)
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
            //console.log('Usuario Passport:', passportUser)
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

const authenticateUserWithRut = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('local', { session: false }, async (err, passportUser, info) => {
            //console.log('Usuario Passport:', passportUser)
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
    //console.log(findUser);
    if(!findUser) {
        return { token: null, fullName: null, email: null }
    }
    else{
        try {
            const token = findUser.generateResetToken()
            return { token, fullName: findUser.fullName, email: findUser.email }
        } catch (error) {
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
            throw new Error(errorMsg.invalidToken)
        }
    } catch (error) {
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
    getUserByRole
}
