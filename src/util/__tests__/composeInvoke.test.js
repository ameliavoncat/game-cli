/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import composeInvoke from '../composeInvoke'

describe(testContext(__filename), function () {
  before(function () {
    this.notify = () => {
      this.notified = true
    }
    this.formatError = () => {
      this.formattedError = true
    }
    this.formatMessage = () => {
      this.formattedMessage = true
    }
    this.formatUsage = () => {
      this.formattedUsage = true
    }
    this.options = {
      formatError: this.formatError,
      formatMessage: this.formatMessage,
      formatUsage: this.formatUsage,
    }
  })
  beforeEach(function () {
    this.notified = false
    this.formattedError = false
    this.formattedUsage = false
    this.formattedMessage = false
  })

  it('throws if its arguments are not functions', function () {
    const compose1 = () => composeInvoke(1, () => null, () => null)
    const compose2 = () => composeInvoke(() => null, 2, () => null)
    const compose3 = () => composeInvoke(() => null, () => null, 3)
    expect(compose1).to.throw(/Expected.+function/)
    expect(compose2).to.throw(/Expected.+function/)
    expect(compose3).to.throw(/Expected.+function/)
  })

  it('notifies about an error if parse fails', function () {
    const parse = () => {
      throw new Error('parse failed')
    }
    const usage = () => null
    const invoke = composeInvoke(parse, usage, () => null)
    return invoke([], this.notify, this.options)
      .then(() => {
        expect(this.notified).to.be.ok
        expect(this.formattedError).to.be.ok
      })
  })

  it('notifies with usage if necessary', function () {
    const parse = () => null
    const usage = () => {
      return 'Usage: blah blah blah'
    }
    const invoke = composeInvoke(parse, usage, () => Promise.resolve())
    return invoke([], this.notify, this.options)
      .then(() => {
        expect(this.notified).to.be.ok
        expect(this.formattedUsage).to.be.ok
      })
  })

  it('invokes the function if parsing succeeds and no usage message is necessary', function () {
    const parse = () => null
    const usage = () => undefined
    let invoked = false
    const invoke = composeInvoke(parse, usage, () => {
      invoked = true
      return Promise.resolve()
    })
    invoke([], this.notify, this.options)
    expect(invoked).to.be.ok
    expect(this.notified).to.not.be.ok
  })
})
