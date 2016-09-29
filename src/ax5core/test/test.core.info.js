describe('ax5.info TEST', function() {
    it('ax5.info.version expect x.x.x', function() {
        ax5.info.version.should.match(/\d+\.\d+\.\d+/);
    });

    it('ax5.info.eventKeys expect {BACKSPACE: 8, ...}', function() {
        var expect = {
            "BACKSPACE": 8,
            "TAB": 9,
            "RETURN": 13,
            "ESC": 27,
            "LEFT": 37,
            "UP": 38,
            "RIGHT": 39,
            "DOWN": 40,
            "DELETE": 46,
            "HOME": 36,
            "END": 35,
            "PAGEUP": 33,
            "PAGEDOWN": 34,
            "INSERT": 45,
            "SPACE": 32
        };
        should.deepEqual(ax5.info.eventKeys, expect);
    });

    it('ax5.info.browser expect {name: "xxx", version: "xx", mobile: Boolean}', function() {
        should.deepEqual(Object.keys(ax5.info.browser), ["name", "version", "mobile"]);
    });

    it('ax5.info.urlUtil() expect ["href", "param", ...]', function() {
        should.deepEqual(Object.keys(ax5.info.urlUtil()), ["href", "param", "referrer", "pathname", "hostname", "port", "url", "baseUrl"]);
    });

    it('ax5.info.errorMsg.ax5dialog["501"] expect "Duplicate call error"', function() {
        should.equal(ax5.info.errorMsg.ax5dialog["501"], 'Duplicate call error');
    });

    it('ax5.info.isBrowser expect true', function() {
        should(ax5.info.isBrowser).Boolean();
    });

    it('ax5.info.wheelEnm expect "mousewheel"', function() {
        should.equal(ax5.info.wheelEnm, "mousewheel");
    });

    it('ax5.info.weekNames expect [{label: "SUN"},{label: "MON"}...]', function() {
        var expect = [
            { "label": "SUN" },
            { "label": "MON" },
            { "label": "TUE" },
            { "label": "WED" },
            { "label": "THU" },
            { "label": "FRI" },
            { "label": "SAT" }
        ];
        should.deepEqual(ax5.info.weekNames, expect);
    });

    it('ax5.info.supportTouch expect Boolean', function() {
        should(ax5.info.supportTouch).Boolean();
    });

});
