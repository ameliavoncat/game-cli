import {sprintf} from 'sprintf-js'

import getServiceBaseURL, {GAME} from '../../util/getServiceBaseURL'
import errorReporter from '../../util/errorReporter'
import graphQLFetcher from '../../util/graphQLFetcher'
import {userIsPlayer} from '../../util/userValidation'

function invokeProjectListWithReviewsAPI(lgJWT) {
  const query = {
    query: `
query {
  getProjectsWithReviewResponsesForPlayer {
    name
    artifactURL
    projectReviewResponses {
      name
      value
    }
  }
}
    `,
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(query)
    .then(data => data.getProjectsWithReviewResponsesForPlayer)
}

function invokeProjectListSummaryAPI(lgJWT) {
  const query = {
    query: `
query {
  getProjectSummaryForPlayer {
    numActiveProjectsForCycle
    numTotalProjectsForPlayer
  }
}
    `,
  }
  return graphQLFetcher(lgJWT, getServiceBaseURL(GAME))(query)
    .then(data => data.getProjectSummaryForPlayer)
}

function formatProjectList(projects) {
  const numReviewed = projects.filter(proj => (
    proj.projectReviewResponses.filter(resp => resp.value).length > 0
  )).length
  const preface = `You have reviewed ${numReviewed} / ${projects.length} projects this cycle. Nice work!`
  const fmt = '%-1s  %-21s  %-3s  %-3s  %s'
  const header = sprintf(fmt, '', 'Project', 'C', 'Q', 'Artifact')
  const underlines = sprintf(fmt, '', '---------------------', '---', '---', '----------------------------------------')
  const projectLines = projects.map(proj => {
    const completeness = proj.projectReviewResponses.find(resp => resp.name === 'completeness').value
    const quality = proj.projectReviewResponses.find(resp => resp.name === 'quality').value
    const reviewed = completeness && quality ? '✓' : '-'
    return sprintf(fmt, reviewed, `#${proj.name}`, completeness || '', quality || '', proj.artifactURL || '')
  })

  return `${preface}\n\n${header}\n${underlines}\n${projectLines.join('\n')}`
}

export function listProjects(args, notify, options) {
  const {
    lgJWT,
    lgUser,
    formatMessage,
    formatError
  } = options

  if (!lgJWT || !userIsPlayer(lgUser)) {
    return Promise.reject('You are not a player in the game.')
  }
  if (args._.length > 0) {
    return Promise.reject(`Invalid command - wrong number of arguments (${args._.length} for 0). Try --help for usage.`)
  }
  if (args['in-review']) {
    return invokeProjectListWithReviewsAPI(lgJWT)
      .then(projects => notify(formatMessage(formatProjectList(projects))))
      .catch(err => {
        errorReporter.captureException(err)
        notify(formatError(err.message || err))
      })
  }

  return invokeProjectListSummaryAPI(lgJWT)
    .then(summary => {
      const {numActiveProjectsForCycle, numTotalProjectsForPlayer} = summary
      const message = `There are ${numActiveProjectsForCycle} active projects this cycle. You have participated in ${numTotalProjectsForPlayer} projects thus far.

Run \`/project list -r\` to list projects in review.`
      notify(formatMessage(message))
    })
    .catch(err => {
      errorReporter.captureException(err)
      notify(formatError(err.message || err))
    })
}
