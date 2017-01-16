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

            };
            // 패널 정보
            this.panels = [];
            cfg = this.config;

            /**
             * @method ax5docker.setPanels
             * @returns {ax5docker}
             */
            this.setPanels = function (_panels) {
                
                console.log(_panels);
                
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