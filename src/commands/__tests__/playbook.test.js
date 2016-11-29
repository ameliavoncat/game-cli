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

      this.runCmd = (args = []) => this.invoke(args, this.notify, {lgJWT: this.lgJWT, lgUser: this.lgUser})
    })

    beforeEach(function () {
      this.errors = []
      this.notifications = []
    })

    it('notifies with the usage message when requested', notifiesWithUsageMessageForDashH)

    it('notifies user', async function () {
      await this.runCmd()
      expect(this.notifications[0]).to.match(/Opening Playbook/i)
    })

    it('notifies user when there are search params', async function () {
      await this.runCmd(['search', 'param'])
      expect(this.notifications[0]).to.match(/Searching Playbook/i)
    })
  })
})
