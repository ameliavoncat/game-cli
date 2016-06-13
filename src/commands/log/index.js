import loadCommand from '../../util/loadCommand'
import composeInvoke from '../../util/composeInvoke'
import LogRetroCommand from './LogRetroCommand'

export const {parse, usage, commandDescriptor} = loadCommand('log')
export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    lgJWT,
    lgPlayer,
    formatError,
    formatMessage,
  } = options
  if (!lgJWT || !lgPlayer || !lgPlayer.id) {
    return Promise.reject('You are not a player in the game.')
  }
  if (args.retro) {
    const retro = new LogRetroCommand(lgJWT, notify, formatMessage, formatError)

    if (typeof args.question === 'string' && args.question.match(/^\d+$/)) {
      const questionNumber = parseInt(args.question, 10)
      const responseParams = args._
      if (responseParams.length === 0) {
        return retro.printSurveyQuestion(questionNumber)
      }
      return retro.logReflection(questionNumber, responseParams)
    }
    return retro.printSurvey()
  }
  return Promise.reject('Invalid arguments. Try --help for usage.')
})
