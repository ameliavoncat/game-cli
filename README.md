# game-cli

Learners Guild game command-line interface (CLI).


## Getting Started

Read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Run the setup tasks:

        $ npm install
        $ npm test

### How to Define New Commands

All of the existing top-level commands are defined in the [config/commands](config/commands) folder, one `.yaml` file per command. To add a new command, simply create a `.yaml` file with the name of the command. Each command and subcommand supports the following attributes:

- `name` primary name of option
- `abbr` one character alias of the option
- `alias` other options treated as alias
- `boolean` if `true`, the option is seen as a boolean flag
- `help` usage string for the option
- `default` default value of the option
- `commands` nested subcommands, which also support this same list of attributes
- `_inactive` if `true`, the command or subcommand will be ignored

It's worth noting that the attributes are an extension of [cliclopts][cliclopts].

## How to Use

1. Install the module in your project

        $ npm install --save @learnersguild/game-cli

2. Use whichever command modules you want by importing them

      ```javascript
      import {cycle, vote} from '@learnersguild/game-cli'

      let usage = vote.usage()
      // <the full usage text for the vote command>
      // - when usage is called with no arguments, it returns the full usage text
      let args = vote.parse(['44', '45'])
      // { _: [ '44', '45' ], help: false, h: false }
      // the '_' attribute contains positional parameters
      usage = vote.usage(args)
      // undefined - we've parsed the users arguments and they didn't ask for help

      args = vote.parse(['-h'])
      // { _: [], help: true, h: true }
      usage = vote.usage(args)
      // <the full usage text for the vote command>
      // - we've parsed the user's arguments and they did ask for help

      args = cycle.parse(['launch', '--help'])
      // { _: [ 'launch', '--help' ],
      //   help: false,
      //   h: false,
      //   subcommand: { launch: { _: [], help: true, h: true } } }
      // - parse() can differentiate between options for the parent and sub commands      
      usage = cycle.usage(args)
      // <the full usage text for the 'cycle launch' sub command>
      // - because the '--help' option came _after_ the subcommand
      ```

## Notes

It may help to look at [subcli][subcli] for more detail on how the argument parsing is handled.

## License

See the [LICENSE](./LICENSE) file.


[subcli]: https://github.com/LearnersGuild/subcli
[cliclopts]: https://github.com/finnp/cliclopts
