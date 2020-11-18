const mockedPlaywight = {
  newContext: () => { 
    return {
      newPage: () => { 
        return {
          goto: () => { return jest.fn(); },
          screenshot: () => { 
            return jest.fn(); 
          }
        };
      },
    };
  },
  close: () => { return jest.fn();}
};

const mockedPlaywightWithError = {
  newContext: () => { 
    return {
      newPage: () => { 
        return {
          goto: () => { throw new Error('mocked error'); },
        };
      },
    };
  }
};

const mockTaskWithError = () => {
  return {
    title: 'Mock Error Step',
    task: () => {
      throw new Error('error');
    }
  };
};

const mockTaskCollectScreenshots = (options) => {
  return {
    title: 'Mock step',
    task: () => {
      console.log(`Step executed with: ${options.browserType}`);
    }
  };
};

module.exports = { 
  mockedPlaywight,
  mockedPlaywightWithError,
  mockTaskCollectScreenshots,
  mockTaskWithError
};
