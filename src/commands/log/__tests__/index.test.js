/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import nock from 'nock'

import {
  notifiesWithUsageMessageForDashH,
  notifiesWithUsageHintForInvalidArgs,
  notifiesWithErrorIfNotAPlayer,
  notifiesWithErrorForAPIErrors,
  notifiesWithErrorForGraphQLErrors,
} from '../../../../test/commonTests'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../index').invoke

      this.notify = msg => {
        this.notifications.push(msg)
      }
      this.formatError = msg => `__FMT: ${msg}`
      this.argv = ['-rq', '1', 'some1:25', 'some2:25', 'some3:25', 'some4:25']
      this.lgJWT = 'not.a.real.token'
      this.lgUser = {id: 'not.a.real.id', roles: ['player']}
    })

    beforeEach(function () {
      this.notifications = []
    })

    afterEach(function () {
      nock.cleanAll()
    })

    it('notifies with the usage message when requested', notifiesWithUsageMessageForDashH)
    it('notifies with a usage hint when not logging reflections', notifiesWithUsageHintForInvalidArgs([]))
    it('notifies with a usage hint when two questions are attempted at once', notifiesWithUsageHintForInvalidArgs(['-r', '-q1', 'answer1', '-r', '-q2', 'answer2']))
    it('notifies with an error message when invoked by a non-player', function () {
      return notifiesWithErrorIfNotAPlayer(this.argv).bind(this)()
    })
    it('notifies of API invocation errors', notifiesWithErrorForAPIErrors(['--retro', '--question', '99999999', 'answer']))
    it('notifies of GraphQL invocation errors', notifiesWithErrorForGraphQLErrors(['--retro', '--question', '1', 'answer']))

    describe('log -r', function () {
      describe('when survey in progress', function () {
        beforeEach('mock game API', function () {
          nock('http://game.learnersguild.test')
            .post('/graphql')
            .reply(200, {data: {
              getRetrospectiveSurvey: {
                questions: [
                  {
                    id: '99ede319-882f-4dc8-81e2-be43f891a111',
                    subjectType: 'player',
                    responseType: 'text',
                    responseInstructions: 'these are the instructions',
                    body: 'this is the question body',
                    subject: {
                      id: '34278883-2e76-42b6-a8aa-fa74a1892f90',
                      name: 'Rosemarie Kub',
                      handle: 'mobile81'
                    },
                    response: 'value',
                  },
                  {
                    id: '99ede319-882f-4dc8-81e2-be43f891a122',
                    subjectType: 'player',
                    responseType: 'text',
                    responseInstructions: 'these are the instructions',
                    body: 'this is the second question body',
                    subject: {
                      id: '34278883-2e76-42b6-a8aa-fa74a1892faa',
                      name: 'Trevor Little',
                      handle: 'tlittle'
                    },
                    response: null,
                  },
                ]
              }
            }})
        })

        it('prints all the questions without question instructions', function () {
          const {lgJWT, lgUser} = this
          return this.invoke(['-r'], this.notify, {lgJWT, lgUser}).then(() => {
            expect(this.notifications[0]).to.match(/this is the question body/i)
            expect(this.notifications[0]).to.match(/this is the second question body/i)
            expect(this.notifications[0]).to.not.match(/these are the instructions/i)
          })
        })

        it('prints survey instructions', function () {
          const {lgJWT, lgUser} = this
          return this.invoke(['-r'], this.notify, {lgJWT, lgUser}).then(() => {
            expect(this.notifications[0]).to.match(/To log a reflection,/i)
            expect(this.notifications[0]).to.match(/Then follow the instructions specified in the question to answer./i)
          })
        })

        it('prints status information', function () {
          const {lgJWT, lgUser} = this
          return this.invoke(['-r'], this.notify, {lgJWT, lgUser}).then(() => {
            expect(this.notifications[0]).to.match(/You have logged 1\/2/i)
          })
        })
      })

      describe('when survey complete', function () {
        beforeEach('mock game API', function () {
          nock('http://game.learnersguild.test')
            .post('/graphql')
            .reply(200, {data: {
              getRetrospectiveSurvey: {
                questions: [
                  {
                    id: '99ede319-882f-4dc8-81e2-be43f891a111',
                    subjectType: 'player',
                    responseType: 'text',
                    responseInstructions: 'these are the instructions',
                    body: 'this is the question body',
                    subject: {
                      id: '34278883-2e76-42b6-a8aa-fa74a1892f90',
                      name: 'Rosemarie Kub',
                      handle: 'mobile81'
                    },
                    response: 'value',
                  },
                  {
                    id: '99ede319-882f-4dc8-81e2-be43f891a122',
                    subjectType: 'player',
                    responseType: 'text',
                    responseInstructions: 'these are the instructions',
                    body: 'this is the second question body',
                    subject: {
                      id: '34278883-2e76-42b6-a8aa-fa74a1892faa',
                      name: 'Trevor Little',
                      handle: 'tlittle'
                    },
                    response: 'value',
                  },
                ]
              }
            }})
        })

        it('prints a "completed" message', function () {
          const {lgJWT, lgUser} = this
          return this.invoke(['-r'], this.notify, {lgJWT, lgUser}).then(() => {
            expect(this.notifications[0]).to.match(/You've completed 100%/i)
          })
        })
      })
    })

    it('prints the question when given a number', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {
          getRetrospectiveSurveyQuestion: {
            id: '99ede319-882f-4dc8-81e2-be43f891a1ba',
            subjectType: 'player',
            responseType: 'text',
            responseInstructions: 'these are the instructions',
            body: 'this is the question body',
            subject: {
              id: '34278883-2e76-42b6-a8aa-fa74a1892f90',
              name: 'Rosemarie Kub',
              handle: 'mobile81'
            },
            response: 'value',
          }
        }})

      const {lgJWT, lgUser} = this
      return this.invoke(['-rq', '1'], this.notify, {lgJWT, lgUser}).then(() => {
        expect(this.notifications[0]).to.match(/this is the question body/i)
        expect(this.notifications[0]).to.match(/these are the instructions/i)
      })
    })

    it('notifies that the reflection is being logged', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {createdIds: ['00000000-1111-2222-3333-444444444444']}})

      const {lgJWT, lgUser} = this
      return this.invoke(this.argv, this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications[0]).to.match(/reflection\s*logged/i)
        })
    })

    it('does not notify if the API invocation succeeds', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {createdIds: ['00000000-1111-2222-3333-444444444444']}})

      const {lgJWT, lgUser} = this
      return this.invoke(this.argv, this.notify, {lgJWT, lgUser})
        .then(() => {
          expect(this.notifications.length).to.equal(1)
          done()
        })
        .catch(err => done(err))
    })
  })
})
