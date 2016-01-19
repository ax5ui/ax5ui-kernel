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
        var
            self = this,
            cfg,
            a_day = 1000 * 60 * 60 * 24;
        
        // 클래스 생성자
        this.main = (function () {
            if (_SUPER_) _SUPER_.call(this); // 부모호출
            this.config = {
                clickEventName: "click",
                theme: 'default',
                mode: 'day', // day|month|year,
                width: '100%',
                height: '100%',
                dateFormat: 'yyyy-mm-dd',
                displayDate: (new Date())
            };
        }).apply(this, arguments);
        
        this.target = null;
        cfg = this.config;
        
        this.printedDay = {
            start: "", end: ""
        };
        
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
            //console.log(this.config);
            if (!cfg.target)
            {
                U.error("aui_calendar_400", "[ax5.ui.calendar] config.target is required");
            }
            this.target = jQuery(cfg.target);
            
            //cfg.item_height = cfg.item_width = cfg.width / 7;
            cfg.displayDate = U.date(cfg.displayDate);
            this.target.html(this.get_frame());
            
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
            
            if (cfg.mode == "day")
            {
                this.print_day(cfg.displayDate);
            }
            else if (cfg.mode == "month")
            {
                this.print_month(cfg.displayDate);
            }
            else if (cfg.mode == "year")
            {
                this.print_year(cfg.displayDate);
            }
            
        };
        
        this.get_frame = function () {
            var po = [];
            po.push('<div class="ax5-ui-calendar ' + cfg.theme + '" data-calendar-els="root" style="' + (function () {
                    return (cfg.width) ? 'width:' + cfg.width + 'px;' : '';
                })() + '" onselectstart="return false;">');
            if (cfg.control)
            {
                po.push('<div class="calendar-control" data-calendar-els="control" style="height:' + cfg.item_height + 'px;line-height:' + cfg.item_height + 'px;">');
                po.push('<a class="date-move-left" data-calendar-move="left" style="width:' + cfg.item_width + 'px;">' + cfg.control.left + '</a>');
                po.push('<div class="date-display" data-calendar-els="control-display"></div>');
                po.push('<a class="date-move-right" data-calendar-move="right" style="width:' + cfg.item_width + 'px;">' + cfg.control.right + '</a>');
                po.push('</div>');
            }
            po.push('<div class="calendar-body" data-calendar-els="body"></div>');
            po.push('</div>');
            return po.join('');
        };
        
        this.set_display = function () {
            if (cfg.control)
            {
                //this.$["control-display"].html(U.date(cfg.displayDate, {"return": cfg.control.display}));
                
                var myDate = U.date(cfg.displayDate), yy = "", mm = "";
                
                if (cfg.mode == "day")
                {
                    if (cfg.control.year_tmpl) yy = cfg.control.year_tmpl.replace('%s', myDate.getFullYear());
                    if (cfg.control.month_tmpl) mm = cfg.control.month_tmpl.replace('%s', (myDate.getMonth() + 1));
                    
                    this.$["control-display"].html('<span data-calendar-display="year">' + yy + '</span>' + '<span data-calendar-display="month">' + mm + '</span>');
                }
                else if (cfg.mode == "month")
                {
                    if (cfg.control.year_tmpl) yy = cfg.control.year_tmpl.replace('%s', myDate.getFullYear());
                    
                    this.$["control-display"].html('<span data-calendar-display="year">' + yy + '</span>');
                }
                else if (cfg.mode == "year")
                {
                    var yy1 = cfg.control.year_tmpl.replace('%s', myDate.getFullYear() - 10);
                    var yy2 = cfg.control.year_tmpl.replace('%s', Number(myDate.getFullYear()) + 9);
                    this.$["control-display"].html(yy1 + ' ~ ' + yy2);
                }
                
                this.$["control-display"].find('[data-calendar-display]').on(cfg.clickEventName, (function (e) {
                    target = axd.parent(e.target, function (target) {
                        if (jQuery.attr(target, "data-calendar-display"))
                        {
                            return true;
                        }
                    });
                    if (target)
                    {
                        var mode = axd.attr(target, "data-calendar-display");
                        this.change_mode(mode);
                    }
                }).bind(this));
            }
        };
        
        this.print_day = function (now_date) {
            var dot_date = U.date(now_date), po = [], month_start_date = new Date(dot_date.getFullYear(), dot_date.getMonth(), 1, 12),
            //_today = new Date(),
                _today = cfg.displayDate,
                table_start_date = (function () {
                    var day = month_start_date.getDay();
                    if (day == 0) day = 7;
                    return U.date(month_start_date, {add: {d: -day}});
                })(), loop_date, this_month = dot_date.getMonth(), this_date = dot_date.getDate(),
                item_styles = ['width:' + cfg.item_width + 'px', 'height:' + cfg.item_height + 'px', 'line-height:' + (cfg.item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px'],
                i, k;
            
            po.push('<table data-calendar-table="day" cellpadding="0" cellspacing="0" style="' + (function () {
                    return (cfg.width) ? 'width:' + cfg.width + 'px;' : 'width:100%;';
                })() + '">');
            po.push('<thead>');
            po.push('<tr>');
            k = 0;
            while (k < 7)
            {
                po.push('<td class="calendar-col-' + k + '">');
                po.push(ax5.info.week_names[k].label);
                po.push('</td>');
                k++;
            }
            po.push('</tr>');
            po.push('</thead>');
            po.push('<tbody>');
            loop_date = table_start_date;
            i = 0;
            while (i < 6)
            {
                po.push('<tr>');
                k = 0;
                while (k < 7)
                {
                    po.push('<td class="calendar-col-' + k + '" style="' + item_styles.join(';') + ';">');
                    po.push('<a class="calendar-item-date ' + (function () {
                            if (cfg.selectable) {
                                if (cfg.selectable[U.date(loop_date, {"return": "yyyy-mm-dd"})]) {
                                    return ( loop_date.getMonth() == this_month ) ? "live" : "";
                                }
                                else {
                                    return "disable";
                                }
                            }
                            else {
                                return ( loop_date.getMonth() == this_month ) ? ( U.date(loop_date, {"return": "yyyymmdd"}) == U.date(_today, {"return": "yyyymmdd"}) ) ? "focus" : "live" : "";
                            }
                            
                        })() + ' ' + (function () {
                            return ""; //( U.date(loop_date, {"return":"yyyymmdd"}) == U.date(cfg.displayDate, {"return":"yyyymmdd"}) ) ? "hover" : "";
                        })() + '" data-calendar-item-date="' + U.date(loop_date, {"return": cfg.dateFormat}) + '"><span class="addon"></span>' + loop_date.getDate() + '<span class="lunar"></span></a>');
                    po.push('</td>');
                    k++;
                    loop_date = U.date(loop_date, {add: {d: 1}});
                }
                po.push('</tr>');
                i++;
            }
            po.push('</tbody>');
            po.push('</table>');
            
            this.$["body"].html(po.join(''));
            this.$["body"].find('[data-calendar-item-date]').on(cfg.clickEventName, function (e) {
                e = e || window.event;
                self.onclick(e);
                
                try {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    e.cancelBubble = true;
                } catch (e) {
                    
                }
                return false;
            });
            
            this.printedDay = {
                start: table_start_date, end: loop_date
            };
            
            if (cfg.on_event) {
                var that = {
                    action: "print_day",
                    printedDay: this.printedDay
                };
                cfg.on_event.call(that, that);
            }
            
            this.set_display();
        };
        
        this.print_month = function (now_date) {
            
            var _item_width = cfg.item_width * 7 / 3, _item_height = cfg.item_height * 6 / 4;
            
            var dot_date = U.date(now_date), n_month = dot_date.getMonth(), po = [],
                item_styles = ['width:' + _item_width + 'px', 'height:' + _item_height + 'px', 'line-height:' + (_item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px'], i, k, m;
            
            po.push('<table data-calendar-table="month" cellpadding="0" cellspacing="0" style="' + (function () {
                    return (cfg.width) ? 'width:' + cfg.width + 'px;' : 'width:100%;';
                })() + '">');
            po.push('<thead>');
            po.push('<tr>');
            
            po.push('<td class="calendar-col-0" colspan="3"> 월을 선택해주세요.');
            po.push('</td>');
            
            po.push('</tr>');
            po.push('</thead>');
            po.push('<tbody>');
            
            m = 0;
            i = 0;
            while (i < 4)
            {
                po.push('<tr>');
                k = 0;
                while (k < 3)
                {
                    po.push('<td class="calendar-col-' + i + '" style="' + item_styles.join(';') + ';">');
                    po.push('<a class="calendar-item-month live ' + (function () {
                            return ( m == n_month ) ? "hover" : "";
                        })() + '" data-calendar-item-month="' + (function () {
                            return dot_date.getFullYear() + '-' + U.set_digit(m + 1, 2) + '-' + U.set_digit(dot_date.getDate(), 2);
                        })() + '">' + (m + 1) + '월</a>');
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
                target = axd.parent(e.target, function (target) {
                    if (jQuery.attr(target, "data-calendar-item-month"))
                    {
                        return true;
                    }
                });
                if (target)
                {
                    value = axd.attr(target, "data-calendar-item-month");
                    self.change_mode("day", value);
                    //alert(value);
                    try {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                        e.cancelBubble = true;
                    } catch (e) {
                        
                    }
                    return false;
                }
            });
            
            this.set_display();
        };
        
        this.print_year = function (now_date) {
            var _item_width = cfg.item_width * 7 / 4, _item_height = cfg.item_height * 6 / 5;
            
            var dot_date = U.date(now_date), n_year = dot_date.getFullYear(), po = [],
                item_styles = ['width:' + _item_width + 'px', 'height:' + _item_height + 'px', 'line-height:' + (_item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px'], i, k, m;
            
            po.push('<table data-calendar-table="year" cellpadding="0" cellspacing="0" style="' + (function () {
                    return (cfg.width) ? 'width:' + cfg.width + 'px;' : 'width:100%;';
                })() + '">');
            po.push('<thead>');
            po.push('<tr>');
            
            po.push('<td class="calendar-col-0" colspan="4">년도를 선택해주세요');
            po.push('</td>');
            
            po.push('</tr>');
            po.push('</thead>');
            
            po.push('<tbody>');
            
            y = n_year - 10;
            i = 0;
            while (i < 5)
            {
                po.push('<tr>');
                k = 0;
                while (k < 4)
                {
                    po.push('<td class="calendar-col-' + i + '" style="' + item_styles.join(';') + ';">');
                    po.push('<a class="calendar-item-year live ' + (function () {
                            return ( y == n_year ) ? "hover" : "";
                        })() + '" data-calendar-item-year="' + (function () {
                            return y + '-' + U.set_digit(dot_date.getMonth() + 1, 2) + '-' + U.set_digit(dot_date.getDate(), 2);
                        })() + '">' + (y) + '년</a>');
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
                target = axd.parent(e.target, function (target) {
                    if (jQuery.attr(target, "data-calendar-item-year"))
                    {
                        return true;
                    }
                });
                if (target)
                {
                    value = axd.attr(target, "data-calendar-item-year");
                    self.change_mode("month", value);
                    
                    try {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                        e.cancelBubble = true;
                    } catch (e) {
                        
                    }
                    return false;
                }
            });
            
            this.set_display();
        };
        
        this.onclick = function (e, target, value) {
            target = axd.parent(e.target, function (target) {
                if (jQuery.attr(target, "data-calendar-item-date"))
                {
                    return true;
                }
            });
            if (target)
            {
                value = axd.attr(target, "data-calendar-item-date");
                var dt = U.date(value, {"return": cfg.dateFormat}), selectable = true;
                
                if (cfg.selectable) {
                    if (!cfg.selectable[dt]) selectable = false;
                }
                
                if (selectable) {
                    this.$["body"].find('[data-calendar-item-date="' + U.date(cfg.displayDate, {"return": cfg.dateFormat}) + '"]').class_name("remove", "hover");
                    axd.class_name(target, "add", "hover");
                    cfg.displayDate = value;
                    
                    if (this.config.onclick)
                    {
                        this.config.onclick.call({
                            date: value, target: this.target.elements[0], item_target: target
                        });
                    }
                }
            }
        };
        
        this.move = function (e, target, value) {
            target = axd.parent(e.target, function (target) {
                if (jQuery.attr(target, "data-calendar-move"))
                {
                    return true;
                }
            });
            if (target)
            {
                value = axd.attr(target, "data-calendar-move");
                
                if (cfg.mode == "day")
                {
                    if (value == "left")
                    {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {m: -1}});
                    }
                    else {
                        cfg.displayDate = U.date(cfg.displayDate, {add: {m: 1}});
                    }
                    this.print_day(cfg.displayDate);
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
                    this.print_month(cfg.displayDate);
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
                    this.print_year(cfg.displayDate);
                }
            }
        };
        
        this.change_mode = function (mode, change_date) {
            if (typeof change_date != "undefined") cfg.displayDate = change_date;
            cfg.mode = mode;
            
            this.$["body"].class_name("remove", "fadein").class_name("add", "fadeout");
            setTimeout((function () {
                if (cfg.mode == "day")
                {
                    this.print_day(cfg.displayDate);
                }
                else if (cfg.mode == "month")
                {
                    this.print_month(cfg.displayDate);
                }
                else if (cfg.mode == "year")
                {
                    this.print_year(cfg.displayDate);
                }
                this.$["body"].class_name("remove", "fadeout").class_name("add", "fadein");
            }).bind(this), 300);
        };
        
        this.set_displayDate = function (d) {
            cfg.displayDate = U.date(d);
            
            this.$["body"].class_name("remove", "fadein").class_name("add", "fadeout");
            setTimeout((function () {
                if (cfg.mode == "day")
                {
                    this.print_day(cfg.displayDate);
                }
                else if (cfg.mode == "month")
                {
                    this.print_month(cfg.displayDate);
                }
                else if (cfg.mode == "year")
                {
                    this.print_year(cfg.displayDate);
                }
                this.$["body"].class_name("remove", "fadeout").class_name("add", "fadein");
            }).bind(this), 300);
        };
        
    };
    //== UI Class
    
    //== ui class 공통 처리 구문
    if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
    root.calendar = axClass; // ax5.ui에 연결
    //== ui class 공통 처리 구문
    
})(ax5.ui, ax5.ui.root);