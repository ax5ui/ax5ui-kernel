describe('ax5.util.left TEST', function() {
  var testCases = [
      {
          args: [ 'abcd.efd', 3 ],
          expect: 'abc'
      },
      {
          args: [ 'abcd.efd', '.' ],
          expect: 'abcd'
      }
  ];

  testCases.forEach(function(testCase){
      it('ax5.util.left(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.left.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.right TEST', function() {
  var testCases = [
      {
          args: [ 'abcd.efd', 3 ],
          expect: 'efd'
      },
      {
          args: [ 'abcd.efd', '.' ],
          expect: 'efd'
      }
    ];

  testCases.forEach(function(testCase){
      it('ax5.util.right(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.right.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.camelCase Test', function() {
  var testCases = [
    {
      args: [ 'inner-width' ],
      expect: 'innerWidth'
    },
    {
      args: [ 'innerWidth' ],
      expect: 'innerWidth'
    }
  ];
  testCases.forEach(function(testCase){
      it('ax5.util.camelCase(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.camelCase.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.snakeCase Test', function() {
  var testCases = [
    {
      args: [ 'inner-width' ],
      expect: 'inner-width'
    },
    {
      args: [ 'camelCase' ],
      expect: 'camel-case'
    }
  ];
  testCases.forEach(function(testCase){
      it('ax5.util.snakeCase(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.snakeCase.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.setDigit Test', function() {
  var testCases = [
    {
      args: [ 1, 2 ],
      expect: '01'
    },
  ];
  testCases.forEach(function(testCase){
      it('ax5.util.setDigit(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.setDigit.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});
