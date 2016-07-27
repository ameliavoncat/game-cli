/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

import {
  notifiesWithUsageMessageForDashH,
  notifiesWithUsageHintForInvalidArgs,
  notifiesWithErrorIfNotAPlayer,
  notifiesWithErrorForAPIErrors,
  notifiesWithErrorForGraphQLErrors,
} from '../../../../test/commonTests'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invokeProject = require('../../project').invoke

      this.invoke = (argv, notify, options) => this.invokeProject(['list', ...argv], notify, options)
      this.notify = msg => {
        this.notifications.push(msg)
      }
      this.formatError = msg => `__FMT: ${msg}`
      this.lgJWT = 'not.a.real.token'
      this.lgUser = {id: 'not.a.real.id', roles: ['player']}
    })
    beforeEach(function () {
      this.notifications = []
    })

    afterEach(function () {
      nock.cleanAll()
    })

    it('notifies with the usage message when requested', notifiesWithUsageMessageForDashH)
    it('notifies with a warning if too many positional arguments are provided', notifiesWithUsageHintForInvalidArgs(['these', 'are', 'arguments']))
    it('notifies with an error message when invoked by a non-player', function () {
      return notifiesWithErrorIfNotAPlayer([]).bind(this)()
    })
    it('notifies of API invocation errors', notifiesWithErrorForAPIErrors([]))
    it('notifies of GraphQL invocation errors', notifiesWithErrorForGraphQLErrors([]))

    const _summaryData = {
      data: {
        getProjectSummaryForPlayer: {
          numActiveProjectsForCycle: 4,
          numTotalProjectsForPlayer: 2,
        }
      }
    }

    const _projectList = {
      data: {
        getProjectsAndReviewResponsesForPlayer: [{
          name: 'frightened-grouse',
          artifactURL: 'http://example.com',
          projectReviewResponses: [{
            name: 'quality',
            value: '88',
          }, {
            name: 'completeness',
            value: '23',
          }],
        }, {
          name: 'helpless-rat',
          artifactURL: null,
          projectReviewResponses: [{
            name: 'quality',
            value: null,
          }, {
            name: 'completeness',
            value: null,
          }],
        }, {
          name: 'magnificent-galah',
          artifactURL: null,
          projectReviewResponses: [{
            name: 'quality',
            value: null,
          }, {
            name: 'completeness',
            value: null,
          }],
        }, {
          name: 'ordinary-wapiti',
          artifactURL: null,
          projectReviewResponses: [{
            name: 'quality',
            value: null,
          }, {
            name: 'completeness',
            value: null,
          }],
        }]
      }
    }

    it('displays summary information when no options are passed', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, _summaryData)

      const {lgJWT, lgUser} = this
      return this.invoke([], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/4 active projects.*participated in 2 projects/)
          done()
        })
        .catch(err => done(err))
    })

    it('displays the list of projects when `--in-review` is passed', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, _projectList)

      const {lgJWT, lgUser} = this
      return this.invoke(['-r'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/have reviewed 1 \/ 4 projects/)
          expect(this.notifications[0]).to.match(/Project\s+C\s+Q\s+Artifact/)
          expect(this.notifications[0]).to.match(/example\.com/)
          expect(this.notifications[0]).to.match(/23\s+88/)
          _projectList.data.getProjectsAndReviewResponsesForPlayer.forEach(p => {
            expect(this.notifications[0]).to.contain(p.name)
          })
          done()
        })
        .catch(err => done(err))
    })
  })
})
