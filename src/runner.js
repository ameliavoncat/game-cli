function run(commandAndArgv) {
  const [commandName, ...argv] = commandAndArgv
  const command = require('./')[commandName]
  command.invoke(argv, console.log)
}

if (!module.parent) {
  const argv = process.argv.slice(2)
  run(argv)
}
