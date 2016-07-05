# Type

## ax5.util.getType()
Return argument object type.
- argument : any type of variable.
- return : The type of argument(number, string, array, object, function, nodelist, fragment).

```js
ax5.util.getType(1); // "number"
ax5.util.getType("1"); // "string"
ax5.util.getType([0, 1, 2]); // "array"
ax5.util.getType({a: 1}); // "object"
ax5.util.getType(function () {}); // "function"
ax5.util.getType(document.querySelectorAll("div")); // "nodelist"
ax5.util.getType(document.createDocumentFragment()); // "fragment"
```
Javascript object type name is not clear. so util.getType() method is very useful.

---
## ax5.util.is*Type*()
Return Boolean value depending on the correspondence of 'does the argument is this type?'.
- argument : any type of variable.
- return : Boolean Value 1 || 0 (True || False)

```js
// return 1 || 0 (True || False)
ax5.util.isWindow(window);
ax5.util.isElement(document.getElementById("#ax5-util-is-type"));
ax5.util.isObject({});
ax5.util.isArray([]);
ax5.util.isFunction(new Function);
ax5.util.isString('');
ax5.util.isNumber(1);
ax5.util.isNodelist(document.querySelectorAll(".content"));
ax5.util.isUndefined();
ax5.util.isNothing();
ax5.util.isDate();

```

#### ax5.util.isDateFormat
`ax5.util.isDateFormat(String)`

```js
console.log(ax5.util.isDateFormat('20160101')); // true
console.log(ax5.util.isDateFormat('2016*01*01')); // true
console.log(ax5.util.isDateFormat('20161132')); // false
```

---


# Object
## ax5.util.filter
You can freely edit filter by anonymous function when use.
the second argument is original data.
it is filtered by your customized filter function.
if the result is True, saved to the first argument.

 > *Argument, Usage, Output*
 
#####//Example 01
Argument :
```js
var array = [5, 4, 3, 2, 1];
```
- aaray : original data.

Usage :
```js
var result = ax5.util.filter(array, function () {
    return this % 2;
});
```
- edit annoymous function. it will be a filter.


Output :
```js
console.log(result);
> [5, 3, 1]
```
- if the return value of filter function is false, the data is filtered. 

#####// Example 02
Argument :
```js
var list = [
    {isdel: 1, name: "ax5-1"},
    {name: "ax5-2"},
    {isdel: 1,name: "ax5-3"},
    {name: "ax5-4"},
    {name: "ax5-5"}
];
```

Usgae : 
```js
var result = ax5.util.filter(list, function () {
    return (this.isdel != 1);
});
```

Output :
```js
console.log(JSON.stringify(result));
> [object, object, object]
>> object0.name = ax5-2
>> object1.name = ax5-4
>> object2.name = ax5-5
```

#####//Example03
Argument :
```js
var filObject = {
a : 1, 
s : "string", 
oa : {pickup:true, name:"AXISJ"}, 
os : {pickup:true, name:"AX5"}
};
```

Usage :
```js
var result = ax5.util.filter( filObject, function(){
	return this.pickup;
});
```

Output : 
```js
console.log( ax5.util.toJson(result) );
> [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
```

---

## ax5.util.search
It returns the first item of the result of the function is True.
```js
var a = ["A", "X", "5"];
var idx = ax5.util.search(a, function () {
    return this == "X";
});
console.log(a[idx]);

idx = ax5.util.search(a, function () {
    return this == "B";
});
console.log(idx);
// -1

console.log(a[
    ax5.util.search(a, function (idx) {
        return idx == 2;
    })
    ]);
// 5

var b = {a: "AX5-0", x: "AX5-1", 5: "AX5-2"};
console.log(b[
    ax5.util.search(b, function (k, v) {
        return k == "x";
    })
    ]);
// AX5-1
```
---

## ax5.util.map
`"map"` creating a new array features set into an array or object. In the example I've created a simple object array as a numeric array.
```js
var a = [1, 2, 3, 4, 5];
a = ax5.util.map(a, function () {
    return {id: this};
});
console.log(ax5.util.toJson(a));

console.log(
    ax5.util.map({a: 1, b: 2}, function (k, v) {
        return {id: k, value: v};
    })
);
```
---

