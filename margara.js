#!/usr/bin/env node
const packageJSON = require('./package.json');
var program = require('commander');

const screenshot = require('./lib/commands/screenshot');

program
  .version(packageJSON.version, '-V, --version')
  .on('--help', function () {
    console.log(' ');
    console.log(' example: ');
    console.log('    $ margara screenshot');
    console.log();
  });

program
  .command('shot')
  .alias('s')
  .description('Take screenshot')
  .requiredOption('-u, --url [url]', 'e.g. https://domain.com')
  .option('-b, --browsers [browsers...]', 'e.g. chromium geckodriver webkit (Defaulted to "chromium" if not specified)')
  .action(screenshot);


program
  .parse(process.argv);

module.exports = program;