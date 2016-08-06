# What is it!

AX5UI는 HTML5 웹표준에 최적화된 UI 플러그인입니다. 
AX5UI를 브라우저에 효과적으로 출력하기 위해 HTML, JS, CSS의 API를 사용하고 있습니다.
JS를 좀 더 효과적으로 사용하기 위해 jQuery 라이브러리를 기반하여 제작이 되었고, 사용자에게 친근한 Bootstrap 프레임워크의 CSS Class구조에 완벽 호환되게 개발되었습니다.

AX5UI는 AXISJ의 개발경험을 가지고 설계 개발된 소프트웨어 입니다.
수많은 사용자에게 UI라이브러리를 제공하면서 가지게 된 생각을 AX5UI에 담아내려고 애썻습니다.

> 어떻게 하면 꼭 필요한 기능들을 바로 사용이 가능하고 완벽히 이해 할 수 있는 형태로 사용자에게 전달할 수 있을까? 또 사용자들이 오픈소스에 어떻게 참여하게 할 수 있을까?  

이런 고민들을 해결하기 위해 몇가지 새로 장치들이 필요했습니다.
- 각각의 UI 플러그인들이 분리개발되어야 한다.
- 전 세계 개발자들이 바로 사용이 가능한 CSS프레임워크를 선택해야 한다.


- - -

# How to Use

## install

설치과정 소개


## 구조
AX5UI를 여러분의 웹 애플리케이션에 추가하면, AX5UI는 브라우저에 ax5라는 변수만을 사용합니다. 
ax5오브젝트안에는 ax5.util, ax5.mustache, ax5.info, ax5.ui등의 키가 담겨 있고 AX5UI의 UI클래스들을 추가하게 되면 ax5.ui아래에 담기되 됩니다.

**ax5core만 삽입된 상황**
```html
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
```
```
console.log(ax5);
// {guid: 1, info: Object, util: Object, ui: Object, mustache: Object}
```

**ax5ui-dialog를 추가한 상황**
```html
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>

<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-dialog/master/dist/ax5dialog.css" />
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-dialog/master/dist/ax5dialog.min.js"></script>
```
```
console.log(ax5.ui);
// {root: Function.., dialog: Function..}
```
위에서와 같이 UI 플러그인들을 추가하면 ax5.ui하위에 추가되는 구조입니다.

**CDN urls**
```
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.css
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.js
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.min.js
```

## Customizing

## Question

- - -

# How to Play
1. Fork this Origninal repository to your repository.
2. Clone your repository to your desktop.
3. Open Terminal
4. Move to git folder (Folder Name : ax5ui-kernel)
5. Type this instruction : npm install

```
npm install
```
> Installing npm(Node Package Modules) to manage the node.js modules. please refer to an Internet


1. Type this instruction : gulp default
    * cf1> or Type this instruction : gulp
    * cf2> current Location : ax5ui-kernel

 
```js
toms-mac:ax5ui-kernel tom$ gulp default
[13:25:56] Using gulpfile ~/Works-OSS/ax5ui/ax5ui-kernel/gulpfile.js
[13:25:56] Starting 'default'...
[13:25:57] Finished 'default' after 227 msa
```
>* if you success, you can see this screen.
    2. if you fail to run gulp, the reason is ['you don't have permission' or 'npm is not installed']
    3. please refer to an Internet
    4. this keyword will help you : 
      1. npm init
      2. npm install -g gulp
      3. npm install --global gulp-cli
      4. sudo npm install --global gulp-cli



## Structure
```
ax5ui-kernel/
    build/
        push.sh     rebase with 'gh-pages' branch from 'master' branch, then change to 'master' branch.
        split.sh    ax5docs, ax5core, ax5ui-dialog, the contents of a folder, such as ax5ui-mask, it overrides in each of git.
    src/
        ax5core/    utility project for ax5ui      
        ax5ui-dialog/    ax5ui ax5dialog project
        ... ax5ui plugin projects
        ..
        .
    gulpfile.js
    package.json
```


- - -

[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-OpensourceJavascriptUILibrary-green.svg)](https://github.com/axisj) [![](https://img.shields.io/badge/AX5.IO-AX5UI-blue.svg)](https://github.com/ax5ui) [![](https://img.shields.io/badge/GITHUB-ThomasJang-red.svg)](https://github.com/thomasJang)

