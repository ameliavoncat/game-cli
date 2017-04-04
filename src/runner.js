import path from 'path'
import fs from 'fs'
import util from 'util'
import fetch from 'isomorphic-fetch'
import encodeAsForm from 'form-urlencoded'

const LGRC_FILENAME = path.join(process.env.HOME, '.lgrc')

function getUserOptions() {
  try {
    const stats = fs.statSync(LGRC_FILENAME)
    if (stats.isFile()) {
      const userOptions = JSON.parse(fs.readFileSync(LGRC_FILENAME).toString())
      return userOptions
    }
  } catch (err) {
    return null
  }
}

function invokeCommandAPI(command, text, options) {
  process.env.APP_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://game.learnersguild.org' : 'http://game.learnersguild.dev'

  const body = encodeAsForm({
    command: `/${command}`,
    text,
  })
  const apiURL = `${process.env.APP_BASE_URL}/command`
  return fetch(apiURL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${options.lgJWT}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body,
  })
    .then(resp => {
      return resp.json()
        .then(result => {
          if (resp.ok) {
            return result
          }
          throw new Error(result.text || result)
        })
        .catch(err => {
          console.error(`ERROR invoking ${apiURL}: ${resp.status} ${resp.statusText}`)
          throw err
        })
    })
}

function run(commandAndArgv) {
  const options = Object.assign({}, getUserOptions(), {maxWidth: process.stdout.columns})
  if (!options) {
    throw new Error(`*** Error: No Learners Guild RC file found in ${LGRC_FILENAME} -- try creating one.`)
  }
  const [commandName, ...argv] = commandAndArgv
  return invokeCommandAPI(commandName, argv.join(' '), options)
}

function printResult(result) {
  if (!result.text) {
    console.info(util.inspect(result, {depth: 4}))
    return
  }
  console.info(result.text)
  const attachmentTexts = (result.attachments || []).map(attachment => attachment.text)
  console.info('-> ', attachmentTexts.join('\n-> '))
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  const argv = process.argv.slice(2)
  run(argv)
    .then(result => {
      printResult(result)
      process.exit(0)
    })
    .catch(err => {
      console.error(err.stack || err.message || err)
      process.exit(-1)
    })
}
