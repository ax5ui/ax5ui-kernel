[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

## Insert the "ax5" in the HTML HEAD.
Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<html>
    <head>
        <script type="text/javascript" src="../../jquery/jquery.min.js"></script>
        <script type="text/javascript" src="../../ax5core/dist/ax5core.min.js"></script>
    </head>
<body>
....
</body>
</html>
```

Enjoy "AX5" utility library


## ax5.util.date
```js
ax5.util.date("20111111");
//Fri Nov 11 2011 23:59:00 GMT+0900 (KST)
ax5.util.date("20111111", {'return':'yyyy/mm/dd'});
//"2011/11/11"

//set multi option
ax5.util.date("20111111", {'return':'yyyy/mm/dd', add:{"d":1}} );
"2011/11/12"
```

"AX5" utility is very safe and useful.
'ax5.info', 'ax5.util', and consists of 'ax5.ui', are among the "ax5.ui" At the same time, perform the parenting
role and the root of the UI library.

If you have any questions, please refer to the following link:

* [gitHub](https://github.com/ax5ui/ax5ui-kernel)


> "ax5core" is a collection of utility functions that have been designed for use in ax5ui. 
It was designed to the utility to act as a minimum code. So it can be considered to be simple compared to other utilities.