#!/usr/bin/env bash
jsdoc2md "src/ax5ui-layout/src/ax5layout.js" > src/ax5ui-layout/API.md
jsdoc2md "src/ax5ui-combobox/src/ax5combobox.js" > src/ax5ui-combobox/API.md
jsdoc2md "src/ax5ui-grid/dist/ax5grid.js" > src/ax5ui-grid/API.md
jsdoc2md "src/ax5ui-binder/dist/ax5binder.js" > src/ax5ui-binder/API.md
jsdoc2md "src/ax5ui-autocomplete/dist/ax5autocomplete.js" > src/ax5ui-autocomplete/API.md
jsdoc2md "src/ax5ui-uploader/dist/ax5uploader.js" > src/ax5ui-uploader/API.md