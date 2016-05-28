export default function findSubcommandDescriptor(commandDescriptor, subcommand) {
  const subcommandDescriptor = commandDescriptor.commands.filter(cmd => cmd.name === subcommand)[0]
  if (!subcommandDescriptor) {
    throw new Error(`FATAL: no such subcommand '${subcommand}'`)
  }
  return subcommandDescriptor
}
