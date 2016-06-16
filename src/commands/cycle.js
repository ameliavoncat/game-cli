import loadCommand from '../util/loadCommand'
import errorReporter from '../util/errorReporter'
import graphQLFetcher from '../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../util/getServiceBaseURL'
import composeInvoke from '../util/composeInvoke'

export const {parse, usage, commandDescriptor} = loadCommand('cycle')

function invokeUpdateCycleStateAPI(state, lgJWT) {
  const mutation = {
    query: 'mutation($state: String!) { updateCycleState(state: $state) { id } }',
    variables: {state},
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(mutation)
    .then(data => data.updateCycleState)
}

function handleUpdateCycleStateCommand(state, statusMsg, notify, options) {
  const {
    lgJWT,
    lgUser,
    formatMessage,
    formatError
  } = options
  if (!lgJWT || !lgUser || lgUser.roles.indexOf('moderator') < 0) {
    return Promise.reject('You are not a moderator.')
  }
  notify(formatMessage(statusMsg))
  return invokeUpdateCycleStateAPI(state, lgJWT)
    .catch(error => {
      errorReporter.captureException(error)
      notify(formatError(error.message || error))
    })
}

export const invoke = composeInvoke(parse, usage, (args, notify, options) => {
  const {
    formatUsage,
  } = options
  if (args._.length === 1) {
    const subcommandFuncs = {
      launch: () => handleUpdateCycleStateCommand('PRACTICE', '🚀  Initiating Launch... stand by.', notify, options),
      reflect: () => handleUpdateCycleStateCommand('REFLECTION', '🤔  Initiating Reflection... stand by.', notify, options),
    }
    return subcommandFuncs[args._[0]]()
  }

  notify(formatUsage(usage()))
  return Promise.resolve()
})
