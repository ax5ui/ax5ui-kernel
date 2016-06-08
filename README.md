**CDN urls**
```
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.css
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.js
https://cdn.rawgit.com/ax5ui/ax5ui-kernel/master/dist/ax5ui.all.min.js
```

# How to Play
0-1. Fork this Origninal repository to your repository.
0-2. Clone your repository to your desktop.
1. Open Terminal
2. Move to git Location : ax5ui-kernel
3. Type this instruction : npm install

```
npm install
```
> Installing npm(Node Package Modules) to manage the node.js modules. please refer to an Internet

4. Type this instruction : gulp default
    > or Type this instruction : gulp
    > current Location : ax5ui-kernel
걸프를 실행하십시요. (걸프가 실행되지 않는다면 node가 설치되어 있지 않다거나. 권한이 없어서 입니다)
터미널에서 ax5ui-kernel 폴더로 이동하신 후
`gulp` or `gulp default`

```js
toms-mac:ax5ui-kernel tom$ gulp default
[13:25:56] Using gulpfile ~/Works-OSS/ax5ui/ax5ui-kernel/gulpfile.js
[13:25:56] Starting 'default'...
[13:25:57] Finished 'default' after 227 ms
```

You can see this screen, if you success.
    > if you fail to run gulp, the reason is 'you don't have permission' or 'npm is not installed'
    > please refer to an Internet
    > this keyword will help you : npm init
    > or this keyword : npm install -g gulp
    > or this keyword : npm install --global gulp-cli
    > or this keyword : sudo npm install --global gulp-cli

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


