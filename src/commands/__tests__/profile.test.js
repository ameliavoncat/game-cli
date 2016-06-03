/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../profile').invoke
      this.notify = msg => {
        this.notifications.push(msg)
      }
    })
    beforeEach(function () {
      this.notifications = []
    })

    it('notifies with the usage message when requested', function () {
      this.invoke(['-h'], this.notify)
      expect(this.notifications[0]).to.match(/Usage:/)
    })

    it('notifies with the usage message if arguments are supplied', function () {
      this.invoke(['ANYTHING'], this.notify)
      expect(this.notifications[0]).to.match(/Usage:/)
    })

    it('notifies that the profile is being loaded', function () {
      this.invoke([], this.notify)
      expect(this.notifications[0]).to.match(/Loading.+profile/i)
    })
  })
})
