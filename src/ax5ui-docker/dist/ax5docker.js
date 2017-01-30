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
        version: "${VERSION}"
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
                columnKeys: {}
            };
            // 패널 정보
            this.panels = [];
            this.panelId = 0;

            // 패널의 컨텐츠 모듈
            this.modules = {};

            cfg = this.config;

            var getPanelId = function getPanelId() {
                return _this.panelId++;
            };

            var defaultModuleInit = function defaultModuleInit(container, state) {
                container["$element"].html(state.name);
            };

            var getPanelPath = function getPanelPath(parent, pIndex) {
                var paths = [];
                if (parent && typeof parent.panelPath !== "undefined") {
                    paths.push(parent.panelPath);
                }

                paths.push('panels[' + (pIndex || 0) + ']');
                return paths.join(".");
            };

            var getPanel = function getPanel(_root, _panelPath) {
                var path = [],
                    _path = [].concat(_panelPath.split(/[\.\[\]]/g));
                _path.forEach(function (n) {
                    if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                });

                // return (Function("val", "this" + _path.join('') + " = val;")).call(this.model, value);
                return Function("", "return this" + path.join('') + ";").call(_root);
            };

            var buildPanel = function buildPanel(_panel) {
                var moduleState = jQuery.extend(_panel.moduleState, {
                    name: _panel.name
                }),
                    moduleContainer = {
                    '$element': _panel.$item
                };

                _panel.builded = true;
                if (_panel.moduleName in _this.modules && 'init' in _this.modules[_panel.moduleName]) {
                    _this.modules[_panel.moduleName].init(moduleContainer, moduleState);
                } else {
                    defaultModuleInit(moduleContainer, moduleState);
                }
            };

            var repaintPanels = function repaintPanels() {

                var appendProcessor = {
                    stack: function stack($parent, parent, myself, pIndex) {

                        var $dom = void 0,
                            activeIndex = -1;
                        myself.panelPath = getPanelPath(parent, pIndex);

                        $dom = jQuery('<div data-ax5docker-pane="" data-ax5docker-path="' + myself.panelPath + '">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, pIndex) {
                                if (myself.active) activeIndex = pIndex;
                            });
                            if (activeIndex === -1) activeIndex = 0;
                            myself.panels[activeIndex].active = true;

                            myself.panels.forEach(function (P, _pIndex) {
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
                                buildPanel(myself);
                                myself.$label.addClass("active");
                                myself.$item.addClass("active");
                            }
                            $parent.find('[data-ax5docker-pane-tabs]').append(myself.$label);
                            $parent.find('[data-ax5docker-pane-item-views]').append(myself.$item);
                        } else {
                            $dom = jQuery('<div data-ax5docker-pane="" data-ax5docker-path="' + myself.panelPath + '">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');

                            buildPanel(myself);
                            myself.$label.addClass("active");
                            myself.$item.addClass("active");

                            $dom.find('[data-ax5docker-pane-tabs]').append(myself.$label);
                            $dom.find('[data-ax5docker-pane-item-views]').append(myself.$item);

                            $parent.append($dom);
                        }

                        $dom = null;
                    },
                    resizeHandel: function resizeHandel($parent, parent, myself) {
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
                                if (_pIndex > 0) appendProcessor["resizeHandel"]($dom, P, myself, _pIndex);
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
                                if (pIndex > 0) appendProcessor["resizeHandel"]($dom, P, myself, _pIndex);
                                appendProcessor[P.type]($dom, myself, P, _pIndex);
                            });
                        }

                        $dom = null;
                    }
                };

                var $root = jQuery('<div data-ax5docker-panes=""></div>');
                appendProcessor[_this.panels[0].type]($root, null, _this.panels[0], 0);
                _this.$target.html($root);

                _this.$target.off("click").on("click", "[data-ax5docker-pane-tab] .close-icon", function (e) {
                    console.log("close icon");
                    U.stopEvent(e);
                }).on("click", "[data-ax5docker-pane-tab]", function (e) {
                    //console.log(e.originalEvent.target);
                    //console.log("click pane-tab");
                    //console.log($(this).parents('[data-ax5docker-pane]'));

                    changeActivePanel(this);

                    U.stopEvent(e);
                });
                $root = null;
            };

            var changeActivePanel = function changeActivePanel(clickedLabel) {
                var $clickedLabel = jQuery(clickedLabel),
                    $pane = $clickedLabel.parents('[data-ax5docker-pane]'),
                    labelIndex = $clickedLabel.attr("data-ax5docker-pane-tab");

                if ($clickedLabel.hasClass("active")) {
                    return false;
                } else {
                    $pane.find(".active").removeClass("active");
                    //labelIndex

                    $pane.find('[data-ax5docker-pane-tab="' + labelIndex + '"]').addClass("active");
                    $pane.find('[data-ax5docker-pane-item="' + labelIndex + '"]').addClass("active");

                    // let pane = getPanel(this, $pane.attr("data-ax5docker-path"));
                    // todo : build 여부 판단후 build 실행
                    var panel = getPanel(_this, $clickedLabel.attr("data-ax5docker-path"));
                    console.log(panel.builded);

                    buildPanel(panel);
                    // buildPanel 여부 판단.
                    //myself.$item 이 필요해..
                }
            };

            var closePanel = function closePanel() {};

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

            this.addModule = function (modules) {
                if (U.isObject(modules)) {
                    jQuery.extend(true, this.modules, modules);
                }
                return this;
            };

            this.repaint = function () {
                // 패널 다시 그리기
                repaintPanels();
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
// todo : resize
// todo : 패널 추가 / 삭제 / 재구성
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