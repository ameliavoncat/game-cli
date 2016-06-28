import loadCommand from '../util/loadCommand'
import errorReporter from '../util/errorReporter'
import graphQLFetcher from '../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../util/getServiceBaseURL'
import composeInvoke from '../util/composeInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('vote')

function invokeVoteAPI(lgJWT, goalDescriptors) {
  const mutation = {
    query: `
mutation($goalDescriptors: [String]!) {
  voteForGoals(goalDescriptors: $goalDescriptors) {
    id
  }
}
    `,
    variables: {goalDescriptors},
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(mutation)
    .then(data => data.voteForGoals)
}

function voteForGoals(goalDescriptors, notify, options) {
  const {
    lgJWT,
    lgPlayer,
    formatMessage,
    formatError
  } = options
  if (!lgJWT || !lgPlayer || !lgPlayer.id) {
    return Promise.reject('You are not a player in the game.')
  }
  if (goalDescriptors.length === 1) {
    return Promise.reject('You must vote for exactly 2 goals.')
  }
  if (goalDescriptors.length > 2) {
    notify(formatMessage(`Only 2 goals are allowed, so these were disqualified: ${goalDescriptors.slice(2).join(', ')}`))
  }

  notify(formatMessage(`Processing votes for goals: ${goalDescriptors.join(', ')}`))
  return invokeVoteAPI(lgJWT, goalDescriptors)
    .catch(error => {
      errorReporter.captureException(error)
      notify(formatError(error.message || error))
    })
}

export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    formatMessage,
  } = options
  if (args._.length > 0) {
    return voteForGoals(args._, notify, options)
  }

  notify(formatMessage('Loading current cycle voting results ...'))
  return Promise.resolve()
})
