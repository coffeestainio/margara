const colors = require('colors');
const Listr = require('listr');

const taskVisualCompare = require('../tasks/visual-compare');
const taskCollectScreenshots = require('../tasks/collect-screenshots');

const doesBaselineExist = require('../utils/file-system');
const validateUrls = require('../utils/validations');
const promptUserToCreateBaseline = require('../utils/user-prompt');

const TEST_DIRECTORY = 'img-results';
const COMMAND_DIRECTORY = 'compare';
const BASE_DIRECTORY = 'base';
const TARGET_DIRECTORY = 'target';
const DIFF_DIRECTORY = 'diff';

async function screenshot(options) {

  if (!validateUrls(options)){
    return;
  }

  // set options
  const browsers = options.browsers || ['chromium'];
  const baseUrl = options.baseUrl ? options.baseUrl : options.targetUrl;
  const targetUrl = options.targetUrl;
  const testName = options.testName || `${baseUrl.split('/')[2]}`;

  const baseDir = `${TEST_DIRECTORY}/${COMMAND_DIRECTORY}`;

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
    
    const fileName = `${testName}-${browserType}.png`;
    const screenShotBaseFile = `${baseDir}/${BASE_DIRECTORY}/${fileName}`;
    const screenShotTargetFile = `${baseDir}/${TARGET_DIRECTORY}/${fileName}`;
    const screenShotDiffFile = `${baseDir}/${DIFF_DIRECTORY}/${fileName}`;
    
    // check if the base exist and was not provided as a parameter
    let baselineExist = false;
    if (!options.baseUrl) {
      baselineExist = await doesBaselineExist(screenShotBaseFile);
    }

    if (!baselineExist) {
      createBaseline =  promptUserToCreateBaseline();
    }

    const compareSettings = {
      browserType: browserType,
      screenShotBaseFile: screenShotBaseFile,
      screenShotTargetFile: screenShotTargetFile,
      screenShotDiffFile: screenShotDiffFile,
      baseUrl: baseUrl,
      targetUrl: targetUrl,
      createBaseline: createBaseline,   
    };

    tasksBrowser.push(taskCollectScreenshots(compareSettings));

    if (!createBaseline) {
      tasksCompare.push(taskVisualCompare(compareSettings));
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
    console.log(`\nImages stored in: ${colors.green(baseDir)} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);
  });
}

module.exports = screenshot;
