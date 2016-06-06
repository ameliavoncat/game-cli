import path from 'path'
import fs from 'fs'

const LGJWT_FILENAME = path.join(process.env.HOME, '.lgJWT')

function getLGJWT() {
  try {
    fs.accessSync(LGJWT_FILENAME, fs.R_OK) // will throw if not readable
  } catch (error) {
    return null
  }
  return fs.readFileSync(LGJWT_FILENAME).toString()
}

function run(commandAndArgv) {
  process.env.APP_BASEURL = 'https://game-cli.learnersguild.org'
  const lgJWT = getLGJWT()
  if (!lgJWT) {
    console.error(`***Error: No lgJWT SSO token available in ${LGJWT_FILENAME} -- try creating one.`)
    return Promise.resolve(1)
  }
  const [commandName, ...argv] = commandAndArgv
  const command = require('./')[commandName]
  return command.invoke(argv, console.log, {lgJWT})
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  const argv = process.argv.slice(2)
  run(argv)
    .then(exitCode => process.exit(exitCode))
    .catch(error => console.error(error.stack))
}
