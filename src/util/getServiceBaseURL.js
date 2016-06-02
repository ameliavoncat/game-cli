export const IDM = 'idm'
export const GAME = 'game'

const SERVICES = [IDM, GAME]

export default function getServiceBaseURL(serviceName) {
  if (SERVICES.indexOf(serviceName) < 0) {
    throw new Error(`Invalid service name: ${serviceName}`)
  }
  return process.env.NODE_ENV && process.env.NODE_ENV === 'development' ?
    `http://${serviceName}.learnersguild.dev` :
    `https://${serviceName}.learnersguild.org`
}
