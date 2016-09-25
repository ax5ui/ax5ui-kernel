describe('ax5.util.param TEST', function() {
    it('ax5.util.param({a: 1, b: \'123\'"2&\'}, "param") expect "a=1&b=123%27%222%26"', function() {
        var actual = ax5.util.param({a: 1, b: '123\'"2&'}, 'param');

        actual.should.equal('a=1&b=123%27%222%26');
    });
    it('ax5.util.param("a=1&b=12\'"32", "param") expect "a=1&b=12\'"32"', function() {
        var actual = ax5.util.param("a=1&b=12'\"32", 'param');

        actual.should.equal('a=1&b=12\'"32');
    });
    it('ax5.util.param("a=1&b=1232") expect {"a":"1","b":"1232"}', function() {
        var actual = ax5.util.param("a=1&b=1232");

        _.isEqual(actual, {"a":"1","b":"1232"}).should.equal(true);
    });
});
