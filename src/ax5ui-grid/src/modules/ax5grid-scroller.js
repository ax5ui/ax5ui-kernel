// ax5.ui.grid.scroller
(function (root) {
    "use strict";

    var U = ax5.util;

    var scrollMover = {
        "on": function (track, bar, type) {
            var self = this;
            // console.log(this.xvar.mousePosition);

            self.xvar.__da = 0;
                jQuery(document.body)
                .bind(root.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                    //self.resizer.css(getResizerPosition[panel.resizerType](e));
                    var mouseObj = root.util.getMousePosition(e);
                    self.xvar.__da = mouseObj.clientY - self.xvar.mousePosition.clientY;
                    
                    console.log(self.xvar.__da);
                    
                })
                .bind(root.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                    scrollMover.off.call(self);
                })
                .bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                    scrollMover.off.call(self);
                });

            jQuery(document.body)
                .attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

        },
        "off": function () {

            jQuery(document.body)
                .unbind(root.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId)
                .unbind(root.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId)
                .unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body)
                .removeAttr('unselectable')
                .css('user-select', 'auto')
                .off('selectstart');
        }
    };

    var init = function () {

        //this.config.scroller.size
        var margin = 4;

        this.$["scroller"]["vertical-bar"].css({width: this.config.scroller.size - (margin + 1), left: margin / 2});
        this.$["scroller"]["horizontal-bar"].css({height: this.config.scroller.size - (margin + 1), top: margin / 2});

        this.$["scroller"]["vertical"]
            .bind(root.util.ENM["mousedown"], (function (e) {
                this.xvar.mousePosition = root.util.getMousePosition(e);
                scrollMover.on.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical");
            }).bind(this))
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