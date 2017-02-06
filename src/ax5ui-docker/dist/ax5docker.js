"use strict";

/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

(function () {

    var UI = ax5.ui,
        U = ax5.util;

    UI.addClass({
        className: "docker",
        version: "1.3.87"
    }, function () {

        /**
         * @class ax5docker
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var ax5docker = new ax5.ui.ax5docker();
         * ```
         */
        var ax5docker = function ax5docker() {
            var _this = this;

            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                columnKeys: {},
                control: {},
                icons: {
                    close: 'X',
                    more: '...'
                }
            };
            // 패널 정보
            this.panels = [];
            this.panelId = 0;

            // 패널의 컨텐츠 모듈
            this.modules = {};

            cfg = this.config;

            var getPanelId = function getPanelId() {
                return _this.panelId++;
            },
                defaultModule = {
                init: function init(container, state) {
                    container["$element"].html(state.name);
                },
                active: function active(container, state) {},
                deactive: function deactive(container, state) {},
                destroy: function destroy(container, state) {}
            },
                getPanelPath = function getPanelPath(parent, pIndex) {
                var paths = [];
                if (parent && typeof parent.panelPath !== "undefined") {
                    paths.push(parent.panelPath);
                }

                paths.push('panels[' + (pIndex || 0) + ']');
                return paths.join(".");
            },
                getPanel = function getPanel(_panelPath) {
                var path = [],
                    _path = U.isArray(_panelPath) ? [].concat(_panelPath) : [].concat(_panelPath.split(/[\.\[\]]/g));

                _path.forEach(function (n) {
                    if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                });

                try {
                    return Function("", "return this" + path.join('') + ";").call(_this);
                } catch (e) {
                    return;
                }
            },
                getParentPanel = function getParentPanel(_panelPath) {
                var path = [],
                    _path = U.isArray(_panelPath) ? [].concat(_panelPath) : [].concat(_panelPath.split(/[\.\[\]]/g));
                _path.pop();
                _path.forEach(function (n) {
                    if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                });

                try {
                    return Function("", "return this" + path.join('') + ";").call(_this);
                } catch (e) {
                    return;
                }
            },
                setPanel = function setPanel(_panelPath, _value) {
                var path = [],
                    _path = U.isArray(_panelPath) ? [].concat(_panelPath) : [].concat(_panelPath.split(/[\.\[\]]/g));

                _path.forEach(function (n) {
                    if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                });

                return Function("val", "return this" + path.join('') + " = val;").call(_this, _value);
            };

            var controlPanel = function controlPanel(_panel, _control) {
                var moduleState = jQuery.extend(_panel.moduleState, {
                    name: _panel.name
                }),
                    moduleContainer = {
                    '$element': _panel.$item
                },
                    module = void 0;

                var processor = {
                    init: function init() {
                        _panel.builded = true;
                        module = _panel.moduleName in _this.modules && 'init' in _this.modules[_panel.moduleName] ? _this.modules[_panel.moduleName] : defaultModule;
                        module.init(moduleContainer, moduleState);
                    },
                    active: function active() {
                        _panel.active = true;
                        _panel.$label.addClass("active");
                        _panel.$item.addClass("active");
                        module = _panel.moduleName in _this.modules && 'active' in _this.modules[_panel.moduleName] ? _this.modules[_panel.moduleName] : defaultModule;
                        module.active(moduleContainer, moduleState);
                    },
                    deactive: function deactive() {
                        _panel.active = false;
                        _panel.$label.removeClass("active");
                        _panel.$item.removeClass("active");
                        module = _panel.moduleName in _this.modules && 'deactive' in _this.modules[_panel.moduleName] ? _this.modules[_panel.moduleName] : defaultModule;
                        module.deactive(moduleContainer, moduleState);
                    },
                    destroy: function destroy() {
                        module = _panel.moduleName in _this.modules && 'destroy' in _this.modules[_panel.moduleName] ? _this.modules[_panel.moduleName] : defaultModule;
                        module.destroy(moduleContainer, moduleState);

                        // 패널 데이터 제거.
                        setPanel(_panel.panelPath, null);
                        // 현재 패널 정보를 검사하여 패널 정보를 재 구성합니다.
                        arrangePanel();
                    }
                };

                // 사용자정의 함수 control.before, control.after에 전달할 인자 = that
                var that = {
                    panel: _panel,
                    controlType: _control
                };

                // 비동기 처리 상황에 대응하기 위해 runProcessor를 별도 처리
                var runProcessor = function runProcessor() {
                    processor[_control]();
                    module = null;

                    if (U.isFunction(cfg.control.after)) {
                        cfg.control.after.call(that, that);
                    }
                };

                if (processor[_control]) {
                    if (U.isFunction(cfg.control.before)) {
                        cfg.control.before.call(that, that, function () {
                            runProcessor();
                        });
                    } else {
                        runProcessor();
                    }
                }
            };

            var repaintPanels = function repaintPanels() {
                var appendProcessor = {
                    stack: function stack($parent, parent, myself, pIndex) {

                        var $dom = void 0,
                            activeIndex = -1;
                        myself.panelPath = getPanelPath(parent, pIndex);

                        $dom = jQuery('<div data-ax5docker-pane="" data-ax5docker-path="' + myself.panelPath + '">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-tabs-aside="">' + cfg.icons.more + '</div>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, pIndex) {
                                if (P.active) activeIndex = pIndex;
                            });
                            if (activeIndex === -1) activeIndex = 0;
                            myself.panels[activeIndex].active = true;

                            myself.panels.forEach(function (P, _pIndex) {
                                P.panelIndex = _pIndex;
                                appendProcessor[P.type]($dom, myself, P, _pIndex);
                            });
                        }

                        $dom = null;
                        activeIndex = null;
                    },
                    panel: function panel($parent, parent, myself, pIndex) {
                        var $dom = void 0;
                        myself.panelPath = getPanelPath(parent, pIndex);
                        myself.$label = jQuery('<li data-ax5docker-pane-tab="' + pIndex + '" data-ax5docker-path="' + myself.panelPath + '">' + '<div class="title">' + myself.name + '</div>' + '<div class="close-icon">' + cfg.icons.close + '</div>' + '</li>');

                        if (!myself.$item) {
                            myself.$item = jQuery('<div data-ax5docker-pane-item="' + pIndex + '" data-ax5docker-pane-id="' + getPanelId() + '" data-ax5docker-path="' + myself.panelPath + '"></div>');
                        }

                        if (parent && parent.type == "stack") {
                            if (myself.active) {
                                if (!myself.builded) controlPanel(myself, "init");
                                controlPanel(myself, "active");
                            }
                            $parent.find('[data-ax5docker-pane-tabs]').append(myself.$label);
                            $parent.find('[data-ax5docker-pane-item-views]').append(myself.$item);
                        } else {
                            $dom = jQuery('<div data-ax5docker-pane="" data-ax5docker-path="' + myself.panelPath + '">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-tabs-aside="">' + cfg.icons.more + '</div>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');

                            if (!myself.builded) controlPanel(myself, "init");
                            controlPanel(myself, "active");

                            $dom.find('[data-ax5docker-pane-tabs]').append(myself.$label);
                            $dom.find('[data-ax5docker-pane-item-views]').append(myself.$item);

                            $parent.append($dom);
                        }

                        $dom = null;
                    },
                    resizeHandle: function resizeHandle($parent, parent, myself) {
                        var $dom = jQuery('<div data-ax5docker-resize-handle=""></div>');
                        $parent.append($dom);
                        $dom = null;
                    },
                    row: function row($parent, parent, myself, pIndex) {
                        var $dom = void 0;
                        myself.panelPath = getPanelPath(parent, pIndex);
                        if (parent && parent.type == "stack") {
                            throw "The 'stack' type child nodes are allowed only for the 'panel' type.";
                        }
                        $dom = jQuery('<div data-ax5docker-pane-axis="row" data-ax5docker-path="' + myself.panelPath + '"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, _pIndex) {
                                if (_pIndex > 0) appendProcessor["resizeHandle"]($dom, P, myself, _pIndex);
                                P.panelIndex = _pIndex;
                                appendProcessor[P.type]($dom, myself, P, _pIndex);
                            });
                        }

                        $dom = null;
                    },
                    column: function column($parent, parent, myself, pIndex) {
                        var $dom = void 0;
                        myself.panelPath = getPanelPath(parent, pIndex);
                        if (parent && parent.type == "stack") {
                            throw "The 'stack' type child nodes are allowed only for the 'panel' type.";
                        }
                        $dom = jQuery('<div data-ax5docker-pane-axis="column" data-ax5docker-path="' + myself.panelPath + '"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, _pIndex) {
                                if (pIndex > 0) appendProcessor["resizeHandle"]($dom, P, myself, _pIndex);
                                P.panelIndex = _pIndex;
                                appendProcessor[P.type]($dom, myself, P, _pIndex);
                            });
                        }

                        $dom = null;
                    }
                };

                var $root = jQuery('<div data-ax5docker-panes=""></div>');
                if (_this.panels[0]) appendProcessor[_this.panels[0].type]($root, null, _this.panels[0], 0);
                _this.$target.html($root);

                _this.$target.off("click").on("click", "[data-ax5docker-pane-tab] .close-icon", function (e) {
                    closePanel($(this).parents('[data-ax5docker-pane-tab]'));
                    U.stopEvent(e);
                }).on("click", "[data-ax5docker-pane-tab]", function (e) {
                    changeActiveStackPanel(this);
                    U.stopEvent(e);
                });

                // stackPane tabs 스크롤처리
                alignStackPane();
                $root = null;
            };

            /**
             * 액티브 패널 변경(stack인 상황에서)
             * @param clickedLabel
             * @returns {boolean}
             */
            var changeActiveStackPanel = function changeActiveStackPanel(clickedLabel) {
                var $clickedLabel = jQuery(clickedLabel),
                    $pane = $clickedLabel.parents('[data-ax5docker-pane]'),
                    labelIndex = $clickedLabel.attr("data-ax5docker-pane-tab"),
                    pane = getPanel($pane.attr("data-ax5docker-path")),
                    panel = getPanel($clickedLabel.attr("data-ax5docker-path"));

                if ($clickedLabel.hasClass("active")) {
                    return false;
                } else {
                    for (var p = 0, pl = pane.panels.length; p < pl; p++) {
                        if (pane.panels[p].active) {
                            controlPanel(pane.panels[p], "deactive");
                        }
                    }

                    if (!panel.builded) controlPanel(panel, "init");
                    controlPanel(panel, "active");
                }
                return _this;
            };

            /**
             * 패널 삭제하기
             * @param clickedLabel
             * @returns {ax5docker}
             */
            var closePanel = function closePanel(clickedLabel) {
                var $clickedLabel = jQuery(clickedLabel),
                    panelPath = $clickedLabel.attr("data-ax5docker-path"),
                    panel = getPanel(panelPath);

                controlPanel(panel, "destroy");
                return _this;
            };

            /**
             * stack type panel resize되면 탭 스크롤 처리 관련 처리
             */
            var debounceFn = ax5.util.debounce(function (fn) {
                fn();
            }, cfg.animateTime);

            var alignStackPane = function alignStackPane() {
                debounceFn(function () {
                    this.$target.find('[data-ax5docker-pane-tabs]').each(function () {
                        var $this = jQuery(this).parent();
                        if (this.scrollWidth > this.clientWidth) {
                            $this.addClass("tabs-scrolled");
                        } else {
                            $this.removeClass("tabs-scrolled");
                        }
                        $this = null;
                    });
                }.bind(_this));
            };

            /**
             * 패널중에 null이 된 요소를 찾아 panels를 정리 합니다.
             * @returns {*}
             */
            var arrangePanel = function arrangePanel() {
                // console.log(this.$target.find('[data-ax5docker-pane]'));
                var panels = [];
                var processor = {
                    stack: function stack(myself) {
                        if (!U.isArray(myself.panels)) return false;

                        var newObj = {
                            type: "stack",
                            panels: []
                        };

                        myself.panels.forEach(function (P, _pIndex) {
                            if (P) {
                                newObj.panels.push(P);
                            }
                        });

                        if (newObj.panels.length < 2) {
                            newObj = newObj.panels[0];
                        }

                        if (U.isArray(newObj.panels)) {
                            for (var p = 0, pl = newObj.panels.length; p < pl; p++) {
                                newObj.panels[p] = processor[newObj.panels[p].type](newObj.panels[p]);
                            }
                        }

                        return newObj;
                    },
                    panel: function panel(myself) {
                        //console.log(myself);
                        return myself;
                    },
                    row: function row(myself) {

                        if (!U.isArray(myself.panels)) return false;

                        var newObj = {
                            type: "row",
                            panels: []
                        };

                        myself.panels.forEach(function (P, _pIndex) {
                            if (P) {
                                newObj.panels.push(P);
                            }
                        });

                        if (newObj.panels.length < 2) {
                            newObj = newObj.panels[0];
                        }

                        if (U.isArray(newObj.panels)) {
                            for (var p = 0, pl = newObj.panels.length; p < pl; p++) {
                                newObj.panels[p] = processor[newObj.panels[p].type](newObj.panels[p]);
                            }
                        }

                        return newObj;
                    },
                    column: function column(myself) {
                        if (!U.isArray(myself.panels)) return false;

                        var newObj = {
                            type: "column",
                            panels: []
                        };

                        myself.panels.forEach(function (P, _pIndex) {
                            if (P) {
                                newObj.panels.push(P);
                            }
                        });

                        if (newObj.panels.length < 2) {
                            newObj = newObj.panels[0];
                        }

                        if (U.isArray(newObj.panels)) {
                            for (var p = 0, pl = newObj.panels.length; p < pl; p++) {
                                newObj.panels[p] = processor[newObj.panels[p].type](newObj.panels[p]);
                            }
                        }

                        return newObj;
                    }
                };

                if (_this.panels[0]) {
                    _this.panels[0] = processor[_this.panels[0].type](_this.panels[0]);
                } else {
                    _this.panels = [];
                }

                repaintPanels();
            };

            /**
             * @method ax5docker.setConfig
             * @param {Object} config
             * @param {Array} config.panels
             */
            this.init = function (_config) {
                cfg = jQuery.extend(true, {}, cfg, _config);
                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5docker", "401", "init"));
                    return this;
                }
                // memory target
                this.$target = jQuery(cfg.target);
                // set panels
                this.panels = cfg.panels || [];
                // event Functions
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                this.onLoad = cfg.onLoad;
                this.onDataChanged = cfg.onDataChanged;

                jQuery(window).bind("resize.ax5docker-" + this.id, function () {
                    // stackPane tabs 스크롤처리
                    alignStackPane();
                });
            };

            /**
             * @method ax5docker.setPanels
             * @returns {ax5docker}
             */
            this.setPanels = function (_panels) {
                // set panels
                this.panels = _panels || [];

                // 패널 다시 그리기
                repaintPanels();
                return this;
            };

            /**
             * @method ax5docker.addModule
             * @param modules
             * @returns {ax5docker}
             */
            this.addModule = function (modules) {
                if (U.isObject(modules)) {
                    jQuery.extend(true, this.modules, modules);
                }
                return this;
            };

            /**
             * repaint panels of docker
             * @method ax5docker.repaint
             * @returns {ax5docker}
             */
            this.repaint = function () {
                // 패널 다시 그리기
                repaintPanels();
                return this;
            };

            /**
             * @method ax5docker.addPanel
             * @param {String} _addPath - Position path to add panel
             * @param _addType
             * @param _panel
             * @param _panelIndex
             * @returns {ax5docker}
             * @example
             * ```js
             * myDocker.addPanel('0.1', 'stack', {type:'panel', name:'addPanel', moduleName: 'content'});
             *
             * ```
             */
            this.addPanel = function (_addPath, _addType, _panel, _panelIndex) {
                if (_addPath == "undefined") _addPath = "0";
                _addPath = _addPath.replace(/[a-zA-Z\[\]]+/g, "").replace(/(\d+)/g, function (a, b) {
                    return "panels[" + a + "]";
                });

                //_addPath = [].concat(_addPath.split(/[\.]/g));
                var pane = getPanel(_addPath);

                console.log(pane);

                var panelProcessor = {
                    "stack": function stack(_pane, _addType, _panel) {
                        var copyPanel = jQuery.extend({}, _pane),
                            addProcessor = {
                            "stack": function stack(_pane, _panel) {
                                _pane.panels.push(_panel);
                                arrangePanel();
                            },
                            "row-left": function rowLeft(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(_panel);
                                    _pane.panels.push(copyPanel);
                                    arrangePanel();
                                }
                            },
                            "row-right": function rowRight(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(copyPanel);
                                    _pane.panels.push(_panel);
                                    arrangePanel();
                                }
                            },
                            "column-top": function columnTop(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "column") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "column",
                                        panels: []
                                    });
                                    _pane.panels.push(_panel);
                                    _pane.panels.push(copyPanel);
                                    arrangePanel();
                                }
                            },
                            "column-bottom": function columnBottom(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "column") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "column",
                                        panels: []
                                    });
                                    _pane.panels.push(copyPanel);
                                    _pane.panels.push(_panel);
                                    arrangePanel();
                                }
                            }
                        };
                        if (_addType in addProcessor) {
                            addProcessor[_addType].call(this, _pane, _panel);
                        }

                        copyPanel = null;
                        addProcessor = null;
                    },
                    "row": function row(_pane, _addType, _panel, _panelIndex) {
                        var copyPanel = jQuery.extend({}, _pane);
                        var addProcessor = {
                            "stack": function stack(_pane, _panel) {
                                // 처리 할 수 없는 상황 첫번째 자식을 찾아 재 요청
                                if (_pane.panels[0] && _pane.panels[0].panelPath) {
                                    this.addPanel(_pane.panels[0].panelPath, _addType, _panel);
                                }
                            },
                            "row-left": function rowLeft(_pane, _panel, _panelIndex) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    _pane.panels.splice(_panelIndex, 0, _panel);
                                    arrangePanel();
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(_panel);
                                    _pane.panels.push(copyPanel);
                                    arrangePanel();
                                }
                            },
                            "row-right": function rowRight(_pane, _panel, _panelIndex) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    _pane.panels.splice(_panelIndex + 1, 0, _panel);
                                    arrangePanel();
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(copyPanel);
                                    _pane.panels.push(_panel);
                                    arrangePanel();
                                }
                            },
                            "column-top": function columnTop(_pane, _panel, _panelIndex) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "column") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "column",
                                        panels: []
                                    });
                                    _pane.panels.push(_panel);
                                    _pane.panels.push(copyPanel);
                                    arrangePanel();
                                }
                            },
                            "column-bottom": function columnBottom(_pane, _panel, _panelIndex) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "column") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "column",
                                        panels: []
                                    });
                                    _pane.panels.push(copyPanel);
                                    _pane.panels.push(_panel);
                                    arrangePanel();
                                }
                            }
                        };
                        if (_addType in addProcessor) {
                            addProcessor[_addType].call(this, _pane, _panel, _panelIndex);
                        }

                        addProcessor = null;
                        copyPanel = null;
                    },
                    "column": function column(_pane, _addType, _panel, _panelIndex) {
                        var copyPanel = jQuery.extend({}, _pane);
                        var addProcessor = {
                            "stack": function stack(_pane, _panel) {
                                if (_pane.panels[0] && _pane.panels[0].panelPath) {
                                    this.addPanel(_pane.panels[0].panelPath, _addType, _panel);
                                }
                            },
                            "row-left": function rowLeft(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(_panel);
                                    _pane.panels.push(copyPanel);
                                    arrangePanel();
                                }
                            },
                            "row-right": function rowRight(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(copyPanel);
                                    _pane.panels.push(_panel);
                                    arrangePanel();
                                }
                            },
                            "column-top": function columnTop(_pane, _panel) {
                                _pane.panels.splice(_panelIndex, 0, _panel);
                                arrangePanel();
                            },
                            "column-bottom": function columnBottom(_pane, _panel) {
                                _pane.panels.splice(_panelIndex + 1, 0, _panel);
                                arrangePanel();
                            }
                        };
                        if (_addType in addProcessor) {
                            addProcessor[_addType].call(this, _pane, _panel);
                        }

                        addProcessor = null;
                        copyPanel = null;
                    },
                    "panel": function panel(_pane, _addType, _panel) {
                        var copyPanel = jQuery.extend({}, _pane),
                            addProcessor = {
                            "stack": function stack(_pane, _panel) {
                                // _pane stack으로 재구성
                                _pane = setPanel(_addPath, {
                                    type: "stack",
                                    panels: []
                                });
                                _pane.panels.push(copyPanel);
                                _pane.panels.push(_panel);
                                arrangePanel();
                            },
                            "row-left": function rowLeft(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(_panel);
                                    _pane.panels.push(copyPanel);
                                    arrangePanel();
                                }
                            },
                            "row-right": function rowRight(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "row") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "row",
                                        panels: []
                                    });
                                    _pane.panels.push(copyPanel);
                                    _pane.panels.push(_panel);
                                    arrangePanel();
                                }
                            },
                            "column-top": function columnTop(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "column") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "column",
                                        panels: []
                                    });
                                    _pane.panels.push(_panel);
                                    _pane.panels.push(copyPanel);
                                    arrangePanel();
                                }
                            },
                            "column-bottom": function columnBottom(_pane, _panel) {
                                var parentPath = _addPath.substr(0, _addPath.lastIndexOf("."));
                                var parentPane = getPanel(parentPath);
                                if (parentPane.type == "column") {
                                    this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                } else {
                                    _pane = setPanel(_addPath, {
                                        type: "column",
                                        panels: []
                                    });
                                    _pane.panels.push(copyPanel);
                                    _pane.panels.push(_panel);
                                    arrangePanel();
                                }
                            }
                        };

                        if (_addType in addProcessor) {
                            addProcessor[_addType].call(this, _pane, _panel);
                        }

                        copyPanel = null;
                        addProcessor = null;
                    }
                };

                panelProcessor[pane.type].call(this, pane, _addType, _panel, _panelIndex);
                return this;
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };

        return ax5docker;
    }());
})();

// todo : active 된 패널만 표시하기 -- ok
// todo : row > stack 구현 -- ok
// todo : stack 패널 active change -- ok
// todo : 패널삭제하기 -- ok ~ active 패널 정리.. -- ok
// todo : 패널추가하기 -- ok
// todo : 패널 스플릿 리사이즈
// todo : stack tab overflow 처리. -- ok (탭 포커싱와 탭 목록 메뉴 처리전)
// todo : 패널 drag & drop

// ax5.ui.docker.tmpl
(function () {

    var DOCKER = ax5.ui.docker;

    var panels = function panels(columnKeys) {
        return " \n{{#panels}}\n{{#panels}}\n{{/panels}}\n{{^panels}}\n{{/panels}}\n{{/panels}}\n        ";
    };

    DOCKER.tmpl = {
        "panels": panels,
        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(DOCKER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();