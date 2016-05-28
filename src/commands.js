import path from 'path'
import yaml from 'yamljs'

import {
  parse as parseFor,
  usage as usageFor,
} from './util'

function genCommand(name) {
  const commandConfigFilename = path.resolve(__dirname, '..', 'config', 'commands', `${name}.yaml`)
  const {command} = yaml.load(commandConfigFilename)
  return {
    parse: argv => parseFor(command, argv),
    usage: (args = null) => usageFor(command, args),
  }
}

export const cycle = genCommand('cycle')
