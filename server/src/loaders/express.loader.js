import express from 'express'
import cookieParser from 'cookie-parser'

import cors from 'cors'
import helmet from 'helmet'

import passport from 'passport'

import { environment, localStrategy } from '../config'
import router from '../routes'

/**
 * Initialization of the Express framework and the configuration of it.
 * Configures parsers, passport, CORS, security headers and routes.
 */
export default async () => {
    const app = express()

    console.log('Iniciando node JS')

    app.use(express.json({ limit: '50mb', extended: true }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))
    app.use(cookieParser())

    /* Configure Passport */
    passport.use('local', localStrategy)
    app.use(passport.initialize())

    /* Configure Cross Origin Resource Sharing */
    app.use(cors(
        environment.env === 'production'
            ? {
                credentials: true,
                origin: true,
                optionsSuccessStatus: 200
            }
            : {
                credentials: true,
                origin: ['http://localhost:3000'],
                optionSuccessStatus: 200
            }
    ))

    /* Configuring security headers */
    app.use(helmet())

    app.use(helmet.contentSecurityPolicy({
        directives: {
            connectSrc: [
                "'self'",
                'blob:',
                environment.storageApi.url
            ],
            defaultSrc: [
                "'self'",
                'data:',
                'blob:',
                environment.storageApi.url
            ],
            fontSrc: [
                "'self'",
                'blob:',
                'fonts.gstatic.com',
                'data:'
            ],
            imgSrc: [
                "'self'",
                'data:',
                'blob:',
                environment.storageApi.url
            ],
            styleSrc: [
                "'self'",
                'blob:',
                "'unsafe-inline'",
                'fonts.googleapis.com'
            ],
            scriptSrc: [
                "'self'",
                'blob:',
                "'unsafe-inline'",
                "'unsafe-eval'",
                environment.storageApi.url
            ]
        }
    }))

    app.use((req, res, next) => {
        res.setHeader(
            'Permissions-Policy',
            'geolocation=()'
        )
        next()
    })

    /* Configure Routes */
    app.use('/', router);

    return app
}
