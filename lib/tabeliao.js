var fs = require('fs');
var os = require('os');
var PKG_DIR = __dirname + '/../../package.json';

function getVersion(pkg) {
  return 'v' + pkg.version;
}

function getProjectData() {
  var pkg;

  try {
    pkg = JSON.parse(fs.readFileSync(PKG_DIR, 'utf8'));
  } catch (err) {
    throw new Error('Invalid package.json');
  }

  return {
    id: os.hostname() + '-' + pkg.name,
    name: pkg.name,
    tags: ['nodejs', getVersion(pkg)]
  };
}

module.exports = {
  getProjectData: getProjectData
};
