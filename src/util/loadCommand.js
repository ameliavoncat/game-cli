import path from 'path'
import yaml from 'yamljs'

import {
  parse as parseFor,
  usage as usageFor,
} from 'subcli'

function loadCommandDescriptor(commandName) {
  const commandConfigFilename = path.resolve(__dirname, '..', '..', 'config', 'commands', `${commandName}.yaml`)
  const {command} = yaml.load(commandConfigFilename)
  return command
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

export default function loadCommand(commandName) {
  let commandDescriptor = loadCommandDescriptor(commandName)
  commandDescriptor = filterOutInactiveSubcommandDescriptors(commandDescriptor)
  return {
    commandDescriptor,
    parse: (argv, opts = {}) => parseFor(commandDescriptor, argv, opts),
    usage: (args = null, opts = {}) => usageFor(commandDescriptor, args, opts),
  }
}
