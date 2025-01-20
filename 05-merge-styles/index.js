const fs = require('node:fs').promises;
const path = require('node:path');
const { stdout, stderr } = process;

const sourceFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(outputFolderPath, 'bundle.css');

const createStylesBundle = async (source, targetFolder, targetFile) => {
  try {
    const stylesArray = [];
    await fs.mkdir(targetFolder, { recursive: true });
    const dirents = await fs.readdir(source, { withFileTypes: true });

    for (const dirent of dirents) {
      const filePath = path.join(source, dirent.name);
      if (dirent.isFile() && path.extname(dirent.name) === '.css') {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        stylesArray.push(fileContent);
      }
    }
    await fs.writeFile(targetFile, stylesArray.join('\n'), { encoding: 'utf-8' });
    stdout.write(`Styles bundle file successfully created: ${targetFile}\n`);
  } catch (error) {
    stderr.write(`Error during the styles bundle creation occurred: ${error.message}\n`);
  }
};

if (require.main === module) {
  createStylesBundle(sourceFolderPath, outputFolderPath, bundleFilePath);
}

module.exports = createStylesBundle;