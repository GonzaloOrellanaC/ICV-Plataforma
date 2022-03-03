/* Mongoose */
import { model, Schema } from 'mongoose'

/* Crypto */
import crypto from 'crypto'

/* JWT */
import jwt from 'jsonwebtoken'
import { environment } from '../config'
import { EncryptionServices } from '../services'

/* User Schema */
const UsersSchema = new Schema({
    email: {
        type: Schema.Types.String,
        lowercase: true,
        unique: [true, 'Email has already been used'],
        validate: {
            validator: (value) => {
                return /(^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+))\w+/g.test(value)
            },
            message: props => `${props.value} it's not an email`
        },
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true,
        default: 'John'
    },
    lastName: {
        type: Schema.Types.String,
        required: true,
        default: 'Doe'
    },
    rut: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.Number
    },
    role: {
        type: Schema.Types.String
    },
    hidden: {
        type: Schema.Types.Boolean,
        default: false
    },
    sites: {
        type: Schema.Types.String,
    },
    permissionsReports:{
        type: Schema.Types.Array
    },
    permissionsUsers:{
        type: Schema.Types.Array
    },
    createdBy:{
        type: Schema.Types.String
    },
    updatedBy:{
        type: Schema.Types.String
    },
    imageUrl:{
        type: Schema.Types.String
    },
    enabled: {
        type: Schema.Types.Boolean,
        default: true
    },
    sign: {
        type: Schema.Types.String
    },
    hash: { type: String },
    salt: { type: String }
},
{
    timestamps: true
}
)

/**
 * FullName Virtual
 * Allows to obtain a virtual document property with the full name of the user without
 * saving it to the database by concatenating name and last name
 */
UsersSchema.virtual('fullName')
    .get(function () { return `${this.name} ${this.lastName}` })

/**
 * Method to set the password of the user using crypto to generate a salt and then
 * a hash that are saved to database
 * @param {String} password - Password string argument
 */
UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 200000, 64, 'sha512').toString('hex')
}

/**
 * Method to validate password of an user trying to authentica by using its salt to compare the
 * entered password with the saved hash
 * @param {String} password - Password string argument
 * @returns - true if it's correct false if not
 */
UsersSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 200000, 64, 'sha512').toString('hex')
    return this.hash === hash
}

/**
 * Method to generate a JSON Web Token using the configured secret and a given expiration date,
 * it contains the email and id.
 * @returns - Returs the JWT string to be set as a cookie on authentication
 */
UsersSchema.methods.generateJWT = function () {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 60)

    return jwt.sign({
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, environment.jwtKey)
}

UsersSchema.methods.generateResetToken = function () {
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 1)
    const data = EncryptionServices.encrypt(`${this.hash}-${new Date(this.updatedAt).getTime()}`)

    return jwt.sign({
        id: this._id,
        data: data,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, environment.resetKey)
}

/* Creates the model from the User Schema */
const Users = model('User', UsersSchema)

export default Users
