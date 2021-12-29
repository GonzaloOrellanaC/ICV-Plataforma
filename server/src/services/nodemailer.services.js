import nodemailer from "nodemailer";
import mg from 'nodemailer-mailgun-transport'
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import environment from "../config/environment.config";

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
            platformURL: 'https://icv-plataforma-mantencion.azurewebsites.net',
            platformName: 'ICV Platform',
            email: email,
            resetLink: 'https://tesso.cl',
            password: password
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

export default {
    sendEmail
}