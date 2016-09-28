/* 
	test.mask.js
	TODO event test 
*/

/* ax5.mask.setConfig */
describe('ax5.mask.setConfig TEST', function(){
	it('using setConfig', function() {
    	var mask = new ax5.ui.mask();
			mask.setConfig({
			    zIndex: 1000, 
			    content: 'Loading content',
			    onStateChanged: function(){
			        console.log(this);
			    },
			    onClick: function(){
			        console.log(this);
			    }
		});

		should.deepEqual(JSON.stringify(mask.config.zIndex) , '1000');
		should.deepEqual(mask.config.content , 'Loading content');
    });

    it('without using setConfig' , function(){
    	var mask = new ax5.ui.mask({
		    zIndex: 1000, 
		    content: 'Loading content',
		    onStateChanged: function(){
		       console.log(this);
		    },
		    onClick: function(){
		        console.log(this);
		    }
		});

		should.deepEqual(JSON.stringify(mask.config.zIndex) , '1000');
		should.deepEqual(mask.config.content , 'Loading content');
    });
});

/* ax5.mask.open */
describe('ax5.mask.open TEST' , function(){
});