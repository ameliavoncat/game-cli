import graphQLFetcher from '../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../util/getServiceBaseURL'
import loadCommand from '../util/loadCommand'
import parseArgvAndInvoke from '../util/parseArgvAndInvoke'

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

export const invoke = parseArgvAndInvoke(parse, usage, (args, notify, options) => {
  const {
    lgJWT,
    lgPlayer,
    formatError,
    formatMessage,
  } = options
  if (!lgJWT || !lgPlayer || !lgPlayer.id) {
    throw new Error('You are not a player in the game.')
  }
  if (typeof args.reflection === 'string') {
    if (args.reflection === '') {
      // display retrospective survey
      // see: https://github.com/LearnersGuild/game-cli/issues/13
      // notify(formatMessage('Loading retrospective survey ...'))
      notify(formatError('Unable to load retrospective survey (NOT YET IMPLEMENTED).'))
      return
    } else if (args.reflection.match(/^\d+$/)) {
      const questionNumber = parseInt(args.reflection, 10)
      if (args._.length === 0) {
        // display retrospective question
        // see: https://github.com/LearnersGuild/game-cli/issues/14
        // notify(formatMessage(`Loading retrospective question ${questionNumber} ...`))
        notify(formatError(`Unable to load retrospective question ${questionNumber} (NOT YET IMPLEMENTED).`))
        return
      }
      // log reflection for particular question
      notify(formatMessage(`Logging your reflection for question ${questionNumber} ...`))
      return invokeResponseAPI(lgJWT, questionNumber, args._)
        .catch(error => {
          notify(formatError(`API invocation failed: ${error.message || error}`))
        })
    }
  }
  notify(formatError('Invalid arguments. Try --help for usage.'))
})
