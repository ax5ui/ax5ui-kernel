// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function () {
        // 헤더 초기화
        this.leftHeaderData = {};
        this.headerData = {};
        this.rightHeaderData = {};
    };

    var repaint = function () {
        var cfg = this.config;
        var dividedHeaderObj = root.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        var leftHeaderData = this.leftHeaderData = dividedHeaderObj.leftData;
        var headerData = this.headerData = dividedHeaderObj.rightData;

        this.leftHeaderColGroup = this.colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = this.colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function (_elTarget, _colGroup, _bodyRow) {
            var SS = [];
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

                for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                    var trCSS_class = "";
                    SS.push('<tr class="'+ trCSS_class +'">');
                    for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                        var col = _bodyRow.rows[tri].cols[ci];
                        var cellHeight = cfg.header.columnHeight * col.rowspan - cfg.header.columnBorderWidth;
                        var colTdCSS_class = "";
                        if(cfg.header.columnBorderWidth) colTdCSS_class += "hasBorder ";

                        SS.push('<td ',
                            'data-ax5grid-column-row="' + tri + '" ',
                            'data-ax5grid-column-col="' + ci + '" ',
                            'colspan="' + col.colspan + '" rowspan="' + col.rowspan + '" ',
                            'class="'+ colTdCSS_class +'" ',
                            'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                        SS.push((function () {
                            var lineHeight = (cfg.header.columnHeight - cfg.header.columnPadding * 2 - cfg.header.columnBorderWidth);
                            if (col.multiLine) {
                                return '<span data-ax5grid-cellHolder="multiLine" style="height:' + cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                            } else {
                                return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.header.columnHeight - cfg.header.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                            }
                        })(), (col.label || "&nbsp;"), '</span>');

                        SS.push('</td>');
                    }
                    SS.push('<td data-ax5grid-column-row="null" data-ax5grid-column-col="null"></td>');
                    SS.push('</tr>');
                }
            SS.push('</table>');

            _elTarget.html(SS.join(''));
        };

        if (cfg.frozenColumnIndex > 0) {
            repaintHeader(this.$.panel["left-header"], this.leftHeaderColGroup, leftHeaderData);
        }
        repaintHeader(this.$.panel["header"], this.headerColGroup, headerData);

        if (cfg.rightSum) {

        }
    };

    root.header = {
        init: init,
        repaint: repaint
    };

})(ax5.ui.grid);