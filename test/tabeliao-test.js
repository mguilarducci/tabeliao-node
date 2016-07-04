/* eslint no-underscore-dangle: ["error", { "allow": ["__set__"] }] */

var expect = require('chai').expect;
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

tabeliao.__set__('PKG_DIR', pkgDir);

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
