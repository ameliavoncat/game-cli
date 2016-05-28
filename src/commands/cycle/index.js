import {
  usage as usageFor,
  parse as parseFor,
} from '../../util'

import launch from './launch'

const commandDescriptor = {
  name: 'cycle',
  description: 'manage cycles',
  usage: 'cycle [options] <command>',
  commands: [
    launch,
  ],
  options: [
    {
      name: 'help',
      abbr: 'h',
      boolean: true,
      help: 'print usage information',
    }
  ]
}

export function parse(argv) {
  return parseFor(commandDescriptor, argv)
}

export function usage(args = null) {
  return usageFor(commandDescriptor, args)
}

export default {
  parse,
  usage,
}
