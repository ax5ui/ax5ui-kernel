// ax5.ui.grid.scroller
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var scrollMover = {
        "on": function (track, bar, type) {
            var self = this,
                barOffset = bar.position(),
                barBox = {
                    width: bar.width(), height: bar.height()
                },
                trackBox = {
                    width: track.innerWidth(), height: track.innerHeight()
                },
                getScrollerPosition = {
                    "vertical": function (e) {
                        var mouseObj = GRID.util.getMousePosition(e);
                        self.xvar.__da = mouseObj.clientY - self.xvar.mousePosition.clientY;
                        // track을 벗어 나지 안도록 범위 체크
                        var newTop = barOffset.top + self.xvar.__da;
                        if (newTop < 0) {
                            newTop = 0;
                        }
                        else if ((newTop + barBox.height) > trackBox.height) {
                            newTop = trackBox.height - barBox.height;
                        }
                        return {top: newTop};
                    },
                    "horizontal": function (e) {
                        var mouseObj = GRID.util.getMousePosition(e);
                        self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                        // track을 벗어 나지 안도록 범위 체크
                        var newLeft = barOffset.left + self.xvar.__da;
                        if (newLeft < 0) {
                            newLeft = 0;
                        }
                        else if ((newLeft + barBox.width) > trackBox.width) {
                            newLeft = trackBox.width - barBox.width;
                        }
                        return {left: newLeft};
                    }
                };

            self.xvar.__da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)

            jQuery(document.body)
                .bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                    var css = getScrollerPosition[type](e);
                    bar.css(css);
                })
                .bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
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
                .unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId)
                .unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId)
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

        this.$["scroller"]["vertical-bar"]
            .bind(GRID.util.ENM["mousedown"], (function (e) {
                this.xvar.mousePosition = GRID.util.getMousePosition(e);
                scrollMover.on.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical");
            }).bind(this))
            .bind("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });
        this.$["scroller"]["vertical"]
            .bind("click", (function (e) {

            }).bind(this));

        this.$["scroller"]["horizontal-bar"]
            .bind(GRID.util.ENM["mousedown"], (function (e) {
                this.xvar.mousePosition = GRID.util.getMousePosition(e);
                scrollMover.on.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal");
            }).bind(this))
            .bind("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });
        this.$["scroller"]["horizontal"]
            .bind("click", (function (e) {

            }).bind(this));

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

    GRID.scroller = {
        init: init,
        resize: resize
    };

})();