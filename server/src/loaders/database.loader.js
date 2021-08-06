import mongoose from 'mongoose'
import { environment } from '../config'

export default async () => {
    mongoose.Promise = global.Promise
    try {
        const connection = await mongoose.connect(environment.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.info(`Succesful connection to database: ${environment.dbURL}`)
        return connection
    } catch (err) {
        console.error('Error connecting to database', err)
        throw err
    }
}
