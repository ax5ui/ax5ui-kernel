// ax5.ui.grid.layout
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function () {

    };

    var set = function (data) {
        this.data = U.deepCopy(data);
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