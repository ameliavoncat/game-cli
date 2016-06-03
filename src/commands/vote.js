import loadCommand from '../util/loadCommand'
import errorReporter from '../util/errorReporter'
import assertFunctions from '../util/assertFunctions'
import graphQLFetcher from '../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../util/getServiceBaseURL'
import defaultInvokeOptions from '../util/defaultInvokeOptions'

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

function voteForGoals(goalDescriptors, lgJWT, lgPlayer, notify, options) {
  const {formatMessage, formatError} = options
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
        notify(formatError(`API invocation failed: ${error.message}`))
      })
  } catch (errorMessage) {
    notify(formatError(errorMessage.message))
  }
}

export function invoke(argv, lgJWT, lgPlayer, notify, options = defaultInvokeOptions) {
  const {formatMessage, formatError, formatUsage} = options
  assertFunctions({notify, formatMessage, formatError, formatUsage})
  let args
  try {
    args = parse(argv)
  } catch (error) {
    return notify(formatError(error))
  }
  const usageText = usage(args)
  if (usageText) {
    notify(formatUsage(usageText))
  } else if (args._.length > 0) {
    return voteForGoals(args._, lgJWT, lgPlayer, notify, options)
  } else {
    notify(formatMessage('Loading current cycle voting results ...'))
  }
}
