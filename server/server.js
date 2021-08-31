import express from 'express'
import path from 'path'

import { environment } from './src/config'
import { databaseLoader, expressLoader } from './src/loaders'
import { AccessControlServices } from './src/services'

const startServer = async () => {
    await databaseLoader()
    await AccessControlServices.initAccessControl()

    const app = await expressLoader()

    if (environment.env === 'production') {
        console.info('The server is in production mode')
        app.use(express.static(path.resolve(__dirname, '../client/build')))

        app.get('/*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
        })
    }

    app.listen(environment.port, (err) => {
        if (err) {
            console.error('Express startup error: ', err)
            throw err
        }

        console.info(`Express server started in port: ${environment.port}`)
    })
}

startServer()
