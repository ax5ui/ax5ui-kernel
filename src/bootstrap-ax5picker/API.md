# Basic Usage
> picker will be able to enter a value for the input element through the other UI.

## bind()
`bind(Options)`



```js
var picker = new ax5.ui.picker();

picker.bind({
    target: $("#input"),
    direction: "top",
    contentWidth: 200,
    content: function (callBack) {
        var html = ''
                + 'HTML CONTENT'
            ;
        callBack(html);
    }
);

picker.bind({
    id: "my-picker-01",
    target: $("#input"),
    direction: "top",
    contentWidth: 200,
    content: {
        width: 270,
        margin: 10,
        type: 'date',
        config: {
            // calendar UI config
        }
    },
    btns: {
        ok: {label: "확인", theme: "default"}
    }
);
```



### id

Type: `String` 

picker unique id

### target

Type: `Dom Element | jQuery Object`

".input-Group" elements that are the target of the picker

### direction

Type: `String` "top|left|right|bottom|auto"

### content

Type: `Function|Object`

### contentWidth

Type: `Number`

If the content type of the function, recommended to set this value.

### btns

Type: `Object`

- - -

## setContentValue()

- - -

## open()

- - -

## close()