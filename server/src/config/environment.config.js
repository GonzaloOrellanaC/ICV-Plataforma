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

/**
 * Environment configuration given by default parameters or environment variables if they are
 * configured, this allows to use autocomplete suggestions from the IDE. Language selection should
 * in the future be changed to a function that allows to request a certain message in a given language,
 * that way it could be used to generate messages in the required language on demand to send to the user
 * if they configured a certain language.
 */
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
    adminDefaultData: {
        name: process.env.NOMBRE,
        lastName: process.env.APELLIDO,
        email: process.env.EMAIL,
        password: process.env.PASSWORD
    },
    messages: languageSelector(process.env.DEFAULT_LANGUAGE), // Cambiar por funcion para sacar mensaje en caso de múltiples lenguajes
    adminRole: {
        name: 'admin',
        resources: {
            User: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            PermissionRole: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            Site: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            Division: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            MachinePrototype: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            Machine: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            AssignedInspection: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            },
            AssignedMaintenance: {
                'create:any': ['*'],
                'read:any': ['*'],
                'update:any': ['*'],
                'delete:any': ['*']
            }
        }
    }
}

export default environment