## ax5.util.merge
`"array like"` the type of object `"concat"`.
```js
var a = [1, 2, 3], b = [7, 8, 9];
console.log(ax5.util.merge(a, b));
```
---

## ax5.util.reduce
As a result of the process performed in the operation from the left to the right of the array it will be reflected to the left side item. It returns the final value of the item.
```js
var aarray = [5, 4, 3, 2, 1], result;
console.log(ax5.util.reduce(aarray, function (p, n) {
    return p * n;
}));
// 120

console.log(ax5.util.reduce({a: 1, b: 2}, function (p, n) {
    // If the "Object" is the first "p" value is "undefined".
    return parseInt(p | 0) + parseInt(n);
}));
// 3
```
---

## ax5.util.reduceRight
Same as "reduce" but with a different direction.
```js
var aarray = [5, 4, 3, 2, 1];
console.log(ax5.util.reduceRight(aarray, function (p, n) {
    return p - n;
}));
// -13
```
---

## ax5.util.sum
It returns the sum. The sum of all the values returned by the function.
```js
var arr = [
    {name: "122", value: 9},
    {name: "122", value: 10},
    {name: "123", value: 11}
];

var rs = ax5.util.sum(arr, function () {
    if(this.name == "122") {
        return this.value;
    }
});
console.log(rs); // 19

console.log(ax5.util.sum(arr, 10, function () {
    return this.value;
}));
// 40
```
---

## ax5.util.avg
It returns the average. The average of all the values returned by the function.
```js
var arr = [
    {name: "122", value: 9},
    {name: "122", value: 10},
    {name: "123", value: 11}
];

var rs = ax5.util.avg(arr, function () {
    return this.value;
});

console.log(rs); // 10
```
---


## ax5.util.first
It returns the first element in the Array, or Object. However, it is faster to use Array in the "Array [0]" rather than using the "first" method.
```js
var _arr = ["ax5", "axisj"];
var _obj = {k: "ax5", z: "axisj"};

console.log(ax5.util.first(_arr));
// ax5

console.log(ax5.util.toJson(ax5.util.first(_obj)));
// {"k": "ax5"}
```
---

## ax5.util.last
It returns the last element in the Array, or Object.
```js
var _arr = ["ax5", "axisj"];
var _obj = {k: "ax5", z: "axisj"};

console.log(ax5.util.last(_arr));
// axisj

console.log(ax5.util.toJson(ax5.util.last(_obj)));
// {"z": "axisj"}
```
---

# String

## ax5.util.left
Returns. Since the beginning of the string to the index, up to a certain character in a string from the beginning of the string.
```js
console.log(ax5.util.left("abcd.efd", 3));
// abc
console.log(ax5.util.left("abcd.efd", "."));
// abcd
```
---

## ax5.util.right
Returns. Up from the end of the string index, up to a certain character in a string from the end of the string
```js
console.log(ax5.util.right("abcd.efd", 3));
// efd
console.log(ax5.util.right("abcd.efd", "."));
// efd
```
---

## ax5.util.camelCase
It converts a string to "Camel Case". "a-b", "aB" will be the "aB".
```js
console.log(ax5.util.camelCase("inner-width"));
console.log(ax5.util.camelCase("innerWidth"));
// innerWidth
console.log(ax5.util.camelCase("camelCase"));
// camelCase
console.log(ax5.util.camelCase("aBc"));
// aBc
```
---

## ax5.util.snakeCase
It converts a string to "Snake Case". "aB" will be the "a-b".
```js
console.log(ax5.util.snakeCase("inner-width"));
// inner-width
console.log(ax5.util.snakeCase("camelCase"));
// camel-case
console.log(ax5.util.snakeCase("aBc"));
// a-bc
```
---

# Number

