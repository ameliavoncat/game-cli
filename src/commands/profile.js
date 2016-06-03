import loadCommand from '../util/loadCommand'
import assertFunctions from '../util/assertFunctions'
import defaultInvokeOptions from '../util/defaultInvokeOptions'

export const {parse, usage, commandDescriptor} = loadCommand('profile')

export function invoke(argv, notify, options = {}) {
  const opts = Object.assign({}, defaultInvokeOptions, options)
  const {
    formatMessage,
    formatError,
    formatUsage
  } = opts
  assertFunctions({notify, formatMessage, formatError, formatUsage})
  let args
  try {
    args = parse(argv)
  } catch (error) {
    return notify(formatError(error))
  }
  const usageText = usage(args)
  if (usageText) {
    notify(formatUsage(usageText))
  } else if (args._.length > 0) {
    notify(formatUsage(usage()))
  } else {
    notify(formatMessage('Loading your profile ...'))
  }
}
