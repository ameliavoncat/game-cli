import path from 'path'
import fs from 'fs'

const LGRC_FILENAME = path.join(process.env.HOME, '.lgrc')

function getUserOptions() {
  try {
    const stats = fs.statSync(LGRC_FILENAME)
    if (stats.isFile()) {
      const userOptions = JSON.parse(fs.readFileSync(LGRC_FILENAME).toString())
      return userOptions
    }
  } catch (error) {
    return null
  }
}

function run(commandAndArgv) {
  process.env.APP_BASE_URL = 'https://game-cli.learnersguild.org'
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
