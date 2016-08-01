/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import path from 'path'
import glob from 'glob'

const IGNORE_PATTERNS = [
  /__tests__.*\.test\.jsx?/,
]

function shouldRequire(f) {
  const ignored = IGNORE_PATTERNS.reduce((ignored, pattern) => ignored || f.match(pattern), false)
  return f.match(/\.jsx?$/) && !ignored
}

function requireAllForCoverage() {
  const promises = [
    'src',
  ].map(dir => (
    new Promise(resolve => {
      const pattern = path.resolve(__dirname, '..', '..', dir, '**', '*.js*')
      glob(pattern, (err, files) => {
        if (err) {
          throw err
        }
        files.forEach(f => {
          if (shouldRequire(f)) {
            require(f)
          }
        })
        resolve()
      })
    })
  ))
  return Promise.all(promises)
}

describe('coverage statistics calculation', function () {
  it('reports accurately', function () {
    this.timeout(10000)
    return requireAllForCoverage()
  })
})
