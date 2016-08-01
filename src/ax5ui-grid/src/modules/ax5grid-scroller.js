// ax5.ui.grid.scroller
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var convertScrollPosition = {
        "vertical": function (css, _var) {
            var top = (_var._content_height * css.top) / _var._vertical_scroller_height;
            if (top < 0) top = 0;
            else if (_var._content_height - _var._panel_height < top) {
                top = _var._content_height - _var._panel_height;
            }
            return {
                top: -top
            }
        },
        "horizontal": function (css, _var) {
            var left = (_var._content_width * css.left) / _var._horizontal_scroller_width;
            if (left < 0) left = 0;
            else if (_var._content_width - _var._panel_width < left) {
                left = _var._content_width - _var._panel_width;
            }
            return {
                left: -left
            }
        }
    };
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

                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = this.xvar.scrollContentHeight,
                _content_width = this.xvar.scrollContentWidth,

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

                    var scrollPositon = convertScrollPosition[type].call(self, css, {
                        _content_width: _content_width,
                        _content_height: _content_height,
                        _panel_width: _panel_width,
                        _panel_height: _panel_height,
                        _horizontal_scroller_width: _horizontal_scroller_width,
                        _vertical_scroller_height: _vertical_scroller_height
                    });
                    if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);
                    GRID.body.scrollTo.call(self, scrollPositon, type);
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
        var _vertical_scroller_height = this.$["scroller"]["vertical"].height(),
            _horizontal_scroller_width = this.$["scroller"]["horizontal"].width(),
            _panel_height = this.$["panel"]["body"].height(),
            _panel_width = this.$["panel"]["body"].width(),
            _content_height = this.xvar.scrollContentHeight,
            _content_width = this.xvar.scrollContentWidth,
            verticalScrollBarHeight = _panel_height * _vertical_scroller_height / _content_height,
            horizontalScrollBarWidth = _panel_width * _horizontal_scroller_width / _content_width;

        var convertScrollBarPosition = {
            "vertical": function (_top) {
                var type = "vertical";
                var top = (_vertical_scroller_height * _top) / _content_height;
                if (verticalScrollBarHeight - top > _vertical_scroller_height) {
                    top = verticalScrollBarHeight - _vertical_scroller_height;

                    var scrollPositon = convertScrollPosition[type].call(this, {top: -top}, {
                        _content_width: _content_width,
                        _content_height: _content_height,
                        _panel_width: _panel_width,
                        _panel_height: _panel_height,
                        _horizontal_scroller_width: _horizontal_scroller_width,
                        _vertical_scroller_height: _vertical_scroller_height
                    });

                    GRID.body.scrollTo.call(this, scrollPositon, type);

                }
                return -top
            },
            "horizontal": function (_left) {
                var type = "horizontal";
                var left = (_horizontal_scroller_width * _left) / _content_width;
                if (horizontalScrollBarWidth - left > _horizontal_scroller_width) {
                    left = horizontalScrollBarWidth - _horizontal_scroller_width;

                    var scrollPositon = convertScrollPosition[type].call(this, {left: -left}, {
                        _content_width: _content_width,
                        _content_height: _content_height,
                        _panel_width: _panel_width,
                        _panel_height: _panel_height,
                        _horizontal_scroller_width: _horizontal_scroller_width,
                        _vertical_scroller_height: _vertical_scroller_height
                    });

                    GRID.header.scrollTo.call(this, scrollPositon);
                    GRID.body.scrollTo.call(this, scrollPositon, type);
                }
                return -left
            }
        };

        this.$["scroller"]["vertical-bar"].css({top: convertScrollBarPosition.vertical.call(this, this.$.panel["body-scroll"].position().top), height: verticalScrollBarHeight});
        this.$["scroller"]["horizontal-bar"].css({left: convertScrollBarPosition.horizontal.call(this, this.$.panel["body-scroll"].position().left), width: horizontalScrollBarWidth});

        _vertical_scroller_height = null;
        _horizontal_scroller_width = null;
        _panel_height = null;
        _panel_width = null;
        _content_height = null;
        _content_width = null;
        verticalScrollBarHeight = null;
        horizontalScrollBarWidth = null;
    };

    GRID.scroller = {
        init: init,
        resize: resize
    };

})();

//todo : 스크롤바 클릭하면 이동
//todo : 휠스크롤 & 터치 스크롤