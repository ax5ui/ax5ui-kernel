/* 
 test.calendar.js
 TODO event test
 */

/* ax5.calendar.setConfig */
describe('ax5.calendar TEST', function () {

    var myCalendar;
    var myDate = new Date();

    var tmpl = '<div id="calendar-target" style="' +
        'width:300px;border:1px solid #ccc;border-radius: 5px;padding: 5px;overflow: hidden;"></div>';

    $(document.body).append(tmpl);

    it('check calendar type', function (done) {
        done(typeof new ax5.ui.calendar() == "object" ? "" : "check type error");
    });

    it('calendar setConfig', function (done) {
        myCalendar = new ax5.ui.calendar();
        myCalendar.setConfig({
            target: document.getElementById("calendar-target"),
            theme: 'info',
            displayDate: myDate,
            control: {},
            mode: 'day',
            selectMode: 'day',
            dateFormat: 'yyyy-mm-dd',
            dimensions: {},
            animateTime: 250,
            lang: {
                yearHeading: '2016',
                monthHeading: '09',
                yearTmpl: '%s',
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                dayTmpl: '%s'
            },
            selectable: '',
            marker: {},
            multipleSelect: false,
            onClick: function () {
                alert('success');
            },
            onStateChanged: function () {
                console.log('onStateChanged');
            }
        });

        if (
            (myCalendar.config.theme == 'info') &&
            (myCalendar.config.animateTime == 250) &&
            (myCalendar.config.dateFormat == 'yyyy-mm-dd') &&
            (myCalendar.config.selectMode == 'day') &&
            (myCalendar.config.displayDate == myDate) &&
            (myCalendar.config.lang.months[0] == 'January') &&
            (typeof myCalendar.config.onClick == 'function') &&
            (typeof myCalendar.config.onStateChanged == 'function') &&
            (myCalendar.config.multipleSelect == false)
        ) {
            done();
        } else {
            done("error setConfig");
        }
    });

    it('changeMode ax5calendar', function(done) {
        myCalendar = new ax5.ui.calendar();
        myCalendar.setConfig({
            target: document.getElementById("calendar-target"),
            theme: 'info',
            displayDate: myDate,
            control: {},
            mode: 'day',
            selectMode: 'day',
            dateFormat: 'yyyy-mm-dd',
            dimensions: {},
            animateTime: 250,
            lang: {
                yearHeading: '2016',
                monthHeading: '09',
                yearTmpl: '%s',
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                dayTmpl: '%s'
            },
            selectable: '',
            marker: {},
            multipleSelect: false,
            onClick: function () {
                alert('success');
            },
            onStateChanged: function () {
                console.log('onStateChanged');
            }
        });

        myCalendar.changeMode("m");

        setTimeout(function () {
            done(myCalendar.$["body"].hasClass("fadein") ? "" : "changeMode error");
        }, myCalendar.config.animateTime);
    });
});