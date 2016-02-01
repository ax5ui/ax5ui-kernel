// ax5.ui.calendar
(function (root, _SUPER_) {
    /**
     * @class ax5.ui.calendar
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @logs
     * 2014-06-21 tom : 시작
     * @example
     * ```
     * var my_pad = new ax5.ui.calendar();
     * ```
     */
    var U = ax5.util;
    
    //== UI Class
    var axClass = function () {
        if (_SUPER_) _SUPER_.call(this); // 부모호출

        var
            self = this,
            cfg,
            aDay = 1000 * 60 * 60 * 24,
            selectableCount = 1
            ;

        this.target = null;
        this.selection = [];
        this.selectableMap = {};
        this.printedDay = {
            start: "", end: ""
        };
        this.config = {
            clickEventName: "click",
            theme: 'default',
            mode: 'day', // day|month|year,
            dateFormat: 'yyyy-mm-dd',
            displayDate: (new Date()),
            animateTime: 250,
            dimensions: {
                controlHeight: '40px',
                controlButtonWidth: '40px',
                itemPadding: 2
            },
            lang: {
                yearHeading: "Choose the year",
                monthHeading: "Choose the month",
                yearTmpl: "%s",
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                dayTmpl: "%s"
            },
            multipleSelect: false,
            selectMode: 'day'
        };
        // todo : selectMode 구현

        cfg = this.config;
        
        /**
         * Preferences of calendar UI
         * @method ax5.ui.calendar.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.calendar}
         * @example
         * ```
         * setConfig({
		 *      target : {Element|AX5 nodelist}, // 메뉴 UI를 출력할 대상
		 *      mode: {String}, // [day|month|year] - 화면 출력 모드
		 *      onclick: {Function} // [onclick] - 아이템 클릭이벤트 처리자
		 * });
         * ```
         */
            //== class body start
        this.init = function () {
            // after setConfig();
            if (!cfg.target) {
                console.log(ax5.info.getError("ax5calendar", "401", "setConfig"));
            }
            this.target = jQuery(cfg.target);
            
            cfg.displayDate = U.date(cfg.displayDate);
            this.target.html(this.getFrame());
            
            // 파트수집
            this.$ = {
                "root": this.target.find('[data-calendar-els="root"]'),
                "control": this.target.find('[data-calendar-els="control"]'),
                "control-display": this.target.find('[data-calendar-els="control-display"]'),
                "body": this.target.find('[data-calendar-els="body"]')
            };
            
            if (cfg.control)
            {
                this.$["control"].find('[data-calendar-move]').on(cfg.clickEventName, (function (e) {
                    this.move(e || window.event);
                }).bind(this));
            }
            
            // collect selectableMap
            if (cfg.selectable) {
                this.setSelectable(cfg.selectable, false);
            }

            if (cfg.mode === "day" || cfg.mode === "d")
            {
                this.printDay(cfg.displayDate);
            }
            else if (cfg.mode === "month" || cfg.mode === "m")
            {
                this.printMonth(cfg.displayDate);
            }
            else if (cfg.mode === "year" || cfg.mode === "y")
            {
                this.printYear(cfg.displayDate);
            }

        };
        
        this.getFrame = function () {
            var
                po = []
                ;
            
            po.push('<div class="ax5-ui-calendar ' + cfg.theme + '" data-calendar-els="root" onselectstart="return false;">');
            if (cfg.control)
            {
                var
                    controlCSS = {},
                    controlButtonCSS = {}
                    ;
                
                controlButtonCSS["height"] = controlCSS["height"] = U.cssNumber(cfg.dimensions.controlHeight);
                controlButtonCSS["line-height"] = controlCSS["line-height"] = U.cssNumber(cfg.dimensions.controlHeight);
                controlButtonCSS["width"] = U.cssNumber(cfg.dimensions.controlHeight);
                
                po.push('<div class="calendar-control" data-calendar-els="control" style="' + U.css(controlCSS) + '">');
                po.push('<a class="date-move-left" data-calendar-move="left" style="' + U.css(controlButtonCSS) + '">' + cfg.control.left + '</a>');
                po.push('<div class="date-display" data-calendar-els="control-display" style="' + U.css(controlCSS) + '"></div>');
                po.push('<a class="date-move-right" data-calendar-move="right" style="' + U.css(controlButtonCSS) + '">' + cfg.control.right + '</a>');
                po.push('</div>');
            }
            po.push('<div class="calendar-body" data-calendar-els="body"></div>');
            po.push('</div>');
            return po.join('');
        };
        
        this.setDisplay = function () {
            if (cfg.control)
            {
                var myDate = U.date(cfg.displayDate), yy = "", mm = "";
                
                if (cfg.mode == "day" || cfg.mode == "d")
                {
                    yy = (cfg.control.yearTmpl) ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear()) : myDate.getFullYear();
                    mm = (cfg.control.monthTmpl) ? cfg.control.monthTmpl.replace('%s', cfg.lang.months[myDate.getMonth()]) : cfg.lang.months[myDate.getMonth()];

                    this.$["control-display"].html((function () {
                        if (cfg.control.yearFirst) {
                            return '<span data-calendar-display="year">' + yy + '</span>' +
                                '<span data-calendar-display="month">' + mm + '</span>';
                        }
                        else {
                            return '<span data-calendar-display="month">' + mm + '</span>' +
                                '<span data-calendar-display="year">' + yy + '</span>';
                        }

                    })());
                }
                else if (cfg.mode == "month" || cfg.mode == "m")
                {
                    yy = (cfg.control.yearTmpl) ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear()) : myDate.getFullYear();
                    this.$["control-display"].html('<span data-calendar-display="year">' + yy + '</span>');
                }
                else if (cfg.mode == "year" || cfg.mode == "y")
                {
                    var yy1 = (cfg.control.yearTmpl) ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear() - 10) : myDate.getFullYear() - 10;
                    var yy2 = (cfg.control.yearTmpl) ? cfg.control.yearTmpl.replace('%s', Number(myDate.getFullYear()) + 9) : Number(myDate.getFullYear()) + 9;
                    this.$["control-display"].html(yy1 + ' ~ ' + yy2);
                }
                
                this.$["control-display"].find('[data-calendar-display]').on(cfg.clickEventName, (function (e) {
                    target = U.findParentNode(e.target, function (target) {
                        if (target.getAttribute("data-calendar-display"))
                        {
                            return true;
                        }
                    });
                    if (target)
                    {
                        var mode = target.getAttribute("data-calendar-display");
                        this.changeMode(mode);
                    }
                }).bind(this));
            }

            return this;
        };
        
        this.printDay = function (nowDate) {
            var
                dotDate = U.date(nowDate),
                po = [],
                monthStratDate = new Date(dotDate.getFullYear(), dotDate.getMonth(), 1, 12),
                _today = cfg.displayDate,
                tableStartDate = (function () {
                    var day = monthStratDate.getDay();
                    if (day == 0) day = 7;
                    return U.date(monthStratDate, {add: {d: -day}});
                })(),
                loopDate,
                thisMonth = dotDate.getMonth(),
                thisDate = dotDate.getDate(),
                itemStyles = {},
                i,
                k,
                frameWidth = this.$["body"].width(),
                frameHeight = Math.floor(frameWidth * (6 / 7)) // 1week = 7days, 1month = 6weeks
                ;

            if (cfg.dimensions.height) {
                frameHeight = U.number(cfg.dimensions.height);
            }

            itemStyles['height'] = Math.floor(frameHeight / 6) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
            itemStyles['line-height'] = itemStyles['height'];
            itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

            po.push('<table data-calendar-table="day" cellpadding="0" cellspacing="0" style="width:100%;">');
            po.push('<thead>');
            po.push('<tr>');
            k = 0;
            while (k < 7)
            {
                po.push('<td class="calendar-col-' + k + '">');
                po.push(ax5.info.weekNames[k].label);
                po.push('</td>');
                k++;
            }
            po.push('</tr>');
            po.push('</thead>');
            po.push('<tbody>');
            
            loopDate = tableStartDate;
            i = 0;
            while (i < 6)
            {
                po.push('<tr>');
                k = 0;
                while (k < 7)
                {
                    po.push('<td class="calendar-col-' + k + '" style="' + U.css(itemStyles) + '">');
                    po.push('<a class="calendar-item-day ' + (function () {
                            if (cfg.selectable) {
                                if (self.selectableMap[U.date(loopDate, {"return": cfg.dateFormat})]) {
                                    return ( loopDate.getMonth() == thisMonth ) ? "live" : "";
                                }
                                else {
                                    return "disable";
                                }
                            }
                            else {
                                return ( loopDate.getMonth() == thisMonth ) ? ( U.date(loopDate, {"return": "yyyymmdd"}) == U.date(_today, {"return": "yyyymmdd"}) ) ? "focus" : "live" : "";
                            }
                        })() + ' ' + (function () {
                            return "";
                        })() + '" data-calendar-item-date="' + U.date(loopDate, {"return": cfg.dateFormat}) + '"><span class="addon"></span>'
                        + cfg.lang.dayTmpl.replace('%s', loopDate.getDate())
                        + '<span class="lunar"></span></a>');
                    po.push('</td>');
                    k++;
                    loopDate = U.date(loopDate, {add: {d: 1}});
                }
                po.push('</tr>');
                i++;
            }
            po.push('</tbody>');
            po.push('</table>');
            
            this.$["body"].html(po.join(''));
            this.$["body"].find('[data-calendar-item-date]').on(cfg.clickEventName, function (e) {
                e = e || window.event;
                self.onclick(e, 'date');
                
                try {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    e.cancelBubble = true;
                } catch (e) {
                    
                }
                return false;
            });
            
            this.printedDay = {
                start: tableStartDate, end: loopDate
            };
            
            if (cfg.onStateChanged) {
                var that = {
                    action: "printDay",
                    printedDay: this.printedDay
                };
                cfg.onStateChanged.call(that, that);
            }
            
            this.setDisplay();
        };
        
        this.printMonth = function (nowDate) {

            var
                dotDate = U.date(nowDate),
                nMonth = dotDate.getMonth(),
                po = [],
                itemStyles = {},
                i,
                k,
                m,
                tableStartMonth,
                frameWidth = this.$["body"].width(),
                frameHeight = Math.floor(frameWidth * (6 / 7))
                ;

            if (cfg.dimensions.height) {
                frameHeight = U.number(cfg.dimensions.height);
            }

            itemStyles['height'] = Math.floor(frameHeight / 4) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
            itemStyles['line-height'] = itemStyles['height'];
            itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

            po.push('<table data-calendar-table="month" cellpadding="0" cellspacing="0" style="width:100%;">');
            po.push('<thead>');
            po.push('<tr>');
            
            po.push('<td class="calendar-col-0" colspan="3">'
                + cfg.lang.monthHeading
                + '</td>');
            
            po.push('</tr>');
            po.push('</thead>');
            po.push('<tbody>');

            tableStartMonth = 0;
            m = 0;
            i = 0;
            while (i < 4)
            {
                po.push('<tr>');
                k = 0;
                while (k < 3)
                {
                    po.push('<td class="calendar-col-' + i + '" style="' + U.css(itemStyles) + '">');
                    po.push('<a class="calendar-item-month ' + (function () {
                            if (cfg.selectable) {
                                return (self.selectableMap[m]) ? 'live' : 'disable';
                            }
                            else {
                                return 'live';
                            }
                        })() + ' ' + (function () {
                            return ( m == nMonth ) ? "focus" : "";
                        })() + '" data-calendar-item-month="' + (function () {
                            return dotDate.getFullYear() + '-' + U.setDigit(m + 1, 2) + '-' + U.setDigit(dotDate.getDate(), 2);
                        })() + '">'
                        + cfg.lang.months[m]
                        + '</a>');
                    po.push('</td>');
                    m++;
                    k++;
                }
                po.push('</tr>');
                i++;
            }
            po.push('</tbody>');
            po.push('</table>');
            
            this.$["body"].html(po.join(''));
            this.$["body"].find('[data-calendar-item-month]').on(cfg.clickEventName, function (e) {
                e = e || window.event;
                self.onclick(e, 'month');
                try {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    e.cancelBubble = true;
                } catch (e) {

                }
                return false;
            });

            this.printedDay = {
                start: dotDate.getFullYear() + '-' + U.setDigit(tableStartMonth + 1, 2), end: dotDate.getFullYear() + '-' + U.setDigit(m, 2)
            };

            if (cfg.onStateChanged) {
                var that = {
                    action: "printMonth",
                    printedDay: this.printedDay
                };
                cfg.onStateChanged.call(that, that);
            }

            this.setDisplay();

            return this;
        };
        
        this.printYear = function (nowDate) {
            var
                dotDate = U.date(nowDate),
                nYear = dotDate.getFullYear(),
                po = [],
                itemStyles = {},
                i,
                k,
                y,
                tableStartYear,
                frameWidth = this.$["body"].width(),
                frameHeight = Math.floor(frameWidth * (6 / 7))
                ;

            if (cfg.dimensions.height) {
                frameHeight = U.number(cfg.dimensions.height);
            }

            itemStyles['height'] = Math.floor(frameHeight / 5) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
            itemStyles['line-height'] = itemStyles['height'];
            itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

            po.push('<table data-calendar-table="year" cellpadding="0" cellspacing="0" style="width:100%;">');
            po.push('<thead>');
            po.push('<tr>');
            
            po.push('<td class="calendar-col-0" colspan="4">'
                + cfg.lang.yearHeading
                + '</td>');
            
            po.push('</tr>');
            po.push('</thead>');
            
            po.push('<tbody>');

            tableStartYear = nYear - 10;
            y = nYear - 10;
            i = 0;
            while (i < 5)
            {
                po.push('<tr>');
                k = 0;
                while (k < 4)
                {
                    po.push('<td class="calendar-col-' + i + '" style="' + U.css(itemStyles) + '">');
                    po.push('<a class="calendar-item-year ' + (function () {
                            if (cfg.selectable) {
                                return (self.selectableMap[y]) ? 'live' : 'disable';
                            }
                            else {
                                return 'live';
                            }
                        })() + ' ' + (function () {
                            return ( y == nYear ) ? "focus" : "";
                        })() + '" data-calendar-item-year="' + (function () {
                            return y + '-' + U.setDigit(dotDate.getMonth() + 1, 2) + '-' + U.setDigit(dotDate.getDate(), 2);
                        })() + '">' + cfg.lang.yearTmpl.replace('%s', (y)) + '</a>');
                    po.push('</td>');
                    y++;
                    k++;
                }
                po.push('</tr>');
                i++;
            }
            po.push('</tbody>');
            po.push('</table>');
            
            this.$["body"].html(po.join(''));
            this.$["body"].find('[data-calendar-item-year]').on(cfg.clickEventName, function (e) {
                e = (e || window.event);
                self.onclick(e, 'year');
                try {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    e.cancelBubble = true;
                } catch (e) {

                }
                return false;
            });

            this.printedDay = {
                start: tableStartYear, end: y - 1
            };

            if (cfg.onStateChanged) {
                var that = {
                    action: "printYear",
                    printedDay: this.printedDay
                };
                cfg.onStateChanged.call(that, that);
            }

            this.setDisplay();

            return this;
        };
        
        this.onclick = function (e, mode, target, value) {
            mode = mode || "date";
            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-calendar-item-" + mode))
                {
                    return true;
                }
            });
            if (target)
            {
                value = target.getAttribute("data-calendar-item-" + mode);

                var
                    dt = U.date(value, {"return": cfg.dateFormat}),
                    selectable = true
                    ;

                selectableCount = (cfg.multipleSelect) ? (U.isNumber(cfg.multipleSelect)) ? cfg.multipleSelect : 2 : 1;

                if (cfg.selectable) {
                    if (!self.selectableMap[dt]) selectable = false;
                }

                if (mode == "date") {
                    if (selectable) {

                        if (self.selection.length >= selectableCount) {
                            var removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                            removed.forEach(function (d) {
                                self.$["body"].find('[data-calendar-item-date="' + U.date(d, {"return": cfg.dateFormat}) + '"]').removeClass("selected-day");
                            });
                        }

                        jQuery(target).addClass("selected-day");
                        self.selection.push(value);

                        if (cfg.onClick)
                        {
                            cfg.onClick.call({
                                date: value, target: this.target, dateElement: target
                            });
                        }
                    }
                }
                else if (mode == "month") {
                    if (cfg.selectMode == "month") {
                        if (selectable) {
                            if (self.selection.length >= selectableCount) {
                                var removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                removed.forEach(function (d) {
                                    self.$["body"].find('[data-calendar-item-month="' + U.date(d, {"return": 'yyyy-mm-dd'}) + '"]').removeClass("selected-month");
                                });
                            }

                            jQuery(target).addClass("selected-month");
                            self.selection.push(value);

                            if (cfg.onClick)
                            {
                                cfg.onClick.call({
                                    date: value, target: this.target, dateElement: target
                                });
                            }
                        }
                    }
                    else {
                        self.changeMode("day", value);
                    }
                }
                else if (mode == "year") {
                    if (cfg.selectMode == "year") {
                        if (selectable) {
                            if (self.selection.length >= selectableCount) {
                                var removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                removed.forEach(function (d) {
                                    self.$["body"].find('[data-calendar-item-year="' + U.date(d, {"return": 'yyyy-mm-dd'}) + '"]').removeClass("selected-year");
                                });
                            }

                            jQuery(target).addClass("selected-year");
                            self.selection.push(value);

                            if (cfg.onClick)
                            {
                                cfg.onClick.call({
                                    date: value, target: this.target, dateElement: target
                                });
                            }
                        }
                    }
                    else {
                        self.changeMode("month", value);
                    }
                }
            }
        };
        
        this.move = function (e, target, value) {
            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-calendar-move"))
                {
                    return true;
                }
            });
            if (target)
            {
                value = target.getAttribute("data-calendar-move");
                
                if (cfg.mode == "day")
                {
                    if (value == "left")
                    {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {m: -1}});
                    }
                    else {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {m: 1}});
                    }
                    this.printDay(cfg.displayDate);
                }
                else if (cfg.mode == "month")
                {
                    if (value == "left")
                    {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {y: -1}});
                    }
                    else {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {y: 1}});
                    }
                    this.printMonth(cfg.displayDate);
                }
                else if (cfg.mode == "year")
                {
                    if (value == "left")
                    {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {y: -10}});
                    }
                    else {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {y: 10}});
                    }
                    this.printYear(cfg.displayDate);
                }
            }

            return this;
        };

        /**
         * @method ax5.ui.calendar.changeMode
         * @param {String} mode
         * @param {String} changeDate
         * @returns {ax5.ui.calendar}
         */
        this.changeMode = function (mode, changeDate) {
            if (typeof changeDate != "undefined") cfg.displayDate = changeDate;
            if (mode) cfg.mode = mode;
            
            this.$["body"].removeClass("fadein").addClass("fadeout");
            setTimeout((function () {
                if (cfg.mode == "day" || cfg.mode == "d")
                {
                    this.printDay(cfg.displayDate);
                }
                else if (cfg.mode == "month" || cfg.mode == "m")
                {
                    this.printMonth(cfg.displayDate);
                }
                else if (cfg.mode == "year" || cfg.mode == "y")
                {
                    this.printYear(cfg.displayDate);
                }
                this.$["body"].removeClass("fadeout").addClass("fadein");
            }).bind(this), cfg.animateTime);

            return this;
        };

        /**
         * @method ax5.ui.calendar.setDisplayDate
         * @param {String|Data} d
         * @returns {ax5.ui.calendar}
         */
        this.setDisplayDate = function (d) {
            cfg.displayDate = U.date(d);
            
            this.$["body"].removeClass("fadein").addClass("fadeout");
            setTimeout((function () {
                if (cfg.mode == "day" || cfg.mode == "d")
                {
                    this.printDay(cfg.displayDate);
                }
                else if (cfg.mode == "month" || cfg.mode == "m")
                {
                    this.printMonth(cfg.displayDate);
                }
                else if (cfg.mode == "year" || cfg.mode == "y")
                {
                    this.printYear(cfg.displayDate);
                }
                this.$["body"].removeClass("fadeout").addClass("fadein");
            }).bind(this), cfg.animateTime);

            return this;
        };

        /**
         * @method ax5.ui.calendar.setSelection
         * @param {Array} selection
         * @returns {ax5.ui.calendar}
         * @example
         * ```
         *
         * ```
         */
        this.setSelection = function (selection) {
            if (!U.isArray(selection)) return this;

            selectableCount = (cfg.multipleSelect) ? (U.isNumber(cfg.multipleSelect)) ? cfg.multipleSelect : 2 : 1;
            this.selection = selection.splice(0, selectableCount);
            this.selection.forEach(function (d) {
                self.$["body"].find('[data-calendar-item-date="' + U.date(d, {"return": cfg.dateFormat}) + '"]').addClass("selected-day");
            });

            return this;
        };

        /**
         * @method ax5.ui.calendar.getSelection
         */
        this.getSelection = function () {
            return this.selection;
        };

        this.setSelectable = (function () {
            this.selectableMap = {};
            var processor = {
                'arr': function (v, map) {
                    map = {};
                    if(!U.isArray(v)) return map;
                    v.forEach(function (n) {
                        if (U.isDate(n))
                            n = U.date(n, {'return': cfg.dateFormat});
                        map[n] = true;
                    });
                    return map;
                },
                'obj': function (v, map) {
                    map = {};
                    if(U.isArray(v)) return map;
                    if(v.range) return map;
                    for (var k in v) {
                        map[k] = v[k];
                    }
                    return map;
                },
                'range': function (v, map) {
                    map = {};
                    if(U.isArray(v)) return map;
                    if(!v.range) return map;

                    v.range.forEach(function (n) {
                        if (U.isDateFormat(n.from) && U.isDateFormat(n.to)) {
                            for (var d = U.date(n.from); d <= U.date(n.to); d.setDate(d.getDate() + 1)) {
                                map[U.date(d, {"return": cfg.dateFormat})] = true;
                            }
                        }
                        else {
                            for (var i = n.from; i <= n.to; i++) {
                                map[i] = true;
                            }
                        }
                    });
                    
                    return map;
                }
            };

            return function (selectable, isPrint) {
                
                var
                    key,
                    result = {}
                    ;

                if (cfg.selectable = selectable) {
                    if (U.isArray(selectable)) {
                        result = processor.arr(selectable);
                    }
                    else {
                        for (key in processor) {
                            if (selectable[key]) {
                                result = processor[key](selectable);
                                break;
                            }
                        }
                        if(Object.keys(result).length === 0){
                            result = processor.obj(selectable);
                        }
                    }
                }

                this.selectableMap = result;
                // 변경내용 적용하여 출력
                if (isPrint !== false) this.changeMode();
            };
        })();

        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };
    //== UI Class

    //== ui class 공통 처리 구문
    if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
    root.calendar = axClass; // ax5.ui에 연결
    //== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);