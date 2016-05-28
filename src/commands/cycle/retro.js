const commandDescriptor = {
  name: 'retro',
  description: 'initiate retrospective',
  usage: 'retro [options]',
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
