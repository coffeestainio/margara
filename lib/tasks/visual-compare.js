const colors = require('colors');
const shell = require('shelljs');
const looksSame = require('looks-same');

module.exports = taskVisualCompare;

function taskVisualCompare(browserType, screenShotBaseFile, screenShotTargetFile, screenShotDiffFile) {
  return {
    title: `Comparing screenshots for: ${browserType}`,
    task: async () => {
      await looksSame(screenShotBaseFile, screenShotTargetFile, function(error, {equal}) {      
        if (error){
          throw new Error(error);
        }
        if (!equal) {
          shell.mkdir('-p', screenShotDiffFile);
          looksSame.createDiff({
            reference: screenShotBaseFile,
            current: screenShotTargetFile,
            diff: screenShotDiffFile,
            highlightColor: '#ff00ff', // color to highlight the differences
            strict: false, // strict comparsion
            tolerance: 2.5,
            antialiasingTolerance: 0,
            ignoreAntialiasing: true, // ignore antialising by default
            ignoreCaret: true // ignore caret by default
          }, function(error) {
            if (error) console.log(error);
          });
          console.log(`\n${colors.bgYellow(colors.black('Comparission failed.'))} Difference image stored in: ${colors.italic(screenShotDiffFile)}` );
        }
      });
    }
  };
}