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

function getPort(expressApp) {
  return expressApp.get('port') || 3000;
}

function getHost(expressApp) {
  return expressApp.get('host') || 'localhost';
}

function getProtocol(expressApp) {
  return expressApp.get('ssl') ? 'https' : 'http';
}

function getCheck(expressApp) {
  var port = getPort(expressApp);
  var protocol = getProtocol(expressApp) + '://';
  var host = getHost(expressApp);
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
    name: pkg.name,
    id: getServiceId(pkg),
    port: getPort(expressApp),
    check: getCheck(expressApp),
    tags: ['nodejs', getVersion(pkg)]
  };
}

function expressRoute(req, res) {
  return res.status(200).json({ ok: 'ok' });
}

// function createRoute(app) {
//   app.get('/healthcheck', expressRoute);
// }

function register(options, cb) {
  var serviceData = getProjectData(options);
  // createRoute(expressApp);
  consul.agent.service.register(serviceData, cb);
}

module.exports = {
  getHost: getHost,
  getPort: getPort,
  getCheck: getCheck,
  register: register,
  getVersion: getVersion,
  getProtocol: getProtocol,
  getServiceId: getServiceId,
  expressRoute: expressRoute,
  getProjectData: getProjectData
};
