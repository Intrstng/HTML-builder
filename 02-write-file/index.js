const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const outputFilePath = path.join(__dirname, 'output.txt');

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  prompt: `\x1b[${34}m${`\nPlease, enter your text (type `}\x1b[${31}m${`exit`}\x1b[${34}m${` or press `}\x1b[${31}m${`Ctrl+C`}\x1b[${34}m${` to quit):\n`}\x1b[0m`
});

const promptUser = () => {
  rl.prompt();

  rl.on('line', async (input) => {
    if (input === 'exit') {
      rl.emit('SIGINT');
    }
    try {
      if (input) {
        await fs.promises.appendFile(outputFilePath, input + '\n');
        console.log(`\x1b[32mText added to \x1b[33m${outputFilePath}\x1b[0m`);
      }
    } catch (error) {
      console.error(`\x1b[33mError writing to file: \x1b[31m${error.message}\x1b[0m`);
    }
    rl.prompt();
  });

  rl.on('SIGINT', () => {
    const exitPhrase = `\x1b[31mYou finished executing of the app!\x1b[0m`;
    console.log(exitPhrase);
    rl.close();
    process.exit(0);
  });
}

promptUser();