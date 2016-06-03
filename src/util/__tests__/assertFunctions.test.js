/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import assertFunctions from '../assertFunctions'

describe(testContext(__filename), function () {
  it('throws an error if any of the parameters are not functions', function () {
    const funcs = {
      notify: () => null,
      formatError: 'NOT A FUNCTION',
      formatMessage: () => null,
      formatUsage: () => null,
    }
    const invoke = () => assertFunctions(funcs)
    expect(invoke).to.throw(/formatError.+string/)
  })
})
