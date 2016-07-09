import 'babel-polyfill'
import path from 'path'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

process.env.APP_BASE_URL = 'http://echo.learnersguild.test'

// helpers
global.testContext = filename => {
  const projectName = path.basename(path.resolve(__dirname, '..'))
  return filename.slice(1).split('/').reduce((ret, curr) => {
    const currWithoutTests = curr === '__tests__' ? null : `/${curr}`
    const value = ret.useCurr && currWithoutTests ? `${ret.value}${currWithoutTests}` : ret.value
    const useCurr = ret.useCurr || curr === projectName
    return {useCurr, value}
  }, {useCurr: false, value: ''}).value.replace('.test.js', '').slice(1)
}

// setup chai and make it available in all tests
chai.use(chaiAsPromised)
global.expect = chai.expect
