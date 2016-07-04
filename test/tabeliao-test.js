/* eslint no-underscore-dangle: ["error", { "allow": ["__set__"] }] */

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');
var os = require('os');
var pkgDir = __dirname + '/../package.json';
var pkg = require(pkgDir);

var tabeliao = rewire('../lib/tabeliao.js');

var project = {
  id: os.hostname() + '-' + pkg.name,
  name: pkg.name,
  tech: 'nodejs',
  version: 'v' + pkg.version
};

var consul = {
  agent: { service: { register: sinon.stub() } }
};

var serviceData = {
  id: project.id,
  name: project.name,
  tags: [project.tech, project.version]
};

tabeliao.__set__({
  consul: consul,
  PKG_DIR: pkgDir
});

describe('Getting project data', function desc() {
  it('should return the name correctly', function test() {
    expect(tabeliao.getProjectData().name).equal(project.name);
  });

  it('should return the project id correctly', function test() {
    expect(tabeliao.getProjectData().id).equal(project.id);
  });

  it('should return tech tag correctly', function test() {
    expect(tabeliao.getProjectData().tags).to.include(project.tech);
  });

  it('should return version tag correctly', function test() {
    expect(tabeliao.getProjectData().tags).to.include(project.version);
  });

  it('should return the correct object', function test() {
    var allKeys = ['id', 'name', 'tags'];
    expect(tabeliao.getProjectData()).to.have.all.keys(allKeys);
  });
});

describe('Calling consul agent', function desc() {
  /* eslint no-unused-expressions: 0 */
  beforeEach(function setUp() {
    consul.agent.service.register.callsArgAsync(1);
  });

  it('should register the service', function test(done) {
    tabeliao.register(function cb(err) {
      expect(err).to.not.exist;
      expect(consul.agent.service.register.calledOnce).to.be.true;
      done();
    });
  });

  it('should register the service with correct values', function test(done) {
    tabeliao.register(function cb(err) {
      var args = consul.agent.service.register.lastCall.args[0];
      expect(err).to.not.exist;
      expect(args).to.deep.equal(serviceData);
      done();
    });
  });
});
