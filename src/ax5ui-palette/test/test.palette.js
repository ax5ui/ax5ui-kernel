/* 
 test.calendar.js
 TODO event test
 */

/* ax5.calendar.setConfig */
describe('ax5.palette TEST', function () {
    var myPalette;
    var tmpl = '<div data-ax5palette="01" style="' +
        'width:300px;"></div>';

    $(document.body).append(tmpl);

    it('check palette type', function (done) {
        done(typeof new ax5.ui.palette() == "object" ? "" : "check type error");
    });

    it('palette setConfig', function (done) {
        myPalette = new ax5.ui.palette();
        myPalette.setConfig({
            target: $('[data-ax5palette="01"]'),
            onClick: function () {
                alert('success');
            }
        });

        done();
    });

    it('palette setSelectedColor on red', function (done) {
        var color = "ff4b4b";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[0]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette setSelectedColor on orange', function (done) {
        var color = "a66200";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[1]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette setSelectedColor on yellow', function (done) {
        var color = "c0c000";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[2]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette setSelectedColor on green', function (done) {
        var color = "007a1a";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[3]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette setSelectedColor on blue', function (done) {
        var color = "4b4bff";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[4]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette setSelectedColor on purple', function (done) {
        var color = "4a0066";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[5]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette setSelectedColor on black', function (done) {
        var color = "1e1e1e";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[6]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette setSelectedColor on white', function (done) {
        var color = "e1e1e1";
        setTimeout(function () {
            done(myPalette.setSelectedColor(color).colors[7]._selectedColor == color ? "" : "setSelectedColor error");
        }, myPalette.config.animateTime);
    });

    it('palette repaint', function (done) {
        setTimeout(function () {
            myPalette.repaint();
            done();
        },  myPalette.config.animateTime * 1.3);
    });
});