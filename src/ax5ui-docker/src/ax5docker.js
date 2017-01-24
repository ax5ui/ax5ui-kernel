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
                let getPanelProcessor = {
                    stack(_pane, _parent){
                        return jQuery('<div data-ax5docker-pane="">' +
                            '<ul></ul>' +
                            '<div data-ax5docker-pane-item-views=""></div>' +
                            '</div>');
                    },
                    row(_pane, _parent){
                        return jQuery('<div data-ax5docker-pane-axis="row"></div>');
                    },
                    column(_pane, _parent){
                        return jQuery('<div data-ax5docker-pane-axis="column"></div>');
                    },
                    panel(_pane, _parent){
                        if (_parent.type == "stack") {
                            return {
                                name: _pane.name,
                                header: _pane.header,
                                body: _pane.body
                            }
                        }
                        else {
                            return jQuery('<div data-ax5docker-pane="">' +
                                '<ul></ul>' +
                                '<div data-ax5docker-pane-item-views=""></div>' +
                                '</div>');
                        }
                    }
                };

                // $parent dom 으로 삽입하는 방식으로 변경해야 하겠음..
                let getPanels = (panels, parent) => {
                    let $dom;
                    let $childs;
                    if (panels && panels.length) {
                        for (let pi = 0, pl = panels.length; pi < pl; pi++) {
                            $dom = getPanelProcessor[panels[pi].type](panels[pi], parent);
                            if (parent == null || parent.type !== "stack") {
                                $childs = getPanels(panels[pi].panels, panels[pi]);
                                if ($childs) $dom.append($childs);
                            } else {
                                // 
                                console.log("stack type");
                                console.log($dom);
                            }
                        }

                        return $dom;
                    } else {
                        return false;
                    }
                };

                let $dom = jQuery('<div data-ax5docker-panes=""></div>');
                $dom.append(getPanels(this.panels, null));
                this.$target.html($dom);
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