/**
 * English language dictionary.
 */
export default {
    controller: {
        auth: {
            error: {
                credentialsRequired: 'Requires both email and password',
                informationMissing: 'Missing information, requires both email and password',
                missingEmail: 'Requires email address'
            },
            success: {
                login: 'Logged in successfully'
            }
        },
        graphql: {
            error: {
                userDisabled: 'Disabled user'
            }
        }
    },
    schema: {
        generic: {
            error: {
                noPermission: 'You do not have the required permissions for this action'
            }
        }
    },
    services: {
        accessControl: {
            error: {
                roleNotFound: 'Permission Role not found'
            }
        },
        user: {
            error: {
                badCredentials: 'Bad Credentials',
                invalidToken: 'Error changing password. Invalid Token',
                missingParameters: 'Missing parameters',
                resetToken: 'Could\'t generate token',
                unableToDelete: 'Usuario couldn\'t be deleted',
                unauthorized: 'Unauthorized',
                userDisabled: 'Disabled user',
                userExists: 'User already exists',
                userNotFound: 'User not found'
            },
            success: {
                resetPassword: 'Password resetted correctly',
                resetPasswordEmail: 'Reset password email sent',
                savedPassword: 'Password saved correctly'
            }
        },
        email: {
            error: {
                forgotPasswordEmail: 'Couldn\'t create html for forgot password email.',
                sendEmail: 'Parameters not filled properly.'
            },
            success: {
                resetPasswordEmail: 'Could\'t send password reset email'
            },
            data: {
                forgotPasswordSubject: (platformName) => `Reset Password - ${platformName}`
            }
        }
    }
}
