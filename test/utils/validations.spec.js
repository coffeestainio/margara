const colors = require('colors');

const validateUrls = require('../../lib/utils/validations');

describe ('validations' , () => {

  test('validate-target-url', async() => {
    const consoleSpy = jest.spyOn(console, 'log');
    const options = {
      targetUrl: 'papaya',
      baseUrl: 'https://www.google.com',
    };
    expect(validateUrls(options)).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(`${colors.bgRed(colors.black('Target url is not valid: '))} ${options.targetUrl}`);
  });

  test('validate-base-url', async() => {
    const consoleSpy = jest.spyOn(console, 'log');
    const options = {
      targetUrl: 'https://www.google.com',
      baseUrl: 'papaya'
    };
    expect(validateUrls(options)).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(`${colors.bgRed(colors.black('Base url is not valid: '))} ${options.baseUrl}`);
  });

  test('validate-np-base-url', async() => {
    const options = {
      targetUrl: 'https://www.google.com'
    };
    expect(validateUrls(options)).toBe(true);
  });

  test('validate-valid-urls', async() => {
    const options = {
      targetUrl: 'https://www.google.com',
      baseUrl: 'https://www.google.com'
    };
    expect(validateUrls(options)).toBe(true);
  });

});
