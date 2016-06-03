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
      this.lgJWT = 'not.a.real.token'
      this.lgUser = {roles: ['moderator']}
    })
    beforeEach(function () {
      this.notifications = []
    })

    it('notifies with the usage message when requested', function () {
      const {lgJWT, lgUser} = this
      this.invoke(['-h'], this.notify, {lgJWT, lgUser})
      expect(this.notifications[0]).to.match(/Usage:/)
    })

    it('notifies with an error message if action is invalid', function () {
      const {lgJWT, lgUser} = this
      this.invoke(['INVALID_ACTION'], this.notify, {lgJWT, lgUser})
      expect(this.notifications[0]).to.match(/no such subcommand/)
    })

    it('notifies with an error message when invoked by a non-moderator', function () {
      const {lgJWT} = this
      this.invoke(['launch'], this.notify, {lgJWT, lgUser: null})
      expect(this.notifications[0]).to.match(/not a moderator/)
      this.invoke(['launch'], this.notify, {lgJWT, lgUser: {roles: ['player']}})
      expect(this.notifications[1]).to.match(/not a moderator/)
    })

    it('notifies that the state is being initiated', function () {
      const {lgJWT, lgUser} = this
      this.invoke(['retro'], this.notify, {lgJWT, lgUser})
      expect(this.notifications[0]).to.match(/Initiating/)
    })

    it('does not notify if the API invocation succeeds', function (done) {
      nock('https://game.learnersguild.org')
        .post('/graphql')
        .reply(200, {data: {id: '00000000-1111-2222-3333-444444444444'}})

      const {lgJWT, lgUser} = this
      return this.invoke(['launch'], this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications.length).to.equal(1)
          done()
        })
        .catch(error => done(error))
    })

    it('notifies of API invocation errors', function (done) {
      nock('https://game.learnersguild.org')
        .post('/graphql')
        .reply(500, 'Internal Server Error')

      const {lgJWT, lgUser} = this
      return this.invoke(['retro'], this.notify, {lgJWT, lgUser})
        .then(() => {
          console.log(this.notifications[1])
          expect(this.notifications[1]).to.match(/API invocation failed/)
          done()
        })
        .catch(error => done(error))
    })
  })
})
