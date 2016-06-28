/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../../project').invoke

      this.notify = msg => {
        this.notifications.push(msg)
      }
      this.formatError = msg => `__FMT: ${msg}`
      this.lgJWT = 'not.a.real.token'
      this.lgPlayer = {id: 'not.a.real.id'}
    })
    beforeEach(function () {
      this.notifications = []
    })

    it('notifies with the usage message when requested', function () {
      const {lgJWT, lgPlayer} = this
      return this.invoke(['-h'], this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/Usage:/)
        })
    })
  })
})
