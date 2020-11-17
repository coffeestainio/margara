const doesBaselineExist = require('../../lib/utils/file-system');

describe('baseline-existance', () => {
  test('validate-not-existance', async () => {
    expect(await doesBaselineExist('test/file/does/not/exist')).toBe(false);

  });

  test('validate-existance', async () => {
    expect(await doesBaselineExist('test/fixtures/file.txt')).toBe(true);
    
  });
});