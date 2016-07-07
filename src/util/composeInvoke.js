import assertFunctions from './assertFunctions'
import defaultInvokeOptions from './defaultInvokeOptions'

const PROMISE_EXPECTATION_MESSAGE = "Warning: invoke function passed to composeInvoke should always return a Promise, but your invoke function returned something that was not then'able. This usually happens when you either forget to return the promise or if you are throwing an Error instead of returning Promise.reject()."

export default function composeInvoke(parse, usage, invokeFn) {
  assertFunctions({parse, usage, invokeFn})
  return (argv, notify, options = {}) => {
    const {
      commandPrefix,
      maxWidth,
    } = options
    const subcliOpts = {commandPrefix, maxWidth}
    const opts = Object.assign({}, defaultInvokeOptions, options)
    const {
      formatMessage,
      formatError,
      formatUsage
    } = opts
    let args
    try {
      assertFunctions({notify, formatMessage, formatError, formatUsage})
      args = parse(argv, subcliOpts)
    } catch (err) {
      notify(formatError(err.message || err))
      return Promise.resolve()
    }
    const usageText = usage(args, subcliOpts)
    if (usageText) {
      notify(formatUsage(usageText))
      return Promise.resolve()
    }

    try {
      const promise = invokeFn(args, notify, opts)
      if (typeof promise.then !== 'function') {
        console.error(PROMISE_EXPECTATION_MESSAGE)
      }
      return promise.catch(err => {
        notify(formatError(err.message || err))
      })
    } catch (err) {
      console.log(PROMISE_EXPECTATION_MESSAGE)
    }
  }
}
