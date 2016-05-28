import parseArgs from 'minimist'

import findSubcommandDescriptor from './findSubcommandDescriptor'

function getParseOptions(commandDescriptor) {
  const options = {
    string: [],
    boolean: [],
    alias: {},
    default: {},
    stopEarly: commandDescriptor.commands && commandDescriptor.commands.length > 0,
    unknown(opt) {
      if (opt[0] === '-') {
        throw new Error(`Unknown option: ${opt}`)
      }
    },
  }
  commandDescriptor.options.forEach(opt => {
    if (opt.abbr) {
      if (!options.alias[opt.name]) {
        options.alias[opt.name] = []
      }
      options.alias[opt.name].push(opt.abbr)
    }
    if (opt.alias) {
      if (!options.alias[opt.name]) {
        options.alias[opt.name] = []
      }
      options.alias[opt.name] = options.alias[opt.name].concat(opt.alias)
    }
    if (opt.boolean) {
      options.boolean.push(opt.name)
    } else {
      options.string.push(opt.name)
    }
    if (opt.default) {
      options.default[opt.name] = opt.default
    }
  })

  return options
}

export default function parse(commandDescriptor, argv) {
  const parseOptions = getParseOptions(commandDescriptor)
  let args = parseArgs(argv, parseOptions)

  // if we have subcommands and the subcommand was provided, we'll recurse into
  // the subcommand options and parse the subcommand options into a nested
  // object (named after the subcommand)
  if (parseOptions.stopEarly && args._.length > 0) {
    const [subcommand, ...subcommandArgv] = args._
    const subcommandDescriptor = findSubcommandDescriptor(commandDescriptor, subcommand)
    const subcommandParseOptions = getParseOptions(subcommandDescriptor)
    const subcommandArgs = parseArgs(subcommandArgv, subcommandParseOptions)
    args = Object.assign({}, args, {[subcommand]: subcommandArgs})
  }

  return args
}
