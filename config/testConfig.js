import 'babel-polyfill'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

// helpers
global.testContext = filename => {
  return filename.slice(1).split('/').reduce((ret, curr) => {
    const currWithoutTests = curr === '__tests__' ? null : `/${curr}`
    const value = ret.useCurr && currWithoutTests ? `${ret.value}${currWithoutTests}` : ret.value
    const useCurr = ret.useCurr || curr === 'game'
    return {useCurr, value}
  }, {useCurr: false, value: ''}).value.replace('.test.js', '').slice(1)
}

// setup chai and make it available in all tests
chai.use(chaiAsPromised)
global.expect = chai.expect
