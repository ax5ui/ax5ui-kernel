// ax5.ui.grid.page
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var statusUpdate = function () {
        var fromRowIndex = this.xvar.paintStartRowIndex;
        var toRowIndex = this.xvar.paintStartRowIndex + this.xvar.paintRowCount - 1;
        var totalElements = this.xvar.dataRowCount;
        if(toRowIndex > totalElements){
            toRowIndex = totalElements;
        }

        this.$["page"]["status"].html(GRID.tmpl.get("page_status", {
            fromRowIndex: U.number(fromRowIndex, {"money":true}),
            toRowIndex: U.number(toRowIndex, {"money":true}),
            totalElements: U.number(totalElements, {"money":true})
        }));
    };

    GRID.page = {
        statusUpdate: statusUpdate
    };

})();