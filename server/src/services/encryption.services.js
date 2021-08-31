import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

/**
 * Allows a string to be encrypted
 * @param {*} text String to encrypt
 * @returns Encrypted message in HEX
 */
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return encrypted.toString('hex')
}

/**
 * Allows a string in HEX to be decrypted
 * @param {*} encrypted Encrypted message in HEX string
 * @returns Decrypted string message
 */
const decrypt = (encrypted) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()])
    return decrypted.toString()
}

export default {
    encrypt,
    decrypt
}
