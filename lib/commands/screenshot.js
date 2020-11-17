var colors = require('colors');
const playwright = require('playwright');
const Listr = require('listr');

const BASELINE_DIR = 'reference';

async function screenshot(options) {

  // set options
  const browsers = options.browsers || ['chromium'];
  const url = options.url;

  // get domain
  const dir = url.split('/')[2];

  let tasksBrowser = [];
  for (const browserType of browsers) {

    tasksBrowser.push({
      title: `Running on ${browserType}`,
      task: async () => {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);
        await page.screenshot({ path: `results/shot/base/${browserType}/${url}.png` });
        await browser.close();
      }
    });
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
    console.log(`\nImages stored in: ${colors.green(`results/${dir}/${BASELINE_DIR}`)} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);
  });
}


module.exports = screenshot;

