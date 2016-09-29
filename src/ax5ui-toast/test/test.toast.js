describe('ax5.ui.toast TEST', function() {
	it('toast.push("message", callback)' , function(){
        var message = 'Toast message';
        var toast = new ax5.ui.toast({
            containerPosition: 'top-right',
            displayTime: 0,
            animateTime: 0,
            onStateChanged: function(){
                console.log('toast.push()#' + this.state);
                var $toastEl = $('#' + this.toastId);
                if (this.state == 'open') {
                    $toastEl.find('.ax-toast-body').text().should.equal(message);
                } else if (this.state == 'close') {
                    should($toastEl.get(0)).undefined();
                }
            }
        });

        toast.push(message, function () {
            console.log('toast.push()#callback');
            should(this.toastId).String();
        });
	});

    it('toast.confirm("message", callback)' , function(){
        var message = 'Toast message';
        var toast = new ax5.ui.toast({
            containerPosition: 'top-right',
            displayTime: 0,
            animateTime: 0,
            onStateChanged: function(){
                console.log('toast.confirm()#' + this.state, this);
                var $toastEl = $('#' + this.toastId);
                if (this.state == 'open') {
                    $toastEl.find('.ax-toast-body').text().should.equal(message);
                } else if (this.state == 'close') {
                    should($toastEl.get(0)).undefined();
                }
            }
        });

        toast.confirm(message, function () {
            console.log('toast.confirm()#callback');
            should(this.toastId).String();
        });

        setTimeout(function(){
            $('[data-ax-toast-btn="ok"]').click();
        }, 100);
	});
});
