export const IDM = 'idm'
export const GAME = 'game'

const SERVICES = [IDM, GAME]

export default function getServiceBaseURL(serviceName, env = process.env.NODE_ENV) {
  if (SERVICES.indexOf(serviceName) < 0) {
    throw new Error(`Invalid service name: ${serviceName}`)
  }
  switch (env) {
    case 'development':
      return `http://${serviceName}.learnersguild.dev`
    case 'test':
      return `http://${serviceName}.learnersguild.test`
    default:
      return `https://${serviceName}.learnersguild.org`
  }
}
