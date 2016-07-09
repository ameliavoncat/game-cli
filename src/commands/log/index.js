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
  if (args.retro && !Array.isArray(args.question)) {
    const retro = new LogRetroCommand(lgJWT, notify, formatMessage, formatError)
    const projectName = args.project && args.project.replace(/^#/, '')

    if (typeof args.question === 'string' && args.question.match(/^\d+$/)) {
      const questionNumber = parseInt(args.question, 10)
      const responseParams = args._
      if (responseParams.length === 0) {
        return retro.printSurveyQuestion(questionNumber, projectName)
      }
      return retro.logReflection(questionNumber, responseParams, projectName)
    }
    return retro.printSurvey(projectName)
  }
  return Promise.reject('Invalid arguments. Try --help for usage.')
})
