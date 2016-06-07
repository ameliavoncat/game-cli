import path from 'path'
import fs from 'fs'

const LGRC_FILENAME = path.join(process.env.HOME, '.lgrc')

function getUserOptions() {
  try {
    fs.accessSync(LGRC_FILENAME, fs.R_OK) // will throw if not readable
  } catch (error) {
    return null
  }
  const userOptions = JSON.parse(fs.readFileSync(LGRC_FILENAME).toString())
  return userOptions
}

function run(commandAndArgv) {
  process.env.APP_BASEURL = 'https://game-cli.learnersguild.org'
  const options = getUserOptions()
  if (!options) {
    console.error(`***Error: No Learners Guild RC file found in ${LGRC_FILENAME} -- try creating one.`)
    return Promise.resolve(1)
  }
  const [commandName, ...argv] = commandAndArgv
  const command = require('./')[commandName]
  return command.invoke(argv, console.log, options)
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  const argv = process.argv.slice(2)
  run(argv)
    .then(exitCode => process.exit(exitCode))
    .catch(error => console.error(error.stack))
}
