// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function () {
        this.headerTable = {}; // 헤더 초기화
        this.headerMap = {}; // 컬럼의 __id값으로 빠르게 데이터를 접근하기 위한 map

        var createHeader = function (columns) {
            var table = {
                rows: []
            };
            var colIndex = 0;
            var maekRows = function (_columns, depth, parentField) {
                var row = {cols: []};
                var i = 0, l = _columns.length;

                for (; i < l; i++) {
                    var field = _columns[i];
                    var colspan = 1;
                    field.colspan = 1;
                    field.rowspan = 1;

                    field.colIndex = (function () {
                        if (!parentField) {
                            return colIndex++;
                        } else {
                            colIndex = parentField.colIndex + i + 1;
                            return parentField.colIndex + i;
                        }
                    })();

                    row.cols.push(field);

                    if ('columns' in field) {
                        colspan = maekRows(field.columns, depth + 1, field);
                    }

                    field.colspan = colspan;
                }

                if (!table.rows[depth]) {
                    table.rows[depth] = {cols: []};
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);


                return (row.cols.length-1) + colspan;
            };
            maekRows(columns, 0);

            (function () {
                // set rowspan
                for (var r = 0, rl = table.rows.length; r < rl; r++) {
                    var row = table.rows[r];
                    for (var c = 0, cl = row.cols.length; c < cl; c++) {
                        var col = row.cols[c];
                        if (!('columns' in col)) {
                            col.rowspan = rl - r;
                        }
                    }
                }
            })();

            return table;
        };

        this.headerTable = createHeader.call(this, this.columns);
        console.log(this.headerTable);
        // console.log(this.columns);
        // console.log(this.headerMap);
    };

    var repaint = function () {
        //console.log(this.columns);
        var data = {
            table: this.headerTable
        };
        this.$.panel.header.html(root.tmpl.get("header", data));

        // resize header elements
    };

    root.header = {
        init: init,
        repaint: repaint
    };

})(ax5.ui.grid);