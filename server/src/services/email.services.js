import Mailgun from 'mailgun.js'
import formData from 'form-data'

import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

import { environment } from '../config'

const { error: errorMsg, success: successMsg, data: dataMsg } = environment.messages.services.email

const fsPromises = fs.promises

/*
    Mailgun service initialization
*/
const mailgun = (new Mailgun(formData)).client({
    username: 'api',
    key: environment.mailApi.key
})

/*
    Function to send an email, needs a from address, to addres, a subject and an html
    message in String form.
*/
/**
 * Function to send an email
 * @param {*} from Sender of the email, in most cases this will be configured from environment
 * @param {*} to Recipient of the email
 * @param {*} subject Subject of the email
 * @param {*} html Content of the email in a string following an html format
 * @returns Result from the creation of the email
 */
const sendEmail = (from, to, subject, html) => {
    if (!from || !to || !subject || !html) {
        throw new Error(errorMsg.sendEmail)
    }
    return mailgun.messages.create(
        environment.mailApi.domain,
        {
            from,
            to,
            subject,
            html
        }
    )
}

/**
 * Function to send a password email, uses data to addornate the message.
 * The template used is in email.templates/forgotPassword.<language>.hbs where <language> corresponds to the language code.
 * The associated .json file is to preview the handlebars template using Handlebars Preview VSCode extension
 * @param {*} fullName Fullname of the recipient
 * @param {*} token Password reset token
 * @param {*} language Chosen language for the email template (e.g. 'es', 'en')
 * @param {*} email Email of the recipient
 * @returns Message, success or error of the function
 */
const forgotPasswordEmail = async (fullName, token, language, email) => {
    try {
        const htmlFile = await fsPromises.readFile(path.join(__dirname, 'email.templates', `forgotPassword.${language}.hbs`))
        const template = handlebars.compile(htmlFile.toString())

        const html = template({
            fullName,
            email,
            resetLink: environment.platform.baseUrl + environment.platform.routes.resetPassword + token,
            logoRoute: environment.platform.logoRoute,
            logoAlt: environment.platform.logoAlt,
            platformURL: environment.platform.baseUrl,
            platformName: environment.platform.name
        })
        await sendEmail(environment.mailApi.baseSender, [email], dataMsg.forgotPasswordSubject(environment.platform.name), html)
        return successMsg.resetPasswordEmail
    } catch (error) {
        throw new Error(errorMsg.forgotPasswordEmail)
    }
}

export default {
    sendEmail,
    forgotPasswordEmail
}
