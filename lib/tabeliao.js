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

function getCheck(expressApp) {
  var port = expressApp.get('port') || 3000;
  var protocol = expressApp.get('ssl') ? 'https://' : 'http://';
  var host = expressApp.get('host') || 'localhost';
  var http = protocol + host + ':' + port + '/healthcheck';

  return {
    http: http,
    interval: '60s',
    ttl: '30s'
  };
}

function getProjectData(expressApp) {
  var pkg;

  try {
    pkg = JSON.parse(fs.readFileSync(findPackageJson(), 'utf8'));
  } catch (err) {
    throw new Error('Invalid package.json');
  }

  return {
    id: getServiceId(pkg),
    name: pkg.name,
    tags: ['nodejs', getVersion(pkg)],
    check: getCheck(expressApp)
  };
}

function expressRoute(req, res) {
  return res.status(200).json({ ok: 'ok' });
}

function createRoute(app) {
  app.get('/healthcheck', expressRoute);
}

function register(expressApp, cb) {
  var options = getProjectData(expressApp);
  createRoute(expressApp);
  consul.agent.service.register(options, cb);
}

module.exports = {
  expressRoute: expressRoute,
  getCheck: getCheck,
  getVersion: getVersion,
  getProjectData: getProjectData,
  getServiceId: getServiceId,
  register: register
};
