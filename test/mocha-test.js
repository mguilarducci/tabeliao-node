var expect = require('chai').expect;

describe('Mocha config', function desc() {
  it('should pass', function test(done) {
    var value = 100;
    expect(value).equal(100);
    done();
  });
});
