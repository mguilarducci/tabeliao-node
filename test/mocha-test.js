var should = require('chai').should();

describe('Mocha config', function desc() {
  it('should pass', function test(done) {
    var value = 100;
    value.should.equal(100);
    done();
  });
});
