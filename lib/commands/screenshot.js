const colors = require('colors');
const Listr = require('listr');

const taskCollectScreenshots = require('../tasks/collect-screenshots');
const validateUrls = require('../utils/validations');

const TEST_DIRECTORY = 'img-results';
const COMMAND_DIRECTORY = 'shot';
const BASE_DIRECTORY = 'base';

async function screenshot(options) {

  if (!validateUrls({targetUrl: options.url})){
    return;
  }

  // set options
  const browsers = options.browsers || ['chromium'];
  const url = options.url;
  const testName = options.testName || `${url.split('/')[2]}`;

  const baseDir = `${TEST_DIRECTORY}/${COMMAND_DIRECTORY}`;
  
  let tasksBrowser = [];
  for (const browserType of browsers) {

    // set fileName
    const fileName = `${testName}-${browserType}.png`;
    const screenShotBaseFile = `${baseDir}/${BASE_DIRECTORY}/${fileName}`;

    const captureSettings = {
      browserType : browserType,
      screenShotBaseFile: screenShotBaseFile,
      baseUrl: url,
      createBaseline: true
    };

    tasksBrowser.push(taskCollectScreenshots(captureSettings));
    
  }

  const tasks = new Listr([
    {
      title: `Taking screenshots for ${url}`,
      task: () => {
        return new Listr(tasksBrowser, {concurrent: true});
      }
    },
  ]);

  console.log(`${colors.green('Started \'Margara\' execution')} ${colors.gray(' ...\n')}`);

  try {
    await tasks.run();
    console.log(`\nImages stored in: ${colors.green(baseDir)} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);
  }
  catch (ex) {
    console.log(ex);
    console.log(colors.bgWhite(colors.red('error')),' Something went wrong. Please check the specified parameters.');
  }    
}


module.exports = screenshot;

