import loadCommand from '../util/loadCommand'
import parseArgvAndInvoke from '../util/parseArgvAndInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('profile')

export const invoke = parseArgvAndInvoke(parse, usage, (args, notify, options) => {
  const {
    formatMessage,
    formatUsage,
  } = options
  if (args._.length > 0) {
    notify(formatUsage(usage()))
    return
  }

  notify(formatMessage('Loading your profile ...'))
})