## ax5.util.number
When the number covers the development, often it requires multiple steps. The syntax is very complex and it is difficult to maintain. "ax5.util.number" command to convert a number that were resolved by passing a JSON format.
```js
console.log('round(1) : ' + ax5.util.number(123456789.678, {round: 1}));
// round(1) : 123456789.7

console.log('round(1) money() : '
    + ax5.util.number(123456789.678, {round: 1, money: true}));
// round(1) money() : 123,456,789.7

console.log('round(2) byte() : '
    + ax5.util.number(123456789.678, {round: 2, byte: true}));
// round(2) byte() : 117.7MB

console.log('abs() round(2) money() : '
    + ax5.util.number(-123456789.678, {abs: true, round: 2, money: true}));
// abs() round(2) money() : 123,456,789.68

console.log('abs() round(2) money() : '
    + ax5.util.number("A-1234~~56789.8~888PX", {abs: true, round: 2, money: true}));
// abs() round(2) money() : 123,456,789.89
```
- - -

# Date
## date
`ax5.util.date(date[, cond])`
```js
ax5.util.date('2013-01-01'); // Tue Jan 01 2013 23:59:00 GMT+0900 (KST)
ax5.util.date((new Date()), {add:{d:10}, return:'yyyy/MM/dd'}); // "2015/07/01"
ax5.util.date('1919-03-01', {add:{d:10}, return:'yyyy/MM/dd hh:mm:ss'}); // "1919/03/11 23:59:00"
```

## dday
`ax5.util.dday(date[, cond])`
```js
ax5.util.dday('2016-01-29'); // 1
ax5.util.dday('2016-01-29', {today:'2016-01-28'}); // 1
ax5.util.dday('1977-03-29', {today:'2016-01-28', age:true}); // 39
```

## weeksOfMonth
`ax5.util.weeksOfMonth(date)`
```js
ax5.util.weeksOfMonth("2015-10-01"); // {year: 2015, month: 10, count: 1}
ax5.util.weeksOfMonth("2015-09-19"); // {year: 2015, month: 9, count: 3}
```

## daysOfMonth
`ax5.util.daysOfMonth(year, month)`
```js
ax5.util.daysOfMonth(2015, 11); // 31
ax5.util.daysOfMonth(2015, 1); // 28
```

- - -

# Misc.
## ax5.util.param
The parameter values may in some cases be the "Object" or "String". At this time, useing the "param", it can be the same as verifying the parameter value.
```js
console.log(ax5.util.param({a: 1, b: '123\'"2&'}, "param"));
// a=1&b=123%27%222%26
console.log(ax5.util.param("a=1&b=12'\"32", "param"));
//a=1&b=12'"32
console.log(ax5.util.toJson(util.param("a=1&b=1232")));
// {"a": "1", "b": "1232"}
```
---

## ax5.util.parseJson
parsing a little more than the less sensitive the JSON syntax "JSON.parse".
```js
console.log(ax5.util.toJson(ax5.util.parseJson("[{'a':'99'},'2','3']")[0]));
// {"a": "99"}
console.log(ax5.util.parseJson("{a:1}").a);
// 1
console.log(ax5.util.toJson(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", false)));
// {"error": 500, "msg": "syntax error"}
console.log(ax5.util.toJson(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", true)));
// {"a": 1, "b": "{Function}"}
```
---

## ax5.util.toJson
```js
console.log(ax5.util.toJson(1));
// 1
console.log(ax5.util.toJson("A"));
// "A"
console.log(ax5.util.toJson([1, 2, 3, 'A']));
// [1,2,3,"A"]
console.log(ax5.util.toJson({a: 'a', x: 'x'}));
// {"a": "a", "x": "x"}
console.log(ax5.util.toJson([1, {a: 'a', x: 'x'}]));
// [1,{"a": "a", "x": "x"}]
console.log(ax5.util.toJson({a: 'a', x: 'x', list: [1, 2, 3]}));
// {"a": "a", "x": "x", "list": [1,2,3]}
console.log(ax5.util.toJson(function () {}));
// "{Function}"
```
---

## ax5.util.alert
```js
ax5.util.alert({a: 1, b: 2});
```
--- 
## ax5.util.toArray
"nodelist" or on the Array Like such "arguments", has properties such as "length", but you can not use functions defined in Array.prototype. With "toArray" because it is easy to convert an array.
```js
function something() {
    var arr = ax5.util.toArray(arguments);
    console.log(ax5.util.toJson(arr));
}
something("A", "X", "I", "S", "J");
```
---

