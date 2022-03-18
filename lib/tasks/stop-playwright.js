const playwright = require('playwright');

module.exports = taskStopBrowser;

function taskStopBrowser(browser) {
  return {
    title: `Stopping ${browser} `,
    task: async (ctx) => {
        // create the playwright browser
        const browser = ctx.browser;
        await browser.close();      
    }
  };
}