import loadCommand from '../util/loadCommand'
import assertFunctions from '../util/assertFunctions'
import defaultInvokeOptions from '../util/defaultInvokeOptions'

export const {parse, usage, commandDescriptor} = loadCommand('log')

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
    return
  } else if (typeof args.reflection === 'string') {
    if (args.reflection === '') {
      // display retrospective survey
      notify(formatMessage('Loading retrospective survey ...'))
      return
    } else if (args.reflection.match(/^\d+$/)) {
      // log reflection for particular question
      const questionNum = parseInt(args.reflection, 10)
      if (args._.length < 1) {
        throw new Error('You must provide a response when logging a reflection.')
      }
      notify(formatMessage(`Logging your reflection for question ${questionNum} ...`))
      return
    }
  }
  console.log({args})
  notify(formatError('Invalid arguments. Try --help for usage.'))
}
