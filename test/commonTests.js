/* eslint-env mocha */
/* global expect */

export function notifiesWithUsageMessageForDashH() {
  const {lgJWT, lgUser} = this
  return this.invoke(['-h'], this.notify, {lgJWT, lgUser})
    .then(() => {
      expect(this.notifications[0]).to.match(/Usage:/)
    })
}

export function notifiesWithUsageHintForInvalidArgs(invalidArgv = []) {
  return function () {  // don't use arrow-function b/c we need 'this'
    const {lgJWT, lgPlayer} = this
    return this.invoke(invalidArgv, this.notify, {lgJWT, lgPlayer})
      .then(() => {
        expect(this.notifications[0]).to.match(/\-\-help/)
      })
  }
}
