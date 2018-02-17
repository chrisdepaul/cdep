const program = require('commander')
const { launch } = require('./prompter/ask.js')

/**
 * Run Program
 */
program
    .version('1.0.0')
    .description('Build Kontakt Script instruments')

program
    .command('generate')
    .alias('g')
    .description('Initiate the instrument generation')
    .action(launch)

program.parse(process.argv)