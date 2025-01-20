const fs = require("node:fs").promises;
const path = require("node:path");
const { stdout, stderr } = process;
const createStylesBundle = require("../05-merge-styles/index");
const startСopy = require("../04-copy-directory/index");

const sourceStylesFolderPath = path.join(__dirname, "styles");
const sourceAssetsFolderPath = path.join(__dirname, "assets");
const sourceTemplateFilePath = path.join(__dirname, "template.html");
const sourceComponentsFolderPath = path.join(__dirname, "components");

const targetBundleFolderPath = path.join(__dirname, "project-dist");
const targetAssetsFolderPath = path.join(targetBundleFolderPath, "assets");
const targetBundleStylesFilePath = path.join(targetBundleFolderPath, "style.css");
const targetHtmlFilePath = path.join(targetBundleFolderPath, "index.html");

const createBundle = async (
  sourceStylesFolder,
  sourceAssetsFolder,
  sourceTemplateFile,
  sourceComponentsFolder,
  targetBundleFolder,
  targetAssetsFolder,
  outputHtmlFile
) => {
  try {
    await createStylesBundle(sourceStylesFolder, targetBundleFolder, targetBundleStylesFilePath);
    await startСopy(sourceAssetsFolder, targetAssetsFolder);

    let template = await fs.readFile(sourceTemplateFile, "utf-8");
    const templateTags = template.match(/{{\s*[\w\-]+\s*}}/g);
    if (!templateTags) {
      throw new Error("The template.html file does not include template tags");
    }

    for (const tag of templateTags) {
      const componentName = tag.replace(/{{\s*|\s*}}/g, "");
      const componentFilePath = path.join(sourceComponentsFolder, `${componentName}.html`);
      try {
        let componentContent = await fs.readFile(componentFilePath, "utf-8");
        componentContent = componentContent.trim().replace(/\n\s*\n/g, "\n");
        template = template.replace(tag, componentContent);
      } catch (error) {
        if (error.code === "ENOENT") {
          throw new Error(`Component ${componentName} does not exist.`);
        } else {
          throw error;
        }
      }
    }
    await fs.writeFile(outputHtmlFile, template);
    stdout.write(`New index.html has been generated successfully: ${outputHtmlFile}`);
  } catch (error) {
    stderr.write(`Error during the bundle creation occurred: ${error.message}`);
  }
};

createBundle(
  sourceStylesFolderPath,
  sourceAssetsFolderPath,
  sourceTemplateFilePath,
  sourceComponentsFolderPath,
  targetBundleFolderPath,
  targetAssetsFolderPath,
  targetHtmlFilePath
);