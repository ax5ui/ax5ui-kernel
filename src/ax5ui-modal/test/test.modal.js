/* 
 test.modal.js
 TODO event test
 */

/* ax5.modal.setConfig */
describe('ax5.ui.modal.setConfig TEST', function () {
    var myModal;

    before(function () {
        myModal = new ax5.ui.modal();

        myModal.setConfig({
            width: 100,
            height: 200,
            position: {
                left: 'left',
                top: "top",
                margin: "10"
            },
            iframeLoadingMsg: "loading",
            iframe: {
                method: "get",
                url: "",
                param: {}
            },
            closeToEsc: true,
            onStateChanged: function () {
                console.log('success');
            },
            animateTime: 100,
            zIndex: 100,
            fullScreen: false,
            header: {
                title: "modal test",
                btns: {
                    close: {
                        label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function () {
                            myModal.close();
                        }
                    }
                }
            }
        });
    });

    it('modal setConfig width test', function () {
        should.equal(myModal.config.width, 100);
    });

    it('modal setConfig height  test', function () {
        should.equal(myModal.config.height, 200);
    });

    it('modal setConfig position test', function () {
        should.equal(typeof myModal.config.position, "object");
        should.equal(myModal.config.position.left, 'left');
        should.equal(myModal.config.position.top, 'top');
        should.equal(myModal.config.position.margin, 10);
    });

    it('modal setConfig iFrame test', function () {
        should.equal(myModal.config.iframeLoadingMsg, 'loading');
        should.equal(typeof myModal.config.iframe, 'object');
        should.equal(myModal.config.iframe.method, 'get');
        should.equal(myModal.config.iframe.url, '');
        should.equal(typeof myModal.config.iframe.param, 'object');
    });

    it('modal setConfig closeToEsc test', function () {
        should.equal(myModal.config.closeToEsc, true);
    });

    it('modal setConfig onStateChanged test', function () {
        should.equal(typeof myModal.config.onStateChanged, 'function');
    });

    it('modal setConfig animateTime test', function () {
        should.equal(myModal.config.animateTime, 100);
    });

    it('modal setConfig zIndex test', function () {
        should.equal(myModal.config.zIndex, 100);
    });

    it('modal setConfig fullScreen test', function () {
        should.equal(myModal.config.fullScreen, false);
    });

    it('modal setConfig header test', function () {
        should.equal(typeof myModal.config.header, 'object');
        should.equal(myModal.config.header.title, 'modal test');
    });
});
/* end ax5.ui.setConfig */

/* ax5.modal.method... */
describe('ax5.ui.modal method TEST', function () {
    var that;
    var myModal = new ax5.ui.modal({
        onStateChanged: function () {
            that = this;
        }
    });

    it('modal open test', function (done) {
        myModal.open();
        done(ae.equalAll("open", that.state));
    });

    it('modal close test', function (done) {
        myModal.close();
        setTimeout(function () {
            done(ae.equalAll("close", that.state));
        }, myModal.config.animateTime);
    });

    it('modal minimize test', function (done) {
        myModal.minimize();
        done(ae.equalAll("minimize", that.state));
    });

    it('modal already minimize test', function (done) {
        that = "";
        myModal.minimize();
        done(ae.equalAll("", that));
    });

    it('modal maximize test', function (done) {
        myModal.maximize();
        done(ae.equalAll("restore", that.state));
    });

    it('modal already maximize test', function (done) {
        that = "";
        myModal.maximize();
        done(ae.equalAll("", that));
    });
});
/* end ax5.modal.method... */
