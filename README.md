## 폴더 구조 설명
```
ax5ui-kernel/
    
    build/
        push.sh     master 브랜치로 gh-pages 브랜치를 rebase 하고 master로 복귀합니다. 
        split.sh    ax5docs, ax5core, booxstrap-ax5dialog, booxstrap-ax5mask등의 폴더내용을 각각의 git으로 덮어쓰기 합니다. 
    
    src/
        ax5core/    ax5ui 제작을 위한 유틸리티 프로젝트

        ax5docs/    ax5ui 웹사이트 프로젝트
            _src_/
            _src_ax5core/
            _src_bootstrap-ax5dialog/
            _src_bootstrap-ax5mask/
            assets/
            ax5core/
            bootstrap-ax5dialog/
            bootstrap-ax5mask/
            
        booxstrap-ax5dialog/    ax5ui ax5dialog 프로젝트

        bootstrap-ax5mask/      ax5ui ax5mask 프로젝트
```

## gulpfile.js
