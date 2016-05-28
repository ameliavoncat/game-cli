import cliclopts from 'cliclopts'
import {sprintf} from 'sprintf-js'

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

export default function usage(commandDescriptor, parentCommand = null) {
  return `${commandDescriptor.name} - ${commandDescriptor.description}
${usageInfo(commandDescriptor.usage || commandDescriptor.name, parentCommand)}
${commandList(commandDescriptor.commands)}
${optionList(commandDescriptor.options)}`
}
