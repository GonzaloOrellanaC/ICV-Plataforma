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

/*
    Function to send a forgot password email, uses the fullname of the person to addornate the message,
    a token to include in the url link for password reset, a language argument that should be 'es' or 'en' and the
    to argument which is the receiver of the email.
    The template used is in email.templates/forgotPassword.<language>.hbs where <language> corresponds to the language code.
    The associated .json file is to preview the handlebars template using Handlebars Preview VSCode extension
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
