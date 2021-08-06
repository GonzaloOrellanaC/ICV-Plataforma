import { should } from 'chai'
import { environment } from '../src/config'
import { EmailServices } from '../src/services'

const { error: errorMsg, success: successMsg } = environment.messages.services.email

should()

describe('Emailing', () => {
    context('without arguments', () => {
        it('should return Error', async () => {
            try {
                await EmailServices.sendEmail()
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.sendEmail)
                // expect(() => { throw error }).to.throw(errorMsg.sendEmail)
            }
        })
        it('should return Error', async () => {
            try {
                await EmailServices.sendEmail('javier.romero@kauel.com')
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.sendEmail)
            }
        })
        it('should return Error', async () => {
            try {
                await EmailServices.sendEmail('javier.romero@kauel.com', 'javier.romero@kauel.com')
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.sendEmail)
            }
        })
        it('should return Error', async () => {
            try {
                await EmailServices.sendEmail('javier.romero@kauel.com', 'javier.romero@kauel.com', 'Prueba')
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.sendEmail)
            }
        })
    })

    context('create email html', () => {
        it('without parameters', async () => {
            try {
                await EmailServices.forgotPasswordEmail('Prueba', 'token')
            } catch (error) {
                error.should.be.an('error')
                error.message.should.be.equal(errorMsg.forgotPasswordEmail)
            }
        })
        it('with parameters', async () => {
            const html = await EmailServices.forgotPasswordEmail('Prueba', 'token', 'es', 'javier.romero@kauel.com')
            html.should.be.equal(successMsg.resetPasswordEmail)
        })
    })

    /* context('with arguments', () => {
        it('should return Object', () => {
            return EmailServices.sendEmail('javier.romero@kauel.com', 'javier.romero@kauel.com', 'Prueba', 'Test')
                .then(result => expect(result).should.be.an('object'))
        })
    }) */
})
