// ax5.ui.grid
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.grid
     * @classdesc
     * @version 0.0.2
     * @author tom@axisj.com
     * @example
     * ```
     * var myGrid = new ax5.ui.grid();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.name = "ax5grid";
        this.version = "0.0.2";

        this.config = {
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
            theme: 'default',
            title: '',
            animateTime: 250
        };

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
            initGrid = function () {
                var grid = this.gridConfig;
                // todo : 템플릿 랜더~
                grid.$target.html(root.grid.tmpl.get("main", grid));
            };
        /// private end

        /**
         * Preferences of grid UI
         * @method ax5.ui.grid.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.grid}
         * @example
         * ```
         * ```
         */
        this.init = function (config) {
            this.onStateChanged = cfg.onStateChanged;
            this.onClick = cfg.onClick;

            var grid = this.gridConfig = jQuery.extend(true, {}, cfg, config);

            if (!grid.target) {
                console.log(ax5.info.getError("ax5grid", "401", "init"));
                return this;
            }
            grid.$target = jQuery(grid.target);

            if (!grid.id) grid.id = grid.$target.data("data-ax5grid-id");
            if (!grid.id) {
                grid.id = 'ax5grid-' + ax5.getGuid();
                grid.$target.data("data-ax5grid-id", grid.id);
            }

            // target attribute data
            (function (data) {
                if (U.isObject(data) && !data.error) {
                    grid = jQuery.extend(true, grid, data);
                }
            })(U.parseJson(grid.$target.attr("data-ax5grid-config"), true));

            initGrid.call(this);
        };

        // 클래스 생성자
        this.main = (function () {

            root.grid_instance = root.grid_instance || [];
            root.grid_instance.push(this);

            // console.log(root.grid.tmpl.main);

            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };
    //== UI Class

    root.grid = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);