const shell = require('shelljs');
const looksSame = require('looks-same');

module.exports = taskVisualCompare;

function taskVisualCompare(compareSettings) {
  return {
    title: `Comparing screenshots for: ${compareSettings.browserType}`,
    task: async (ctx) => {
      ctx.failed = await checkIfLooksSame(compareSettings);
    }
  };
}

function checkIfLooksSame(compareSettings) {
  return new Promise((resolve, reject)=>{
    looksSame(compareSettings.screenShotBaseFile, compareSettings.screenShotTargetFile, function(error, {equal}) {      
      if (error){
        reject(true);
      }
      if (!equal) {
        createDifferenceFile(compareSettings);
        resolve(true);
      }
      resolve(false);
    });
  });
}

function createDifferenceFile(compareSettings){
  const options = {
    reference: compareSettings.screenShotBaseFile,
    current: compareSettings.screenShotTargetFile,
    diff: compareSettings.screenShotDiffFile,
    highlightColor: '#ff00ff', // color to highlight the differences
    strict: false, // strict comparsion
    tolerance: 2.5,
    antialiasingTolerance: 0,
    ignoreAntialiasing: true, // ignore antialising by default
    ignoreCaret: true // ignore caret by default
  };
  shell.mkdir('-p', compareSettings.screenShotDiffDir);
  looksSame.createDiff(options, function(error) {
    if (error) console.log(error);
  });
}