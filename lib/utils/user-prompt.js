const inquirer = require('inquirer');

// check if baseline exist and return true if it needs to be created
module.exports = async function promptUserToCreateBaseline() {
  let input = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'create',
      default: true,
      message: 'Baseline was not specified and is not previously recorded. Do you want to create a baseline?'
    }]); 
  return(input.create);
};
