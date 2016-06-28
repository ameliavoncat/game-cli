import loadCommand from '../../util/loadCommand'
import composeInvoke from '../../util/composeInvoke'

import {setProjectArtifactURL} from './setArtifact'

export const {parse, usage, commandDescriptor} = loadCommand('project')

export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  if (args._.length >= 1) {
    const subcommandFuncs = {
      'set-artifact': () => setProjectArtifactURL(args.$['set-artifact'], notify, options),
    }
    return subcommandFuncs[args._[0]]()
  }

  return Promise.reject('Invalid arguments. Try --help for usage.')
})
