/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invokeProject = require('../../project').invoke

      this.invoke = (argv, notify, options) => this.invokeProject(['set-artifact', ...argv], notify, options)
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

    it('notifies with an error message when too few positional arguments are provided', function () {
      const {lgJWT, lgPlayer} = this
      return this.invoke(['#bad-lemurs-12'], this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/wrong number of arguments/)
        })
    })

    it('notifies with a warning if too many positional arguments are provided', function () {
      const {lgJWT, lgPlayer} = this
      return this.invoke(['#bad-lemurs-12', '#good-bears-2', 'http://example.com'], this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/wrong number of arguments/)
        })
    })

    it('notifies with an error message when invoked by a non-player', function () {
      const {lgJWT} = this
      return Promise.all([
        this.invoke(['#bad-lemurs-12', 'http://example.com/'], this.notify, {lgJWT, lgPlayer: null})
          .then(() => {
            expect(this.notifications[0]).to.match(/not a player/)
          }),
        this.invoke(['#bad-lemurs-12', 'http://example.com/'], this.notify, {lgJWT, lgPlayer: {object: 'without id attribute'}})
          .then(() => {
            expect(this.notifications[1]).to.match(/not a player/)
          })
      ])
    })

    it('notifies with a thank you message when the API invocation succeeds', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {setProjectArtifactURL: {id: '00000000-1111-2222-3333-444444444444'}}})

      const {lgJWT, lgPlayer} = this
      return this.invoke(['#bad-lemurs-12', 'http://example.com/'], this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/Thanks! The artifact for .+ is now set to .+/)
          done()
        })
        .catch(err => done(err))
    })

    it('notifies of API invocation errors', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(500, 'Internal Server Error')

      const {lgJWT, lgPlayer, formatError} = this
      return this.invoke(['#bad-lemurs-12', 'http://example.com/'], this.notify, {lgJWT, lgPlayer, formatError})
        .then(() => {
          expect(this.notifications[0]).to.equal('__FMT: Internal Server Error')
          done()
        })
        .catch(err => done(err))
    })

    it('notifies of GraphQL invocation errors', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {errors: [{message: 'GraphQL Error'}]})

      const {lgJWT, lgPlayer, formatError} = this
      this.invoke(['#bad-lemurs-12', 'http://example.com/'], this.notify, {lgJWT, lgPlayer, formatError})
        .then(() => {
          expect(this.notifications[0]).to.equal('__FMT: GraphQL Error')
          done()
        })
        .catch(err => done(err))
    })
  })
})
