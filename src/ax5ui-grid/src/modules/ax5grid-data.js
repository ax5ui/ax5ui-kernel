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

    GRID.data = {
        init: init,
        set: set,
        get: get
    };

})();