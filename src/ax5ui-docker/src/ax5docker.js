/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

(function () {

    let UI = ax5.ui,
        U = ax5.util;

    UI.addClass({
        className: "docker",
        version: "${VERSION}"
    }, (function () {

        /**
         * @class ax5docker
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var ax5docker = new ax5.ui.ax5docker();
         * ```
         */
        let ax5docker = function () {
            let self = this,
                cfg;

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

            const getPanelId = () => {
                return this.panelId++;
            };

            const defaultModuleInit = (container, state) => {
                container["$element"].html(state.name);
            };

            const repaintPanels = () => {

                const buildPanel = (_pane) => {
                    let moduleState = jQuery.extend(_pane.moduleState, {
                            name: _pane.name
                        }),
                        moduleContainer = {
                            '$element': _pane.$item
                        };

                    if (_pane.moduleName in this.modules && 'init' in this.modules[_pane.moduleName]) {
                        this.modules[_pane.moduleName].init(moduleContainer, moduleState);
                    } else {
                        defaultModuleInit(moduleContainer, moduleState);
                    }
                };

                const appendProcessor = {
                    stack($parent, parent, myself){
                        let $dom, activeIndex = -1;

                        $dom = jQuery('<div data-ax5docker-pane="">' +
                            '<ul data-ax5docker-pane-tabs=""></ul>' +
                            '<div data-ax5docker-pane-item-views=""></div>' +
                            '</div>');
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
                    panel($parent, parent, myself, pIndex){
                        let $dom, $item, $label;

                        $label = jQuery('<li data-ax5docker-pane-tab="' + pIndex + '">' +
                            '<div class="title">' + myself.name + '</div>' +
                            '<div class="close-icon">' + cfg.icons.close + '</div>' +
                            '</li>');

                        if (!myself.$item) {
                            myself.$item = jQuery('<div data-ax5docker-pane-item="' + pIndex + '" data-ax5docker-pane-id="' + getPanelId() + '"></div>');
                            buildPanel(myself);
                        }

                        if (parent && parent.type == "stack") {
                            if (myself.active) {
                                $label.addClass("active");
                                myself.$item.addClass("active");
                            }
                            $parent.find('[data-ax5docker-pane-tabs]').append($label);
                            $parent.find('[data-ax5docker-pane-item-views]').append(myself.$item);
                        } else {
                            $dom = jQuery('<div data-ax5docker-pane="">' +
                                '<ul data-ax5docker-pane-tabs=""></ul>' +
                                '<div data-ax5docker-pane-item-views=""></div>' +
                                '</div>');

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
                    resizeHandel($parent, parent, myself){
                        let $dom = jQuery('<div data-ax5docker-resize-handle=""></div>');
                        $parent.append($dom);
                        $dom = null;
                    },
                    row($parent, parent, myself){
                        let $dom;

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
                    column($parent, parent, myself){
                        let $dom;

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

                let $root = jQuery('<div data-ax5docker-panes=""></div>');
                appendProcessor[this.panels[0].type]($root, null, this.panels[0], 0);
                this.$target.html($root);

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

            this.addModule = function (modules) {
                if (U.isObject(modules)) {
                    jQuery.extend(true, this.modules, modules);
                }
                return this;
            };

            // 클래스 생성자
            this.main = (function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);

        };

        return ax5docker;
    })());

})();