# How to run

터미널에서 ax5ui-kernel 폴더로 이동하신 후
```
npm install
```
> node_modules에 빌드를 위해 필요한 플러그인을 다운로드 됩니다. npm에 대해서는 인터넷에 많은 자료가 있으니 참고 하시기 바람니다.

걸프를 실행하십시요. (걸프가 실행되지 않는다면 node가 설치되어 있지 않다거나. npm install이 되지 않아서 입니다)
터미널에서 ax5ui-kernel 폴더로 이동하신 후
`gulp` 또는 `gulp default`

```js
toms-mac:ax5ui-kernel tom$ gulp default
[13:25:56] Using gulpfile ~/Works-OSS/ax5ui/ax5ui-kernel/gulpfile.js
[13:25:56] Starting 'default'...
[13:25:57] Finished 'default' after 227 ms
```

위와 같은 결과를 보신다면 성공.

## plugin 수정

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

## gulpfile.js