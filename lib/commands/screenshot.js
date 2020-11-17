const colors = require('colors');
const Listr = require('listr');

const taskCollectScreenshots = require('../tasks/collect-screenshots');
const validateUrls = require('../utils/validations');

const TEST_DIRECTORY = 'test-images';
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

  tasks.run().catch(err => {
    console.error(err);
  }).then(()=> {
    console.log(`\nImages stored in: ${colors.green(baseDir)} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);
  });
}


module.exports = screenshot;

