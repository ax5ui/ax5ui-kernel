describe('ax5.util.getType TEST', function() {
    var success = [
        {
            args: [ 1 ],
            expect: 'number'
        },
        {
            args: [ '1' ],
            expect: 'string'
        },
        {
            args: [ [0, 1, 2] ],
            expect: 'array'
        },
        {
            args: [ {a: 1} ],
            expect: 'object'
        },
        {
            args: [ function(){} ],
            expect: 'function'
        },
        {
            args: [ document.querySelectorAll("div") ],
            expect: 'nodelist'
        },
        {
            args: [ document.createDocumentFragment() ],
            expect: 'fragment'
        },
        {
            args: [ null ],
            expect: 'null'
        },
        {
            args: [ undefined ],
            expect: 'undefined'
        }
    ];

    success.forEach(function(item){
        it('ax5.util.getType: ' + JSON.stringify(item), function() {
            var actual = ax5.util.getType.apply(this, item.args);

            actual.should.equal(item.expect);
        });
    });

});
