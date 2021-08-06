import { should } from 'chai'
import { EncryptionServices } from '../src/services'

should()

describe('Encryption and decryption', () => {
    context('with string', () => {
        it('they should be equal', () => {
            const stringTest = 'Testing string'
            const encrypted = EncryptionServices.encrypt(stringTest)
            const decrypted = EncryptionServices.decrypt(encrypted)
            decrypted.should.be.equal(stringTest)
        })
    })
})
