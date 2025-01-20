const fs = require('node:fs').promises;
const path = require('node:path');
const { stdout, stderr } = process;

const sourceFolderPath = path.join(__dirname, 'files');
const destinationFolderPath = path.join(__dirname, 'files-copy');

/**
 * To avoid errors in cases where the directory already exists,
 * instead of checking for the (error.code === 'ENOENT') condition, we could also use:
 * await fs.mkdir(target, { recursive: true });
 * but I wanted to make an alternative solution to this task
 */
const copyDirectory = async (source, target) => {
  try {
    await fs.access(target);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const items = await fs.readdir(source, { withFileTypes: true });
      await fs.mkdir(target);

      for (const item of items) {
        const sourcePath = path.join(source, item.name);
        const targetPath = path.join(target, item.name);

        if (item.isDirectory()) {
          await copyDirectory(sourcePath, targetPath);
        } else {
          await fs.copyFile(sourcePath, targetPath);
        }
      }
    } else {
      stderr.write(`Error copying directory: ${error.message}\n`);
    }
  }
};

const removeFolder = async (pathToFolder) => {
  try {
    await fs.rm(pathToFolder, { recursive: true, force: true });
  } catch (error) {
    stderr.write(`Error removing folder: ${error.message}\n`);
  }
}

const startСopy = async (sourceDirectoryPath, targetDirectoryPath) => {
  try {
    await removeFolder(targetDirectoryPath);
    await copyDirectory(sourceDirectoryPath, targetDirectoryPath);
    stdout.write(`Files copied successfully: ${targetDirectoryPath}\n`);
  } catch (error) {
    stderr.write(`Failed to copy files: ${error.message}\n`);
  }
};

if (require.main === module) {
  startСopy(sourceFolderPath, destinationFolderPath);
}

module.exports = startСopy;