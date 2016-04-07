[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5core
"AX5" utility is very safe and useful.
'ax5.info', 'ax5.util', and consists of 'ax5.ui', are among the "ax5.ui" At the same time, perform the parenting
role and the root of the UI library.

"ax5core" is a collection of utility functions that have been designed for use in ax5ui. 
It was designed to the utility to act as a minimum code. So it can be considered to be simple compared to other utilities.

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_

### Install by bower
```sh
bower install ax5core
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
using the `bower`, when you install the plug-in is installed to resolve the plug-in dependencies under the `bower_components` folder.  
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using the `bower`. 
If you've never used a bower is, you will be able to be used for [http://bower.io/#install-bower](http://bower.io/#install-bower).
   
### Insert the "ax5" in the HTML HEAD.
Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<html>
    <head>
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/ax5core/dist/ax5core.min.js"></script>
    </head>
<body>
....
</body>
</html>
```
***

### Use CDN
```html
https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.js
https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js
```
***

### Install by npm

If you do not use the bower, it can be downloaded by using the npm as second best.
In npm, so pile on the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
```
***
After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.
***


### Basic Usage
```js
ax5.util.date("20111111");
//Fri Nov 11 2011 23:59:00 GMT+0900 (KST)
ax5.util.date("20111111", {'return':'yyyy/mm/dd'});
//"2011/11/11"

//set multi option
ax5.util.date("20111111", {'return':'yyyy/mm/dd', add:{"d":1}} );
"2011/11/12"
```

### API
- [See API](http://ax5.io/ax5core/info/ax5-info.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)