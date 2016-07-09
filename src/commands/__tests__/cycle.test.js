/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

import {
  notifiesWithUsageMessageForDashH,
  notifiesWithUsageHintForInvalidArgs,
  notifiesWithErrorIfNotAModerator,
  notifiesWithErrorForAPIErrors,
  notifiesWithErrorForGraphQLErrors,
} from '../../../test/commonTests'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../cycle').invoke

      this.notify = msg => {
        this.notifications.push(msg)
      }
      this.formatError = msg => `__FMT: ${msg}`
      this.lgJWT = 'not.a.real.token'
      this.lgUser = {roles: ['moderator']}
    })

    beforeEach(function () {
      this.errors = []
      this.notifications = []
    })

    afterEach(function () {
      nock.cleanAll()
    })

    it('notifies with the usage message when requested', notifiesWithUsageMessageForDashH)
    it('notifies with a usage hint when no args are passed', notifiesWithUsageHintForInvalidArgs([]))
    it('notifies with an error message when invoked by a non-moderator', notifiesWithErrorIfNotAModerator(['launch']))

    it('notifies with an error message if action is invalid', function () {
      const {lgJWT, lgUser} = this
      return this.invoke(['INVALID_ACTION'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/no such subcommand/)
        })
    })

    describe('cycle init', function () {
      it('notifies user on success', function () {
        nock('http://game.learnersguild.test')
          .post('/graphql')
          .reply(200, {data: {createCycle: {cycleNumber: 3}}})

        const {lgJWT, lgUser} = this
        return this.invoke(['init'], this.notify, {lgJWT, lgUser})
          .then(() => {
            expect(this.notifications[0]).to.match(/Cycle #3/i)
          })
      })
      it('notifies of API invocation errors', notifiesWithErrorForAPIErrors(['init']))
      it('notifies of GraphQL invocation errors', notifiesWithErrorForGraphQLErrors(['init']))
    })

    describe('cycle launch', function () {
      it('does not notify if the API invocation succeeds', function (done) {
        nock('http://game.learnersguild.test')
          .post('/graphql')
          .reply(200, {data: {updateCycleState: {id: '00000000-1111-2222-3333-444444444444'}}})

        const {lgJWT, lgUser} = this
        this.invoke(['launch'], this.notify, {lgJWT, lgUser})
          .then(() => {
            expect(this.notifications.length).to.equal(1)
            done()
          })
          .catch(err => done(err))
      })
      it('notifies of API invocation errors', notifiesWithErrorForAPIErrors(['launch']))
      it('notifies of GraphQL invocation errors', notifiesWithErrorForGraphQLErrors(['launch']))
    })

    describe('cycle reflect', function () {
      it('notifies that the state is being initiated', function () {
        nock('http://game.learnersguild.test')
          .post('/graphql')
          .reply(200, {data: {updateCycleState: {id: '00000000-1111-2222-3333-444444444444'}}})

        const {lgJWT, lgUser} = this
        return this.invoke(['reflect'], this.notify, {lgJWT, lgUser})
          .then(() => {
            expect(this.notifications[0]).to.match(/Initiating/)
          })
      })
      it('notifies of API invocation errors', notifiesWithErrorForAPIErrors(['reflect']))
      it('notifies of GraphQL invocation errors', notifiesWithErrorForGraphQLErrors(['reflect']))
    })
  })
})
