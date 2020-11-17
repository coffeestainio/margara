const fs = require('fs');

// check if baseline exist and return true if it needs to be created
module.exports = function doesBaselineExist(screenShotBaseFile) {
  return new Promise ((resolve) => {
    fs.access(screenShotBaseFile, (error) => {
      //  if file does not exist
      if (error) {
        resolve (false);
      }
      resolve (true);
    });
  });   
};
