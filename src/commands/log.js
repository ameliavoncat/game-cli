import errorReporter from '../util/errorReporter'
import graphQLFetcher from '../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../util/getServiceBaseURL'
import loadCommand from '../util/loadCommand'
import composeInvoke from '../util/composeInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('log')

function invokeResponseAPI(lgJWT, lgPlayer, questionNumber, responseParams) {
  const mutation = {
    query: `
mutation($response: CLISurveyResponse!) {
  saveRetrospectiveCLISurveyResponse(response: $response) {
    createdIds
  }
}
    `,
    variables: {response: {questionNumber, responseParams}},
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(mutation)
    .then(data => data.saveRetrospectiveCLISurveyResponse)
}

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
  if (typeof args.question === 'string') {
    if (args.retro && args.question === '') {
      // display retrospective survey
      // see: https://github.com/LearnersGuild/game-cli/issues/13
      // notify(formatMessage('Loading retrospective survey ...'))
      return Promise.reject('Unable to load retrospective survey (NOT YET IMPLEMENTED).')
    }
    if (args.retro && args.question.match(/^\d+$/)) {
      const questionNumber = parseInt(args.question, 10)
      if (args._.length === 0) {
        // display retrospective question
        // see: https://github.com/LearnersGuild/game-cli/issues/14
        // notify(formatMessage(`Loading retrospective question ${questionNumber} ...`))
        return Promise.reject(`Unable to load retrospective question ${questionNumber} (NOT YET IMPLEMENTED).`)
      }
      // log reflection for particular question
      notify(formatMessage(`Logging your reflection for question ${questionNumber} ...`))
      return invokeResponseAPI(lgJWT, questionNumber, args._)
        .catch(error => {
          errorReporter.captureException(error)
          notify(formatError(`API invocation failed: ${error.message || error}`))
        })
    }
  }
  return Promise.reject('Invalid arguments. Try --help for usage.')
})
