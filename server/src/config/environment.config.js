import { englishLanguage, spanishLanguage } from '../language'

const languageSelector = (select) => {
    switch (select) {
    case 'ES':
        return spanishLanguage
    case 'EN':
        return englishLanguage
    default:
        return spanishLanguage
    }
}

const environment = {
    dbURL: process.env.DB_URL || 'mongodb://localhost:27017/test',
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    jwtKey: process.env.JWT_KEY || 'secret1',
    resetKey: process.env.RESET_KEY || 'secret2',
    mailApi: {
        key: process.env.MAIL_KEY || '1665980594623da5258dfa0dc73bfd57-c27bf672-0bbf16b8',
        domain: process.env.MAIL_DOMAIN || 'sandboxe24aef5e2a3f411d895e160239476418.mailgun.org',
        baseSender: process.env.MAIL_SENDER || 'javier.romero@kauel.com'
    },
    platform: {
        name: process.env.PLATFORM_BASE_URL || 'Plataforma de prueba',
        logoRoute: process.env.PLATFORM_LOGO_ROUTE || 'http://localhost:3000/logo.png',
        logoAlt: process.env.PLATFORM_LOGO_ALT || 'LOGO',
        baseUrl: process.env.PLATFORM_BASE_URL || 'http://localhost:3000/',
        routes: {
            resetPassword: process.env.ROUTE_RESET_PASS || 'resetpassword/'
        }
    },
    messages: languageSelector(process.env.DEFAULT_LANGUAGE)
}

export default environment
