// ax5.ui.grid.page
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var navigationUpdate = function () {
        if(this.page) {
            var page = {
                currentPage: this.page.currentPage,
                pageSize: this.page.pageSize,
                totalElements: this.page.totalElements,
                totalPages: this.page.totalPages
            };
            var navigationItemCount = this.config.page.navigationItemCount;

            page["@paging"] = (function () {
                var returns = [];

                var startI = page.currentPage - Math.floor(navigationItemCount / 2);
                if (startI < 0) startI = 0;
                var endI = page.currentPage + navigationItemCount;
                if (endI - startI > 10) {
                    endI = startI + 10;
                }
                if (endI > page.totalPages) endI = page.totalPages;

                for (var p = startI, l = endI; p < l; p++) {
                    returns.push({'pageNo': (p + 1), 'selected': page.currentPage == p});
                }
                return returns;
            })();

            this.$["page"]["navigation"].html(GRID.tmpl.get("page_navigation", page));
        }else{
            this.$["page"]["navigation"].empty();
        }
    };

    var statusUpdate = function () {
        var fromRowIndex = this.xvar.paintStartRowIndex;
        var toRowIndex = this.xvar.paintStartRowIndex + this.xvar.paintRowCount - 1;
        //var totalElements = (this.page && this.page.totalElements) ? this.page.totalElements : this.xvar.dataRowCount;
        var totalElements = this.xvar.dataRowCount;
        if (toRowIndex > totalElements) {
            toRowIndex = totalElements;
        }

        this.$["page"]["status"].html(GRID.tmpl.get("page_status", {
            fromRowIndex: U.number(fromRowIndex + 1, {"money": true}),
            toRowIndex: U.number(toRowIndex, {"money": true}),
            totalElements: U.number(totalElements, {"money": true})
        }));
    };

    GRID.page = {
        navigationUpdate: navigationUpdate,
        statusUpdate: statusUpdate
    };

})();