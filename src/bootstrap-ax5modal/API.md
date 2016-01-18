# Basic Usage
> Modal UI, hold does not exceed the current page, you can use in order to process a simple user input and information. In some cases, by the other page so as to output in the modal, it can also handle the task of more diverse forms.

## setConfig()
`setConfig([options])`
You define the default settings for the modal. Create a ax5.ui.modal instance, using the setConfig method in that instance, you can define a default value.
 
```js
var myModal = new ax5.ui.modal();
myModal.set_config({
    width: "Number",
    height: "Number",
    position: {
        left: "left|center|right|Number", 
        top: "top|middle|bottom|Number", 
        margin: "Number"
    },
    iframe: {
        method: "get|post", 
        url: "String", 
        param: "paramString|Object"
    },
    closeToEsc: "Boolean",
    onStateChanged: "Function",
    animateTime: "Number",
    zIndex: "Number"
});
```

### width

Type: `Number` [default: 300]

Modal width

### height

Type: `Number` [default: 400]

Modal height

### onStateChanged

Type: `Function`  

onStateChanged function is executed when the modal of the state is changed,
this.state state value is passed to this time onStateChanged function.

### animateTime

Type: `Number` [default : 300]


- - -

## push()
`push(String|Options[, callBack])`

If this is String in the first argument and recognizes the first argument to `msg`.  
it is possible to redefine all of the options that can be used in setConfig.  

```js
toast.push('Toast message', function () {
    console.log(this);
});

toast.push({
    theme: 'danger',
    msg:'Toast message'
}, function () {
    console.log(this);
});
```

- - -

## confirm()
`confirm(String|Options[, callBack])`

```js
confirmToast.confirm({
    msg: 'Confirm message'
}, function(){

});
```

## close()
`close()`