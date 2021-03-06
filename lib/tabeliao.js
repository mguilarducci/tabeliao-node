var fs = require('fs');
var os = require('os');
var path = require('path');
var async = require('async');
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

function getPort(options) {
  return (options && options.port) || 3000;
}

function getHost(options) {
  return (options && options.host) || 'localhost';
}

function getProtocol(options) {
  return options && !!options.ssl ? 'https' : 'http';
}

function getCheck(options) {
  var http = getProtocol(options) +
    '://' +
    getHost(options) +
    ':' +
    getPort(options) +
    '/healthcheck';

  return {
    ttl: '30s',
    http: http,
    interval: '60s'
  };
}

function getServiceData(options) {
  var pkg;

  try {
    pkg = JSON.parse(fs.readFileSync(findPackageJson(), 'utf8'));
  } catch (err) {
    throw new Error('Invalid package.json');
  }

  return {
    name: pkg.name,
    id: getServiceId(pkg),
    port: getPort(options),
    check: getCheck(options),
    tags: ['nodejs', getVersion(pkg)]
  };
}

function expressRoute(req, res) {
  return res.status(200).json({ ok: 'ok' });
}

function createRoute(app) {
  app.get('/healthcheck', expressRoute);
}

function register(options, cb) {
  var serviceData = getServiceData(options);
  if (options && options.app) {
    createRoute(options.app);
  }
  consul.agent.service.register(serviceData, cb);
}

function getKeyValue(result, key, cb) {
  /* eslint no-param-reassign: 0 */
  consul.kv.get(key, function res(err, data) {
    var value = (!err && data && data.Value) || null;
    try {
      result[key] = JSON.parse(value);
    } catch (ex) {
      result[key] = value;
    }
    return cb(null, result);
  });
}

function getDependencies(deps, cb) {
  async.reduce(deps, {}, getKeyValue, cb);
}

module.exports = {
  getHost: getHost,
  getPort: getPort,
  getCheck: getCheck,
  register: register,
  getVersion: getVersion,
  getProtocol: getProtocol,
  getKeyValue: getKeyValue,
  createRoute: createRoute,
  getServiceId: getServiceId,
  expressRoute: expressRoute,
  getServiceData: getServiceData,
  getDependencies: getDependencies
};
