/* eslint-env mocha */
/* global expect */

export function notifiesWithUsageMessageForDashH() {
  const {lgJWT, lgUser} = this
  return this.invoke(['-h'], this.notify, {lgJWT, lgUser})
    .then(() => {
      expect(this.notifications[0]).to.match(/Usage:/)
    })
}

export function notifiesWithUsageHintForInvalidArgs(invalidArgv) {
  return function () {  // don't use arrow-function b/c we need 'this'
    const {lgJWT, lgPlayer} = this
    return this.invoke(invalidArgv, this.notify, {lgJWT, lgPlayer})
      .then(() => {
        expect(this.notifications[0]).to.match(/\-\-help/)
      })
  }
}

export function notifiesWithErrorIfNotAPlayer(validArgv) {
  return function () {  // don't use arrow-function b/c we need 'this'
    const {lgJWT} = this
    return Promise.all([
      this.invoke(validArgv, this.notify, {lgJWT, lgPlayer: null})
        .then(() => {
          expect(this.notifications[0]).to.match(/not a player/)
        }),
      this.invoke(validArgv, this.notify, {lgJWT, lgPlayer: {object: 'without id attribute'}})
        .then(() => {
          expect(this.notifications[1]).to.match(/not a player/)
        })
    ])
  }
}

export function notifiesWithErrorIfNotAModerator(validArgv) {
  return function () {  // don't use arrow-function b/c we need 'this'
    const {lgJWT} = this
    return Promise.all([
      this.invoke(validArgv, this.notify, {lgJWT, lgUser: null})
        .then(() => {
          expect(this.notifications[0]).to.match(/not a moderator/)
        }),
      this.invoke(validArgv, this.notify, {lgJWT, lgUser: {roles: ['player']}})
        .then(() => {
          expect(this.notifications[1]).to.match(/not a moderator/)
        })
    ])
  }
}