## ax5.util.setCookie
```js
ax5.util.setCookie("ax5-cookie", "abcde");
ax5.util.setCookie("ax5-cookie-path", "abcde", 2, {path: "/"});
```
---

## ax5.util.getCookie
```js
console.log(ax5.util.getCookie("ax5-cookie"));
// abcde
console.log(ax5.util.getCookie("ax5-cookie-path"));
// abcde
```
---

## ax5.util.findParentNode
```js
/*
var cond = {
    tagname: {String} - tagName (ex. a, div, span..),
    clazz: {String} - name of Class
    [, attributes]
};
*/

console.log(
    ax5.util.findParentNode(e.target, {tagname:"a", clazz:"ax-menu-handel", "data-custom-attr":"attr_value"})
);

// using cond 
jQuery('#id').bind("click.app_expand", function(e){
    var target = ax5.dom.findParentNode(e.target, function(target){
        if($(target).hasClass("aside")){
            return true;
        }
        else{
            return true;
        }
    });
    //client-aside
    if(target.id !== "client-aside"){
        // some action
    }
}); 
```

## ax5.util.cssNumber
```js
console.log(ax5.util.cssNumber('100px'));
// 100px
console.log(ax5.util.cssNumber(100));
// 100px
console.log(ax5.util.cssNumber('100%'));
// 100%
console.log(ax5.util.cssNumber('##100@'));
// 100px
```

## ax5.util.css
```js
console.log(ax5.util.css({
    background: "#ccc",
    padding: "50px",
    width: "100px"
}));
// background:#ccc;padding:50px;width:100px;
console.log(ax5.util.css('width:100px;padding: 50px; background: #ccc'));
// {width: "100px", padding: "50px", background: "#ccc"}
```

## ax5.util.stopEvent
```js
ax5.util.stopEvent(e);
```

## ax5.util.selectRange
```html
<div id="select-test-0" contentEditable="true">SELECT TEST</div>
<div id="select-test-1" contentEditable="true">SELECT TEST</div>
<div id="select-test-2" contentEditable="true">SELECT TEST</div>

<script>
    $(document.body).ready(function () {
        ax5.util.selectRange($("#select-test-0"), "end"); // focus on end
        ax5.util.selectRange($("#select-test-1").get(0), [1, 5]); // select 1~5
        //ax5.util.selectRange($("#select-test-2"), "start"); // focus on start
        //ax5.util.selectRange($("#select-test-2")); // selectAll
        //ax5.util.selectRange($("#select-test-2"), "selectAll"); // selectAll
    });
</script>
```

## ax5.util.debounce
`ax5.util.debounce(func, wait[, immediately])`
```js
var debounceFn = ax5.util.debounce(function( val ) {
    console.log(val);
}, 300);

$(document.body).click(function(){
    debounceFn(new Date());
});
```
// return is Object.
ax5.util.isObject({});

// return is Array.
ax5.util.isArray([]);

// return is Functon.
ax5.util.isFunction(new Function);

// return is String.
ax5.util.isString('');

// return is Number.
ax5.util.isNumber(1);

// return is nodeList.
ax5.util.isNodelist(document.querySelectorAll(".content"));

// return is undefined.
ax5.util.isUndefined();

// return is undefined|''|null.
ax5.util.isNothing();

// return is Date
ax5.util.isDate();

```

## ax5.util.isDateFormat
`ax5.util.isDateFormat(String)`

```js
console.log(ax5.util.isDateFormat('20160101')); // true
console.log(ax5.util.isDateFormat('2016*01*01')); // true
console.log(ax5.util.isDateFormat('20161132')); // false
```

---


# Object
## ax5.util.filter
The first item is delivered to the second argument of the filter function. The second argument is an anonymous function, the result is True, the items will be collected.
```js
var result, aarray = [5, 4, 3, 2, 1];

result = ax5.util.filter(aarray, function () {
    return this % 2;
});
console.log(result);

var list = [
    {isdel: 1, name: "ax5-1"}, {name: "ax5-2"}, {
        isdel: 1,
        name: "ax5-3"
    }, {name: "ax5-4"}, {name: "ax5-5"}
];
result = ax5.util.filter(list, function () {
    return (this.isdel != 1);
});
console.log(JSON.stringify(result));

