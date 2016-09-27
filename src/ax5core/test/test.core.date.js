describe('ax5.util.date TEST', function() {

	/* ax.util.date */
	//Example 01
	//confirm 필요
	it('ax5.util.date("2013-01-01")' , function(){
		should.deepEqual(ax5.util.date('2013-01-01') , '2013-01-01 23:59:00.000 +0900');
	});

	//Example 02
	it('ax5.util.date((new Date()) , {add:{d:10} , return:"yyyy/MM/dd"})' , function(){
		var date = new Date();
		date.setDate(date.getDate() + 10);
		var str = date.getFullYear() + "/" + (date.getMonth()+1) + "/"
		
		if(date.getDate() < 10){
			str += "0"+date.getDate();
		}else{
			str += date.getDate();
		}
		
		should.deepEqual(
			ax5.util.date((new Date()) , {add:{d:10} , return:'yyyy/MM/dd'}) , str
		);
	});

	//Example 03
	it('ax5.util.date("1919-03-01", {add:{d:10}, return:"yyyy/MM/dd hh:mm:ss"})' , function(){
		should.deepEqual(ax5.util.date("1919-03-01", {add:{d:10}, return:"yyyy/MM/dd hh:mm:ss"}) , '1919/03/11 23:59:00');
	});
	/* end ax.util.date */
});