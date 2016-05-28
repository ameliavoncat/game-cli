const commandDescriptor = {
  name: 'status',
  description: 'check the status of the cycle',
  usage: 'status [options]',
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
