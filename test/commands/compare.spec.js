const colors = require('colors');

const { mockTaskWithError, mockTaskCollectScreenshots, mockTaskWithContext} = require('../mocks/jest-mocks');

let taskCollectScreenshot = {};
let taskVisualCompare = {};
let doesBaselineExist = jest.fn();
let promptUserToCreateBaseline = jest.fn();
jest.mock('../../lib/tasks/collect-screenshots', () => taskCollectScreenshot = jest.fn());
jest.mock('../../lib/tasks/visual-compare', () => taskVisualCompare = jest.fn());
jest.mock('../../lib/utils/file-system', () => doesBaselineExist = jest.fn());
jest.mock('../../lib/utils/user-prompt', () => promptUserToCreateBaseline = jest.fn());

const compare = require('../../lib/commands/compare');


describe('screenshots-command', () => {

  beforeEach(()=> {
    // create mocked function 
    taskCollectScreenshot.mockImplementation(mockTaskCollectScreenshots);
    taskVisualCompare.mockImplementation(mockTaskCollectScreenshots);
  });

  test('test url validation errors', async() => {

    const consoleSpy = jest.spyOn(console, 'log');
    
    const options = {
      url:'https://www.google.com',
      browsers: ['firefox','chromium']
    };
    
    await compare(options); 
    expect(consoleSpy).toHaveBeenCalledTimes(1);

  });

  test('test no browser is sent by default', async() => {

    const consoleSpy = jest.spyOn(console, 'log');
    
    const options = {
      baseUrl:'https://www.google.com',
      targetUrl:'https://www.google.com',
    };
    
    await compare(options); 
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `${colors.green(`Started 'www.google.com' execution`)} ${colors.gray(' ...\n')}`);
    expect(consoleSpy).toHaveBeenNthCalledWith(6, 'Step executed with: chromium');

  });

  test('test when task returns error', async() => {

    taskCollectScreenshot.mockImplementation(mockTaskWithError);

    const consoleSpy5 = jest.spyOn(console, 'log');
    
    const options = {
      baseUrl:'https://www.google.com',
      targetUrl:'https://www.google.com',
    };
    
    await compare(options);
    
    expect(consoleSpy5).toHaveBeenNthCalledWith(7, colors.bgWhite(colors.red('error')),' Something went wrong. Please check the specified parameters.');

  });

  test('test when baseline does not exist', async() => {

    doesBaselineExist.mockImplementation(()=> new Promise ( res => {res(false)}));
    promptUserToCreateBaseline.mockImplementation(()=> new Promise ( res => {res(true)}));

    const consoleSpy = jest.spyOn(console, 'log');
    
    const options = {
      targetUrl:'https://www.google.com',
    };
    
    await compare(options);
    
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `${colors.green(`Started 'www.google.com' execution`)} ${colors.gray(' ...\n')}`);

  });

  test('validation set context failure to trye', async() => {

    taskCollectScreenshot.mockImplementation(mockTaskWithContext);

    const consoleSpy = jest.spyOn(console, 'log');
    
    const options = {
      targetUrl:'https://www.google.com',
    };
    
    await compare(options);
    
    expect(consoleSpy).toHaveBeenNthCalledWith(8, `\nImages stored in: ${colors.green('img-results/compare')} \n🎉 ${colors.gray('Process completed succesfully')} 🎉`);

  });

  afterEach(() => {    
    jest.resetAllMocks();
  });

  afterAll(()=> {
    jest.restoreAllMocks();
  });
});