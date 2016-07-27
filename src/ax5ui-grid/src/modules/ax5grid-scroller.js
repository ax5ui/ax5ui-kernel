// ax5.ui.grid.scroller
(function (root) {
    "use strict";


    var init = function () {
        //this.config.scroller.size
        var margin = 4;
        this.$["scroller"]["vertical-bar"].css({width: this.config.scroller.size - (margin + 1), left: margin / 2});
        this.$["scroller"]["horizontal-bar"].css({height: this.config.scroller.size - (margin + 1), top: margin / 2});
    };

    var setPosition = function () {
        this.$["scroller"]["vertical-bar"].css({top: 0, height: 100});
        this.$["scroller"]["horizontal-bar"].css({left: 0, width: 100});
    };

    root.scroller = {
        init: init,
        setPosition: setPosition
    };

})(ax5.ui.grid);