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
     * @version 0.2.0
     * @author tom@axisj.com
     * @example
     * ```
     * var myViewer = new ax5.ui.mediaViewer();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.queue = [];
        this.config = {
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
            theme: 'default',
            animateTime: 250,

            columnKeys: {
                src: 'src',
                poster: 'poster',
                html: 'html'
            },
            loading: {
                icon: '',
                text: 'Now Loading'
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
        this.selectedIndex = 0;

        cfg = this.config;

        var
            onStateChanged = function (opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
            getFrameTmpl = function (columnKeys) {
                return `
                <div data-ax5-ui-media-viewer="{{id}}" class="{{theme}}">
                    <div data-media-viewer-els="viewer"></div>
                    <div data-media-viewer-els="viewer-loading">
                        <div class="ax5-ui-media-viewer-loading-holder">
                            <div class="ax5-ui-media-viewer-loading-cell">
                                {{{loading.icon}}}
                                {{{loading.text}}}
                            </div>
                        </div>
                    </div>
                    {{#media}}
                    <div data-media-viewer-els="media-list-holder">
                        <div data-media-viewer-els="media-list-prev-handle">{{{prevHandle}}}</div>
                        <div data-media-viewer-els="media-list">
                            <div data-media-viewer-els="media-list-table">
                            {{#list}}
                                <div data-media-viewer-els="media-list-table-td">
                                    {{#image}}
                                    <div data-media-thumbnail="{{@i}}">
                                        <img src="{{${columnKeys.poster}}}" data-media-thumbnail-image="{{@i}}" />
                                    </div>
                                    {{/image}}
                                    {{#video}}
                                    <div data-media-thumbnail="{{@i}}">{{#${columnKeys.poster}}}<img src="{{.}}" data-media-thumbnail-video="{{@i}}" />>{{/${columnKeys.poster}}}{{^${columnKeys.poster}}}<a data-media-thumbnail-video="{{@i}}">{{{media.${columnKeys.poster}}}}</a>{{/${columnKeys.poster}}}</div>
                                    {{/video}}
                                </div>
                            {{/list}}
                            </div>
                        </div>
                        <div data-media-viewer-els="media-list-next-handle">{{{nextHandle}}}</div>
                    </div>
                    {{/media}}
                </div>
                `;
            },
            getFrame = function () {
                var
                    data = jQuery.extend(true, {}, cfg),
                    tmpl = getFrameTmpl(cfg.columnKeys);

                data.id = this.id;

                try {
                    return ax5.mustache.render(tmpl, data);
                }
                finally {
                    data = null;
                    tmpl = null;
                }
            },
            onClick = function (e, target) {
                var
                    result,
                    elementType = "",
                    processor = {
                        'thumbnail': function (target) {
                            this.select(target.getAttribute("data-media-thumbnail"));
                        },
                        'prev': function (target) {
                            if (this.selectedIndex > 0) {
                                this.select(this.selectedIndex - 1);
                            }
                        },
                        'next': function (target) {
                            if (this.selectedIndex < cfg.media.list.length - 1) {
                                this.select(this.selectedIndex + 1);
                            }
                        },
                        'viewer': function (target) {
                            if (self.onClick) {
                                self.onClick.call({
                                    media: cfg.media.list[this.selectedIndex]
                                });
                            }
                        }
                    };

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-media-thumbnail")) {
                        elementType = "thumbnail";
                        return true;
                    }
                    else if (target.getAttribute("data-media-viewer-els") == "media-list-prev-handle") {
                        elementType = "prev";
                        return true;
                    }
                    else if (target.getAttribute("data-media-viewer-els") == "media-list-next-handle") {
                        elementType = "next";
                        return true;
                    }
                    else if (target.getAttribute("data-media-viewer-els") == "viewer") {
                        elementType = "viewer";
                        return true;
                    }
                    else if (self.target.get(0) == target) {
                        return true;
                    }
                });

                if (target) {
                    for (var key in processor) {
                        if (key == elementType) {
                            result = processor[key].call(this, target);
                            break;
                        }
                    }
                    return this;
                }
                return this;
            },
            getSelectedIndex = function () {
                if (cfg.media && cfg.media.list && cfg.media.list.length > 0) {
                    var i = cfg.media.list.length, selecteIndex = 0;
                    while (i--) {
                        if (cfg.media.list[i].selected) {
                            selecteIndex = i;
                            break;
                        }
                    }

                    if (selecteIndex == 0) {
                        cfg.media.list[0].selected = true;
                    }
                    try {
                        return selecteIndex;
                    } finally {
                        i = null;
                        selecteIndex = null;
                    }
                }
                else {
                    return;
                }
            },
            alignMediaList = function () {
                var thumbnail = this.$["list"].find('[data-media-thumbnail=' + this.selectedIndex + ']'),
                    pos = thumbnail.position(), thumbnailWidth = thumbnail.width(),
                    containerWidth = this.$["list"].width(),
                    parentLeft = this.$["list-table"].position().left,
                    parentWidth = this.$["list-table"].width(),
                    newLeft = 0;

                if (pos.left + thumbnailWidth + parentLeft > containerWidth) {
                    newLeft = containerWidth - (pos.left + thumbnailWidth);
                    if (parentLeft != newLeft) this.$["list-table"].css({left: parentLeft = newLeft});
                }
                else if (pos.left + parentLeft < 0) {
                    newLeft = pos.left;
                    if (newLeft > 0) newLeft = 0;
                    if (parentLeft != newLeft) this.$["list-table"].css({left: parentLeft = newLeft});
                }

                if (parentLeft != newLeft) {
                    if (parentLeft + parentWidth < containerWidth) {
                        newLeft = containerWidth - parentWidth;
                        if (newLeft > 0) newLeft = 0;
                        this.$["list-table"].css({left: newLeft});
                    }
                }

                thumbnail = null;
                pos = null;
                thumbnailWidth = null;
                containerWidth = null;
                parentLeft = null;
                newLeft = null;
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
            if (cfg.target && (cfg.media && cfg.media.list && cfg.media.list.length > 0)) {
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
                "viewer-loading": this.target.find('[data-media-viewer-els="viewer-loading"]'),
                "list-holder": this.target.find('[data-media-viewer-els="media-list-holder"]'),
                "list-prev-handle": this.target.find('[data-media-viewer-els="media-list-prev-handle"]'),
                "list": this.target.find('[data-media-viewer-els="media-list"]'),
                "list-table": this.target.find('[data-media-viewer-els="media-list-table"]'),
                "list-next-handle": this.target.find('[data-media-viewer-els="media-list-next-handle"]')
            };

            this.align();
            jQuery(window).unbind("resize.ax5media-viewer-" + this.id).bind("resize.ax5media-viewer-" + this.id, (function () {
                this.align();
                alignMediaList.call(this);
            }).bind(this));

            this.target.unbind("click").bind("click", (function (e) {
                e = e || window.event;
                onClick.call(this, e);
                U.stopEvent(e);
            }).bind(this));

            this.select(getSelectedIndex.call(this));
            return this;
        };

        /**
         * @method ax5.ui.mediaViewer.align
         * @returns {axClass}
         */
        this.align = function () {
            // viewer width, height
            this.$["viewer"].css({height: this.$["viewer"].width() / cfg.viewer.ratio});
            if (this.$["viewer"].data("media-type") == "image") {
                var $img = this.$["viewer"].find("img");
                $img.css({
                    width: this.$["viewer"].height() * this.$["viewer"].data("img-ratio"), height: this.$["viewer"].height()
                });
                setTimeout((function (_img) {
                    _img.css({left: (this.$["viewer"].width() - _img.width()) / 2});
                }).bind(this, $img), 1);
            }
            else if (this.$["viewer"].data("media-type") == "video") {
                this.$["viewer"].find("iframe").css({width: this.$["viewer"].height() * this.$["viewer"].data("img-ratio"), height: this.$["viewer"].height()});
            }
            this.$["viewer-loading"].css({height: this.$["viewer"].height()});

            var mediaThumbnailWidth = (U.right(cfg.media.width, 1) == '%') ? U.number(cfg.media.width) / 100 * this.$["viewer"].width() : U.number(cfg.media.width),
                mediaThumbnailHeight = (U.right(cfg.media.height, 1) == '%') ? U.number(cfg.media.height) / 100 * this.$["viewer"].width() : U.number(cfg.media.height);

            mediaThumbnailWidth = Math.floor(mediaThumbnailWidth);
            mediaThumbnailHeight = Math.floor(mediaThumbnailHeight);

            this.$["list-prev-handle"].css({width: mediaThumbnailWidth * 1.5});
            this.$["list-next-handle"].css({width: mediaThumbnailWidth * 1.5});
            this.$["list"].css({height: mediaThumbnailHeight});
            this.$["list-table"].find('[data-media-thumbnail]').css({width: mediaThumbnailWidth, height: mediaThumbnailHeight});
            this.$["list-table"].find('[data-media-thumbnail-video]').css({width: mediaThumbnailWidth, height: mediaThumbnailHeight});


            return this;
        };

        /**
         * @method ax5.ui.mediaViewer.select
         * @param index
         * @returns {axClass}
         */
        this.select = (function () {
            var mediaView = {
                image: function (obj, callBack) {
                    self.$["viewer-loading"].show();
                    var dim = [this.$["viewer"].width(), this.$["viewer"].height()];
                    var img = new Image();
                    img.src = obj.image[cfg.columnKeys.src];
                    img.onload = function () {
                        self.$["viewer-loading"].fadeOut();
                        var h = dim[1];
                        var w = h * img.width / img.height;
                        callBack(img, Math.floor(w), h);
                    };
                    return img;
                },
                video: function (obj, callBack) {
                    self.$["viewer-loading"].show();
                    var dim = [this.$["viewer"].width(), this.$["viewer"].height()];
                    var html = jQuery(obj.video[cfg.columnKeys.html]);
                    callBack(html, dim[0], dim[1]);
                    self.$["viewer-loading"].fadeOut();
                }
            };
            var onLoad = {
                image: function (img, w, h) {
                    img.width = w;
                    img.height = h;

                    var $img = $(img);
                    this.$["viewer"].html($img);
                    $img.css({left: (this.$["viewer"].width() - w) / 2});

                    this.$["viewer"].data("media-type", "image");
                    this.$["viewer"].data("img-ratio", w / h);
                },
                video: function (html, w, h) {
                    html.css({width: w, height: h});
                    this.$["viewer"].html(html);
                    this.$["viewer"].data("media-type", "video");
                    this.$["viewer"].data("img-ratio", w / h);
                }
            };
            var select = function (index) {
                this.$["list"].find('[data-media-thumbnail]').removeClass("selected");
                this.$["list"].find('[data-media-thumbnail=' + index + ']').addClass("selected");
                alignMediaList.call(this);
            };

            return function (index) {
                if (typeof index === "undefined") return this;
                this.selectedIndex = Number(index);
                var media = cfg.media.list[index];
                select.call(this, index);
                for (var key in mediaView) {
                    if (media[key]) {
                        mediaView[key].call(this, media, onLoad[key].bind(this));
                        break;
                    }
                }
                return this;
            };
        })();

        /**
         * @method ax5.ui.mediaViewer.setMediaList
         * @param list
         * @returns {axClass}
         */
        this.setMediaList = function (list) {
            cfg.media.list = [].concat(list);
            this.attach(cfg.target);
            return this;
        };

        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
            else {
                this.init();
            }
        }).apply(this, arguments);
    };
    //== UI Class

    root.mediaViewer = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);