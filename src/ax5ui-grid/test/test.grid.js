/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5grid TEST', function () {
    var myUI;

    var tmpl = '<div data-ax5grid="first-grid" data-ax5grid-config="" style=""></div>';

    $(document.body).append(tmpl);
    
    ///
    it('new ax5grid', function (done) {
        try {
            myUI = new ax5.ui.grid();
            done();
        } catch (e) {
            done(e);
        }
    });

});