const path = require('path');
const colors = require('colors/safe');
const fs = require('fs-extra');
const appVersion = require('../package.json').version;
const versionFilePath = path.join(__dirname + '/../src/core/version.ts');
const src = `export const version = '${appVersion}';\n`;

console.log(colors.cyan('\nRunning pre-build tasks'));

try {
  fs.mkdirSync(path.join(__dirname + `/../dist`));
} catch (err) {
  if (err.code !== 'EEXIST') {
    throw err;
  }
}

fs.writeFileSync(versionFilePath, src, { encoding: 'utf8', flat: 'w' }, (err) => {
  if (err) {
    return console.log(colors.red(err));
  }

  console.log(colors.green(`Updating application version ${colors.yellow(appVersion)}`));
  console.log(`${colors.green('Writing version module to ')}${colors.yellow(versionFilePath)}\n`);
});

const copyFiles = ['package.json', 'README.md'];

for (const copyFile of copyFiles) {
  fs.copyFile(path.join(__dirname + `/../${copyFile}`), path.join(__dirname + `/../dist/${copyFile}`), (err) => {
    if (err) {
      return console.log(colors.red(err));
    }

    console.log(colors.green(`copy ${colors.yellow(copyFile)}`));
  });
}
