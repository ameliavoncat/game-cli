/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import {
  notifiesWithUsageMessageForDashH,
} from '../../../test/commonTests'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../playbook').invoke

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

    it('notifies with the usage message when requested', notifiesWithUsageMessageForDashH)
    it('notifies user on success', async function () {
      await this.invoke(['init'], this.notify, {lgJWT: this.lgJWT, lgUser: this.lgUser})
      expect(this.notifications[0]).to.match(/Opening Playbook/i)
    })
  })
})
