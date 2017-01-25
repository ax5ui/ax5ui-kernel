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
            this.$panels = [];

            cfg = this.config;


            let repaintPanels = () => {
                let appendProcessor = {
                    stack($parent, myself, parent){
                        let $dom;

                        $dom = jQuery('<div data-ax5docker-pane="">' +
                            '<ul data-ax5docker-pane-tabs=""></ul>' +
                            '<div data-ax5docker-pane-item-views=""></div>' +
                            '</div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P) {
                                appendProcessor[P.type]($dom, P, myself);
                            });
                        }
                    },
                    panel($parent, myself, parent){
                        let $dom, $item, $label;

                        $label = jQuery('<li>' + myself.name + '</li>');
                        $item = jQuery('<div data-ax5docker-pane-item=""></div>');

                        if (parent.type == "stack") {
                            $parent.find('[data-ax5docker-pane-tabs]').append($label);
                            $parent.find('[data-ax5docker-pane-item-views]').append($item);
                        } else {
                            $dom = jQuery('<div data-ax5docker-pane="">' +
                                '<ul data-ax5docker-pane-tabs=""></ul>' +
                                '<div data-ax5docker-pane-item-views=""></div>' +
                                '</div>');

                            $dom.find('[data-ax5docker-pane-tabs]').append($label);
                            $dom.find('[data-ax5docker-pane-item-views]').append($item);

                            $parent.append($dom);
                        }
                    },
                    row($parent, myself, parent){
                        let $dom;

                        $dom = jQuery('<div data-ax5docker-pane-axis="row"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P) {
                                appendProcessor[P.type]($dom, P, myself);
                            });
                        }
                    },
                    columns($parent, myself, parent){
                        let $dom;

                        $dom = jQuery('<div data-ax5docker-pane-axis="column"></div>');
                        $parent.append($dom);

                        if (U.isArray(myself.panels)) {
                            myself.panels.forEach(function (P) {
                                appendProcessor[P.type]($dom, P, myself);
                            });
                        }
                    }
                };


                let $root = jQuery('<div data-ax5docker-panes=""></div>');
                appendProcessor[this.panels[0].type]($root, this.panels[0], null);

                this.$target.html($root);
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
            this.main = (function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);

        };

        return ax5docker;
    })());

})();