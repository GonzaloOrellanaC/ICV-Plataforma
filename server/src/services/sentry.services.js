import environment from "../config/environment.config";
import * as Sentry from '@sentry/node'

Sentry.init({
    dsn: environment.sentry.dsn,
    tracesSampleRate: 1.0
})

export {
    Sentry
}