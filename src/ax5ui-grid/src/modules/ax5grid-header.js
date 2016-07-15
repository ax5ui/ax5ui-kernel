// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function () {
        // 헤더 초기화
        this.headerTable = {};
        this.leftHeaderData = {};
        this.headerData = {};
        this.rightHeaderData = {};

        // 컬럼의 __id값으로 빠르게 데이터를 접근하기 위한 map | 아직 구현전. 필요성 타진 후 맵 데이터를 생성하도록 합니다.
        // this.headerMap = {};
        this.headerTable = makeHeaderTable.call(this, this.columns);
    };

    var makeHeaderTable = function (columns) {
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

                if(!field.hidden) {
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
                    console.log("hh");
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

    /**
     * @method ax5grid.header.divideHeader
     * @param headerTable
     * @param frozenColumnIndex
     * @returns {{leftHeaderData: {rows: Array}, headerData: {rows: Array}}}
     */
    var divideHeader = function (headerTable, frozenColumnIndex) {
        var tempTable_l = {rows: []};
        var tempTable_r = {rows: []};
        for (var r = 0, rl = headerTable.rows.length; r < rl; r++) {
            var row = headerTable.rows[r];

            tempTable_l.rows[r] = {cols: []};
            tempTable_r.rows[r] = {cols: []};

            for (var c = 0, cl = row.cols.length; c < cl; c++) {
                var col = jQuery.extend({}, row.cols[c]);
                var colStartIndex = col.colIndex, colEndIndex = col.colIndex + col.colspan;

                if (colStartIndex < frozenColumnIndex) {
                    if (colEndIndex <= frozenColumnIndex) {
                        // 좌측편에 변형없이 추가
                        tempTable_l.rows[r].cols.push(col);
                    } else {
                        var leftCol = jQuery.extend({}, col);
                        var rightCol = jQuery.extend({}, leftCol);
                        leftCol.colspan = frozenColumnIndex - leftCol.colIndex;
                        rightCol.colIndex = frozenColumnIndex;
                        rightCol.colspan = col.colspan - leftCol.colspan;

                        tempTable_l.rows[r].cols.push(leftCol);
                        tempTable_r.rows[r].cols.push(rightCol);
                    }
                }
                else {
                    // 오른편
                    tempTable_r.rows[r].cols.push(col);
                }
            }
        }

        return {
            leftHeaderData: tempTable_l,
            headerData: tempTable_r
        }
    };

    var repaint = function () {
        var dividedHeaderObj = divideHeader(this.headerTable, this.config.frozenColumnIndex);
        this.leftHeaderData = dividedHeaderObj.leftHeaderData;
        this.headerData = dividedHeaderObj.headerData;

        this.$.panel["left-header"].html(root.tmpl.get("left-header", {
            table: this.leftHeaderData
        }));
        this.$.panel["header"].html(root.tmpl.get("header", {
            table: this.headerData
        }));
        this.$.panel["right-header"].html(root.tmpl.get("right-header", {
            table: this.rightHeaderData
        }));
    };

    root.header = {
        init: init,
        divideHeader: divideHeader,
        repaint: repaint
    };

})(ax5.ui.grid);