var colors = require('colors');
const playwright = require('playwright');
const Listr = require('listr');
const looksSame = require('looks-same');

const BASELINE_DIR = 'baseline';

async function screenshot(options) {
  // set options
  const browsers = options.browsers || ['chromium'];
  const baseUrl = options.base;
  const targetUrl = options.target;

  // get domain

  let dirBase = '';
  let dirTarget = '';
  let dirDiff = '';

  let tasksBrowser = [];
  let tasksCompare = [];
  for (const browserType of browsers) {

    dirBase = `results/compare/reference/${baseUrl.split('/')[2]}-${browserType}.png`;
    dirTarget = `results/compare/target/${targetUrl.split('/')[2]}-${browserType}.png`;
    dirDiff = `results/compare/diff/${baseUrl.split('/')[2]}-${browserType}.png`;

    tasksBrowser.push({
      title: `Capturing screenshots using: ${browserType}`,
      task: async () => {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const pageBase = await context.newPage();
        await pageBase.goto(baseUrl);
        await pageBase.screenshot({ path: dirBase });
        
        const contextTarget = await browser.newContext();
        const pageTarget = await contextTarget.newPage();       
        await pageTarget.goto(targetUrl);
        await pageTarget.screenshot({ path: dirTarget });
        
        await browser.close();
      }
    });

    tasksCompare.push({
      title: `Comparing screenshots for: ${browserType}`,
      task: async () => {
        await looksSame(dirBase, dirTarget, function(error, {equal}) {
          if (error){
            throw new Error(error);
          }
          if (!equal) {
            looksSame.createDiff({
              reference: dirBase,
              current: dirTarget,
              diff: dirDiff,
              highlightColor: '#ff00ff', // color to highlight the differences
              strict: false, // strict comparsion
              tolerance: 2.5,
              antialiasingTolerance: 0,
              ignoreAntialiasing: true, // ignore antialising by default
              ignoreCaret: true // ignore caret by default
            }, function(error) {
                if (error) console.log(error);
            });
            console.log(`\n${colors.bgYellow(colors.black('Comparission failed.'))} Difference image stored in: ${colors.italic(dirDiff)}` );
        }
      });
      }
    });
  }

  const tasks = new Listr([
    {
      title: `Capturing screenshots`,
      task: () => {
        return new Listr(tasksBrowser, {concurrent: true});
      }
    },
    {
      title: `Comparing screenshots`,
      task: () => {
        return new Listr(tasksCompare, {concurrent: true});
      }
    }], {concurrent: false});

  console.log(`${colors.green('Started \'Margara\' execution')} ${colors.gray(' ...\n')}`);
  console.log(`${colors.bold('Validation details:')}`);
  console.log(`   ${colors.bgGreen(colors.black(`Base Url:`))} ${colors.gray(baseUrl)} `);
  console.log(`   ${colors.bgGreen(colors.black(`Target Url:`))} ${colors.gray(targetUrl)} `);
  console.log(`   ${colors.bgGreen(colors.black(`Browsers:`))} ${colors.gray(browsers)} \n\n`);

  tasks.run().catch(err => {
    console.error(err);
  }).then(()=> {
    console.log(`\nImages stored in: ${colors.green(`results/compare/`)} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);
  });
}


module.exports = screenshot;

