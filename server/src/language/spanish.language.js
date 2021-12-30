/**
 * Spanish language dictionary.
 */
export default {
    controller: {
        auth: {
            error: {
                credentialsRequired: 'Requiere ingresar tanto email como contraseña',
                informationMissing: 'Información faltante, requiere tanto email como contraseña',
                missingEmail: 'Requiere ingresar email',
                missingInfoUser: 'Error de lectura de los datos de usuario. Intente nuevamente.'
            },
            success: {
                login: 'Conectado con éxito'
            }
        },
        graphql: {
            error: {
                userDisabled: 'Usuario no habilitado'
            }
        }
    },
    schema: {
        generic: {
            error: {
                noPermission: 'No tienes los permisos requeridos para realizar esta acción'
            }
        }
    },
    services: {
        accessControl: {
            error: {
                roleNotFound: 'Rol de permisos no encontrado'
            }
        },
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
                resetPasswordEmail: 'Email de reinicio de contraseña enviado.'
            },
            data: {
                forgotPasswordSubject: (platformName) => `Reiniciar Contraseña - ${platformName}`
            }
        }
    }
}
