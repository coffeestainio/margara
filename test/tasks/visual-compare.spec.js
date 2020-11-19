jest.mock('shelljs');
jest.mock('looks-same');


const shell = require('shelljs');
const looksSame = require('looks-same');
const colors = require('colors');

jest.spyOn(looksSame, 'createDiff').mockResolvedValue(jest.fn());

const taskVisualCompare = require('../../lib/tasks/visual-compare');

describe('visual-compare-task', () => {

  test('verify task title', async() => {

    const image = '/test/fixtures/image.png';

    const compareSettings = {
      browserType: 'webkit',
    };
    
    const task = taskVisualCompare(compareSettings);
    expect(task.title).toBe('Comparing screenshots for: webkit');

  });


  test('images are  same', async() => {

    const consoleSpy = jest.spyOn(console, 'log');
    const image = 'test/fixtures/image.png';

    const compareSettings = {
      browserType: 'webkit',
      screenShotBaseFile: image,
      screenShotTargetFile: image,
    };
    
    const task = taskVisualCompare(compareSettings);
    task.task();

    expect(consoleSpy).toHaveBeenCalledTimes(0);
  
  });

  test('images are  different', async() => {

    shell.mkdir = jest.fn();
    const consoleSpy = jest.spyOn(console, 'log');
    const image = 'test/fixtures/image.png';
    const imageDiff = 'test/fixtures/image-diff.png';
    const screenShotDiffFile = 'test/fixtures/image-diff-result.png';

    const compareSettings = {
      browserType: 'webkit',
      screenShotBaseFile: image,
      screenShotTargetFile: imageDiff,
      screenShotDiffFile: screenShotDiffFile
    };
    
    const task = taskVisualCompare(compareSettings);
    await task.task()

    expect(consoleSpy).toHaveBeenCalledTimes(0);
  
  });

  test('throw error on failure', async() => {

    const compareSettings = {
      browserType: 'webkit',
      screenShotBaseFile: 'img/does/not.png',
    };
    
    const task = taskVisualCompare(compareSettings);
    try{
      await task.task()
    }
    catch(ex){
      expect(ex).toBe(true)
    }
  
  });

  afterEach(() => {    
    jest.resetAllMocks();
  });

});