/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5select TEST', function () {
    var myUI;
    var options = [];
    options.push({value: "1", text: "string"});
    options.push({value: "2", text: "number"});
    options.push({value: "3", text: "substr"});
    options.push({value: "4", text: "substring"});
    options.push({value: "search", text: "search"});
    options.push({value: "parseInt", text: "parseInt"});
    options.push({value: "toFixed", text: "toFixed"});
    options.push({value: "min", text: "min"});
    options.push({value: "max", text: "max"});

    var tmpl = '<div class="form-group">' +
        '<div data-ax5select="select1" data-ax5select-config="{}"></div>' +
        '</div>';

    $(document.body).append(tmpl);


    ///
    it('new ax5select', function (done) {
        try {
            myUI = new ax5.ui.select();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('bind select', function (done) {
        myUI.bind({
            target: $('[data-ax5select="select1"]'),
            options: options,
            onChange: function () {

            },
            onStateChanged: function () {
            }
        });
        done();
    });
});

/* ax5.modal.method... */
describe('ax5.ui.select method TEST', function () {
    var myUI = new ax5.ui.select();
    var that;

    before(function () {
        var options = [];
        options.push({value: "1", text: "string"});
        options.push({value: "2", text: "number"});
        options.push({value: "3", text: "substr"});
        options.push({value: "4", text: "substring"});
        options.push({value: "search", text: "search"});
        options.push({value: "parseInt", text: "parseInt"});
        options.push({value: "toFixed", text: "toFixed"});
        options.push({value: "min", text: "min"});
        options.push({value: "max", text: "max"});

        var tmpl = '<div class="form-group">' +
            '<div data-ax5select="select2" data-ax5select-config="{}"></div>' +
            '</div>';

        $(document.body).append(tmpl);

        myUI.bind({
            target: $('[data-ax5select="select2"]'),
            options: options,
            onChange: function () {

            },
            onStateChanged: function () {
                that = this;
            }
        });
    });

    it('select open test', function (done) {
        myUI.open($('[data-ax5select="select2"]'));
        done(ae.equalAll("open", that.state));
    });

    it('select close test', function (done) {
        myUI.close($('[data-ax5select="select2"]'));
        setTimeout(function () {
            done(ae.equalAll("close", that.state));
        }, myUI.config.animateTime);
    });

    it('select val test', function (done) {
        var val = myUI.val($('[data-ax5select="select2"]'))[0];
        done(
            ae.equalAll("1", val.value)
            && ae.equalAll("string", val.text)
        );
    });

    it('select update test', function (done) {
        myUI.update({
            target      : $('[data-ax5select="select1"]'),
            theme       : "danger",
            animateTime : 200
        });
        done(
            ae.equalAll("danger", myUI.queue[1].theme)
            && ae.equalAll(200, myUI.queue[1].animateTime)
        );
    });
});