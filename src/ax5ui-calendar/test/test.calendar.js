/* 
	test.calendar.js
	TODO event test 
*/

/* ax5.calendar.setConfig */
describe('ax5.calendar TEST', function(){
	before(function(){
	});

	it('check calendar type' , function(){
		should.equal(typeof new ax5.ui.calendar() , "object");
	});

	it('calendar setConfig' , function(){
		var myCalendar = new ax5.ui.calendar();
		var myDate = new Date();

		myCalendar.setConfig({
			target : '',
			theme : 'info',
			displayDate : myDate,
			control : {

			},
			mode : 'day',
			selectMode : 'day',
			dateFormat : 'yyyy-mm-dd',
			dimensions : {

			},
			animateTime : 250,
			lang : {
				yearHeading : '2016',
				monthHeading : '09',
				yearTmpl : '%s',
				months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				dayTmpl : '%s'	
			},
			selectable : '',
			marker : {},
			multipleSelect : false,
			onClick : function(){
				alert('success');
			},
			onStateChanged : function(){
				console.log('onStateChanged');
			}
		});

		should.equal(myCalendar.config.theme , 'info');
		should.equal(myCalendar.config.animateTime , 250);
		should.equal(myCalendar.config.dateFormat , 'yyyy-mm-dd');
		should.equal(myCalendar.config.selectMode , 'day');
		should.equal(myCalendar.config.displayDate , myDate);
		should.equal(myCalendar.config.lang.months[0] , 'January');
		should.equal(typeof myCalendar.config.onClick , 'function');
		should.equal(typeof myCalendar.config.onStateChanged , 'function');
		should.equal(myCalendar.config.multipleSelect , false);
	});

	it('calendar initalizing without using setConfig method' , function(){
		var myCalendar2 = new ax5.ui.calendar({
			theme : 'info',
			onClick : function(){
				alert('success');
			}
			// etc ...
		});

		should.equal(myCalendar2.config.theme , 'info');
		should.equal(typeof myCalendar2.config.onClick , 'function');
	});
});