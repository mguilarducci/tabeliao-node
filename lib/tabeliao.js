var fs = require('fs');
var os = require('os');
var path = require('path');
var consul = require('consul')();

function findPackageJson() {
  var pkgfile;
  var dir = path.resolve(process.cwd());

  do {
    pkgfile = path.join(dir, 'package.json');

    if (!fs.existsSync(pkgfile)) {
      dir = path.join(dir, '..');
      continue;
    }
    return pkgfile;
  } while (dir !== path.resolve(dir, '..'));
  return null;
}

function getVersion(pkg) {
  return 'v' + pkg.version;
}

function getServiceId(pkg) {
  return os.hostname() + '-' + pkg.name;
}

function getProjectData() {
  var pkg;

  try {
    pkg = JSON.parse(fs.readFileSync(findPackageJson(), 'utf8'));
  } catch (err) {
    throw new Error('Invalid package.json');
  }

  return {
    id: getServiceId(pkg),
    name: pkg.name,
    tags: ['nodejs', getVersion(pkg)]
  };
}

function register(cb) {
  var options = getProjectData();
  consul.agent.service.register(options, cb);
}

module.exports = {
  getVersion: getVersion,
  getProjectData: getProjectData,
  getServiceId: getServiceId,
  register: register
};
