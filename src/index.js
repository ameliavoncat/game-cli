import fs from 'fs'
import path from 'path'

import loadCommand from './util/loadCommand'

function filterOutInactiveCommands(commands) {
  return commands.filter(command => {
    return !command.commandDescriptor._inactive
  })
}

function genCommandMap() {
  const commandConfigDir = path.resolve(__dirname, '..', 'config', 'commands')
  const commandConfigFilenames = fs.readdirSync(commandConfigDir)
    .map(filename => path.resolve(commandConfigDir, filename))
  const commands = commandConfigFilenames
    .filter(filename => filename.match(/\.yaml$/))
    .map(filename => filename.replace(/\.yaml$/, ''))
    .map(commandName => loadCommand(commandName))
  return filterOutInactiveCommands(commands)                  // ensure that it's not marked _inactive
    .reduce((commandMap, command) => {
      commandMap[command.commandDescriptor.name] = command
      return commandMap
    }, {})
}

const commandMap = genCommandMap()
export default commandMap
