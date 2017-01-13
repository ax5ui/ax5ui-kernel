describe('formatter Money TEST', function() {
	before(function(){
		$('body').append(
			'<div class="form-group" id="ax5formatter-01">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Money</span>\n' +
			'        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="money" value="9999.99">\n' +
			'    </div>\n' +
			'</div>\n' +
			'<div class="form-group">\n' +
			'    <div class="input-group" id="ax5formatter-01-1">\n' +
			'        <span class="input-group-addon">Money(int)</span>\n' +
			'        <input id="ax5formatter-002" name="2" type="text" class="form-control" placeholder data-ax5formatter="money(int)">\n' +
			'    </div>\n' +
			'</div>\n' +
			'<div class="form-group">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Money</span>\n' +
			'        <input id="ax5formatter-003" name="2" type="text" class="form-control" placeholder="1,000,000" data-ax5formatter="money" data-ax5="formatter">\n' +
			'    </div>\n' +
			'</div>');
	});

	it('Formatter Money' , function(){
		$('[data-ax5formatter]').ax5formatter();

		$('#ax5formatter-001').val().should.equal('9,999.99');
		// TODO 값을 set 하면 안될 듯... HJ.Park 2016-09-30
		//$('#ax5formatter-002').val(1.23).blur().should.equal('1');
		$('#ax5formatter-003').val(3000).blur().val().should.equal('3,000');
	});

	after(function(){
		$('div.form-group').remove();
	});
});

describe('formatter Date TEST', function() {
	before(function(){
		$('body').append(
			'<div class="form-group">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Date</span>\n' +
			'        <input id="ax5formatter-004" name="3" type="text" class="form-control" placeholder="yyyy-mm-dd" data-ax5formatter="date">\n' +
			'    </div>\n' +
			'</div>\n' +
			'<div class="form-group">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Date(time)</span>\n' +
			'        <input id="ax5formatter-005" name="3" type="text" class="form-control" placeholder="yyyy-mm-dd hh:mi:ss" data-ax5formatter="date(time)">\n' +
			'    </div>\n' +
			'</div>\n' +
			'<div class="form-group">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Time</span>\n' +
			'        <input id="ax5formatter-006" name="3" type="text" class="form-control" placeholder="hh:mi:ss" data-ax5formatter="time">\n' +
			'    </div>\n' +
			'</div>');
	});

	it('Formatter Date' , function(){
		$('[data-ax5formatter]').ax5formatter();

		$('#ax5formatter-004').val('20160903').blur().val().should.equal('2016-09-03');
		$('#ax5formatter-005').val('20160903101010').blur().val().should.equal('2016-09-03 10:10:10');
		$('#ax5formatter-006').val('101010').blur().val().should.equal('10:10:10');
	});

	after(function(){
		$('div.form-group').remove();
	});
});

describe('formatter Phone TEST', function() {
	before(function(){
		$('body').append(
			'<div class="form-group" id="ax5formatter-01">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Money</span>\n' +
			'        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="phone" value="01012345678">\n' +
			'    </div>\n' +
			'</div>\n' +
			'<div class="form-group">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Money</span>\n' +
			'        <input id="ax5formatter-002" name="2" type="text" class="form-control" placeholder="02-XXXX-XXXX" data-ax5formatter="phone" value="0212345678">\n' +
			'    </div>\n' +
			'</div>');
	});

	it('Formatter Phone' , function(){
		$('[data-ax5formatter]').ax5formatter();

		$('#ax5formatter-001').val().should.equal('010-1234-5678');
		$('#ax5formatter-002').val('0298765432').blur().val().should.equal('02-9876-5432');
	});

	after(function(){
		$('div.form-group').remove();
	});
});

describe('formatter Bizno TEST', function() {
	before(function(){
		$('body').append(
			'<div class="form-group" id="ax5formatter-01">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Money</span>\n' +
			'        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="bizno" value="1234567890">\n' +
			'    </div>\n' +
			'</div>\n' +
			'<div class="form-group">\n' +
			'    <div class="input-group">\n' +
			'        <span class="input-group-addon">Money</span>\n' +
			'        <input id="ax5formatter-002" name="2" type="text" class="form-control" placeholder="XXX-XX-XXXXX" data-ax5formatter="bizno" value="1234567890">\n' +
			'    </div>\n' +
			'</div>');
	});

	it('Formatter Bizno' , function(){
		$('[data-ax5formatter]').ax5formatter();

		$('#ax5formatter-001').val().should.equal('123-45-67890');
		$('#ax5formatter-002').val('0987654321').blur().val().should.equal('098-76-54321');
	});

	after(function(){
		$('div.form-group').remove();
	});
});