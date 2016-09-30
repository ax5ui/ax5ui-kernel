describe('ax5.ui.toast TEST', function() {
<<<<<<< HEAD
	it('toast.push("message", callback)' , function(done){
=======
	it('toast.push("message", callback)' , function(){
>>>>>>> ax5ui/master
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
<<<<<<< HEAD
                    done();
=======
>>>>>>> ax5ui/master
                }
            }
        });

        toast.push(message, function () {
            console.log('toast.push()#callback');
            should(this.toastId).String();
        });
	});

<<<<<<< HEAD
    it('toast.confirm("message", callback)' , function(done){
=======
    it('toast.confirm("message", callback)' , function(){
>>>>>>> ax5ui/master
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
<<<<<<< HEAD
                    done();
=======
>>>>>>> ax5ui/master
                }
            }
        });

        toast.confirm(message, function () {
            console.log('toast.confirm()#callback');
            should(this.toastId).String();
        });

        setTimeout(function(){
            $('[data-ax-toast-btn="ok"]').click();
<<<<<<< HEAD
        }, 20);
=======
        }, 100);
>>>>>>> ax5ui/master
	});
});
