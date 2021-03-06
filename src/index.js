import fs from 'fs'
import path from 'path'

function filterOutInactiveCommands(commands) {
  return commands.filter(command => {
    return !command.commandDescriptor._inactive
  })
}

function genCommandMap() {
  const commandSrcDir = path.resolve(__dirname, 'commands')
  const commandSourceFilenames = fs.readdirSync(commandSrcDir)
    .map(filename => path.resolve(commandSrcDir, filename))
  const commands = commandSourceFilenames
    .filter(filename => {
      const filenameToRequire = filename.match(/\.js$/) ? filename : path.join(filename, 'index.js')
      try {
        return fs.statSync(filenameToRequire, fs.R_OK).isFile()
      } catch (error) {
        return false  // file not found
      }
    })
    .map(filename => require(filename))
  return filterOutInactiveCommands(commands)                  // ensure that it's not marked _inactive
    .filter(command => typeof command.invoke === 'function')  // ensure that there's an implementation
    .reduce((commandMap, command) => {
      commandMap[command.commandDescriptor.name] = command
      return commandMap
    }, {})
}

export default genCommandMap()
