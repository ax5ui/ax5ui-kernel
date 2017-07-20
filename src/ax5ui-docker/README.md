[![Build Status](https://travis-ci.org/ax5ui/ax5ui-docker.svg?branch=master)](https://travis-ci.org/ax5ui/ax5ui-docker)
[![npm version](https://badge.fury.io/js/ax5ui-docker.svg)](https://badge.fury.io/js/ax5ui-docker)
[![](https://img.shields.io/npm/dm/ax5ui-docker.svg)](https://www.npmjs.com/package/ax5ui-docker)

# ax5ui-docker
"docker" dock panel UI

![ax5docker](src/ax5docker.gif)

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[ax5ui-menu](http://ax5.io/ax5ui-menu)_

### Install with bower
```sh
bower install ax5ui-docker
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
When you install `bower`, it will be installed under the `bower_components` folder to resolve the plug-in dependencies.  
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using `bower`. 
If you've never used bower, please refer to [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Install with npm
If you do not use bower, it also can be installed by using npm as an alternative.
In case of npm, which is the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
npm install ax5ui-menu
npm install ax5ui-docker
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-docker Github releases](https://github.com/ax5ui/ax5ui-docker/releases)


### Insert "ax5docker" in HTML HEAD.

Folder location can be any for your project. However, please be sure to assign the right path in the project.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-docker/master/dist/ax5docker.css" />
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-menu/master/dist/ax5menu.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5menu/master/dist/ax5menu.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-docker/master/dist/ax5docker.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5ui-docker. ax5ui offers the CDN services through rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-docker/master/dist/ax5docker.css
https://cdn.rawgit.com/ax5ui/ax5ui-docker/master/dist/ax5docker.min.js
```

### Basic Usage
```html
<div data-ax5docker="docker1" style="height: 500px;background: #eee;padding: 5px;"></div>
```

```js
$(function () {
    var myDocker = new ax5.ui.docker();
    
    myDocker.setConfig({
        target: $('[data-ax5docker="docker1"]'),
        icons: {
            close: '<i class="fa fa-times" aria-hidden="true"></i>',
            more: '<i class="fa fa-chevron-circle-down" aria-hidden="true"></i>'
        },
        panels: [
            {
                type: "row", // type : row, column, stack
                panels: [
                    {
                        type: "column",
                        panels: [
                            {
                                type: "panel",
                                name: "my name 1",
                                moduleName: "content",
                                moduleState: {
                                    data1: "data1"
                                }
                            },
                            {
                                type: "panel",
                                name: "my name 1",
                                moduleName: "content",
                                moduleState: {
                                    data1: "data1"
                                }
                            }
                        ]
                    },
                    {
                        type: "stack",
                        panels: [
                            {
                                type: "panel",
                                name: "my name 3",
                                moduleName: "content",
                                moduleState: {
                                    data1: "data1"
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        disableClosePanel: false,
        disableDragPanel: false,
        control: {
            before: function (that, callback) {
                if (that.controlType === "destroy") {
                    if (confirm("Do you want to Delete?")) {
                        setTimeout(function () {
                            callback();
                        }, 300);

                        return;
                    }
                } else {
                    callback();
                    return;
                }
            }
        },
        menu: {
            theme: 'default',
            position: "absolute",
            icons: {
                'arrow': '▸'
            }
        }
    });

    myDocker.onResize = function (e) {
        console.log(e);
    };

    myDocker.addModule({
        "content": {
            init: function (container, state) {
                container["$element"].html(JSON.stringify(state));
            },
            active: function (container, state) {
                // console.log(state, "active");
            },
            deactive: function (container, state) {
                // console.log(state, "deactive");
            },
            destroy: function (container, state) {
                // console.log(state, "destroy");
            }
        }
    });

    myDocker.repaint(); // play docker
});
```

- - -

### Preview
- [See Demonstration](http://ax5.io/ax5ui-docker/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)

## Question
- https://jsdev.kr/c/axisj/ax5ui
- https://github.com/ax5ui/ax5ui-kernel/issues

[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)
