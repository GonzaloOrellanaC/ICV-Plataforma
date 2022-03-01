/* import Mailgun from 'mailgun.js'
import formData from 'form-data'
 */
import nodemailer from "nodemailer";
import mg from 'nodemailer-mailgun-transport'
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import environment from "../config/environment.config";

const { error: errorMsg, success: successMsg, data: dataMsg } = environment.messages.services.email

const fsPromises = fs.promises;

const sendEmail = (typeEmail, fullName, language, email, password) => {

    return new Promise( async resolve => {
        const auth = {
            auth: {
                api_key: environment.mailApi.key,
                domain: environment.mailApi.domain
            }
        }

        let subject;

        if(typeEmail === 'newUser') {
            subject = "Datos nuevo usuario"
        }

        let data = {
            logoAlt: 'Logo',
            fullName: fullName,
            platformURL: environment.platform.baseUrl,
            platformName: 'ICV Platform',
            email: email,
            resetLink: 'https://tesso.cl',
            password: password,
            logoRoute: environment.platform.logoRoute,
            logoAlt: environment.platform.logoAlt,
        }

        let transporter = nodemailer.createTransport(mg(auth));
        let htmlFile = await fsPromises.readFile(path.join(`src/services/email.templates/${typeEmail}.${language}.html`));
        let template = handlebars.compile(htmlFile.toString());
        let html = template(data);
        
        transporter.sendMail({
            from: `No Responder --Plataforma mantención ICV <${environment.mailApi.baseSender}>`,
            to: email,
            subject: subject,
            html: html
        })
        .then(()=> {
            console.log('Mensaje enviado');
            resolve(true)
        })
        .catch(e=>{
            console.log('Error en el envio de correos: ', e);
            resolve(false)
        })
    })
}

const send = (from, to, subject, html) => {

    let auth = {
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: environment.mailApi.baseSender,
          pass: environment.mailApi.key,
        },
    }
    
    return new Promise(resolve => {
    
        let transporter = nodemailer.createTransport(auth);
    
        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: html
        })
        .then(()=> {
            console.log('Mensaje enviado');
            resolve(true)
        })
        .catch(e=>{
            console.log('Error en el envio de correos: ', e);
            resolve(false)
        })
    })
}

const forgotPasswordEmail = async (fullName, token, language, email) => {
    //console.log(fullName, language, email);
    //console.log(environment.platform.baseUrl, environment.platform.routes.resetPassword)
    return new Promise (async resolve => {
        const htmlFile = await fsPromises.readFile(path.join(`src/services/email.templates/forgotPass.${language}.html`))
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

        console.log(environment.mailApi.baseSender)
        const emailSendState = await send(environment.mailApi.baseSender, [email], dataMsg.forgotPasswordSubject(environment.platform.name), html)
        console.log(emailSendState)
        if(emailSendState) {
            resolve(successMsg.resetPasswordEmail)
        }else{
            resolve(errorMsg.forgotPasswordEmail)
        }
    })
}


export default {
    sendEmail,
    forgotPasswordEmail
}