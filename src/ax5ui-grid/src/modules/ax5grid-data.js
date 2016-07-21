// ax5.ui.grid.layout
(function (root) {
    "use strict";

    var U = ax5.util;
    var init = function () {

    };

    var set = function (data) {
        this.data = U.deepCopy(data);
        return this;
    };

    var get = function () {

    };

    root.data = {
        init: init,
        set: set,
        get: get
    };

})(ax5.ui.grid);