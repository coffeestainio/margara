const colors = require('colors');

const { mockTaskWithError, mockTaskCollectScreenshots } = require('../mocks/jest-mocks');

let taskCollectScreenshot = {};
jest.mock('../../lib/tasks/collect-screenshots', () => taskCollectScreenshot = jest.fn());

const screenshot = require('../../lib/commands/screenshot');

// create mocked function 
taskCollectScreenshot.mockImplementation(mockTaskCollectScreenshots);

describe('screenshots-command', () => {

  test('test no browser provided defaults to chrome', async() => {

    const consoleSpy0 = jest.spyOn(console, 'log');

    const options = {
      url:'https://www.google.com'
    };
    
    await screenshot(options);
    
    expect(consoleSpy0).toHaveBeenNthCalledWith(2, 'Step executed with: chromium');

  });

  test('test browser provided use provided values', async() => {

    const consoleSpy1 = jest.spyOn(console, 'log');
    
    const options = {
      url:'https://www.google.com',
      browsers: ['firefox','chromium']
    };
    
    await screenshot(options);
    
    expect(consoleSpy1).toHaveBeenNthCalledWith(2, 'Step executed with: firefox');
    expect(consoleSpy1).toHaveBeenNthCalledWith(3, 'Step executed with: chromium');

  });

  test('test verify wrong url returns the function', async() => {

    const consoleSpy3 = jest.spyOn(console, 'log');
    
    const options = {
      url:'asda.com',
    };
    
    await screenshot(options);
    
    expect(consoleSpy3).toHaveBeenCalledTimes(1);

  });

  test('test when task returns error', async() => {

    taskCollectScreenshot.mockImplementation(mockTaskWithError);

    const consoleSpy5 = jest.spyOn(console, 'log');
    
    const options = {
      url:'https://www.google.com',
    };
    
    await screenshot(options);
    
    expect(consoleSpy5).toHaveBeenNthCalledWith(2, colors.bgWhite(colors.red('error')),' Something went wrong. Please check the specified parameters.');

  });

  afterEach(() => {    
    jest.restoreAllMocks();
  });

});