"use strict";

// ax5.ui.palette
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var PALETTE = void 0;

    UI.addClass({
        className: "palette",
        version: "${VERSION}"
    }, function () {

        /**
         * @class ax5palette
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * ```
         */
        return function () {
            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.target = null;

            this.config = {
                clickEventName: "click",
                theme: 'default',
                animateTime: 100
            };

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
            };

            /**
             * Preferences of palette UI
             * @method ax5palette.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Element|nodelist} config.target
             * @returns {ax5palette}
             * @example
             * ```js
             * ```
             */
            //== class body start
            this.init = function () {
                // after setConfig();

                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;

                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5palette", "401", "setConfig"));
                }
                this.target = jQuery(cfg.target);
            };

            // 클래스 생성자
            this.main = function () {

                UI.palette_instance = UI.palette_instance || [];
                UI.palette_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());
    PALETTE = ax5.ui.palette;
})();
// ax5.ui.calendar.tmpl
(function () {

    var CALENDAR = ax5.ui.calendar;

    var frameTmpl = function frameTmpl(columnKeys) {
        return "\n                <div class=\"ax5-ui-calendar {{theme}}\" data-calendar-els=\"root\" onselectstart=\"return false;\">\n                    {{#control}}\n                    <div class=\"calendar-control\" data-calendar-els=\"control\" style=\"{{controlCSS}}\">\n                        <a class=\"date-move-left\" data-calendar-move=\"left\" style=\"{{controlButtonCSS}}\">{{{left}}}</a>\n                        <div class=\"date-display\" data-calendar-els=\"control-display\" style=\"{{controlCSS}}\"></div>\n                        <a class=\"date-move-right\" data-calendar-move=\"right\" style=\"{{controlButtonCSS}}\">{{{right}}}</a>\n                    </div>\n                    {{/control}}\n                    <div class=\"calendar-body\" data-calendar-els=\"body\"></div>\n                </div>\n                ";
    };
    var dayTmpl = function dayTmpl(columnKeys) {
        return "\n                <table data-calendar-table=\"day\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                        {{#weekNames}}\n                            <td class=\"calendar-col-{{col}}\" style=\"height: {{colHeadHeight}}\">\n                            {{label}}\n                            </td>\n                        {{/weekNames}}\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfWeek}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfWeek}}\n                            <td class=\"calendar-col-{{col}}\" style=\"{{itemStyles}}\">\n                                <a class=\"calendar-item-day {{addClass}}\" data-calendar-item-date=\"{{thisDate}}\">\n                                    <span class=\"addon addon-header\"></span>\n                                    {{thisDataLabel}}\n                                    <span class=\"addon addon-footer\"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ";
    };
    var monthTmpl = function monthTmpl(columnKeys) {
        return "\n                <table data-calendar-table=\"month\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <td class=\"calendar-col-0\" colspan=\"3\" style=\"height: {{colHeadHeight}}\">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class=\"calendar-col-{{col}}\" style=\"{{itemStyles}}\">\n                                <a class=\"calendar-item-month {{addClass}}\" data-calendar-item-month=\"{{thisMonth}}\">\n                                    <span class=\"addon\"></span>\n                                    {{thisMonthLabel}}\n                                    <span class=\"lunar\"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ";
    };
    var yearTmpl = function yearTmpl(columnKeys) {
        return "\n                <table data-calendar-table=\"year\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <td class=\"calendar-col-0\" colspan=\"4\" style=\"height: {{colHeadHeight}}\">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class=\"calendar-col-{{col}}\" style=\"{{itemStyles}}\">\n                                <a class=\"calendar-item-year {{addClass}}\" data-calendar-item-year=\"{{thisYear}}\">\n                                    <span class=\"addon\"></span>\n                                    {{thisYearLabel}}\n                                    <span class=\"lunar\"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ";
    };

    CALENDAR.tmpl = {
        "frameTmpl": frameTmpl,
        "dayTmpl": dayTmpl,
        "monthTmpl": monthTmpl,
        "yearTmpl": yearTmpl,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(CALENDAR.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();