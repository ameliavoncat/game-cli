import fs from 'fs'
import path from 'path'
import yaml from 'yamljs'

import {
  parse as parseFor,
  usage as usageFor,
} from 'subcli'

function loadCommandDescriptor(commandConfigFilename) {
  const {command} = yaml.load(commandConfigFilename)
  return command
}

function genCommand(commandDescriptor) {
  return {
    commandDescriptor,
    parse: argv => parseFor(commandDescriptor, argv),
    usage: (args = null) => usageFor(commandDescriptor, args),
  }
}

function filterOutInactiveSubcommandDescriptors(commandDescriptor) {
  if (!commandDescriptor.commands) {
    return commandDescriptor
  }
  const filteredSubcommands = filterOutInactiveCommandDescriptors(commandDescriptor.commands)
  const filteredCommandDescriptor = Object.assign({}, commandDescriptor, {commands: filteredSubcommands})
  return filteredCommandDescriptor
}

function filterOutInactiveCommandDescriptors(commandDescriptors) {
  return commandDescriptors.map(commandDescriptor => filterOutInactiveSubcommandDescriptors(commandDescriptor))
    .filter(commandDescriptor => {
      return !commandDescriptor._inactive
    })
}

function genCommandMap() {
  const commandConfigDir = path.resolve(__dirname, '..', 'config', 'commands')
  const commandConfigFilenames = fs.readdirSync(commandConfigDir)
    .filter(filename => filename.match(/\.yaml$/))
    .map(filename => path.resolve(commandConfigDir, filename))
  const commandDescriptors = commandConfigFilenames.map(filename => loadCommandDescriptor(filename))
  return filterOutInactiveCommandDescriptors(commandDescriptors)
    .map(commandDescriptor => genCommand(commandDescriptor))
    .reduce((commandMap, command) => {
      commandMap[command.commandDescriptor.name] = command
      return commandMap
    }, {})
}

export default genCommandMap()
