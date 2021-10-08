import mongoose from 'mongoose'
import { environment } from '../config'
import { PermissionRoles } from '../models'

/**
 * Initialization of the Database, in this case MongoDB through the Mongoose ODM
 */
export default async () => {
    mongoose.Promise = global.Promise
    try {
        const connection = await mongoose.connect(environment.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).then(()=> {
            /* .... */

            /* const rol = await PermissionRoles.findOne({
                name: ADMIN
            }) */
        })


        console.info(`Succesful connection to database: ${environment.dbURL}`)
        return connection
    } catch (err) {
        console.error('Error connecting to database', err)
        throw err
    }
}
