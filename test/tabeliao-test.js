/* eslint no-unused-expressions: 0 */
/* eslint no-underscore-dangle: ["error", { "allow": ["__set__"] }] */

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');
var os = require('os');
var pkgDir = __dirname + '/../package.json';
var pkg = require(pkgDir);

var tabeliao = rewire('../lib/tabeliao.js');

var version = 'v' + pkg.version;

var serviceData = {
  port: '5000',
  name: pkg.name,
  tags: ['nodejs', version],
  id: os.hostname() + '-' + pkg.name,
  check: {
    http: 'https://host.com:5000/healthcheck',
    interval: '60s',
    ttl: '30s'
  }
};

var app = {
  get: sinon.stub()
};

beforeEach(function setUp() {
  app.get.reset();

  app.get.withArgs('port').returns('5000');
  app.get.withArgs('host').returns('host.com');
  app.get.withArgs('ssl').returns('true');
});

describe('Getting check', function desc() {
  it('should return correct data', function test() {
    expect(tabeliao.getCheck(app)).to.be.deep.equal(serviceData.check);
  });

  it('should return correct check port default', function test() {
    app.get.withArgs('port').returns(null);

    expect(tabeliao.getCheck(app).http)
      .to.be.equal('https://host.com:3000/healthcheck');
  });

  it('should return correct check default', function test() {
    app.get.withArgs('ssl').returns(null);
    app.get.withArgs('host').returns(null);
    app.get.withArgs('port').returns(null);

    expect(tabeliao.getCheck(app).http)
      .to.be.equal('http://localhost:3000/healthcheck');
  });

  it('should return correct check with params', function test() {
    expect(tabeliao.getCheck(app).http)
      .to.be.equal('https://host.com:5000/healthcheck');
  });
});

describe('Getting project data', function desc() {
  it('should return correct id', function test() {
    expect(tabeliao.getServiceId(pkg)).to.be.equal(serviceData.id);
  });

  it('should return correct version', function test() {
    expect(tabeliao.getVersion(pkg)).to.be.equal(serviceData.tags[1]);
  });

  it('should return correct port', function test() {
    expect(tabeliao.getPort(app)).to.be.equal('5000');
  });

  it('should return correct host', function test() {
    expect(tabeliao.getHost(app)).to.be.equal('host.com');
  });

  it('should return correct protocol', function test() {
    expect(tabeliao.getProtocol(app)).to.be.equal('https');
  });

  it('should return the serviceData correctly', function test() {
    expect(tabeliao.getProjectData(app)).to.deep.equal(serviceData);
  });
});

describe('Express route', function desc() {
  var res = {
    status: function status() { return this; },
    json: sinon.spy()
  };

  beforeEach(function setUp() {
    res.json.reset();
  });

  it('should return { ok: "ok" }', function test() {
    tabeliao.expressRoute({}, res);
    expect(res.json.calledOnce).to.be.true;
  });
});

describe('tabeliao.register', function desc() {
  var consul = {
    agent: { service: { register: sinon.stub() } }
  };

  var options = {
    app: app,
    ssl: true,
    port: '5000',
    host: 'hostexpress.com'
  };

  var tabeliaoRevert = tabeliao.__set__({
    consul: consul
  });

  beforeEach(function setUp() {
    consul.agent.service.register.callsArgAsync(1);
  });

  after(function tearDown() {
    tabeliaoRevert();
  });

  it('should register the service', function test(done) {
    tabeliao.register(options, function cb(err) {
      expect(err).to.not.exist;
      expect(consul.agent.service.register.calledOnce).to.be.true;
      done();
    });
  });
});
