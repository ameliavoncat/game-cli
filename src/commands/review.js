import loadCommand from '../util/loadCommand'
import composeInvoke from '../util/composeInvoke'
import getServiceBaseURL, {GAME} from '../util/getServiceBaseURL'
import errorReporter from '../util/errorReporter'
import graphQLFetcher from '../util/graphQLFetcher'

const questionNames = ['completeness', 'quality']

export const {parse, usage, commandDescriptor} = loadCommand('review')
export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    lgJWT,
    lgPlayer,
    formatError,
    formatMessage,
  } = options
  const notifyCallbacks = {
    msg: msg => notify(formatMessage(msg)),
    error: err => notify(formatError(err)),
  }

  if (!lgJWT || !lgPlayer || !lgPlayer.id) {
    return Promise.reject('You are not a player in the game.')
  }
  if (isResponseCommand(args)) {
    return handleProjectReview(lgJWT, args, notifyCallbacks)
      .catch(error => {
        errorReporter.captureException(error)
        notify(formatError(error.message || error))
      })
  }

  return Promise.reject('Invalid arguments. Try --help for usage.')
})

function isResponseCommand(args) {
  return Boolean(questionNames.find(name => args[name]))
}

function handleProjectReview(lgJWT, args, {msg}) {
  const projectName = args._[0].replace('#', '')
  const responses = questionNames.map(questionName => ({
    questionName,
    responseParams: [args[questionName]]
  }))

  return invokeSaveProjectReviewCLISurveyResponsesAPI(lgJWT, projectName, responses)
    .then(() => msg(projectReviewRecordedSuccessMessage(projectName, args)))
}

function invokeSaveProjectReviewCLISurveyResponsesAPI(lgJWT, projectName, responses) {
  const mutation = {
    query: `
mutation($projectName: String!, $responses: [CLINamedSurveyResponse]!) {
  saveProjectReviewCLISurveyResponses(projectName: $projectName, responses: $responses) {
    createdIds
  }
}
    `,
    variables: {projectName, responses},
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(mutation)
    .then(data => data.saveProjectReviewCLISurveyResponses)
}

function projectReviewRecordedSuccessMessage(projectName, args) {
  if (args.completeness && args.quality) {
    return `Completeness and quality scores captured for #${projectName}!`
  }

  if (args.completeness) {
    return `Completeness score captured for #${projectName}!`
  }

  if (args.quality) {
    return `Quality score captured for #${projectName}!`
  }
}
