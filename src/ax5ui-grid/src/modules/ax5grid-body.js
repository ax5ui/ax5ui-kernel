
// ax5.ui.grid.body
(function (root) {
    "use strict";

    var init = function(){
        // 바디 초기화
        this.bodyRowTable = {};
        this.leftBodyRowData = {};
        this.bodyRowData = {};
        this.rightBodyRowData = {};

        // this.bodyRowMap = {};
        this.bodyRowTable = makeBodyRowTable.call(this, this.columns);
    };

    var makeBodyRowTable = function(columns){
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

                if(!field.hidden && 'key' in field) {
                    field.colspan = 1;
                    field.rowspan = 1;

                    field.rowIndex = depth;
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
                }else{

                }
            }

            if(row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = {cols: []};
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return (row.cols.length - 1) + colspan;
            }else{
                return colspan;
            }

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

    var repaint = function () {
        var dividedBodyRowObj = root.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.config.frozenColumnIndex);
        this.leftBodyRowData = dividedBodyRowObj.leftData;
        this.bodyRowData = dividedBodyRowObj.rightData;

        this.$.panel["left-body"].html(root.tmpl.get("left-body", {
            table: this.leftBodyRowData
        }));
        this.$.panel["body"].html(root.tmpl.get("body", {
            table: this.bodyRowData
        }));
        this.$.panel["right-body"].html(root.tmpl.get("right-body", {
            table: this.rightBodyRowData
        }));
    };

    var setData = function(){

    };


    root.body = {
        init: init,
        repaint: repaint,
        setData: setData
    };

})(ax5.ui.grid);