import assertFunctions from './assertFunctions'
import defaultInvokeOptions from './defaultInvokeOptions'

export default function parseArgvAndInvoke(parse, usage, invokeFn) {
  return (argv, notify, options = {}) => {
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
      notify(formatError(error))
      return
    }
    const usageText = usage(args)
    if (usageText) {
      notify(formatUsage(usageText))
      return
    }

    return invokeFn(args, notify, opts)
  }
}
