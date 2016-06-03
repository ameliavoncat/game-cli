import loadCommand from '../util/loadCommand'
import parseArgvAndInvoke from '../util/parseArgvAndInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('log')

export const invoke = parseArgvAndInvoke(parse, usage, (args, notify, options) => {
  const {
    formatError,
    formatMessage,
  } = options
  if (typeof args.reflection === 'string') {
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
  notify(formatError('Invalid arguments. Try --help for usage.'))
})
