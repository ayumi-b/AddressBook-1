/* jshint mocha: true, expr: true, strict: false, undef: false */


describe('test suite', function () {
  it('should assert true', function () {
    true.should.be.true;
    false.should.be.false;
  });
});

describe('hello', function () {
  it('should return world', function () {
    hello().should.equal('world');
  });
});

describe('setUpPage', function () {
  it('should console log the page is set'), function () {
    setUpPage().should.log('the page is set');
  };
});

describe('toggled', function () {
  it('should console log to add the clicked items'), function () {
    toggled().should.log('add the clicked items');
  };
});



