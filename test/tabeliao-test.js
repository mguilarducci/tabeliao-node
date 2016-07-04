/* eslint no-underscore-dangle: ["error", { "allow": ["__set__"] }] */

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');
var os = require('os');
var pkgDir = __dirname + '/../package.json';
var pkg = require(pkgDir);

var tabeliao = rewire('../lib/tabeliao.js');

var consul = {
  agent: { service: { register: sinon.stub() } }
};

var version = 'v' + pkg.version;

var serviceData = {
  id: os.hostname() + '-' + pkg.name,
  name: pkg.name,
  tags: ['nodejs', version]
};

tabeliao.__set__({
  consul: consul
});

describe('Getting project data', function desc() {
  it('should return the tags correctly', function test() {
    expect(tabeliao.getProjectData()).to.deep.equal(serviceData);
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
