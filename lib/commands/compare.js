const colors = require('colors');
const playwright = require('playwright');
const Listr = require('listr');
const inquirer = require('inquirer');

const taskVisualCompare = require('../tasks/visual-compare');
const doesBaselineExist = require('../utils/fs-utils');
const validateUrls = require('../utils/validations');

const TEST_DIRECTORY = 'test-images/';
const BASE_DIRECTORY = 'base/';
const TARGET_DIRECTORY = 'target/';
const DIFF_DIRECTORY = 'target/';

async function screenshot(options) {

  if (!validateUrls(options)){
    return;
  }

  // set options
  const browsers = options.browsers || ['chromium'];
  const baseUrl = options.baseUrl ? options.baseUrl : options.targetUrl;
  const targetUrl = options.targetUrl;
  const testName = options.testName || `${baseUrl.split('/')[2]}.png`;

  // print introduction
  console.log(`${colors.green(`Started '${testName}' execution`)} ${colors.gray(' ...\n')}`);
  console.log(`${colors.bold('Validation details:')}`);
  console.log(`   ${colors.bgGreen(colors.black('Base Url:'))} ${colors.gray(baseUrl)} `);
  console.log(`   ${colors.bgGreen(colors.black('Target Url:'))} ${colors.gray(targetUrl)} `);
  console.log(`   ${colors.bgGreen(colors.black('Browsers:'))} ${colors.gray(browsers)} \n\n`);

  // get domain

  let createBaseline = false;

  let tasksBrowser = [];
  let tasksCompare = [];
  for (const browserType of browsers) {

    // set ursls
    const screenShotBaseFile = `${TEST_DIRECTORY}/compare/${BASE_DIRECTORY}/${browserType}-${testName}.png`;
    const screenShotTargetFile = `${TEST_DIRECTORY}/compare/${TARGET_DIRECTORY}/${browserType}-${testName}.png`;
    const screenShotDiffFile = `${TEST_DIRECTORY}/compare/${DIFF_DIRECTORY}/${browserType}-${testName}.png`;
    
    // check if the base exist and was not provided as a parameter
    if (!options.baseUrl) {
      createBaseline = await !doesBaselineExist(screenShotBaseFile);
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
      title: `${createBaseline ? 'Creating baseline ' : 'Capturing screenshots'} using: ${browserType}`,
      task: async () => {
        const browser = await playwright[browserType].launch({headless:true});
        const context = await browser.newContext();
        const pageBase = await context.newPage();
        await pageBase.goto(baseUrl);
        await pageBase.screenshot({ path: screenShotBaseFile });
        
        if (!createBaseline) {
          const contextTarget = await browser.newContext();
          const pageTarget = await contextTarget.newPage();       
          await pageTarget.goto(targetUrl);
          await pageTarget.screenshot({ path: screenShotTargetFile });
        }
  
        await browser.close();
      }
    });

    if (!createBaseline) {
      tasksCompare.push(taskVisualCompare(browserType, screenShotBaseFile, screenShotTargetFile, screenShotDiffFile));
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
