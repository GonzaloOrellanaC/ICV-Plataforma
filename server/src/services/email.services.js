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
const mailgun = new Mailgun(formData)

const client = mailgun.client({
    username: 'api',
    key: environment.mailApi.key
})



let platformURL;

if(environment.state === 'development') {
    platformURL = 'http://localhost:3000'
}else{
    platformURL = environment.platform.baseUrl
}

/**
 * Function to send an email
 * @param {*} from Sender of the email, in most cases this will be configured from environment
 * @param {*} to Recipient of the email
 * @param {*} subject Subject of the email
 * @param {*} html Content of the email in a string following an html format
 * @returns Result from the creation of the email
 */
const sendEmail = (typeEmail, fullName, language, email, password) => {
    return new Promise(async resolve => {
        let data = {
            logoAlt: 'Logo',
            fullName: fullName,
            platformURL: platformURL,
            platformName: 'ICV Platform',
            email: email,
            //resetLink: 'https://tesso.cl',
            password: password
        }
        
        //let transporter = nodemailer.createTransport(mailInfo);
        let from = `No responder <${environment.mailApi.baseSender}>`
        let to = email;
        let subject = "Datos nuevo usuario"
        let htmlFile = await fsPromises.readFile(path.join(`src/services/email.templates/${typeEmail}.${language}.html`));
        let template = handlebars.compile(htmlFile.toString());
        let html = template(data);

        const messageData = {
            from: from,
            to: to,
            subject: subject,
            html: html
        }
    
        if (!from || !to || !subject || !html) {
            throw new Error(errorMsg.sendEmail)
        }
        client.messages.create(
            environment.mailApi.domain,
            messageData
        ).then((res => {
            console.log(res)
            resolve(true)
        })).catch(err => {
            console.log(err);
            resolve(false)
        })
        
    })
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
            resetLink: platformURL + environment.platform.routes.resetPassword + token,
            logoRoute: environment.platform.logoRoute,
            logoAlt: environment.platform.logoAlt,
            platformURL: platformURL,
            platformName: environment.platform.name
        })
        await sendEmail(environment.mailApi.baseSender, [email], dataMsg.forgotPasswordSubject(environment.platform.name), html)
        return successMsg.resetPasswordEmail
    } catch (error) {
        throw new Error(errorMsg.forgotPasswordEmail)
    }
}
/**
 * Function to send an email
 * @param {*} from Sender of the email, in most cases this will be configured from environment
 * @param {*} to Recipient of the email
 * @param {*} subject Subject of the email
 * @param {*} html Content of the email in a string following an html format
 * @returns Result from the creation of the email
 */
 const sendEmailEndOfWork = (typeEmail, fullNameWorker, language, orderNumber, email) => {
    return new Promise(async resolve => {
        try{
            let data = {
                fullNameWorker: fullNameWorker,
                orderNumber: orderNumber,
                platformName: 'ICV Platform',
                logoRoute: environment.platform.logoRoute,
                logoAlt: environment.platform.logoAlt,
    
            }
            
            //let transporter = nodemailer.createTransport(mailInfo);
            let from = `Notificación de Orden #${orderNumber} <${environment.mailApi.baseSender}>`
            let to = email;
            let subject = "Aviso término de jornada con actividades en Orden #"+orderNumber+" pendientes"
            let htmlFile = await fsPromises.readFile(path.join(`src/services/email.templates/${typeEmail}.${language}.html`));
            let template = handlebars.compile(htmlFile.toString());
            let html = template(data);
    
            const messageData = {
                from: from,
                to: to,
                subject: subject,
                html: html
            }
        
            if (!from || !to || !subject || !html) {
                throw new Error(errorMsg.sendEmail)
            }
            client.messages.create(
                environment.mailApi.domain,
                messageData
            ).then((res => {
                console.log(res)
                resolve(true)
            })).catch(err => {
                console.log(err);
                resolve(false)
            })
        }catch (err) {
            console.log(err)
        }
        
    })
}


/**
 * Function to send an email
 * @param {*} from Sender of the email, in most cases this will be configured from environment
 * @param {*} to Recipient of the email
 * @param {*} subject Subject of the email
 * @param {*} html Content of the email in a string following an html format
 * @returns Result from the creation of the email
 */
 const sendEmailEndOfOrder = (typeEmail, numberType, fullNameWorker, language, orderNumber, email) => {
    return new Promise(async resolve => {
        try{            
            let contextMail = new String
            if(numberType == 1) {
                contextMail = 'termino de ejecución';
            }else{
                contextMail = 'aprobación de nivel ' + numberType;
            }

            let data = {
                fullNameWorker: fullNameWorker,
                orderNumber: orderNumber,
                platformName: 'ICV Platform',
                logoRoute: environment.platform.logoRoute,
                logoAlt: environment.platform.logoAlt,
                contextMail: contextMail
            }
            
            //let transporter = nodemailer.createTransport(mailInfo);
            let from = `Notificación de Orden #${orderNumber} <${environment.mailApi.baseSender}>`
            let to = email;
            let subject = "Aviso de "+ contextMail + " de Orden #"+orderNumber
            let htmlFile = await fsPromises.readFile(path.join(`src/services/email.templates/${typeEmail}.${language}.html`));
            let template = handlebars.compile(htmlFile.toString());
            let html = template(data);
    
            const messageData = {
                from: from,
                to: to,
                subject: subject,
                html: html
            }
        
            if (!from || !to || !subject || !html) {
                throw new Error(errorMsg.sendEmail)
            }
            client.messages.create(
                environment.mailApi.domain,
                messageData
            ).then((res => {
                console.log(res)
                resolve(true)
            })).catch(err => {
                console.log(err);
                resolve(false)
            })
        }catch (err) {
            console.log(err)
        }
        
    })
}
export default {
    sendEmail,
    forgotPasswordEmail,
    sendEmailEndOfWork,
    sendEmailEndOfOrder
}
