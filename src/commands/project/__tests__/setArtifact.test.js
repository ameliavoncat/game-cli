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

      this.invoke = (argv, notify, options) => this.invokeProject(['set-artifact', ...argv], notify, options)
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
    it('notifies with an error message when too few positional arguments are provided', notifiesWithUsageHintForInvalidArgs(['#bad-lemurs-12']))
    it('notifies with a warning if too many positional arguments are provided', notifiesWithUsageHintForInvalidArgs(['#bad-lemurs-12', '#good-bears-2', 'http://example.com']))
    it('notifies with an error message when invoked by a non-player', function () {
      return notifiesWithErrorIfNotAPlayer(['#bad-lemurs-12', 'http://example.com/']).bind(this)()
    })
    it('notifies of API invocation errors', notifiesWithErrorForAPIErrors(['#bad-lemurs-12', 'http://example.com/']))
    it('notifies of GraphQL invocation errors', notifiesWithErrorForGraphQLErrors(['#bad-lemurs-12', 'http://example.com/']))

    it('notifies with a thank you message when the API invocation succeeds', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {setProjectArtifactURL: {id: '00000000-1111-2222-3333-444444444444'}}})

      const {lgJWT, lgUser} = this
      return this.invoke(['#bad-lemurs-12', 'http://example.com/'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/Thanks! The artifact for .+ is now set to .+/)
          done()
        })
        .catch(err => done(err))
    })
  })
})
