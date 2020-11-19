const playwright = require('playwright');

module.exports = taskCollectScreenshot;

function taskCollectScreenshot(captureSettings) {
  return {
    title: `${captureSettings.createBaseline ? 'Creating baseline' : 'Capturing screenshots'} using: ${captureSettings.browserType}`,
    task: async () => {
      try {
        const browser = await playwright[captureSettings.browserType].launch({headless:true});
        const context = await browser.newContext();
        const pageBase = await context.newPage();
        await pageBase.goto(captureSettings.baseUrl);
        await pageBase.screenshot({ path: captureSettings.screenShotBaseFile, fullPage : true });
        
        if (!captureSettings.createBaseline) {
          const contextTarget = await browser.newContext();
          const pageTarget = await contextTarget.newPage();       
          await pageTarget.goto(captureSettings.targetUrl);
          await pageTarget.screenshot({ path: captureSettings.screenShotTargetFile, fullPage : true });
        }

        await browser.close();
      }  
      catch (ex) {
        throw new Error('Something went wrong taking the screenshots!');
      }
    }
  };
}