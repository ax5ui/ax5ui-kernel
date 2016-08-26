// ax5.ui.grid.collector
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var sum = function () {
        //return U.number(this.value, {"money":true});
    };
    var avg = function () {
        //return U.number(this.value, {"money":true});
    };

    GRID.collector = {
        sum: sum,
        avg: avg
    };

})();