var filObject = {a:1, s:"string", oa:{pickup:true, name:"AXISJ"}, os:{pickup:true, name:"AX5"}};
result = ax5.util.filter( filObject, function(){
	return this.pickup;
});
console.log( ax5.util.toJson(result) );
// [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
```

---

## ax5.util.search
It returns the first item of the result of the function is True.
```js
var a = ["A", "X", "5"];
var idx = ax5.util.search(a, function () {
    return this == "X";
});
console.log(a[idx]);

idx = ax5.util.search(a, function () {
    return this == "B";
});
console.log(idx);
// -1

console.log(a[
    ax5.util.search(a, function (idx) {
        return idx == 2;
    })
    ]);
// 5

var b = {a: "AX5-0", x: "AX5-1", 5: "AX5-2"};
console.log(b[
    ax5.util.search(b, function (k, v) {
        return k == "x";
    })
    ]);
// AX5-1
```
---

## ax5.util.map
`"map"` creating a new array features set into an array or object. In the example I've created a simple object array as a numeric array.
```js
var a = [1, 2, 3, 4, 5];
a = ax5.util.map(a, function () {
    return {id: this};
});
console.log(ax5.util.toJson(a));

console.log(
    ax5.util.map({a: 1, b: 2}, function (k, v) {
        return {id: k, value: v};
    })
);
```
---

## ax5.util.merge
`"array like"` the type of object `"concat"`.
```js
var a = [1, 2, 3], b = [7, 8, 9];
console.log(ax5.util.merge(a, b));
```
---

## ax5.util.reduce
As a result of the process performed in the operation from the left to the right of the array it will be reflected to the left side item. It returns the final value of the item.
```js
var aarray = [5, 4, 3, 2, 1], result;
console.log(ax5.util.reduce(aarray, function (p, n) {
    return p * n;
}));
// 120

console.log(ax5.util.reduce({a: 1, b: 2}, function (p, n) {
    // If the "Object" is the first "p" value is "undefined".
    return parseInt(p | 0) + parseInt(n);
}));
// 3
```
---

## ax5.util.reduceRight
Same as "reduce" but with a different direction.
```js
var aarray = [5, 4, 3, 2, 1];
console.log(ax5.util.reduceRight(aarray, function (p, n) {
    return p - n;
}));
// -13
```
---

## ax5.util.sum
It returns the sum. The sum of all the values returned by the function.
```js
var arr = [
    {name: "122", value: 9},
    {name: "122", value: 10},
    {name: "123", value: 11}
];

var rs = ax5.util.sum(arr, function () {
    if(this.name == "122") {
        return this.value;
    }
});
console.log(rs); // 19

console.log(ax5.util.sum(arr, 10, function () {
    return this.value;
}));
// 40
```
---

## ax5.util.avg
It returns the average. The average of all the values returned by the function.
```js
var arr = [
    {name: "122", value: 9},
    {name: "122", value: 10},
    {name: "123", value: 11}
];

var rs = ax5.util.avg(arr, function () {
    return this.value;
});

console.log(rs); // 10
```
---


## ax5.util.first
It returns the first element in the Array, or Object. However, it is faster to use Array in the "Array [0]" rather than using the "first" method.
```js
var _arr = ["ax5", "axisj"];
var _obj = {k: "ax5", z: "axisj"};

console.log(ax5.util.first(_arr));
// ax5

console.log(ax5.util.toJson(ax5.util.first(_obj)));
// {"k": "ax5"}
```
---

## ax5.util.last
It returns the last element in the Array, or Object.
```js
var _arr = ["ax5", "axisj"];
var _obj = {k: "ax5", z: "axisj"};

console.log(ax5.util.last(_arr));
// axisj

