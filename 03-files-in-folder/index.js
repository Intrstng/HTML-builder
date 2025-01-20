const fs = require('node:fs').promises;
const path = require('node:path');
const { stdout, stderr } = process;

const folderPath = path.join(__dirname, 'secret-folder');

const getFilesInfoInDirectory = async (folderPath) => {
  try {
    const filePromises = [];
    const dirents = await fs.readdir(folderPath, { withFileTypes: true });
    dirents.forEach(dirent => {
      if (dirent.isFile()) {
        const filePath = path.join(folderPath, dirent.name);
        filePromises.push(
          fs.stat(filePath)
            .then(stats => {
              const fileName = path.parse(dirent.name).name;
              const fileExtension = path.parse(dirent.name).ext.slice(1);
              const fileSize = (stats.size / 1024).toFixed(3);
              stdout.write(`${fileName} - ${fileExtension} - ${fileSize}kb\n`);
            })
            .catch(error => {
              stderr.write(`Error getting file stats: ${error}\n`);
            })
        );
      }
    });

    await Promise.all(filePromises);
    stdout.write('File processing completed successfully.\n');
  } catch (error) {
    stderr.write(`Error reading directory: ${error}\n`);
  }
};

getFilesInfoInDirectory(folderPath)
  .catch(error => {
    stderr.write(`Failed to process files: ${error.message}\n`);
  });