/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.page
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var money = function () {
        return U.number(this.value, {"money":true});
    };

    GRID.formatter = {
        money: money
    };

})();