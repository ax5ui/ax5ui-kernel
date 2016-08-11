// ax5.ui.grid.layout
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function () {

    };

    var set = function (data) {

        if(U.isArray(data)){
            this.page = null;
            this.data = U.deepCopy(data);
        }else if("page" in data){
            this.page = jQuery.extend({}, data.page);
            this.data = U.deepCopy(data.list);
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.data.length) ? this.data.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var get = function () {

    };

    var setValue = function(){

    };

    var select = function(dindex, selected){
        if(typeof selected === "undefined") {
            this.data[dindex][this.config.columnKeys.selected] = !this.data[dindex][this.config.columnKeys.selected];
        }else{
            this.data[dindex][this.config.columnKeys.selected] = selected;
        }
        return this.data[dindex][this.config.columnKeys.selected];
    };

    GRID.data = {
        init: init,
        set: set,
        get: get,
        setValue: setValue,
        select: select
    };

})();