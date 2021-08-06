export default {
    controller: {
        auth: {
            error: {
                credentialsRequired: 'Requiere ingresar tanto email como contraseña',
                informationMissing: 'Información faltante, requiere tanto email como contraseña',
                missingEmail: 'Requiere ingresar email'
            }
        },
        graphql: {
            error: {
                userDisabled: 'Usuario no habilitado'
            }
        }
    },
    services: {
        user: {
            error: {
                badCredentials: 'Credenciales incorrectas',
                invalidToken: 'Error cambiando contraseña. Token inválido',
                missingParameters: 'Faltan parámetros',
                resetToken: 'No se pudo genererar token',
                unableToDelete: 'Usuario no se pudo eliminar',
                unauthorized: 'No autorizado',
                userDisabled: 'Usuario no habilitado',
                userExists: 'Usuario ya existe',
                userNotFound: 'Usuario no encontrado'
            },
            success: {
                resetPassword: 'Contraseña reiniciada correctamente',
                resetPasswordEmail: 'Correo de reinicio de contraseña enviado',
                savedPassword: 'Contraseña guardada correctamente'
            }
        },
        email: {
            error: {
                forgotPasswordEmail: 'No se pudo crear html para email de olvido de contraseña.',
                sendEmail: 'Parámetros no completados correctamente.'
            },
            success: {
                resetPasswordEmail: 'No se puedo enviar email de reinicio contraseña'
            },
            data: {
                forgotPasswordSubject: (platformName) => `Reiniciar Contraseña - ${platformName}`
            }
        }
    }
}
