'use strict';

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.media-viewer
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.mediaViewer
     * @classdesc
     * @version 0.0.1
     * @author tom@axisj.com
     * @example
     * ```
     * var mymediaViewer = new ax5.ui.mediaViewer();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function axClass() {
        var self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.queue = [];
        this.config = {
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
            theme: 'default',
            animateTime: 250,

            columnKeys: {
                url: 'url',
                type: 'type'
            },
            viewer: {
                prevHandle: false,
                nextHandle: false,
                ratio: 16 / 9
            },
            media: {
                prevHandle: '<',
                nextHandle: '>',
                width: 36, height: 36,
                list: []
            }
        };

        this.openTimer = null;
        this.closeTimer = null;

        cfg = this.config;

        var onStateChanged = function onStateChanged(opts, that) {
            if (opts && opts.onStateChanged) {
                opts.onStateChanged.call(that, that);
            } else if (this.onStateChanged) {
                this.onStateChanged.call(that, that);
            }
            return true;
        },
            getFrameTmpl = function getFrameTmpl(columnKeys) {
            return '\n                <div data-ax5-ui-media-viewer="{{id}}">\n                    <div data-media-viewer-els="viewer"></div>\n                    {{#media}}\n                    <div data-media-viewer-els="media-list-holder">\n                        <div data-media-viewer-els="media-list-prev-handle" style="width:{{width}}px;height:{{height}}px;">{{{prevHandle}}}</div>\n                        <div data-media-viewer-els="media-list">\n                            <div data-media-viewer-els="media-list-table">\n                            {{#list}}\n                                <div data-media-viewer-els="media-list-table-td">\n                                    <div data-media-thumbnail="{{@i}}" style="width:{{width}}px;height:{{height}}px;">\n                                        {{#image}}\n                                        <img src="{{poster}}" data-media-thumbnail-image="{{@i}}" />\n                                        {{/image}}\n                                        {{#video}}\n                                        <img src="{{poster}}" data-media-thumbnail-video="{{@i}}" />\n                                        {{/video}}\n                                    </div>\n                                </div>\n                            {{/list}}\n                            </div>\n                        </div>\n                        <div data-media-viewer-els="media-list-next-handle" style="width:{{width}}px;height:{{height}}px;">{{{nextHandle}}}</div>\n                    </div>\n                    {{/media}}\n                </div>\n                ';
        },
            getFrame = function getFrame() {
            var data = jQuery.extend(true, {}, cfg),
                tmpl = getFrameTmpl(cfg.columnKeys);

            data.id = this.id;

            try {
                return ax5.mustache.render(tmpl, data);
            } finally {
                data = null;
                tmpl = null;
            }
        },
            onClick = function onClick(e, target) {
            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-picker-els")) {
                    return true;
                } else if (opts.$target.get(0) == target) {
                    return true;
                }
            });
            if (!target) {
                return this;
            }
            return this;
        };
        /// private end

        /**
         * Preferences of mediaViewer UI
         * @method ax5.ui.mediaViewer.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.mediaViewer}
         * @example
         * ```
         * ```
         */
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
            this.onClick = cfg.onClick;
            this.id = 'ax5-media-viewer-' + ax5.getGuid();
            if (cfg.target) {
                this.attach(cfg.target);
            }
        };

        /**
         * @method ax5.ui.mediaViewer.attach
         * @param target
         * @param options
         * @returns {ax5.ui.mediaViewer}
         */
        this.attach = function (target, options) {
            if (!target) {
                console.log(ax5.info.getError("ax5mediaViewer", "401", "setConfig"));
            }
            if (typeof options != "undefined") {
                this.setConfig(options, false);
            }
            this.target = jQuery(target);
            this.target.html(getFrame.call(this));

            // 파트수집
            this.$ = {
                "root": this.target.find('[data-ax5-ui-media-viewer]'),
                "viewer": this.target.find('[data-media-viewer-els="viewer"]'),
                "list-holder": this.target.find('[data-media-viewer-els="media-list-holder"]'),
                "list-prev-handle": this.target.find('[data-media-viewer-els="media-list-prev-handle"]'),
                "list": this.target.find('[data-media-viewer-els="media-list"]'),
                "list-next-handle": this.target.find('[data-media-viewer-els="media-list-next-handle"]')
            };

            this.align();
            jQuery(window).bind("resize.ax5media-viewer", function () {
                this.align();
            }.bind(this));
            return this;
        };

        /**
         * @method ax5.ui.mediaViewer.align
         * @returns {axClass}
         */
        this.align = function () {

            return this;
        };

        // 클래스 생성자
        this.main = function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            } else {
                this.init();
            }
        }.apply(this, arguments);
    };
    //== UI Class

    root.mediaViewer = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);