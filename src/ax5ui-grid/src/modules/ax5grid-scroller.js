// ax5.ui.grid.scroller
(function (root) {
    "use strict";

    var U = ax5.util;
    var init = function () {

        //this.config.scroller.size
        var margin = 4;
        this.$["scroller"]["vertical-bar"].css({width: this.config.scroller.size - (margin + 1), left: margin / 2});
        this.$["scroller"]["horizontal-bar"].css({height: this.config.scroller.size - (margin + 1), top: margin / 2});

        this.$["scroller"]["horizontal-bar"].bind("click.ax5grid", function(){

        });

        this.$["scroller"]["vertical"]
            .bind(root.util.ENM["mousedown"], function (e) {
                console.log(e.clientX);
                //panelInfo.mousePosition = getMousePosition(e);
                //resizeSplitter.on.call(self, queIdx, panelInfo, panelInfo.$splitter);
            })
            .bind("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });
        // todo : scroller scroll ready
    };

    var resize = function () {
        var VERTICAL_SCROLLER_HEIGHT = this.$["scroller"]["vertical"].height();
        var HORIZONTAL_SCROLLER_WIDTH = this.$["scroller"]["horizontal"].width();
        var PANEL_HEIGHT = this.$["panel"]["body"].height();
        var PANEL_WIDTH = this.$["panel"]["body"].width();
        var CONTENT_HEIGHT = this.xvar.scrollContentHeight;
        var CONTENT_WIDTH = this.xvar.scrollContentWidth;
        var verticalScrollBarHeight, horizontalScrollBarWidth;

        verticalScrollBarHeight = PANEL_HEIGHT * VERTICAL_SCROLLER_HEIGHT / CONTENT_HEIGHT;
        horizontalScrollBarWidth = PANEL_WIDTH * HORIZONTAL_SCROLLER_WIDTH / CONTENT_WIDTH;

        this.$["scroller"]["vertical-bar"].css({top: 0, height: verticalScrollBarHeight});
        this.$["scroller"]["horizontal-bar"].css({left: 0, width: horizontalScrollBarWidth});
    };

    root.scroller = {
        init: init,
        resize: resize
    };

})(ax5.ui.grid);