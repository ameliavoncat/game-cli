export const HELP_OPTION = {
  name: 'help',
  abbr: 'h',
  boolean: true,
  help: 'print usage information',
  __DEFAULT_HELP_OPTION__: true,
}

function _addHelpOption(commandDescriptor) {
  const cdWithHelp = Object.assign({}, commandDescriptor)
  if (!cdWithHelp.options) {
    cdWithHelp.options = []
  }
  cdWithHelp.options = cdWithHelp.options.filter(opt => !opt.__DEFAULT_HELP_OPTION__)
  cdWithHelp.options.push(HELP_OPTION)

  return cdWithHelp
}

export default function addHelpOption(commandDescriptor) {
  // add help option to parent command
  const cdWithHelp = _addHelpOption(commandDescriptor)
  // recursively add help option to subcommands
  if (cdWithHelp.commands) {
    cdWithHelp.commands = cdWithHelp.commands.map(cmd => {
      return addHelpOption(cmd)
    })
  }

  return cdWithHelp
}
