import loadCommand from '../util/loadCommand'
import composeInvoke from '../util/composeInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('playbook')

export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    formatMessage,
  } = options

  notify(formatMessage('📖  Opening Playbook'))
  return Promise.resolve()
})
