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

describe('tabeliao.getVersion', function desc() {
  it('should return correct version', function test() {
    expect(tabeliao.getVersion({ version: '1.2.3' })).to.be.equal('v1.2.3');
    expect(tabeliao.getVersion({ version: '2.2.2' })).to.be.equal('v2.2.2');
    expect(tabeliao.getVersion({ version: '0' })).to.be.equal('v0');
  });
});

describe('tabeliao.getServiceId', function desc() {
  it('should return correct service id', function test() {
    expect(tabeliao.getServiceId({ name: '1.2.3' }))
      .to.be.equal(os.hostname() + '-1.2.3');
    expect(tabeliao.getServiceId({ name: '2.2.2' }))
      .to.be.equal(os.hostname() + '-2.2.2');
    expect(tabeliao.getServiceId({ name: '0' }))
      .to.be.equal(os.hostname() + '-0');
  });
});

describe('tabeliao.getPort', function desc() {
  it('should return correct port', function test() {
    expect(tabeliao.getPort({ port: '1234' })).to.be.equal('1234');
    expect(tabeliao.getPort({ port: '2222' })).to.be.equal('2222');
    expect(tabeliao.getPort({ port: '0000' })).to.be.equal('0000');
  });

  it('should return 3000 as default', function test() {
    expect(tabeliao.getPort()).to.be.equal(3000);
  });
});

describe('tabeliao.getHost', function desc() {
  it('should return correct host', function test() {
    expect(tabeliao.getHost({ host: 'abc.com' })).to.be.equal('abc.com');
    expect(tabeliao.getHost({ host: 'example.com' })).to.be.equal('example.com');
    expect(tabeliao.getHost({ host: 'pipitchu.xyz' })).to.be.equal('pipitchu.xyz');
  });

  it('should return localhost as default', function test() {
    expect(tabeliao.getHost()).to.be.equal('localhost');
  });
});

describe('tabeliao.getProtocol', function desc() {
  it('should return https when ssl is true', function test() {
    expect(tabeliao.getProtocol({ ssl: true })).to.be.equal('https');
  });

  it('should return http as default', function test() {
    expect(tabeliao.getProtocol()).to.be.equal('http');
  });
});
