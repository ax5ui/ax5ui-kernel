/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

/*
 test.calendar.js
 TODO event test
 */

/* ax5.calendar.setConfig */
describe('ax5.docker TEST', function () {
    var myDocker;
    var tmpl = '<div data-ax5docker="docker1" style="height: 500px;background: #eee;padding: 5px;"></div>';

    $(document.body).append(tmpl);

    it('check docker type', function (done) {
        done(typeof new ax5.ui.docker() == "object" ? "" : "check type error");
    });

    it('docker setConfig', function (done) {
        myDocker = new ax5.ui.docker();
        myDocker.setConfig({
            target: $('[data-ax5docker="docker1"]')
        });

        done();
    });
});