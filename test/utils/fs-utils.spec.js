const colors = require('colors');
const fs = require('fs');

const doesBaselineExist = require('../../lib/utils/fs-utils');

describe('baseline-existance', () => {
  test('validate-exist', async () => {
    expect(await doesBaselineExist('test/file/does/not/exist')).toBe(false);

  });

  test('validate-exist', async () => {
    expect(await doesBaselineExist('test/fixtures/file.txt')).toBe(true);
    
  });

})