import raven from 'raven'

raven.patchGlobal(process.env.SENTRY_SERVER_DSN)

const errorReporter = new raven.Client(process.env.SENTRY_SERVER_DSN)

export default errorReporter
