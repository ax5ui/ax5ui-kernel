[![Build Status](https://travis-ci.org/ax5ui/ax5ui-kernel.svg?branch=master)](https://travis-ci.org/ax5ui/ax5ui-kernel)
[![Backers on Open Collective](https://opencollective.com/ax5ui-kernel/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/ax5ui-kernel/sponsors/badge.svg)](#sponsors)
[![](https://img.shields.io/npm/dm/ax5core.svg)](https://www.npmjs.com/package/ax5core)

![ax5ui preview](src/preview.png)

# What is it!!
AX5UI is HTML5 Web standard Javascript UI plug-ins to be used in conjunction with jQuery / Bootstrap. (http://ax5.io)
In order to use the AX5UI, you need a basic knowledge of the "HTML, JS, CSS". Knowledge of the "HTML, JS, CSS," can be easily obtained by using a search engine.

### jQuery
Faster development of the UI plug-in, in order to be more rational, we use the jQuery library.
The role of the jQuery library in AX5UI is, the DOM Element "looking, erase, add to, to connect the events." It is used for.
jQuery is, JS library that most of developers around the world are using (http://jquery.com/).


###Bootstrap
Bootstrap is, various layouts, buttons, is a framework that has been created a design such as an input window in advance by CSS and Javascript.
There was enough explosive reaction called the revolution of Web design, is one of the front-end framework that most used in the world.
AX5UI theme of the system is made of SCSS code, has been designed as a final product structure is being created CSS file.
SCSS variables within the code structure and is designed to be compatible with Bootstrap SCSS architecture, was developed and tested to optimize the use of CSS classes and input windows in structures such as Bootstrap.

### AX5UI
AX5UI is a software that has been designed and developed with the development experience of AXISJ.
It had the idea while offering numerous UI library users have tried to put in AX5UI.
- How you can, or will be able to shorten the development time of developers?
- How can, I wonder developers can happily development?
- How you can, or will be able to share feel free to add at any time and the developer is required functionality?

In order to solve such a trouble, several new methods were required.
- Not a framework, to add light and developed in the form of a plug-in must be convenient for use with other plug-ins.
- While mutually compatible with each of the UI plug-in must be independent.
- Convenient distribution system such as NPM and Bower there must be.
- There must be to develop a plug-in from one of the repository, Each of the UI plug, be distributed to each of the repository.
- All processes were automated, developer must be able to enjoy only coding.

In the future, growth in the UI plug-ins that can be used need more improvement and effort, but would be further,
We hope to participate in the feeling that we make together.

---

# How to Use

## install
AX5UI is that you are ready to connect to the source code of a web page without the installation process.
One of the following ways: You can download the source code.
- Download directly from Github.
- NPM
- Bower
- Git clone `git clone https://github.com/ax5ui/ax5ui-kernel`

If the source code download 
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>

<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-dialog/master/dist/ax5dialog.css" />
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-dialog/master/dist/ax5dialog.min.js"></script>
```
Please AX5UI import the plug-in Web page, as shown above. If you can here a success. If this process is difficult to call right now if to the developer Stray around right now, close your browser.

### Structure
When you add to your Web application AX5UI, AX5UI uses only variables that ax5 in your browser.
`ax5` object contained inside the keys, such as` ax5.util`, `ax5.mustache`,` ax5.info`, `ax5.ui` and down when` ax5.ui` Add to add the UI class of AX5UI It will be back.

**ax5core**
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
```
```
console.log(ax5);
// {guid: 1, info: Object, util: Object, ui: Object, mustache: Object}
```

**add ax5ui-dialog**
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>

<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-dialog/master/dist/ax5dialog.css" />
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-dialog/master/dist/ax5dialog.min.js"></script>
```
```
console.log(ax5.ui);
// {root: Function.., dialog: Function..}
```
When you add the UI plug-in, as shown above is a structure that is added to the sub-ax5.ui.


## Customizing

You can modify the source code from the source in the `src` folder.
More detailed information will be covered next time. For now, just ask.


## Question

- https://jsdev.kr/c/axisj/ax5ui
- https://github.com/ax5ui/ax5ui-kernel/issues 

- - -

# How to Play
1. Fork this Origninal repository to your repository.
2. Clone your repository to your desktop.
3. Open Terminal
4. Move to git folder (Folder Name : ax5ui-kernel)
5. Type this instruction : npm install
6. Run Gulp task
7. Build a test environment (src/ax5ui-**/test) > bower install
8. Coding & test

### npm install
```
npm install
```
> Installing npm(Node Package Modules) to manage the node.js modules. please refer to an Internet

- Type this instruction : gulp default
    * cf1> or Type this instruction : gulp
    * cf2> current Location : ax5ui-kernel

### Gulp
```
toms-mac:ax5ui-kernel tom$ gulp default
[13:25:56] Using gulpfile ~/Works-OSS/ax5ui/ax5ui-kernel/gulpfile.js
[13:25:56] Starting 'default'...
[13:25:57] Finished 'default' after 227 msa
```
> if you success, you can see this screen.
> if you fail to run gulp, the reason is ['you don't have permission' or 'npm is not installed'] please refer to an Internet this keyword will help you : 
> - npm init
> - npm install -g gulp
> - npm install --global gulp-cli
> - sudo npm install --global gulp-cli

### Bower
In each of the UI folder there is a `test folder`. 
`Test folder` is, in the development of each of the UI, will be used for testing purposes.
`Bower.json` is a file that manages the necessary plugins in the` test folder `.

```
npm install -g bower
bower install
```

After the move in the `test folder` 
When you run the above command in a terminal, 
bower_components folder is created in the `test folder`, it will be downloaded the plug-ins required.
Then, open the html file, you can test the code in development.

## Structure
```
ax5ui-kernel/
├── build/
|   ├── jsdoc2md.sh (jsdoc to markdown shell script)
|   ├── split.sh (gitsubsplit shell script)
|   └── split_jenkins.sh (gitsubsplit shell script for jenkins)
├── dist/
├── src/
|   ├── ax5core/
|   |   ├── dist/
|   |   ├── src/
|   |   ├── test/
│   |   ├── API...
│   |   ├── bower.json
│   |   ├── deploy.sh
│   |   ├── package.json
│   |   └── README.md
|   ├── ax5ui-autocomplete/
|   |   ├── dist/
|   |   |   ├── ax5autocomplete.css
|   |   |   ├── ax5autocomplete.js
|   |   |   └── ax5autocomplete.min.js
|   |   ├── src/
|   |   |   ├── modules/
|   |   |   |   ├── ax5autocomplete-tmpl.js
|   |   |   |   └── ax5autocomplete-util.js
|   |   |   ├── scss/
|   |   |   |   ├── _ax5autocomplete.scss
|   |   |   |   └── _ax5autocomplete_variables.scss
|   |   |   ├── ax5autocomplete.js
|   |   |   └── ax5autocomplete.scss
|   |   ├── test/
|   |   |   ├── bower.json (you can run `$bower install` initialize test environment)
|   |   |   └── index.html
|   |   ├── bootstrap.min.js
│   |   ├── chartist.min.js
│   |   ├── demo.js
│   |   ├── jquery-1.10.2.js
│   |   └── light-bootstrap-dashboard.js
|   ├── ax5ui-.../
|   └── ax5ui-.../
|
├── .babelrc
├── .gitignore
├── gulpfile.js
├── LICENSE
├── package.json
├── README.md
└── README-kor.md
```




## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/ax5ui-kernel#backer)]

<a href="https://opencollective.com/ax5ui-kernel/backer/0/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/1/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/2/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/3/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/4/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/5/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/6/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/7/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/8/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/9/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/10/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/11/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/12/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/13/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/14/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/15/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/16/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/17/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/18/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/19/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/20/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/21/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/22/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/23/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/24/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/25/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/26/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/27/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/28/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/backer/29/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/backer/29/avatar.svg"></a>


## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/ax5ui-kernel#sponsor)]

<a href="https://opencollective.com/ax5ui-kernel/sponsor/0/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/1/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/2/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/3/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/4/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/5/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/6/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/7/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/8/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/9/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/10/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/11/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/12/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/13/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/14/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/15/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/16/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/17/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/18/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/19/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/20/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/21/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/22/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/23/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/24/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/25/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/26/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/27/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/28/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/ax5ui-kernel/sponsor/29/website" target="_blank"><img src="https://opencollective.com/ax5ui-kernel/sponsor/29/avatar.svg"></a>


- - -


[![](https://img.shields.io/badge/AX5.IO-AX5UI-blue.svg)](https://github.com/ax5ui) [![](https://img.shields.io/badge/GITHUB-ThomasJang-red.svg)](https://github.com/thomasJang)


