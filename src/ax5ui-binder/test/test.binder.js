/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5binder TEST', function () {
    var myUI;

    var tmpl = '<form class name="binder-form" onsubmit="return false;" style="border: 1px solid #ccc;padding: 10px;border-radius: 10px;">' +
        '<div class="form-group">' +
        '<label>Email address</label>' +
        '<input type="email" class="form-control" data-ax-path="email">' +
        '</div>' +
        '<div class="form-group">' +
        '<label>Password</label>' +
        '<input type="password" class="form-control" data-ax-path="password"></div>' +
        '<div class="form-group">' +
        '<label>Select</label>' +
        '<select class="form-control" data-ax-path="select"><option value></option><option value="A">A</option><option value="B">B</option></select></div>' +
        '<div class="checkbox"><label><input type="checkbox" data-ax-path="useYn" value="Y">Y/N</label></div>' +
        '<div class="radio"><label><input type="radio" name="radio" data-ax-path="sex" value="M">M</label>' +
        '<label><input type="radio" name="radio" data-ax-path="sex" value="F">F</label>' +
        '</div>' +
        '</form>';

    $(document.body).append(tmpl);


    ///
    it('new ax5binder', function (done) {
        try {
            myUI = new ax5.ui.binder();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('setModel ax5binder', function (done) {
        myUI.setModel({
            email: "tom@axisj.com",
            password: "12345",
            select: "B",
            useYn: "Y",
            sex: "F"
        }, jQuery(document["binder-form"]));

        done(myUI.get("email") == "tom@axisj.com" ? "" : "setModel error");
    });


    it('set[select] ax5binder', function (done) {
        myUI.set("select", "A");
        done(myUI.get("select") == "A" ? "" : "set error");
    });

    it('set[checkbox] ax5binder', function (done) {
        myUI.set("useYn", "N");
        done(myUI.get("useYn") == "N" ? "" : "set error");
    });

    it('set[radio] ax5binder', function (done) {
        myUI.set("sex", "M");
        done(myUI.get("sex") == "M" ? "" : "set error");
    });


    it('onchange input value ax5binder', function (done) {
        jQuery('[data-ax-path="email"]')
            .val("brant")
            .trigger("change");

        done(myUI.get("email") == "brant" ? "" : "onchange input value");
    });

});