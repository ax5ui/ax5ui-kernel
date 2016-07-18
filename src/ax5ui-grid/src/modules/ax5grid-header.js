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

        var getColWidth = function () {
            if(ax5.util.isNumber(this.width)){
                this._realWidth = this.width + "px";
                return this._realWidth;
            }
            else{
                this._realWidth = undefined;
                return "";
            }
        };

        if (this.config.frozenColumnIndex > 0) {
            this.$.panel["left-header"].html(root.tmpl.get("header", {
                '@getColWidth': getColWidth,
                colGroup: this.leftHeaderColGroup,
                table: this.leftHeaderData
            }));
        }

        this.$.panel["header"].html(root.tmpl.get("header", {
            '@getColWidth': getColWidth,
            colGroup: this.headerColGroup,
            table: this.headerData
        }));

        if (this.config.rowSum) {
            this.$.panel["right-header"].html(root.tmpl.get("header", {
                '@getColWidth': getColWidth,
                table: this.rightHeaderData
            }));
        }
    };

    root.header = {
        init: init,
        repaint: repaint
    };

})(ax5.ui.grid);