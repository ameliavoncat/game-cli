import loadCommand from '../util/loadCommand'
import composeInvoke from '../util/composeInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('profile')

export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    formatMessage,
    formatUsage,
  } = options
  if (args._.length > 0) {
    notify(formatUsage(usage()))
    return Promise.resolve()
  }

  notify(formatMessage('Loading your profile ...'))
  return Promise.resolve()
})
