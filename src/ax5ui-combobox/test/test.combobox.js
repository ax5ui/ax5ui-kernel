/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5combobox TEST', function () {
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
        '<div data-ax5combobox="combobox1" data-ax5combobox-config="{}"></div>' +
        '</div>';

    $(document.body).append(tmpl);


    ///
    it('new ax5combobox', function (done) {
        try {
            myUI = new ax5.ui.combobox();
            done();
        } catch (e) {
            done(e);
        }
    });


    it('bind combobox', function (done) {
        myUI.bind({
            target: $('[data-ax5combobox="combobox1"]'),
            options: options,
            onChange: function () {

            },
            onStateChanged: function () {

            }
        });
        done();
    });

    it('setValue combobox', function (done) {
        myUI.setValue($('[data-ax5combobox="combobox1"]'), 2);
        var selectedItem = myUI.getSelectedOption($('[data-ax5combobox="combobox1"]'))[0];

        if (selectedItem.value == 2 && selectedItem.selected) {
            done();
        } else {
            done("setValue error");
        }
    });

    it('setText combobox', function (done) {
        myUI.setText($('[data-ax5combobox="combobox1"]'), "number");
        var selectedItem = myUI.getSelectedOption($('[data-ax5combobox="combobox1"]'))[0];

        if (selectedItem.text == "number" && selectedItem.selected) {
            done();
        } else {
            done("setText error");
        }
    });
});