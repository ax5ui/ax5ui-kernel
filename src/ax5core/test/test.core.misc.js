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

describe('ax5.util.parseJson TEST', function() {
    it('ax5.util.util.parseJson("[{"a":"99"},"2","3"]") expect [{"a":"99"},"2","3"]', function() {
        var actual = ax5.util.parseJson('[{"a":"99"},"2","3"]');

        actual.should.deepEqual([{"a":"99"},"2","3"]);
    });
    it('ax5.util.parseJson("{"a":1, "b":function(){return 1;}}", false) expect {"error": 500, "msg": "syntax error"}', function() {
        var actual = ax5.util.parseJson('{"a":1, "b":function(){return 1;}}', false);

        actual.should.deepEqual({"error": 500, "msg": "syntax error"});
    });
    it('ax5.util.parseJson("{"a":1, "b":function(){return 1;}}", true) expect {"a": 1, "b": "{Function}"}', function() {
        var actual = ax5.util.parseJson('{"a":1, "b":function(){return 1;}}', true);

        actual.a.should.equal(1);
        actual.b.should.Function();
    });
});

describe('ax5.util.toJson TEST', function() {
    var testCases = [
        {
            args: 1,
            expect: 1
        },
        {
            args: "A",
            expect: '"A"'
        },
        {
            args: [1, 2, 3, "A"],
            expect: '[1,2,3,"A"]'
        },
        {
            args: {a: "a", x: "x"},
            expect: '{"a": "a", "x": "x"}'
        },
        {
            args: [1,{"a": "a", "x": "x"}],
            expect: '[1,{"a": "a", "x": "x"}]'
        },
        {
            args: {"a": "a", "x": "x", "list": [1,2,3]},
            expect: '{"a": "a", "x": "x", "list": [1,2,3]}'
        },
        {
            args: function func() {},
            expect: '"{Function}"'
        }
    ];

    _.each(testCases, function(testCase){
        it('ax5.util.toJson(' + (JSON.stringify(testCase.args) || testCase.args.toString()) + ') expect ' + testCase.expect, function() {
            var actual = ax5.util.toJson(testCase.args);

            actual.should.deepEqual(testCase.expect);
        });
    });
});
