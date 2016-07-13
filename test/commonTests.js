/* eslint-env mocha */
/* global expect */

import nock from 'nock'

export function notifiesWithUsageMessageForDashH() {
  const {lgJWT, lgUser} = this
  return this.invoke(['-h'], this.notify, {lgJWT, lgUser})
    .then(() => {
      expect(this.notifications[0]).to.match(/Usage:/)
    })
}

export function notifiesWithUsageHintForInvalidArgs(invalidArgv) {
  return function () {  // don't use arrow-function b/c we need 'this'
    const {lgJWT, lgUser} = this
    return this.invoke(invalidArgv, this.notify, {lgJWT, lgUser})
      .then(() => {
        expect(this.notifications[0]).to.match(/\-\-help/)
      })
  }
}

export function notifiesWithErrorIfNotAPlayer(validArgv) {
  return function () {  // don't use arrow-function b/c we need 'this'
    const {lgJWT} = this
    return Promise.all([
      this.invoke(validArgv, this.notify, {lgJWT, lgUser: null})
        .then(() => {
          expect(this.notifications[0]).to.match(/not a player/)
        }),
      this.invoke(validArgv, this.notify, {lgJWT, lgUser: {id: 'not.a.real.id', roles: ['notplayer']}})
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
      this.invoke(validArgv, this.notify, {lgJWT, lgUser: {id: 'not.a.real.id', roles: ['player']}})
        .then(() => {
          expect(this.notifications[1]).to.match(/not a moderator/)
        })
    ])
  }
}

export function notifiesWithErrorForAPIErrors(validArgv) {
  return function (done) {  // don't use arrow-function b/c we need 'this'
    nock('http://game.learnersguild.test')
      .post('/graphql')
      .reply(500, 'Internal Server Error')

    const {lgJWT, lgUser} = this
    const formatError = msg => `__FMT: ${msg}`
    return this.invoke(validArgv, this.notify, {lgJWT, lgUser, formatError})
      .then(() => {
        expect(this.notifications).to.include('__FMT: Internal Server Error')
        done()
      })
      .catch(err => done(err))
  }
}

export function notifiesWithErrorForGraphQLErrors(validArgv) {
  return function (done) {
    nock('http://game.learnersguild.test')
      .post('/graphql')
      .reply(200, {errors: [{message: 'GraphQL Error'}]})

    const {lgJWT, lgUser} = this
    const formatError = msg => `__FMT: ${msg}`
    this.invoke(validArgv, this.notify, {lgJWT, lgUser, formatError})
      .then(() => {
        expect(this.notifications).to.include('__FMT: GraphQL Error')
        done()
      })
      .catch(err => done(err))
  }
}
