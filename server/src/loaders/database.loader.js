import mongoose from 'mongoose'
import { environment } from '../config'

/**
 * Initialization of the Database, in this case MongoDB through the Mongoose ODM
 */
export default async () => {
    console.log(environment.dbURL)
    mongoose.Promise = global.Promise
    try {
        const connection = await mongoose.connect(environment.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).then(()=> {
            console.log('Conectado!!!')
            /* .... */

        }).catch(err => {
            console.log(err)
        })


        console.info(`Succesful connection to database: ${environment.dbURL}`)
        return connection
    } catch (err) {
        console.error('Error connecting to database', err)
        throw err
    }
}
