import parseArgs from 'minimist'

export default function parse(commandDescriptor, args) {
  const options = {
    string: [],
    boolean: [],
    alias: {},
    default: {},
    unknown(opt) {
      throw new Error(`Unknown option: ${opt}`)
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
    // console.log({options})
  })
  return parseArgs(args, options)
}
