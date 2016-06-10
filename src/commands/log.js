import errorReporter from '../util/errorReporter'
import graphQLFetcher from '../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../util/getServiceBaseURL'
import loadCommand from '../util/loadCommand'
import composeInvoke from '../util/composeInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('log')

function invokeResponseAPI(lgJWT, questionNumber, responseParams) {
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

function invokeSurveyQuestionAPI(lgJWT, questionNumber) {
  const query = {
    query:
      `query($questionNumber: Int!) {
        getRetrospectiveSurveyQuestion(questionNumber: $questionNumber) {
          ... on SurveyQuestionInterface {
            id subjectType responseType body
          }
          ... on SinglePartSubjectSurveyQuestion {
            subject { id name handle }
          }
          ... on MultiPartSubjectSurveyQuestion {
            subject { id name handle }
          }
        }
      }`,
    variables: {questionNumber},
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(query)
    .then(data => data.getRetrospectiveSurveyQuestion)
}

function formatSubject(subject) {
  if (!Array.isArray(subject)) {
    return subject.handle
  }

  if (subject.length === 1) {
    return subject[0]
  }

  const subjectParts = subject.map(part => part.handle)
  let subjectString = subjectParts.slice(0, subjectParts.length - 2).join(', ')
  subjectString = `${subjectString} and ${subjectParts[subjectParts.length - 1]}`
  return subjectString
}

function formatQuestion(question, {questionNumber}) {
  const subjectString = formatSubject(question.subject)
  return `
${questionNumber}. Answer the following question about ${subjectString}:
${question.body}
`
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
        return invokeSurveyQuestionAPI(lgJWT, questionNumber)
          .then(question => notify(formatMessage(formatQuestion(question, {questionNumber}))))
          .catch(error => {
            errorReporter.captureException(error)
            notify(formatError(`${error.message || error}`))
          })
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
