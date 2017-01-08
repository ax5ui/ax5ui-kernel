/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5picker TEST', function () {
    var myUI;

    var tmpl = '<div class="input-group" data-ax5picker="basic">' +
        '<input type="text" class="form-control" placeholder>' +
        '<span class="input-group-addon"><i class="fa fa-calculator"></i></span>' +
        '</div>';

    $(document.body).append(tmpl);


    ///
    it('new ax5picker', function (done) {
        try {
            myUI = new ax5.ui.picker();
            done();
        } catch (e) {
            done(e);
        }
    });


    it('bind select', function (done) {
        myUI.bind({
            target: $('[data-ax5picker="basic"]'),
            direction: "top",
            contentWidth: 280,
            content: function (callBack) {
                var html = ''
                        + '<form style="padding:0 5px;">'
                        + '<div class="form-group">'
                        + '<label for="exampleInputWidth">Width</label>'
                        + '<input type="number" class="form-control" id="exampleInputWidth" placeholder="width" value="10">'
                        + '</div>'
                        + '<div class="form-group">'
                        + '<label for="exampleInputHeight">Height</label>'
                        + '<input type="number" class="form-control" id="exampleInputHeight" placeholder="height" value="10">'
                        + '</div>'
                        + '</form>'
                    ;
                callBack(html);
            },
            onStateChanged: function () {
                if (this.state == "open") {
                    // ..
                    console.log(this);
                }
            },
            btns: {
                ok: {
                    label: "Calculate", theme: "btn-primary", onClick: function () {
                        //console.log(this);
                        var w = this.item.pickerContent.find("#exampleInputWidth").val() || 1;
                        var h = this.item.pickerContent.find("#exampleInputHeight").val() || 1;
                        this.self.setContentValue(this.item.id, 0, w * h);
                        this.self.close();

                    }
                }
            }
        });

        done();
    });


});