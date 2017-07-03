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

    // setSelectedColor testCases
    var testCases = [
        {
            index: 0,
            colorHex: "ff4b4b",
            colorName: "red"
        },
        {
            index: 1,
            colorHex: "a66200",
            colorName: "orange"
        },
        {
            index: 2,
            colorHex: "c0c000",
            colorName: "yellow"
        },
        {
            index: 3,
            colorHex: "007a1a",
            colorName: "green"
        },
        {
            index: 4,
            colorHex: "4b4bff",
            colorName: "blue"
        },
        {
            index: 5,
            colorHex: "4a0066",
            colorName: "purple"
        },
        {
            index: 6,
            colorHex: "1e1e1e",
            colorName: "black"
        },
        {
            index: 7,
            colorHex: "e1e1e1",
            colorName: "white"
        }
    ];

    testCases.forEach(function(testCase){
        it('palette setSelectedColor on ' + testCase.colorName, function (done) {
            var color = testCase.colorHex;
            setTimeout(function () {
                done(myPalette.setSelectedColor(color).colors[testCase.index]._selectedColor == color ? "" : "setSelectedColor error");
            }, myPalette.config.animateTime);
        });
    });

    it('palette repaint', function (done) {
        setTimeout(function () {
            myPalette.repaint();
            done();
        },  myPalette.config.animateTime * 1.3);
    });
});