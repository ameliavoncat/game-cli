import cliclopts from 'cliclopts'
import {sprintf} from 'sprintf-js'

export function usageInfo(usage) {
  if (!usage) {
    return ''
  }

  return `\nUsage:\n    ${usage}`
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

export default function usage(commandDescriptor) {
  return `${commandDescriptor.name} - ${commandDescriptor.description}
${usageInfo(commandDescriptor.usage)}
${commandList(commandDescriptor.commands)}
${optionList(commandDescriptor.options)}`
}
