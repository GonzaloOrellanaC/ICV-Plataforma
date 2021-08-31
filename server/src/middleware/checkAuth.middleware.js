import jwt from 'express-jwt'

import { environment } from '../config'

/**
 * Function that allows to obtain the authentication token from jwt cookie of a request.
 * @param {Object} req Request body.
 */
const getTokenFromCookies = (req) => {
    return req.cookies.jwt
}

/**
 * Function that allows to obtain the token from the url of a request, specifically used in the
 * case of a password reset token
 * @param {*} req Request body
 */
const getTokenFromURL = (req) => {
    const { params: { token } } = req
    return token
}

/**
 * Auth allows a request to be authenticated, required means that the token extracted from the headers
 * has to be authenticated succesfully to allow the request to be valid, while optional allows to extract
 * data from the token but a valid token or a token itself are not necessary to validate the request
 * @property {function} required - Middleware that requires credentials to be valid.
 * @property {function} optional - Middleware that does not require credentials to be valid.
 * @property {function} reset - Middleware that verifies the validity of a reset password token.
 */
export default {
    required: jwt({
        secret: environment.jwtKey,
        userProperty: 'payload',
        getToken: getTokenFromCookies,
        algorithms: ['HS256']
    }),
    optional: jwt({
        secret: environment.jwtKey,
        userProperty: 'payload',
        getToken: getTokenFromCookies,
        credentialsRequired: false,
        algorithms: ['HS256']
    }),
    reset: jwt({
        secret: environment.resetKey,
        userProperty: 'payload',
        getToken: getTokenFromURL,
        algorithms: ['HS256']
    })
}
