describe('ax5.ui.toast TEST', function() {
	it('toast.push("message", callback)' , function(done){
        var message = 'Toast message';
        var toast = new ax5.ui.toast({
            containerPosition: 'top-right',
            displayTime: 0,
            animateTime: 0,
            onStateChanged: function(){
                var $toastEl = $('#' + this.toastId);
                if (this.state == 'open') {
                    $toastEl.find('.ax-toast-body').text().should.equal(message);
                } else if (this.state == 'close') {
                    should($toastEl.get(0)).undefined();
                    done();
                }
            }
        });

        toast.push(message, function () {
            should(this.toastId).String();
        });
	});

    it('toast.confirm("message", callback)' , function(done){
        var message = 'Toast message';
        var toast = new ax5.ui.toast({
            containerPosition: 'top-right',
            displayTime: 0,
            animateTime: 0,
            onStateChanged: function(){
                var $toastEl = $('#' + this.toastId);
                if (this.state == 'open') {
                    $toastEl.find('.ax-toast-body').text().should.equal(message);
                } else if (this.state == 'close') {
                    should($toastEl.get(0)).undefined();
                    done();
                }
            }
        });

        toast.confirm(message, function () {
            should(this.toastId).String();
        });

        setTimeout(function(){
            $('[data-ax-toast-btn="ok"]').click();
        }, 20);
	});
});
