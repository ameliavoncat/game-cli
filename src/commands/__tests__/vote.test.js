/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

import {
  notifiesWithUsageMessageForDashH,
  notifiesWithErrorIfNotAPlayer,
  notifiesWithErrorForAPIErrors,
  notifiesWithErrorForGraphQLErrors,
} from '../../../test/commonTests'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../vote').invoke

      this.notify = msg => {
        this.notifications.push(msg)
      }
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
    it('notifies with an error message when invoked by a non-player', notifiesWithErrorIfNotAPlayer(['1', '2']))
    it('notifies of API invocation errors', notifiesWithErrorForAPIErrors(['1', '2']))
    it('notifies of GraphQL invocation errors', notifiesWithErrorForGraphQLErrors(['1', '2']))

    it('notifies with an error message when too few goal descriptors are provided', function () {
      const {lgJWT, lgUser} = this
      return this.invoke(['1'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/exactly 2/)
        })
    })

    it('notifies with a warning if extra goal descriptors are provided', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {id: '00000000-1111-2222-3333-444444444444'}})

      const {lgJWT, lgUser} = this
      return this.invoke(['1', '2', '3'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/disqualified/)
        })
    })

    it('notifies that the goals are being validated', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {id: '00000000-1111-2222-3333-444444444444'}})

      const {lgJWT, lgUser} = this
      return this.invoke(['1', '2'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/Validating/)
        })
    })

    it('notifies that the goals are being validated', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {id: '00000000-1111-2222-3333-444444444444'}})

      const {lgJWT, lgUser} = this
      return this.invoke(['1', '2'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/Validating/)
        })
    })

    it('does not notify if the API invocation succeeds', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {id: '00000000-1111-2222-3333-444444444444'}})

      const {lgJWT, lgUser} = this
      return this.invoke(['1', '2'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications.length).to.equal(1)
          done()
        })
        .catch(err => done(err))
    })
  })
})
