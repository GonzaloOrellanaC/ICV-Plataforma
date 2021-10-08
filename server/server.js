import express from 'express'
import path from 'path'

import { environment } from './src/config'
import { databaseLoader, expressLoader } from './src/loaders'
import { AccessControlServices } from './src/services'

/**
 * Starts server using each loader and init function and then usess app.listen to serve.
 */
const startServer = async () => {
    await databaseLoader()
    await AccessControlServices.initAccessControl()

    const app = await expressLoader();

    if(app) {
        console.log('Ok APP')
    }

    if (environment.env === 'production') {
        /* Solo se ejecuta en producción */
        console.info('The server is in production mode')
        app.use(express.static(path.resolve(__dirname, '../client/build')))

        app.get('/*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
        })
    }else{
        console.info('The server is in development mode')
    }

    app.listen(environment.port, (err) => {
        console.log(environment)
        if (err) {
            console.error('Express startup error: ', err)
            throw err
        }

        console.info(`Express server started in port: ${environment.port}`)
    })
}

startServer()
