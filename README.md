# command-parser

Learners Guild command parsing module.


## Getting Started

Read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Run the setup tasks:

        $ npm install
        $ npm test


## How to Use

1. Install the module in your project

        $ npm install --save @learnersguild/command-parser

2. Use whichever command modules you want by importing them

      ```javascript
      import {cycle, vote} from '@learnersguild/command-parser'

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

It may help to look at [minimist][minimist] for more detail on how the argument parsing is handled. One thing to note is that, our command parsing supports the notion of "sub commands". For example, you may see a result that looks like:

```javascript
{
  _: [ 'launch' ],   // positional parameters for the parent command
  help: false,       // options for the parent command
  h: false,          // ...
  subcommand: {
    launch: {
      _: [],         // positional parameters for the sub command
      help: false,   // options for the sub command
      h: false       // ...
    }
  }
}
```

## License

See the [LICENSE](./LICENSE) file.


[minimist]: https://github.com/substack/minimist
