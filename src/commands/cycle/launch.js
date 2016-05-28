const commandDescriptor = {
  name: 'launch',
  description: 'tally votes and create project teams',
  usage: 'launch [options]',
  options: [
    {
      name: 'help',
      abbr: 'h',
      boolean: true,
      help: 'print usage information',
    }
  ],
}
export default commandDescriptor
