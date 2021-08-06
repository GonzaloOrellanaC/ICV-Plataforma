import { should } from 'chai'
import mongoose from 'mongoose'
import { environment } from '../src/config'
import { Users } from '../src/models'
import { UserServices } from '../src/services'
import jsonwebtoken from 'jsonwebtoken'

const { error: errorMsg, success: successMsg } = environment.messages.services.user

should()

const user = {
    email: 'test@test.test'
}

describe('Creating a user', () => {
    context('without', () => {
        it('any arguments', async () => {
            try {
                await UserServices.createUser()
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.missingParameters)
            }
        })
        it('password', async () => {
            try {
                await UserServices.createUser(user)
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.missingParameters)
            }
        })
        it('user', async () => {
            try {
                await UserServices.createUser({}, 'password')
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.missingParameters)
            }
        })
    })
})

describe('Reset Password', () => {
    let user = null
    beforeEach(async () => {
        await mongoose.connect(environment.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        user = await Users.findOne({ email: 'javier.romero@kauel.com' })
    })

    it('generate reset token', async () => {
        try {
            const { token } = await UserServices.forgotPassword('javier.romero@kauel.com')
            token.should.be.a('string')
        } catch (error) {
            error.should.be.a('string')
        }
    })
    it('reset password', async () => {
        try {
            const { token } = await UserServices.forgotPassword('javier.romero@kauel.com')
            const decoded = jsonwebtoken.decode(token)
            const message = await UserServices.resetPassword(user._id, decoded.data, '12345678')
            message.should.be.equal(successMsg.resetPassword)
        } catch (error) {
            error.should.be.a('string')
        }
    })
})
