// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function () {
        //console.log(this.columns);
        this.header = []; // 헤더 초기화

        var colIndex = 0, collectColumns = [];
        var makeHeader = function (columns) {
            console.log(columns);
            var i = 0, l = columns.length;
            for (; i < l; i++) {
                console.log(i);
                var field = columns[i];

                if (!('columns' in field)) {

                    field["columnIndex"] = colIndex++;
                }
            }
        };
        makeHeader(this.columns);

        console.log(JSON.stringify(this.columns));
        /*
         for (; i < l; i++) {
         this.header.push({

         });
         }
         */
    };

    root.header = {
        init: init
    };

})(ax5.ui.grid);