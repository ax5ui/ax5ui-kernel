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

        var dividedHeaderObj = root.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        this.leftHeaderData = dividedHeaderObj.leftData;
        this.headerData = dividedHeaderObj.rightData;

        this.leftHeaderColGroup = this.colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = this.colGroup.slice(this.config.frozenColumnIndex);
        var cfg = this.config;

        var getColWidth = function () {
            if (ax5.util.isNumber(this.width)) {
                this._realWidth = this.width + "px";
                return this._realWidth;
            }
            else {
                this._realWidth = undefined;
                return "";
            }
        };
        var getRowHeight = function () {
            return cfg.header.columnHeight + "px";
        };
        var getColStyle = function () {
            return "height:" + (cfg.header.columnHeight * this.rowspan) + "px";
        };

        if (this.config.frozenColumnIndex > 0) {
            this.$.panel["left-header"].html(root.tmpl.get("header", {
                '@getColWidth': getColWidth,
                '@getRowHeight': getRowHeight,
                '@getColStyle': getColStyle,
                colGroup: this.leftHeaderColGroup,
                table: this.leftHeaderData
            }));
        }

        this.$.panel["header"].html(root.tmpl.get("header", {
            '@getColWidth': getColWidth,
            '@getRowHeight': getRowHeight,
            '@getColStyle': getColStyle,
            colGroup: this.headerColGroup,
            table: this.headerData
        }));

        if (this.config.rightSum) {
            this.$.panel["right-header"].html(root.tmpl.get("header", {
                '@getColWidth': getColWidth,
                '@getRowHeight': getRowHeight,
                '@getColStyle': getColStyle,
                table: this.rightHeaderData
            }));
        }
    };

    root.header = {
        init: init,
        repaint: repaint
    };

})(ax5.ui.grid);