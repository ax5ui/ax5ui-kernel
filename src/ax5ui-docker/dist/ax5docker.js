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
                var getDomProcessor = {
                    stack: function stack($parent, parent, panels) {
                        return jQuery('<div data-ax5docker-pane="">' + '<ul></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                    },
                    row: function row($parent, parent, panels) {
                        return jQuery('<div data-ax5docker-pane-axis="row"></div>');
                    },
                    column: function column($parent, parent, panels) {
                        return jQuery('<div data-ax5docker-pane-axis="column"></div>');
                    },
                    panel: function panel($parent, parent, panels) {
                        if (_parent.type == "stack") {
                            return $parent;
                        } else {
                            return jQuery('<div data-ax5docker-pane="">' + '<ul></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                        }
                    }
                };

                var appendProcessor = {
                    stack: function stack($parent, myself, parent) {

                        var $dom = jQuery('<div data-ax5docker-pane="">' + '<ul></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P) {
                                appendProcessor[P.type]($dom, P, myself);
                            });
                        }
                    },
                    panel: function panel($parent, myself, parent) {

                        var $dom = void 0,
                            $item = void 0;
                        if (parent.type == "stack") {
                            $item = jQuery('<div data-ax5docker-pane-item=""></div>');
                            $parent.find('[data-ax5docker-pane-item-views]').append($item);
                        } else {
                            $dom = jQuery('<div data-ax5docker-pane="">' + '<ul></ul>' + '<div data-ax5docker-pane-item-views=""></div>' + '</div>');
                            $item = jQuery('<div data-ax5docker-pane-item=""></div>');
                            // panel
                            $dom.find('[data-ax5docker-pane-item-views]').append($item);

                            $parent.append($dom);
                        }
                    },
                    row: function row($parent, myself, parent) {
                        if (!U.isArray(panels)) return false;
                        var $dom = jQuery('<div data-ax5docker-pane-axis="row"></div>');
                    },
                    columns: function columns($parent, myself, parent) {
                        if (!U.isArray(panels)) return false;
                        return jQuery('<div data-ax5docker-pane-axis="column"></div>');
                    }
                };

                var $root = jQuery('<div data-ax5docker-panes=""></div>');
                appendProcessor[_this.panels[0].type]($root, _this.panels[0], null);

                _this.$target.html($root);
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