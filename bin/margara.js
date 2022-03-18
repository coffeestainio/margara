#!/usr/bin/env node
const packageJSON = require('../package.json');
var program = require('commander');

const screenshot = require('../lib/commands/screenshot');
const compare = require('../lib/commands/compare');

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
  .option('-b, --browsers [browsers...]', 'e.g. chromium geckodriver webkit (Default to "chromium" if not specified)')
  .action(screenshot);

program
  .command('compare')
  .alias('c')
  .description('Compare Web Pages')
  .requiredOption('-t, --targetUrl [targetUrl]', 'e.g. https://target.com')
  .option('-B, --baseUrl [baseUrl]', 'e.g. https://domain.com')
  .option('-b, --browsers [browsers...]', 'e.g. chromium geckodriver webkit (Default to "chromium" if not specified)')
  .option('-n, --testName [testName]', 'e.g. home-page')
  .action(compare);


program
  .parse(process.argv);

module.exports = program;