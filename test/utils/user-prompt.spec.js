const inquirer = require('inquirer');
const promptUserToCreateBaseline = require('../../lib/utils/user-prompt');

describe ('validations' , () => {

  test('validate-target-url', async() => {
    
    const spy = jest.spyOn(inquirer,'prompt').mockImplementation(jest.fn(() => 
    {
      return {create : true};
    }));

    expect(await promptUserToCreateBaseline()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterAll(()=>{
    jest.clearAllMocks();
  });

});
