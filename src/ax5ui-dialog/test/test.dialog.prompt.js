var theme = "test";
describe('ax5.ui.dialog TEST', function() {
});
    describe('dialog.confirm', function() {
    var data1 = "test1";
    var data2 = "test2";
    var dialog = new ax5.ui.dialog().prompt({
        theme: theme,
        title: 'Prompt ' + theme,
        msg: theme + ' color',
        input: {
            data1: {label: "data1의 라벨"},
            data2: {label: "data2의 라벨"}
        }
    }, function () {
      var inputValue1 = this.data1;
      var inputValue2 = this.data2;

      it('dialog prompt first input value', function() {
          inputValue1.should.deepEqual('test1');
      });
      it('dialog prompt last input value', function() {
          inputValue2.should.deepEqual('test2');
      });
    });
    var promptProps = [
      {
        item : 'Title',
        target: '.ax-dialog-header',
        value: 'Prompt test'
      },
      {
        item: 'Msg',
        target: '.ax-dialog-msg',
        value: 'test color'
      },
      {
        item: 'Input[data1]',
        target: 'input[data-dialog-prompt="data1"]',
        value: ''
      },
      {
        item: 'input[data2]',
        target: 'input[data-dialog-prompt="data2"]',
        value: ''
      }
    ];
    promptProps.forEach(function(prop) {
      it('dialog prompt'+prop.item, function() {
        prop.value.should.deepEqual($(prop.target).text().trim());
      });
    });
    if (data1 != "" && data2 != "") {
      $('input[data-dialog-prompt="data1"]').val(data1);
      $('input[data-dialog-prompt="data2"]').val(data2);
      $('button[data-dialog-btn="ok"]').trigger('click');
    } else {
      //TODO : dialog close하는 타이밍을 잡기 어려움.. 테스트해야함.
      $('button[data-dialog-btn="cancel"]').trigger('click');
    }
  });
