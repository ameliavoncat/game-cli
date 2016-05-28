import cliclopts from 'cliclopts'
import {sprintf} from 'sprintf-js'

import addHelpOption from './addHelpOption'
import findSubcommandDescriptor from './findSubcommandDescriptor'
import {DEFAULT_OPTIONS} from './index'

export function usageInfo(usage, parentCommand = null) {
  if (!usage) {
    return ''
  }
  const usageString = parentCommand ? `${parentCommand} ${usage}` : usage

  return `\nUsage:\n    ${usageString}`
}

export function commandList(commands) {
  if (!commands || commands.length === 0) {
    return ''
  }

  const maxCommandWidth = commands.reduce((maxWidth, currCmd) => {
    return (currCmd.name.length > maxWidth) ? currCmd.name.length : maxWidth
  }, 0)
  const commandDescs = commands.map(cmd => (
    sprintf(`    %-${maxCommandWidth}s - %s`, cmd.name, cmd.description)
  ))
  return `\nCommands:\n${commandDescs.join('\n')}`
}

export function optionList(options) {
  if (!options || options.length === 0) {
    return ''
  }

  const cliOpts = cliclopts(options)
  return `\nOptions:\n${cliOpts.usage()}`
}

function commandDescriptorIncludesDefaultHelp(commandDescriptor) {
  if (!commandDescriptor.options) {
    return false
  }
  const defaultHelpOptions = commandDescriptor.options.filter(opt => opt.__DEFAULT_HELP_OPTION__)
  return defaultHelpOptions.length > 0
}

export function usageMessage(commandDescriptor, parentCommand = null) {
  const fullCommandName = parentCommand ? `${parentCommand} ${commandDescriptor.name}` : commandDescriptor.name
  return `${fullCommandName} - ${commandDescriptor.description}
${usageInfo(commandDescriptor.usage || commandDescriptor.name, parentCommand)}
${commandList(commandDescriptor.commands)}
${optionList(commandDescriptor.options)}`
}

export default function usage(cd, args = null, options = DEFAULT_OPTIONS) {
  const commandDescriptor = options.includeHelp ? addHelpOption(cd) : cd
  if (options.includeHelp) {
    if (!args || (args.help && commandDescriptorIncludesDefaultHelp(commandDescriptor))) {
      return usageMessage(commandDescriptor)
    }
    if (args.subcommand) {
      const subcommand = Object.keys(args.subcommand)[0]
      const subcommandDescriptor = findSubcommandDescriptor(commandDescriptor, subcommand)
      if (args.subcommand[subcommand].help && commandDescriptorIncludesDefaultHelp(subcommandDescriptor)) {
        return usageMessage(subcommandDescriptor, commandDescriptor.name)
      }
    }
  }
}
