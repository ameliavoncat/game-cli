/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../cycle').invoke
      this.notify = msg => {
        this.notifications.push(msg)
      }
      this.formatError = msg => {
        this.errors.push(msg)
      }
      this.lgJWT = 'not.a.real.token'
      this.lgUser = {roles: ['moderator']}
    })
    beforeEach(function () {
      this.errors = []
      this.notifications = []
    })

    it('notifies with the usage message when requested', function () {
      const {lgJWT, lgUser} = this
      return this.invoke(['-h'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/Usage:/)
        })
    })

    it('notifies with an error message if action is invalid', function () {
      const {lgJWT, lgUser} = this
      return this.invoke(['INVALID_ACTION'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/no such subcommand/)
        })
    })

    it('notifies with an error message when invoked by a non-moderator', function () {
      const {lgJWT} = this
      return Promise.all([
        this.invoke(['launch'], this.notify, {lgJWT, lgUser: null})
          .then(() => {
            expect(this.notifications[0]).to.match(/not a moderator/)
          }),
        this.invoke(['launch'], this.notify, {lgJWT, lgUser: {roles: ['player']}})
          .then(() => {
            expect(this.notifications[1]).to.match(/not a moderator/)
          })
      ])
    })

    it('notifies that the state is being initiated', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {id: '00000000-1111-2222-3333-444444444444'}})

      const {lgJWT, lgUser} = this
      return this.invoke(['reflect'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/Initiating/)
        })
    })

    it('does not notify if the API invocation succeeds', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {id: '00000000-1111-2222-3333-444444444444'}})

      const {lgJWT, lgUser} = this
      this.invoke(['launch'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications.length).to.equal(1)
          done()
        })
        .catch(error => done(error))
    })

    it('notifies of API invocation errors', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(500, 'Internal Server Error')

      const {lgJWT, lgUser, formatError} = this
      this.invoke(['reflect'], this.notify, {lgJWT, lgUser, formatError})
        .then(() => {
          expect(this.errors.length).to.equal(1)
          done()
        })
        .catch(error => done(error))
    })
  })
})
