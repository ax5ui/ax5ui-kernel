describe('ax5.ui.dialog TEST', function() {
  var dialog = new ax5.ui.dialog();
  var theme = "test";

describe('dialog.setConfig TEST', function() {

  dialog.setConfig({
      zIndex: 5000,
      onStateChanged: function () {
          if (this.state === "open") {
              it('dialog.setConfig.onStateChaned.state === open', function() {

              });
          }
          else if (this.state === "close") {
            it('dialog.setConfig.onStateChaned.state === close', function() {
            });
          }
      }
  });
});

describe('dialog.alert TEST', function() {

dialog.alert({
    theme: theme,
    title: 'Alert ' + theme,
    msg: theme + ' color'
}, function () {
  it('dialog.alert works', function() {

  });
});
dialog.close();

});

    var types = [
      {
          name: 'title',
          args: [ 'title' ],
          value: 'string'
      },
      {
          name: 'theme',
          args: [ 'theme' ],
          value: 'string'
      },
      {
          name: 'width',
          args: [ 300 ],
          value: 'number'
      },
      {
          name: 'onStateChanged',
          args: [ function(){name:'onStateChanged'} ],
          value: 'function'
      },
      {
          name: 'btns',
          args: [
                  {
                    ok: {
                      label: "ok",
                      theme: "default"
                    }
                  }
                ],
          value: '{}'
      },
      {
          name: 'input',
          args: [
                  {
                    value: {
                      label: ""
                    }
                  }
                ],
          value: '{}'
      }
    ];
  });
