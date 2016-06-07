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
  try {
    if (!lgJWT || !lgPlayer || !lgPlayer.id) {
      throw new Error('You are not a player in the game.')
    }
    if (goalDescriptors.length === 1) {
      throw new Error('You must vote for exactly 2 goals.')
    }
    if (goalDescriptors.length > 2) {
      notify(formatMessage(`Only 2 goals are allowed, so these were disqualified: ${goalDescriptors.slice(2).join(', ')}`))
    }

    notify(formatMessage(`Validating the goals you voted on: ${goalDescriptors.join(', ')}`))
    return invokeVoteAPI(lgJWT, goalDescriptors)
      .catch(error => {
        errorReporter.captureException(error)
        notify(formatError(`API invocation failed: ${error.message || error}`))
      })
  } catch (errorMessage) {
    notify(formatError(errorMessage.message))
  }
}

export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    formatMessage,
  } = options
  if (args._.length > 0) {
    return voteForGoals(args._, notify, options)
  }

  notify(formatMessage('Loading current cycle voting results ...'))
})
