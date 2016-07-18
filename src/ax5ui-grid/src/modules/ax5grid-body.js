// ax5.ui.grid.body
(function (root) {
    "use strict";

    var init = function () {
        // 바디 초기화
        this.bodyRowTable = {};
        this.leftBodyRowData = {};
        this.bodyRowData = {};
        this.rightBodyRowData = {};

        // this.bodyRowMap = {};
        this.bodyRowTable = makeBodyRowTable.call(this, this.columns);
    };

    var makeBodyRowTable = function (columns) {
        var table = {
            rows: []
        };
        var colIndex = 0;
        var maekRows = function (_columns, depth, parentField) {
            var row = {cols: []};
            var i = 0, l = _columns.length;


            var selfMakeRow = function (__columns) {
                var i = 0, l = __columns.length;
                for (; i < l; i++) {
                    var field = __columns[i];
                    var colspan = 1;

                    if (!field.hidden) {

                        if ('key' in field) {
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
                        }
                        else {
                            if ('columns' in field) {
                                selfMakeRow(field.columns, depth);
                            }
                        }
                    } else {

                    }
                }
            };

            for (; i < l; i++) {
                var field = _columns[i];
                var colspan = 1;

                if (!field.hidden) {

                    if ('key' in field) {
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
                    }
                    else {
                        if ('columns' in field) {
                            selfMakeRow(field.columns, depth);
                        }
                    }
                } else {

                }
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = {cols: []};
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return (row.cols.length - 1) + colspan;
            } else {
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
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;

        var data = this.data;
        // todo : 현재 화면에 출력된 범위를 연산하여 data를 결정.

        var SS = [];
        SS.push('<table border="0" cellpadding="0" cellspacing="0">');
        SS.push('<colgroup>');
        for (var cgi = 0, cgl = this.headerColGroup.length; cgi < cgl; cgi++) {
            SS.push('<col style="width:'+ this.headerColGroup[cgi]._realWidth +';"  />');
        }
        SS.push('</colgroup>');

        for (var di = 0, dl = data.length; di < dl; di++) {
            for (var tri = 0, trl = bodyRowData.rows.length; tri < trl; tri++) {
                SS.push('<tr>');
                for (var ci = 0, cl = bodyRowData.rows[tri].cols.length; ci < cl; ci++) {
                    var col = bodyRowData.rows[tri].cols[ci];
                    SS.push('<td colspan="' + col.colspan + '" rowspan="' + col.rowspan + '">');
                    SS.push( data[di][col.key] || "&nbsp;" );
                    SS.push('</td>');
                }
                SS.push('</tr>');
            }
        }
        SS.push('</table>');

        this.$.panel["body"].html(SS.join(''));
    };

    var repaintByTmpl = function () {
        var dividedBodyRowObj = root.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.config.frozenColumnIndex);
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;

        var data = this.data;
        // todo : 현재 화면에 출력된 범위를 연산하여 data를 결정.

        var getCols = function () {
            var ci = this.cols.length;
            while (ci--) {
                this.cols[ci]['@dataIndex'] = this['@dataIndex'];
            }
            return this.cols;
        };
        var getColumnValue = function () {
            return {
                value: data[this['@dataIndex']][this.key] || "&nbsp;"
            };
        };

        if (this.config.frozenColumnIndex > 0) {
            this.$.panel["left-body"].html(root.tmpl.get("body", {
                list: data,
                '@rows': function () {
                    var ri = leftBodyRowData.rows.length;
                    while (ri--) {
                        leftBodyRowData.rows[ri]['@dataIndex'] = this['@i'];
                    }
                    return leftBodyRowData.rows;
                },
                '@cols': getCols,
                '@columnValue': getColumnValue
            }));
        }

        this.$.panel["body"].html(root.tmpl.get("body", {
            list: data,
            '@rows': function () {
                var ri = bodyRowData.rows.length;
                while (ri--) {
                    bodyRowData.rows[ri]['@dataIndex'] = this['@i'];
                }
                return bodyRowData.rows;
            },
            '@cols': getCols,
            '@columnValue': getColumnValue
        }));
    };

    var setData = function () {

    };


    root.body = {
        init: init,
        repaint: repaint,
        repaintByTmpl: repaintByTmpl,
        setData: setData
    };

})(ax5.ui.grid);