'use strict';

var program = require('commander');

var _require = require('./prompter/ask.js'),
    launch = _require.launch;

/**
 * Run Program
 */


program.version('1.0.0').description('Build Kontakt Script instruments');

program.command('generate').alias('g').description('Initiate the instrument generation').action(launch);

program.parse(process.argv);