const validUrl = require('valid-url');
const colors = require('colors');

module.exports = function validateUrls(options) {

  // validate urls
  if (!validUrl.isUri(options.targetUrl)){
    console.log(`${colors.bgRed(colors.black('Target url is not valid: '))} ${options.targetUrl}`);
    return false;
  }

  // validate urls
  if (options.baseUrl && !validUrl.isUri(options.baseUrl)){
    console.log(`${colors.bgRed(colors.black('Base url is not valid: '))} ${options.baseUrl}`);
    return false;
  }
  return true;
};
