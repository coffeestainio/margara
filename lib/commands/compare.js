const colors = require('colors');
const Listr = require('listr');

const taskVisualCompare = require('../tasks/visual-compare');
const taskCollectScreenshot = require('../tasks/collect-screenshots');

const doesBaselineExist = require('../utils/file-system');
const validateUrls = require('../utils/validations');
const promptUserToCreateBaseline = require('../utils/user-prompt');

const TEST_DIRECTORY = 'img-results';
const COMMAND_DIRECTORY = 'compare';
const BASE_DIRECTORY = 'base';
const TARGET_DIRECTORY = 'target';
const DIFF_DIRECTORY = 'diff';

async function compare(options) {

  if (!validateUrls(options)){
    return;
  }

  // set options
  const browsers = options.browsers || ['chromium'];
  const baseUrl = options.baseUrl ? options.baseUrl : options.targetUrl;
  const targetUrl = options.targetUrl;
  const testName = options.testName || `${baseUrl.split('/')[2]}`;

  const baseDir = `${TEST_DIRECTORY}/${COMMAND_DIRECTORY}`;
  const screenShotDiffDir = `${baseDir}/${DIFF_DIRECTORY}`;

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
    const screenShotDiffFile = `${screenShotDiffDir}/${fileName}`;
    
    // check if the base exist and was not provided as a parameter
    let baselineExist = true;
    if (!options.baseUrl) {
      baselineExist = await doesBaselineExist(screenShotBaseFile);
    }

    if (!baselineExist) {
      createBaseline = true;
      // exit the process
      if (!await promptUserToCreateBaseline())
        return;
    }

    const compareSettings = {
      browserType: browserType,
      screenShotBaseFile: screenShotBaseFile,
      screenShotTargetFile: screenShotTargetFile,
      screenShotDiffFile: screenShotDiffFile,
      screenShotDiffDir: screenShotDiffDir,
      baseUrl: baseUrl,
      targetUrl: targetUrl,
      createBaseline: createBaseline,   
    };

    tasksBrowser.push(taskCollectScreenshot(compareSettings));

    if (baselineExist && !createBaseline) {
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
    }], {concurrent: false , exitOnError: false});

  try {
    let ctx = {
      failed: false
    };
    ctx = await tasks.run(ctx);
    if (ctx.failed){
      console.log(`\n${colors.bgYellow(colors.black('Comparission failed.'))} Difference image stored in: ${colors.italic(screenShotDiffDir)}`);
    }
    console.log(`\nImages stored in: ${colors.green(baseDir)} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);
  } catch (ex) {
    console.log(colors.bgWhite(colors.red('error' )),' Something went wrong. Please check the specified parameters.');
  }
}

module.exports = compare;
