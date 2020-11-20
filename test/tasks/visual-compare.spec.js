jest.mock('looks-same');

const looksSame = require('looks-same');

jest.spyOn(looksSame, 'createDiff').mockResolvedValue(jest.fn());

const taskVisualCompare = require('../../lib/tasks/visual-compare');

describe('visual-compare-task', () => {

  test('verify task title', async() => {

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

  afterEach(() => {    
    jest.resetAllMocks();
  });

});