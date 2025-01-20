const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  prompt: `\x1b[${33}m${`\nYou are currently in ${pathToHomeDirectory}\n`}\x1b[0m`
});


rl.on('line', async (input) => {
  if (input === '.exit') {
    this.#rl.emit('SIGINT');
  };
  try {
    if (input) {
      const parsedInputArgs = parseInputArguments(input);
      this.#router(parsedInputArgs);
    }
  } catch (error) {
    console.error(error.message);
  }
  // Set the prompt again for the next input
  rl.prompt();
});

rl.on('SIGINT', () => {
  const exitPhrase =  this.#colorize('Thank you for using File Manager, ', 31) +
    this.#colorize(userName, 94) +
    this.#colorize(' goodbye!', 31);
  console.log(exitPhrase);
  process.exit(0);
});