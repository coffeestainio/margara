const colors = require('colors');
const shell = require('shelljs');
const looksSame = require('looks-same');

module.exports = taskVisualCompare;

function taskVisualCompare(compareSettings) {
  return {
    title: `Comparing screenshots for: ${compareSettings.browserType}`,
    task: async () => {
      await looksSame(compareSettings.screenShotBaseFile, compareSettings.screenShotTargetFile, function(error, {equal}) {      
        if (error){
          throw new Error(error);
        }
        if (!equal) {
          shell.mkdir('-p', compareSettings.screenShotDiffFile);
          looksSame.createDiff({
            reference: compareSettings.screenShotBaseFile,
            current: compareSettings.screenShotTargetFile,
            diff: compareSettings.screenShotDiffFile,
            highlightColor: '#ff00ff', // color to highlight the differences
            strict: false, // strict comparsion
            tolerance: 2.5,
            antialiasingTolerance: 0,
            ignoreAntialiasing: true, // ignore antialising by default
            ignoreCaret: true // ignore caret by default
          }, function(error) {
            if (error) console.log(error);
          });
          console.log(`\n${colors.bgYellow(colors.black('Comparission failed.'))} Difference image stored in: ${colors.italic(compareSettings.screenShotDiffFile)}` );
        }
      });
    }
  };
}