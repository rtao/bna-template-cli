const fs = require('fs');
const Path = require('path');
const Axios = require('axios');
const unzipper = require('unzipper');

const pkg = require('../package.json');

module.exports = {
  downloadArchive: async () => {
    const archiveUrl = `https://github.com/rtao/bna-template/archive/v${pkg.archiveVersion}.zip`;
    // const path = Path.resolve(__dirname, '.template.zip');
    const path = 'template.zip';

    const res = await Axios({
      method: 'GET',
      url: archiveUrl,
      responseType: 'stream',
    });

    res.data.pipe(fs.createWriteStream(path));

    return new Promise((resolve, reject) => {
      res.data.on('end', () => {
        resolve();
      });

      res.data.on('error', () => {
        reject();
      });
    });
  },

  unpackArchive: async moduleName => {
    const path = 'template.zip';
    fs.createReadStream(path)
      .pipe(
        unzipper.Extract({
          path: '',
        })
      )
      .promise()
      .then(() => {
        const archiveFolder = `bna-template-${pkg.archiveVersion}`;
        fs.renameSync(archiveFolder, moduleName);
      })
      .then(() => {
        module.exports.updatePackageJson(moduleName);
      });
  },

  clearArchive: async () => {
    const path = 'template.zip';
    fs.unlinkSync(path);
  },

  updatePackageJson: async moduleName => {
    const path = `${moduleName}/package.json`;
    const modPackage = JSON.parse(fs.readFileSync(path, 'utf8'));

    modPackage.name = moduleName;
    const build = modPackage.scripts.buildpackage;
    modPackage.scripts.buildpackage = build.replace('bna-template', moduleName);

    // Update the package.json
    fs.writeFileSync(path, JSON.stringify(modPackage, null, 2));

    fs.renameSync(`${moduleName}/lib/bna-template.js`, `${moduleName}/lib/${moduleName}.js`);
    fs.renameSync(
      `${moduleName}/test/bna-template.test.js`,
      `${moduleName}/test/${moduleName}.test.js`
    );
    fs.renameSync(
      `${moduleName}/models/bna-template.cto`,
      `${moduleName}/models/${moduleName}.cto`
    );
  },
};
