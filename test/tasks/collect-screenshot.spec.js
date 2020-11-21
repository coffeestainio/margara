jest.mock('playwright');
const playwright = require('playwright');

const { mockedPlaywight, mockedPlaywightWithError  } = require('../mocks/jest-mocks');

const taskCollectScreenshot = require('../../lib/tasks/collect-screenshots');

describe('screenshots-task', () => {

  test('does not require baseline creation', async() => {

    const mock = playwright.firefox.launch.mockResolvedValue(mockedPlaywight);

    const captureSettings = {
      createBaseline: false,
      browserType: 'firefox'
    };
    
    const task = taskCollectScreenshot(captureSettings);
    expect(task.title).toBe('Capturing screenshots using: firefox');
    task.task();

    expect(mock).toHaveBeenCalledTimes(1);
  
  });

  test('require baseline creation', async() => {

    const mock = playwright.firefox.launch.mockResolvedValue(mockedPlaywight);

    const captureSettings = {
      createBaseline: true,
      browserType: 'firefox'
    };
    
    const task = taskCollectScreenshot(captureSettings);
    expect(task.title).toBe('Creating baseline using: firefox');
    task.task();

    expect(mock).toHaveBeenCalledTimes(1);
  
  });

  test('error handling', async() => {

    const browserMockWithError = playwright.firefox.launch.mockResolvedValue(mockedPlaywightWithError);

    const captureSettings = {
      createBaseline: true,
      browserType: 'firefox'
    };
    
    const task = taskCollectScreenshot(captureSettings);
    expect(task.title).toBe('Creating baseline using: firefox');
    expect(task.task).rejects.toThrow();

    expect(browserMockWithError).toHaveBeenCalledTimes(1);
  
  });

  afterEach(() => {    
    jest.resetAllMocks();
  });

});