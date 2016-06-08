**CDN urls**
```
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.css
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.js
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.min.js
```

# How to Play
1. Fork this Origninal repository to your repository.
2. Clone your repository to your desktop.
3. Open Terminal
4. Move to git Location : ax5ui-kernel
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
    2. if you fail to run gulp, the reason is 'you don't have permission' or 'npm is not installed'
    3. please refer to an Internet
    4. this keyword will help you : 
      1. npm init
      2. npm install -g gulp
      3. npm install --global gulp-cli
      4. sudo npm install --global gulp-cli

## plugin 개발

많은 플러그인들 중에 샘플로 `bootstrap-ax5dialog`로 코드를 수정해 보겠습니다.

```
ax5ui-kernel/
    build/
    src/
        ax5core/   
        ax5ui-dialog/ [이 폴더를 열어주세요]
            dist/
            src/
            test/
            API.md
            bower.json
            ...
            ..
            .
```

`src` 폴더안에 `ax5dialog.js`를 수정하면, `gulp`가 `dist`폴에 빌드된 js파일을 만들거나 업데이트 합니다. 
변경된 소스는 `test/index.html`에서 확인 할 수 있습니다.


- - - 


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

## 코딩가이드



