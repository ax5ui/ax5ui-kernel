# Basic Usage
> dialog is a UI that can be used as an alternative means of window.alert, window.confirm and window.prompt

## setConfig
You define the default settings for the dialog. Create a ax5.ui.dialog instance, using the setConfig method in that instance, you can define a default value.
 
```js
var myDialog = new ax5.ui.dialog();
myDialog.set_config({
    title: '<i class="axi axi-ion-alert"></i> Default alert',
    onStateChanged: function(){
    
    }
});

$('#btn').click(function () {
    myDialog.alert({
        msg: 'Alert message'
    }, function () {
        console.log(this);
    });
});
```