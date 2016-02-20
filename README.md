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
