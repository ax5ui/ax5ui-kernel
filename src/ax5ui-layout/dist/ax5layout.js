"use strict";

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.layout
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.layout
     * @classdesc
     * @version 0.1.0
     * @author tom@axisj.com
     * @example
     * ```
     * var myLayout = new ax5.ui.layout();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function axClass() {
        var self = this,
            cfg,
            ENM = {
            "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
            "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
            "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
        },
            getMousePosition = function getMousePosition(e) {
            var mouseObj = e;
            if ('changedTouches' in e) {
                mouseObj = e.changedTouches[0];
            }
            return {
                clientX: mouseObj.clientX,
                clientY: mouseObj.clientY
            };
        };

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.queue = [];
        this.config = {
            theme: 'default',
            animateTime: 250,
            splitter: {
                size: 4
            }
        };

        this.openTimer = null;
        this.closeTimer = null;
        this.resizer = null;

        cfg = this.config;

        var onStateChanged = function onStateChanged(opts, that) {
            if (opts && opts.onStateChanged) {
                opts.onStateChanged.call(that, that);
            } else if (this.onStateChanged) {
                this.onStateChanged.call(that, that);
            }
            return true;
        },
            alignLayoutAll = function alignLayoutAll() {
            var i = this.queue.length;
            while (i--) {
                if (typeof this.queue[i].parentQueIdx === "undefined") alignLayout.call(this, i);
            }
        },
            alignLayout = function () {

            var setCSS = {
                "top": function top(item, panel) {
                    panel.$target.css({ height: panel.__height || 0 });
                    if (panel.split) {
                        panel.$splitter.css({ height: cfg.splitter.size, top: panel.__height || 0 });
                    }
                },
                "bottom": function bottom(item, panel) {
                    panel.$target.css({ height: panel.__height || 0 });
                    if (panel.split) {
                        panel.$splitter.css({ height: cfg.splitter.size, bottom: panel.__height || 0 });
                    }
                },
                "left": function left(item, panel) {
                    var css = {
                        width: panel.__width || 0,
                        height: item.targetDimension.height
                    };

                    if (item.dockPanel.top) {
                        css.height -= item.dockPanel.top.__height;
                        css.top = item.dockPanel.top.__height;
                        if (item.dockPanel.top.split) {
                            css.height -= cfg.splitter.size;
                            css.top += cfg.splitter.size;
                        }
                    }
                    if (item.dockPanel.bottom) {
                        css.height -= item.dockPanel.bottom.__height;
                        if (item.dockPanel.bottom.split) {
                            css.height -= cfg.splitter.size;
                        }
                    }

                    panel.$target.css(css);

                    if (panel.split) {
                        panel.$splitter.css({ width: cfg.splitter.size, height: css.height, top: css.top, left: css.width });
                    }
                },
                "right": function right(item, panel) {
                    var css = {
                        width: panel.__width || 0,
                        height: item.targetDimension.height
                    };

                    if (item.dockPanel.top) {
                        css.height -= item.dockPanel.top.__height;
                        css.top = item.dockPanel.top.__height;
                        if (item.dockPanel.top.split) {
                            css.height -= cfg.splitter.size;
                            css.top += cfg.splitter.size;
                        }
                    }
                    if (item.dockPanel.bottom) {
                        css.height -= item.dockPanel.bottom.__height;
                        if (item.dockPanel.bottom.split) {
                            css.height -= cfg.splitter.size;
                        }
                    }

                    panel.$target.css(css);

                    if (panel.split) {
                        panel.$splitter.css({ width: cfg.splitter.size, height: css.height, top: css.top, right: css.width });
                    }
                },
                "center": function center(item, panel) {
                    var css = {
                        width: item.targetDimension.width,
                        height: item.targetDimension.height
                    };

                    if (item.dockPanel.top) {
                        css.height -= item.dockPanel.top.__height || 0;
                        css.top = item.dockPanel.top.__height || 0;
                        if (item.dockPanel.top.split) {
                            css.height -= cfg.splitter.size;
                            css.top += cfg.splitter.size;
                        }
                    }
                    if (item.dockPanel.bottom) {
                        css.height -= item.dockPanel.bottom.__height || 0;
                        if (item.dockPanel.bottom.split) {
                            css.height -= cfg.splitter.size;
                        }
                    }
                    if (item.dockPanel.left) {
                        css.width -= item.dockPanel.left.__width || 0;
                        css.left = item.dockPanel.left.__width || 0;
                        if (item.dockPanel.left.split) {
                            css.width -= cfg.splitter.size;
                            css.left += cfg.splitter.size;
                        }
                    }
                    if (item.dockPanel.right) {
                        css.width -= item.dockPanel.right.__width || 0;
                        if (item.dockPanel.right.split) {
                            css.width -= cfg.splitter.size;
                        }
                    }

                    panel.$target.css(css);
                }
            };
            var childResize = function childResize(item) {
                var i = item.childQueIdxs.length;
                while (i--) {
                    alignLayout.call(this, item.childQueIdxs[i]);
                }
            };

            return function (queIdx, callBack) {

                var item = this.queue[queIdx];

                // 레이아웃 타겟의 CSS속성을 미리 저장해 둡니다. 왜? 패널별로 크기 계산 할 때 쓰려고
                item.targetDimension = {
                    height: item.$target.innerHeight(),
                    width: item.$target.innerWidth()
                };

                // dockPanel
                if (item.layout == "dock-panel") {
                    for (var panel in item.dockPanel) {
                        if (item.dockPanel[panel].$target && item.dockPanel[panel].$target.get(0)) {
                            if (panel in setCSS) {
                                item.dockPanel[panel].split = item.dockPanel[panel].split && item.dockPanel[panel].split.toString() == "true";
                                setCSS[panel].call(this, item, item.dockPanel[panel]);
                            }
                        }
                    }
                }

                if (item.childQueIdxs) childResize.call(this, item);
                if (item.onResize) {
                    setTimeout(function () {
                        this.onResize.call(this, this);
                    }.bind(item), 1);
                }
                if (callBack) {
                    callBack.call(item, item);
                }
            };
        }(),
            resizeSplitter = {
            on: function on(queIdx, panel) {
                var item = this.queue[queIdx];
                var splitterOffset = panel.$splitter.offset();
                var splitterBox = {
                    width: panel.$splitter.width(), height: panel.$splitter.height()
                };
                var getResizerPosition = {
                    "left": function left(e) {
                        panel.__da = e.clientX - panel.mousePosition.clientX;
                        var minWidth = panel.minWidth || 0;
                        var maxWidth = panel.maxWidth || item.targetDimension.width - (item.dockPanel.left ? item.dockPanel.left.__width + (item.dockPanel.left.split ? cfg.splitter.size : 0) : 0) - (item.dockPanel.right ? item.dockPanel.right.__width + (item.dockPanel.right.split ? cfg.splitter.size : 0) : 0);

                        if (panel.__width + panel.__da < minWidth) {
                            panel.__da = -panel.__width + minWidth;
                        } else if (maxWidth < panel.__width + panel.__da) {
                            panel.__da = maxWidth - panel.__width;
                        }
                        return { left: panel.$splitter.offset().left + panel.__da };
                    },
                    "right": function right(e) {
                        panel.__da = e.clientX - panel.mousePosition.clientX;
                        var minWidth = panel.minWidth || 0;
                        var maxWidth = panel.maxWidth || item.targetDimension.width - (item.dockPanel.left ? item.dockPanel.left.__width + (item.dockPanel.left.split ? cfg.splitter.size : 0) : 0) - (item.dockPanel.right ? item.dockPanel.right.__width + (item.dockPanel.right.split ? cfg.splitter.size : 0) : 0);

                        if (panel.__width - panel.__da < minWidth) {
                            panel.__da = panel.__width - minWidth;
                        } else if (maxWidth < panel.__width - panel.__da) {
                            panel.__da = -maxWidth + panel.__width;
                        }
                        return { left: panel.$splitter.offset().left + panel.__da };
                    },
                    "top": function top(e) {
                        panel.__da = e.clientY - panel.mousePosition.clientY;
                        var minHeight = panel.minHeight || 0;
                        var maxHeight = panel.maxHeight || item.targetDimension.height - (item.dockPanel.top ? item.dockPanel.top.__height + (item.dockPanel.top.split ? cfg.splitter.size : 0) : 0) - (item.dockPanel.bottom ? item.dockPanel.bottom.__height + (item.dockPanel.bottom.split ? cfg.splitter.size : 0) : 0);

                        if (panel.__height + panel.__da < minHeight) {
                            panel.__da = -panel.__height + minHeight;
                        } else if (maxHeight < panel.__height + panel.__da) {
                            panel.__da = maxHeight - panel.__height;
                        }
                        return { top: panel.$splitter.offset().top + panel.__da };
                    },
                    "bottom": function bottom(e) {
                        panel.__da = e.clientY - panel.mousePosition.clientY;
                        var minHeight = panel.minHeight || 0;
                        var maxHeight = panel.maxHeight || item.targetDimension.height - (item.dockPanel.top ? item.dockPanel.top.__height + (item.dockPanel.top.split ? cfg.splitter.size : 0) : 0) - (item.dockPanel.bottom ? item.dockPanel.bottom.__height + (item.dockPanel.bottom.split ? cfg.splitter.size : 0) : 0);

                        if (panel.__height - panel.__da < minHeight) {
                            panel.__da = panel.__height - minHeight;
                        } else if (maxHeight < panel.__height - panel.__da) {
                            panel.__da = -maxHeight + panel.__height;
                        }
                        return { top: panel.$splitter.offset().top + panel.__da };
                    }
                };
                panel.__da = 0; // 패널의 변화량

                jQuery(document.body).bind(ENM["mousemove"] + ".ax5layout-" + this.instanceId, function (e) {
                    // console.log(e.clientX - panel.mousePosition.clientX);
                    if (!self.resizer) {
                        self.resizer = jQuery('<div class="ax5layout-resizer panel-' + panel.dock + '" ondragstart="return false;"></div>');
                        self.resizer.css({
                            left: splitterOffset.left,
                            top: splitterOffset.top,
                            width: splitterBox.width,
                            height: splitterBox.height
                        });
                        item.$target.append(self.resizer);
                    }
                    self.resizer.css(getResizerPosition[panel.dock](e));
                }).bind(ENM["mouseup"] + ".ax5layout-" + this.instanceId, function (e) {
                    resizeSplitter.off.call(self, queIdx, panel);
                }).bind("mouseleave.ax5layout-" + this.instanceId, function (e) {
                    resizeSplitter.off.call(self, queIdx, panel);
                });
            },
            off: function off(queIdx, panel) {

                var setPanelSize = {
                    "dock-panel": {
                        "left": function left(queIdx, panel) {
                            panel.__width += panel.__da;
                        },
                        "right": function right() {
                            panel.__width -= panel.__da;
                        },
                        "top": function top() {
                            panel.__height += panel.__da;
                        },
                        "bottom": function bottom() {
                            panel.__height -= panel.__da;
                        }
                    },
                    "split-panel": {},
                    "tab-panel": {}
                };

                if (self.resizer) {
                    self.resizer.remove();
                    self.resizer = null;
                    setPanelSize[this.queue[queIdx].layout][panel.dock].call(this, queIdx, panel);
                    alignLayout.call(this, queIdx);
                }

                jQuery(document.body).unbind(ENM["mousemove"] + ".ax5layout-" + this.instanceId).unbind(ENM["mouseup"] + ".ax5layout-" + this.instanceId).unbind("mouseleave.ax5layout-" + this.instanceId);
            }
        },
            bindLayoutTarget = function () {

            var applyLayout = {
                'dock-panel': function dockPanel(queIdx) {
                    var item = this.queue[queIdx],
                        outerSize = 0;
                    item.dockPanel = {};
                    item.$target.find('>[data-dock-panel]').each(function () {

                        var panelInfo = {};
                        (function (data) {
                            if (U.isObject(data) && !data.error) {
                                panelInfo = jQuery.extend(true, panelInfo, data);
                            }
                        })(U.parseJson(this.getAttribute("data-dock-panel"), true));

                        if ('dock' in panelInfo) {
                            panelInfo.$target = jQuery(this);
                            panelInfo.$target.addClass("dock-panel-" + panelInfo.dock);

                            if (panelInfo.split && panelInfo.split.toString() == "true") {
                                panelInfo.$splitter = jQuery('<div class="dock-panel-splitter dock-panel-' + panelInfo.dock + '"></div>');
                                panelInfo.$splitter.bind(ENM["mousedown"], function (e) {
                                    // console.log(e.clientX);
                                    panelInfo.mousePosition = getMousePosition(e);
                                    resizeSplitter.on.call(self, queIdx, panelInfo);
                                }).bind("dragstart", function (e) {
                                    U.stopEvent(e);
                                    return false;
                                });
                                item.$target.append(panelInfo.$splitter);
                                outerSize = 0;
                            }

                            if (panelInfo.dock == "top" || panelInfo.dock == "bottom") {
                                panelInfo.__height = panelInfo.height + outerSize;
                            } else {
                                panelInfo.__width = panelInfo.width + outerSize;
                            }

                            item.dockPanel[panelInfo.dock] = panelInfo;
                        }
                    });
                }
            };

            return function (queIdx) {
                var item = this.queue[queIdx];
                var data = {};

                // 부모 컨테이너가 ax5layout인지 판단 필요.
                if (item.$target.parents("[data-ax5layout]").get(0)) {
                    hooksResizeLayout.call(this, item.$target.parents("[data-ax5layout]").get(0), queIdx);
                }

                if (item.layout in applyLayout) {
                    applyLayout[item.layout].call(this, queIdx);
                }
                alignLayout.call(this, queIdx);
                //item.$target.find();
            };
        }(),
            getQueIdx = function getQueIdx(boundID) {
            if (!U.isString(boundID)) {
                boundID = jQuery(boundID).data("data-ax5layout-id");
            }
            if (!U.isString(boundID)) {
                console.log(ax5.info.getError("ax5layout", "402", "getQueIdx"));
                return;
            }
            return U.search(this.queue, function () {
                return this.id == boundID;
            });
        },
            hooksResizeLayout = function hooksResizeLayout(boundID, childQueIdx) {
            var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
            if (!this.queue[queIdx].childQueIdxs) this.queue[queIdx].childQueIdxs = [];
            this.queue[queIdx].childQueIdxs.push(childQueIdx);
            this.queue[childQueIdx].parentQueIdx = queIdx;
        };
        /// private end

        /**
         * Preferences of layout UI
         * @method ax5.ui.layout.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.layout}
         * @example
         * ```
         * ```
         */
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
            this.onClick = cfg.onClick;
            jQuery(window).bind("resize.ax5layout-" + this.instanceId, function () {
                alignLayoutAll.call(this);
                /*
                 setTimeout((function(){
                 alignLayoutAll.call(this);
                 }).bind(this), 100);
                 */
            }.bind(this));
        };

        /**
         * ax5.ui.layout.bind
         * @param {Object} item
         * @param {String} [item.layout]
         * @param {String} [item.theme]
         * @param {Element} item.target
         * @param {Object[]} item.options
         * @returns {ax5.ui.layout}
         */
        this.bind = function (item) {
            var UIConfig = {},
                queIdx;

            item = jQuery.extend(true, UIConfig, cfg, item);
            if (!item.target) {
                console.log(ax5.info.getError("ax5layout", "401", "bind"));
                return this;
            }

            item.$target = jQuery(item.target);

            if (!item.id) item.id = item.$target.data("data-ax5layout-id");
            if (!item.id) {
                item.id = 'ax5layout-' + ax5.getGuid();
                item.$target.data("data-ax5layout-id", item.id);
            }
            item.name = item.$target.attr("data-ax5layout");
            if (item.options) {
                item.options = JSON.parse(JSON.stringify(item.options));
            }

            // target attribute data
            (function (data) {
                if (U.isObject(data) && !data.error) {
                    item = jQuery.extend(true, item, data);
                }
            })(U.parseJson(item.$target.attr("data-config"), true));

            queIdx = U.search(this.queue, function () {
                return this.id == item.id;
            });

            if (queIdx === -1) {
                this.queue.push(item);
                bindLayoutTarget.call(this, this.queue.length - 1);
            } else {
                this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                bindLayoutTarget.call(this, queIdx);
            }

            UIConfig = null;
            queIdx = null;
            return this;
        };

        /**
         * ax5.ui.layout.align
         * @param boundID
         * @param {Function} [callBack]
         * @returns {ax5.ui.layout}
         */
        this.align = function (boundID, callBack) {
            var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
            if (queIdx === -1) {
                console.log(ax5.info.getError("ax5layout", "402", "align"));
                return;
            }
            alignLayout.call(this, queIdx, callBack);
            return this;
        };

        /**
         * ax5.ui.layout.onResize
         * @param boundID
         * @param fn
         * @returns {ax5.ui.layout}
         */
        this.onResize = function (boundID, fn) {
            var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
            if (queIdx === -1) {
                console.log(ax5.info.getError("ax5layout", "402", "onResize"));
                return;
            }
            this.queue[queIdx].onResize = fn;
            return this;
        };

        /**
         * ax5.ui.layout.resize
         * @param boundID
         * @param {Object} resizeOption
         * @param {Function} [callBack]
         * @returns {ax5.ui.layout}
         */
        this.resize = function () {

            var resizeLayoutPanel = {
                "dock-panel": function dockPanel(item, resizeOption) {
                    ["top", "bottom", "left", "right"].forEach(function (dock) {
                        if (resizeOption[dock] && item.dockPanel[dock]) {
                            if (dock == "top" || dock == "bottom") {
                                item.dockPanel[dock].__height = U.isObject(resizeOption[dock]) ? resizeOption[dock].height : resizeOption[dock];
                            } else if (dock == "left" || dock == "right") {
                                item.dockPanel[dock].__width = U.isObject(resizeOption[dock]) ? resizeOption[dock].width : resizeOption[dock];
                            }
                        }
                    });
                },
                "split-panel": function splitPanel() {},
                "tab-panel": function tabPanel() {}
            };

            return function (boundID, resizeOption, callBack) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5layout", "402", "resize"));
                    return;
                }

                resizeLayoutPanel[this.queue[queIdx].layout].call(this, this.queue[queIdx], resizeOption);
                alignLayout.call(this, queIdx, callBack);
                return this;
            };
        }();

        this.reset = function () {

            var resetLayoutPanel = {
                "dock-panel": function dockPanel(item) {
                    ["top", "bottom", "left", "right"].forEach(function (dock) {
                        if (item.dockPanel[dock]) {
                            if (dock == "top" || dock == "bottom") {
                                item.dockPanel[dock].__height = item.dockPanel[dock].height;
                            } else if (dock == "left" || dock == "right") {
                                item.dockPanel[dock].__width = item.dockPanel[dock].width;
                            }
                        }
                    });
                },
                "split-panel": function splitPanel() {},
                "tab-panel": function tabPanel() {}
            };

            return function (boundID, callBack) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5layout", "402", "reset"));
                    return;
                }

                resetLayoutPanel[this.queue[queIdx].layout].call(this, this.queue[queIdx]);
                alignLayout.call(this, queIdx, callBack);
                return this;
            };
        }();

        // 클래스 생성자
        this.main = function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            } else {
                this.init();
            }
        }.apply(this, arguments);
    };
    //== UI Class

    root.layout = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);

ax5.ui.layout_instance = new ax5.ui.layout();
jQuery.fn.ax5layout = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "align":
                    return ax5.ui.layout_instance.align(this, arguments[1]);
                    break;
                case "resize":
                    return ax5.ui.layout_instance.resize(this, arguments[1], arguments[2]);
                    break;
                case "reset":
                    return ax5.ui.layout_instance.reset(this, arguments[1]);
                    break;
                case "onResize":
                    return ax5.ui.layout_instance.onResize(this, arguments[1]);
                    break;

                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.layout_instance.bind(config);
            });
        }
        return this;
    };
}();