console.log(ax5.util.toJson(ax5.util.last(_obj)));
// {"z": "axisj"}
```
---

# String

## ax5.util.left
Returns. Since the beginning of the string to the index, up to a certain character in a string from the beginning of the string.
```js
console.log(ax5.util.left("abcd.efd", 3));
// abc
console.log(ax5.util.left("abcd.efd", "."));
// abcd
```
---

## ax5.util.right
Returns. Up from the end of the string index, up to a certain character in a string from the end of the string
```js
console.log(ax5.util.right("abcd.efd", 3));
// efd
console.log(ax5.util.right("abcd.efd", "."));
// efd
```
---

## ax5.util.camelCase
It converts a string to "Camel Case". "a-b", "aB" will be the "aB".
```js
console.log(ax5.util.camelCase("inner-width"));
console.log(ax5.util.camelCase("innerWidth"));
// innerWidth
console.log(ax5.util.camelCase("camelCase"));
// camelCase
console.log(ax5.util.camelCase("aBc"));
// aBc
```
---

## ax5.util.snakeCase
It converts a string to "Snake Case". "aB" will be the "a-b".
```js
console.log(ax5.util.snakeCase("inner-width"));
// inner-width
console.log(ax5.util.snakeCase("camelCase"));
// camel-case
console.log(ax5.util.snakeCase("aBc"));
// a-bc
```
---

# Number

## ax5.util.number
When the number covers the development, often it requires multiple steps. The syntax is very complex and it is difficult to maintain. "ax5.util.number" command to convert a number that were resolved by passing a JSON format.
```js
console.log('round(1) : ' + ax5.util.number(123456789.678, {round: 1}));
// round(1) : 123456789.7

console.log('round(1) money() : '
    + ax5.util.number(123456789.678, {round: 1, money: true}));
// round(1) money() : 123,456,789.7

console.log('round(2) byte() : '
    + ax5.util.number(123456789.678, {round: 2, byte: true}));
// round(2) byte() : 117.7MB

console.log('abs() round(2) money() : '
    + ax5.util.number(-123456789.678, {abs: true, round: 2, money: true}));
// abs() round(2) money() : 123,456,789.68

console.log('abs() round(2) money() : '
    + ax5.util.number("A-1234~~56789.8~888PX", {abs: true, round: 2, money: true}));
