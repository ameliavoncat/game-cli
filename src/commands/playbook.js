import loadCommand from '../util/loadCommand'
import composeInvoke from '../util/composeInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('playbook')

export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    formatMessage,
  } = options

  if (args._.length > 0) {
    notify(formatMessage('📖  Searching Playbook'))
  } else {
    notify(formatMessage('📖  Opening Playbook'))
  }

  return Promise.resolve()
})
