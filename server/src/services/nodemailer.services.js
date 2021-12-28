import nodemailer from "nodemailer";
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';

const fsPromises = fs.promises;

const sendEmail = async (typeEmail, fullName, language, email, password) => {

    const mailInfo = {
        host: "smtp.mailgun.org",
        port: 587,
        secure: true,
        auth: {
            user: 'postmaster@sandboxe24aef5e2a3f411d895e160239476418.mailgun.org',
            pass: '87de82e2474d9b622a127b2d202092db-6f4beb0a-760ed35a',
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true
        }

        /* host: "mail.tesso.cl",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'pruebas@tesso.cl',
            pass: 'T9i*L0n12%*9',
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true
        } */
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

    let transporter = nodemailer.createTransport(mailInfo);
    let htmlFile = await fsPromises.readFile(path.join(`src/services/email.templates/${typeEmail}.${language}.html`));
    let template = handlebars.compile(htmlFile.toString());
    let html = template(data);
    
    const verification = () => {
        return new Promise(resolve => {
            transporter.verify((error, success) => {
                if (error) {
                    console.log('Se ha producido un error: ', error);
                    resolve(false) 
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(true) 
                }
            })
        })
    }

    let isVerification = await verification()

    if(isVerification) {
        transporter.sendMail({
            from: 'ICV No Reply <pruebas@tesso.cl>', // sender address
            to: email, // list of receivers
            //bcc: 'teratec.solutions@gmail.com',
            subject: "Datos nuevo Administrador", // Subject line
            //text: "", // plain text body
            html: html
          })
          .then(()=> {
            console.log('Mensaje enviado');
          })
          .catch(e=>{
            console.log('Error en el envio de correos: ', e);
            return false;
          })
    }
}

export default {
    sendEmail
}