// abs() round(2) money() : 123,456,789.89
```
- - -

# Date
## date
`ax5.util.date(date[, cond])`
```js
ax5.util.date('2013-01-01'); // Tue Jan 01 2013 23:59:00 GMT+0900 (KST)
ax5.util.date((new Date()), {add:{d:10}, return:'yyyy/MM/dd'}); // "2015/07/01"
ax5.util.date('1919-03-01', {add:{d:10}, return:'yyyy/MM/dd hh:mm:ss'}); // "1919/03/11 23:59:00"
```

## dday
`ax5.util.dday(date[, cond])`
```js
ax5.util.dday('2016-01-29'); // 1
ax5.util.dday('2016-01-29', {today:'2016-01-28'}); // 1
ax5.util.dday('1977-03-29', {today:'2016-01-28', age:true}); // 39
```

## weeksOfMonth
`ax5.util.weeksOfMonth(date)`
```js
ax5.util.weeksOfMonth("2015-10-01"); // {year: 2015, month: 10, count: 1}
ax5.util.weeksOfMonth("2015-09-19"); // {year: 2015, month: 9, count: 3}
```

## daysOfMonth
`ax5.util.daysOfMonth(year, month)`
```js
ax5.util.daysOfMonth(2015, 11); // 31
ax5.util.daysOfMonth(2015, 1); // 28
```

- - -

# Misc.
## ax5.util.param
The parameter values may in some cases be the "Object" or "String". At this time, useing the "param", it can be the same as verifying the parameter value.
```js
console.log(ax5.util.param({a: 1, b: '123\'"2&'}, "param"));
// a=1&b=123%27%222%26
console.log(ax5.util.param("a=1&b=12'\"32", "param"));
//a=1&b=12'"32
console.log(ax5.util.toJson(util.param("a=1&b=1232")));
// {"a": "1", "b": "1232"}
```
---

## ax5.util.parseJson
parsing a little more than the less sensitive the JSON syntax "JSON.parse".
```js
console.log(ax5.util.toJson(ax5.util.parseJson("[{'a':'99'},'2','3']")[0]));
// {"a": "99"}
console.log(ax5.util.parseJson("{a:1}").a);
// 1
console.log(ax5.util.toJson(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", false)));
// {"error": 500, "msg": "syntax error"}
console.log(ax5.util.toJson(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", true)));
// {"a": 1, "b": "{Function}"}
```
---

## ax5.util.toJson
```js
console.log(ax5.util.toJson(1));
// 1
console.log(ax5.util.toJson("A"));
// "A"
console.log(ax5.util.toJson([1, 2, 3, 'A']));
// [1,2,3,"A"]
console.log(ax5.util.toJson({a: 'a', x: 'x'}));
// {"a": "a", "x": "x"}
console.log(ax5.util.toJson([1, {a: 'a', x: 'x'}]));
// [1,{"a": "a", "x": "x"}]
console.log(ax5.util.toJson({a: 'a', x: 'x', list: [1, 2, 3]}));
// {"a": "a", "x": "x", "list": [1,2,3]}
console.log(ax5.util.toJson(function () {}));
// "{Function}"
```
---

## ax5.util.alert
```js
ax5.util.alert({a: 1, b: 2});
```
--- 
## ax5.util.toArray
"nodelist" or on the Array Like such "arguments", has properties such as "length", but you can not use functions defined in Array.prototype. With "toArray" because it is easy to convert an array.
```js
function something() {
    var arr = ax5.util.toArray(arguments);
    console.log(ax5.util.toJson(arr));
}
something("A", "X", "I", "S", "J");
```
---

## ax5.util.setCookie
```js
ax5.util.setCookie("ax5-cookie", "abcde");
ax5.util.setCookie("ax5-cookie-path", "abcde", 2, {path: "/"});
```
---

## ax5.util.getCookie
```js
console.log(ax5.util.getCookie("ax5-cookie"));
// abcde
console.log(ax5.util.getCookie("ax5-cookie-path"));
// abcde
```
---

## ax5.util.findParentNode
```js
/*
var cond = {
    tagname: {String} - tagName (ex. a, div, span..),
    clazz: {String} - name of Class
    [, attributes]
};
*/

console.log(
    ax5.util.findParentNode(e.target, {tagname:"a", clazz:"ax-menu-handel", "data-custom-attr":"attr_value"})
);

// using cond 
jQuery('#id').bind("click.app_expand", function(e){
    var target = ax5.dom.findParentNode(e.target, function(target){
        if($(target).hasClass("aside")){
            return true;
        }
        else{
            return true;
        }
    });
    //client-aside
    if(target.id !== "client-aside"){
        // some action
    }
}); 
```

## ax5.util.cssNumber
```js
console.log(ax5.util.cssNumber('100px'));
// 100px
console.log(ax5.util.cssNumber(100));
// 100px
console.log(ax5.util.cssNumber('100%'));
// 100%
console.log(ax5.util.cssNumber('##100@'));
// 100px
```

## ax5.util.css
```js
console.log(ax5.util.css({
    background: "#ccc",
    padding: "50px",
    width: "100px"
}));
// background:#ccc;padding:50px;width:100px;
console.log(ax5.util.css('width:100px;padding: 50px; background: #ccc'));
// {width: "100px", padding: "50px", background: "#ccc"}
```

## ax5.util.stopEvent
```js
ax5.util.stopEvent(e);
```

## ax5.util.selectRange
```html
<div id="select-test-0" contentEditable="true">SELECT TEST</div>
<div id="select-test-1" contentEditable="true">SELECT TEST</div>
<div id="select-test-2" contentEditable="true">SELECT TEST</div>

<script>
    $(document.body).ready(function () {
        ax5.util.selectRange($("#select-test-0"), "end"); // focus on end
        ax5.util.selectRange($("#select-test-1").get(0), [1, 5]); // select 1~5
        //ax5.util.selectRange($("#select-test-2"), "start"); // focus on start
        //ax5.util.selectRange($("#select-test-2")); // selectAll
        //ax5.util.selectRange($("#select-test-2"), "selectAll"); // selectAll
    });
</script>
```

## ax5.util.debounce
`ax5.util.debounce(func, wait[, immediately])`
```js
var debounceFn = ax5.util.debounce(function( val ) {
    console.log(val);
}, 300);

$(document.body).click(function(){
    debounceFn(new Date());
});
```