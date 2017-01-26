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
            this.$panels = [];

            cfg = this.config;

            var repaintPanels = function repaintPanels() {

                var appendProcessor = {
                    stack: function stack($parent, myself, parent) {
                        var $dom = void 0;

                        $dom = jQuery('<div data-ax5docker-pane="">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P) {
                                appendProcessor[P.type]($dom, P, myself);
                            });
                        }

                        $dom = null;
                    },
                    panel: function panel($parent, myself, parent) {
                        var $dom = void 0,
                            $item = void 0,
                            $label = void 0;

                        $label = jQuery('<li>' + myself.name + '</li>');
                        $item = jQuery('<div data-ax5docker-pane-item=""></div>');

                        if (parent.type == "stack") {
                            $parent.find('[data-ax5docker-pane-tabs]').append($label);
                            $parent.find('[data-ax5docker-pane-item-views]').append($item);
                        } else {
                            $dom = jQuery('<div data-ax5docker-pane="">' + '<ul data-ax5docker-pane-tabs=""></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');

                            $dom.find('[data-ax5docker-pane-tabs]').append($label);
                            $dom.find('[data-ax5docker-pane-item-views]').append($item);

                            $parent.append($dom);
                        }

                        $dom = null;
                        $item = null;
                        $label = null;
                    },
                    resizeHandel: function resizeHandel($parent, myself, parent) {
                        var $dom = jQuery('<div data-ax5docker-resize-handle=""></div>');
                        $parent.append($dom);
                        $dom = null;
                    },
                    row: function row($parent, myself, parent) {
                        var $dom = void 0;

                        $dom = jQuery('<div data-ax5docker-pane-axis="row"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P, pIndex) {
                                if (pIndex > 0) {
                                    appendProcessor["resizeHandel"]($dom, P, myself);
                                }
                                appendProcessor[P.type]($dom, P, myself);
                            });
                        }

                        $dom = null;
                    },
                    columns: function columns($parent, myself, parent) {
                        var $dom = void 0;

                        $dom = jQuery('<div data-ax5docker-pane-axis="column"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P) {
                                appendProcessor[P.type]($dom, P, myself);
                            });
                        }

                        $dom = null;
                    }
                };

                var $root = jQuery('<div data-ax5docker-panes=""></div>');
                appendProcessor[_this.panels[0].type]($root, _this.panels[0], null);
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

                // 패널 다시 그리기
                repaintPanels();
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