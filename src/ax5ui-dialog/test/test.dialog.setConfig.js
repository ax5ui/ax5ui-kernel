var theme = "test";
describe('ax5.ui.dialog TEST', function() {
});
  describe('dialog.setConfig TEST', function() {
    var dialog = new ax5.ui.dialog().setConfig({
        zIndex: 5000,
        onStateChanged: function (callback) {
            if(callback) return"onStateChanged";
        }
    });
    it('dialog.setConfig().setConfig({zIndex:5000})', function() {
        should.deepEqual(dialog.config.zIndex, 5000);
    });
    it('dialog.setConfig().setConfig(onStateChanged(){})', function() {
        should.deepEqual(dialog.config.onStateChanged(this), "onStateChanged");
    });
  });

var promise = alertTest();
function alertTest() {
  var deferred = $.Deferred();
  describe('dialog.alert TEST', function() {
  var dialog = new ax5.ui.dialog().alert({
      theme: theme,
      title: 'Alert ' + theme,
      msg: theme + ' msg'
  }, function () {
    it('dialog alert close', function(){
      deferred.resolve();
    });
  });

  var alertProps = [
    {
      item : 'Title',
      target: '.ax-dialog-header',
      value: 'Alert test'
    },
    {
      item: 'Msg',
      target: '.ax-dialog-msg',
      value: 'test msg'
    },
    {
      item: 'Button',
      target: 'button',
      value: 'ok'
    }
  ];
  alertProps.forEach(function(prop) {
    it('dialog alert'+prop.item, function() {
      prop.value.should.deepEqual($(prop.target).first().text().trim());
      deferred.resolve();
    });
  });
  $('.btn-test').trigger('click');
  });
  return deferred;
};
promise.then(confirmTest("delete"), confirmTest("cancel"));
  function confirmTest(buttonLabel) {
    var deferred = $.Deferred();
    describe('dialog.confirm', function() {
      var dialog = new ax5.ui.dialog().confirm({
          theme: theme,
          title: 'Confirm ' + theme,
          msg: theme + ' color',
          btns: {
              del: {
                  label: 'Delete', theme: 'warning', onClick: function (key) {
                    it('dialog confirm delete', function(){
                      deferred.resolve();
                    });
                      dialog.close();
                  }
              },
              cancel: {
                  label: 'Cancel', theme: 'danger', onClick: function (key) {
                      it('dialog confirm cancel', function(){
                        deferred.resolve();
                      });
                      dialog.close();
                  }
              },
              other: {
                  label: 'Other', onClick: function (key) {
                      console.log(key, this);
                  }
              }
          }
      }, function () {
        // TODO : need to test for callback
      });
      var confirmProps = [
        {
          item : 'Title',
          target: '.ax-dialog-header',
          value: 'Confirm test'
        },
        {
          item: 'Msg',
          target: '.ax-dialog-msg',
          value: 'test color'
        },
        {
          item: 'DeleteButton',
          target: 'button[data-dialog-btn="del"]',
          value: 'Delete'
        },
        {
          item: 'CancelButton',
          target: 'button[data-dialog-btn="cancel"]',
          value: 'Cancel'
        },
        {
          item: 'OtherButton',
          target: 'button[data-dialog-btn="other"]',
          value: 'Other'
        }
      ];
      confirmProps.forEach(function(prop) {
        it('dialog confirm'+prop.item, function() {
          prop.value.should.deepEqual($(prop.target).last().text().trim());
          deferred.resolve();
        });
      });
      if (buttonLabel == "delete") {
        $('button[data-dialog-btn="delete"]').trigger('click');
      } else {
        $('button[data-dialog-btn="cancel"]').trigger('click');
      }
    });
    return deferred;
  };
