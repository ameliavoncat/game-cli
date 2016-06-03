const noop = str => str
const DEFAULT_INVOKE_OPTIONS = {
  formatMessage: noop,
  formatError: noop,
  formatUsage: noop,
}

export default DEFAULT_INVOKE_OPTIONS
