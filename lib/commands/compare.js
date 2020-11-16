const fs = require('fs');
const colors = require('colors');
const playwright = require('playwright');
const shell = require('shelljs');
const Listr = require('listr');
const looksSame = require('looks-same');
const inquirer = require('inquirer');
const validUrl = require('valid-url');

async function screenshot(options) {

  // validate urls
  if (!validUrl.isUri(options.targetUrl)){
    console.log(`${colors.bgRed(colors.black('Target url is not valid: '))} ${options.targetUrl}`);
    return;
  }

  // validate urls
  if (options.baseUrl && !validUrl.isUri(options.baseUrl)){
    console.log(`${colors.bgRed(colors.black('Base url is not valid: '))} ${options.baseUrl}`);
    return;
  }

  // set options

  const browsers = options.browsers || ['chromium'];
  // if baseUrl is not provided assign the target as base
  const baseUrl = options.baseUrl ? options.baseUrl : options.targetUrl;
  const targetUrl = options.targetUrl;

  // print introduction
  console.log(`${colors.green('Started \'Margara\' execution')} ${colors.gray(' ...\n')}`);
  console.log(`${colors.bold('Validation details:')}`);
  console.log(`   ${colors.bgGreen(colors.black('Base Url:'))} ${colors.gray(baseUrl)} `);
  console.log(`   ${colors.bgGreen(colors.black('Target Url:'))} ${colors.gray(targetUrl)} `);
  console.log(`   ${colors.bgGreen(colors.black('Browsers:'))} ${colors.gray(browsers)} \n\n`);

  // get domain

  let baseDir = '';
  let targetDir = '';
  let diffDir = '';
  let baseFile = '';
  let targetFile = '';

  let createBaseline = false;

  let tasksBrowser = [];
  let tasksCompare = [];
  for (const browserType of browsers) {

    // set ursls
    baseDir = `results/compare/reference/${browserType}/`;
    targetDir = `results/compare/target/${browserType}/`;
    diffDir = `results/compare/diff/${browserType}/`;

    baseFile = `${baseUrl.split('/')[2]}.png`;
    targetFile = `${targetUrl.split('/')[2]}.png`;


    // check if the base exist and was not provided as a parameter
    if (!options.baseUrl) {
      await fs.access(baseDir + baseFile, (error) => {
        //  if file does not exist
        if (error && error.errno === -2) {
          createBaseline = true;
        }
      });
    }

    if (createBaseline) {
      let input = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'create',
          default: true,
          message: 'Baseline was not specified and is not previously recorded. Do you want to create a baseline?'
        }]);
      createBaseline = input.create;
    }

    tasksBrowser.push({
      title: `${createBaseline ? 'Creating basesline ' : 'Capturing screenshots'} using: ${browserType}`,
      task: async () => {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const pageBase = await context.newPage();
        await pageBase.goto(baseUrl);
        await pageBase.screenshot({ path: baseDir + baseFile });
        
        if (!createBaseline) {
          const contextTarget = await browser.newContext();
          const pageTarget = await contextTarget.newPage();       
          await pageTarget.goto(targetUrl);
          await pageTarget.screenshot({ path: targetDir + targetFile });
        }
        
        await browser.close();
      }
    });

    if (!createBaseline) {

      tasksCompare.push({
        title: `Comparing screenshots for: ${browserType}`,
        task: async () => {
          await looksSame(baseDir + baseFile, targetDir + targetFile, function(error, {equal}) {
            if (error){
              throw new Error(error);
            }
            if (!equal) {
              shell.mkdir('-p', diffDir);
              looksSame.createDiff({
                reference: baseDir + baseFile,
                current: targetDir + targetFile,
                diff: diffDir + targetFile,
                highlightColor: '#ff00ff', // color to highlight the differences
                strict: false, // strict comparsion
                tolerance: 2.5,
                antialiasingTolerance: 0,
                ignoreAntialiasing: true, // ignore antialising by default
                ignoreCaret: true // ignore caret by default
              }, function(error) {
                if (error) console.log(error);
              });
              console.log(`\n${colors.bgYellow(colors.black('Comparission failed.'))} Difference image stored in: ${colors.italic(diffDir)}` );
            }
          });
        }
      });
    }
  }

  const tasks = new Listr([
    {
      title: 'Capturing screenshots',
      task: () => {
        return new Listr(tasksBrowser, {concurrent: true});
      }
    },
    {
      title: 'Comparing screenshots',
      skip: () => {
        if (createBaseline) {
          return 'Baselines created';
        }
      },
      task: () => {
        return new Listr(tasksCompare, {concurrent: true});
      }
    }], {concurrent: false});

  await tasks.run().catch(err => {
    console.error(err);
  }).then(()=> {
    console.log(`\nImages stored in: ${colors.green('results/compare/')} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);
  });
}

module.exports = screenshot;
