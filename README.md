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
            _src_bootstrap-ax5mask/
            assets/
            ax5core/
            bootstrap-ax5dialog/
            bootstrap-ax5mask/
        booxstrap-ax5dialog/    ax5ui ax5dialog project
        bootstrap-ax5mask/      ax5ui ax5mask project
    gulpfile.js
    marko-taglib.json
    package.json
```

## gulpfile.js
- **default**
- AX5CORE-docs
- AX5CORE-scripts
- AX5DIALOG-docs
- AX5DIALOG-scripts
- AX5MASK-docs
- AX5MASK-scripts
- AX5UI-docs
- SASS
- docs:all
- watch


## marko-taglib.json
