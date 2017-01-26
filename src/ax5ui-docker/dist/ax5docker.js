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

            var repaintPanels = function repaintPanels() {
                var buildPanel = function buildPanel(_pane) {
                    var moduleState = jQuery.extend(_pane.moduleState, {
                        name: _pane.name
                    }),
                        moduleContainer = {
                        '$element': _pane.$item
                    };
                    if (_pane.moduleName in _this.modules && 'init' in _this.modules[_pane.moduleName]) {
                        _this.modules[_pane.moduleName].init(moduleContainer, moduleState);
                    } else {
                        defaultModuleInit(moduleContainer, moduleState);
                    }
                };

                var appendProcessor = {
                    stack: function stack($parent, parent, myself) {
                        var $dom = void 0,
                            activeIndex = -1;

                        $dom = jQuery('<div data-ax5docker-pane="">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, pIndex) {
                                if (myself.active) activeIndex = pIndex;
                            });
                            if (activeIndex === -1) activeIndex = 0;
                            myself.panels[activeIndex].active = true;

                            myself.panels.forEach(function (P, pIndex) {
                                appendProcessor[P.type]($dom, myself, P, pIndex);
                            });
                        }

                        $dom = null;
                        activeIndex = null;
                    },
                    panel: function panel($parent, parent, myself, pIndex) {
                        var $dom = void 0,
                            $item = void 0,
                            $label = void 0;

                        $label = jQuery('<li data-ax5docker-pane-tab="' + pIndex + '">' + '<div class="title">' + myself.name + '</div>' + '<div class="close-icon">' + cfg.icons.close + '</div>' + '</li>');

                        if (!myself.$item) {
                            myself.$item = jQuery('<div data-ax5docker-pane-item="' + pIndex + '" data-ax5docker-pane-id="' + getPanelId() + '"></div>');
                        }

                        if (parent && parent.type == "stack") {
                            if (myself.active) {
                                buildPanel(myself);
                                $label.addClass("active");
                                myself.$item.addClass("active");
                            }
                            $parent.find('[data-ax5docker-pane-tabs]').append($label);
                            $parent.find('[data-ax5docker-pane-item-views]').append(myself.$item);
                        } else {
                            $dom = jQuery('<div data-ax5docker-pane="">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');

                            buildPanel(myself);
                            $label.addClass("active");
                            myself.$item.addClass("active");

                            $dom.find('[data-ax5docker-pane-tabs]').append($label);
                            $dom.find('[data-ax5docker-pane-item-views]').append(myself.$item);

                            $parent.append($dom);
                        }

                        $dom = null;
                        $item = null;
                        $label = null;
                    },
                    resizeHandel: function resizeHandel($parent, parent, myself) {
                        var $dom = jQuery('<div data-ax5docker-resize-handle=""></div>');
                        $parent.append($dom);
                        $dom = null;
                    },
                    row: function row($parent, parent, myself) {
                        var $dom = void 0;
                        if (parent && parent.type == "stack") {
                            throw "The 'stack' type child nodes are allowed only for the 'panel' type.";
                        }
                        $dom = jQuery('<div data-ax5docker-pane-axis="row"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, pIndex) {
                                if (pIndex > 0) appendProcessor["resizeHandel"]($dom, P, myself);
                                appendProcessor[P.type]($dom, myself, P);
                            });
                        }

                        $dom = null;
                    },
                    column: function column($parent, parent, myself) {
                        var $dom = void 0;
                        if (parent && parent.type == "stack") {
                            throw "The 'stack' type child nodes are allowed only for the 'panel' type.";
                        }
                        $dom = jQuery('<div data-ax5docker-pane-axis="column"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, pIndex) {
                                if (pIndex > 0) appendProcessor["resizeHandel"]($dom, P, myself);
                                appendProcessor[P.type]($dom, myself, P);
                            });
                        }

                        $dom = null;
                    }
                };

                var $root = jQuery('<div data-ax5docker-panes=""></div>');
                appendProcessor[_this.panels[0].type]($root, null, _this.panels[0], 0);
                _this.$target.html($root);

                $root = null;
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
// todo : stack 패널 active change
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