// ax5.ui.grid.page
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var navigationUpdate = function(){
        var page = {
            currentPage: this.page.currentPage,
            pageSize: this.page.pageSize,
            totalElements: this.page.totalElements,
            totalPages: this.page.totalPages
        };

        this.$["page"]["navigation"].html(GRID.tmpl.get("page_navigation", page));
    };

    var statusUpdate = function () {
        var fromRowIndex = this.xvar.paintStartRowIndex;
        var toRowIndex = this.xvar.paintStartRowIndex + this.xvar.paintRowCount - 1;
        //var totalElements = (this.page && this.page.totalElements) ? this.page.totalElements : this.xvar.dataRowCount;
        var totalElements = this.xvar.dataRowCount;
        if(toRowIndex > totalElements){
            toRowIndex = totalElements;
        }

        this.$["page"]["status"].html(GRID.tmpl.get("page_status", {
            fromRowIndex: U.number(fromRowIndex+1, {"money":true}),
            toRowIndex: U.number(toRowIndex, {"money":true}),
            totalElements: U.number(totalElements, {"money":true})
        }));
    };

    GRID.page = {
        navigationUpdate: navigationUpdate,
        statusUpdate: statusUpdate
    };

})();