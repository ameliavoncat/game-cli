import getServiceBaseURL, {GAME} from '../../util/getServiceBaseURL'
import errorReporter from '../../util/errorReporter'
import graphQLFetcher from '../../util/graphQLFetcher'

function invokeSetProjectArtifactURLAPI(lgJWT, projectName, url) {
  const mutation = {
    query: `
mutation($projectName: String!, $url: URL!) {
  setProjectArtifactURL(projectName: $projectName, url: $url) {
    id
  }
}
    `,
    variables: {projectName, url},
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(mutation)
    .then(data => data.setProjectArtifactURL)
}

export function setProjectArtifactURL(args, notify, options) {
  const {
    lgJWT,
    lgPlayer,
    formatMessage,
    formatError
  } = options

  if (!lgJWT || !lgPlayer || !lgPlayer.id) {
    return Promise.reject('You are not a player in the game.')
  }
  if (args._.length !== 2) {
    return Promise.reject(`Invalid command - wrong number of arguments (${args._.length} for 2)`)
  }

  const [projectNameOrChannel, url] = args._
  const projectName = projectNameOrChannel.replace(/^#/, '')
  return invokeSetProjectArtifactURLAPI(lgJWT, projectName, url)
    .then(project => {
      if (project.id) {
        notify(formatMessage(`Thanks! The artifact for #${projectName} is now set to ${url}.`))
        return
      }
      const err = 'Expected a project id to be returned, but none was.'
      errorReporter.captureMessage(err)
      notify(formatError('Something went wrong. Please try again.'))
    })
    .catch(err => {
      errorReporter.captureException(err)
      notify(formatError(err.message || err))
    })
}
