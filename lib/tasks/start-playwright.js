const playwright = require('playwright');

module.exports = taskStartBrowser;

function taskStartBrowser(browserType) {
  return {
    title: `Starting ${browserType} like browser.`,
    task: async (ctx) => {
      try {
        // create the playwright browser
        const browser = await playwright[browserType].launch({headless:false});
        ctx.browser = browser;        
      }
      catch (ex) {
        throw new Error('Something went wrong strting the browser!');
      }
    }
  };
}