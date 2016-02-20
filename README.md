# How to run

걸프를 실행하십시요.
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
        ax5docs/
        booxstrap-ax5dialog/ [이 폴더를 열어주세요]
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
        split.sh    ax5docs, ax5core, booxstrap-ax5dialog, the contents of a folder, such as booxstrap-ax5mask, it overrides in each of git.
    src/
        ax5core/    utility project for ax5ui
        ax5docs/    ax5ui website project
            _src_/
            _src_ax5core/
            _src_bootstrap-ax5dialog/
            ... ax5ui plugin project document tmpls
            ..
            .
            assets/ 
                _layouts/   marko layout
                components  marko custom tag renderer
                css
                include
                js  
                lib front plugin resource
                .bowerrrc   bower manage folder config
                ax5favicon.ico
                bower.json  
            ax5core/
            bootstrap-ax5dialog/
            ... document dist folders
            ..
            .            
        booxstrap-ax5dialog/    ax5ui ax5dialog project
        ... ax5ui plugin projects
        ..
        .
    gulpfile.js
    marko-taglib.json
    package.json
```

## gulpfile.js


## marko-taglib.json

```json
{
	"tags-dir": "src/ax5docs/assets/components"
}
```
marko custom tag src

