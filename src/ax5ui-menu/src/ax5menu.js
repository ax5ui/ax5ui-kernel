// ax5.ui.menu
(function (root, _SUPER_) {
    
    /**
     * @class ax5.ui.menu
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @example
     * ```
     * var menu = new ax5.ui.menu();
     * ```
     */
    var U = ax5.util;
    
    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출
        
        this.config = {
            theme: "default",
            //width: 200,
            iconWidth: 22,
            acceleratorWidth: 100,
            menuBodyPadding: 5,
            direction: "top-left", // top-left|top-right|bottom-left|bottom-right
            animateTime: 250,
            items: []
        };
        
        this.openTimer = null;
        this.closeTimer = null;
        this.queue = [];
        
        cfg = this.config;
        
        this.init = function () {
            // after set_config();
            self.menuId = ax5.getGuid();
        };
        
        /** private **/
        this.__getTmpl = function () {
            return `
            <div class="ax5-ui-menu {{theme}}">
                <div class="ax-menu-body">
                    {{#items}}
                        {{#divide}}
                        <div class="ax-menu-item-divide"></div>
                        {{/divide}}
                        {{^divide}}
                        <div class="ax-menu-item" data-menu-item-depth="{{@depth}}" data-menu-item-index="{{@i}}" data-menu-item-path="{{@path}}.{{@i}}">
                            <span class="ax-menu-item-cell ax-menu-item-icon" style="width:{{cfg.iconWidth}}px;">{{{icon}}}</span>
                            <span class="ax-menu-item-cell ax-menu-item-label">{{{label}}}</span>
                            {{#accelerator}}
                            <span class="ax-menu-item-cell ax-menu-item-accelerator" style="width:{{cfg.acceleratorWidth}}px;"><span class="item-wrap">{{.}}</span></span>
                            {{/accelerator}}
                            {{#@hasChild}}
                            <span class="ax-menu-item-cell ax-menu-item-handle">{{{cfg.icons.arrow}}}</span>
                            {{/@hasChild}}
                        </div>
                        {{/divide}}

                    {{/items}}
                </div>
                <div class="ax-menu-arrow"></div>
            </div>
            `;
        };
        
        /** private **/
        this.__popup = function (opt, items, depth, path) {
            var data = opt,
                activeMenu
                ;
            
            data.theme = opt.theme || cfg.theme;
            data.cfg = {
                icons: jQuery.extend({}, cfg.icons),
                iconWidth: opt.iconWidth || cfg.iconWidth,
                acceleratorWidth: opt.acceleratorWidth || cfg.acceleratorWidth
            };
            data.items = items;
            data['@depth'] = depth;
            data['@path'] = path || "root";
            data['@hasChild'] = function () {
                return this.items && this.items.length > 0;
            };
            activeMenu = jQuery(ax5.mustache.render(this.__getTmpl(), data));
            jQuery(document.body).append(activeMenu);
            
            // remove queue

            var removed = this.queue.splice(depth);
            removed.forEach(function (n) {
                n.$target.remove();
            });
            this.queue.push({
                '$target': activeMenu
            });
            
            activeMenu.find('[data-menu-item-index]').bind("mouseover", function () {
                var
                    depth = this.getAttribute("data-menu-item-depth"),
                    index = this.getAttribute("data-menu-item-index"),
                    path = this.getAttribute("data-menu-item-path")
                    ;

                activeMenu.find('[data-menu-item-index]').removeClass("hover");
                jQuery(this).addClass("hover");
                if (activeMenu.attr("data-selected-menu-item-index") != index) {
                    activeMenu.attr("data-selected-menu-item-index", index);
                    
                    if (items[index].items && items[index].items.length > 0) {

                        var $this = $(this),
                            offset = $this.offset(),
                            childOpt = {
                                left: offset.left + $this.width() - cfg.menuBodyPadding,
                                top: offset.top - cfg.menuBodyPadding - 1
                            };
                        childOpt = jQuery.extend(true, opt, childOpt);
                        self.__popup(childOpt, items[index].items, (depth + 1), path);
                    }
                    else{
                        self.queue.splice(Number(depth) + 1).forEach(function (n) {
                            n.$target.remove();
                        });
                    }
                }
            });

            // is Root
            if(depth == 0) {
                jQuery(document).bind("click.ax5menu", function (e) {
                    var target = U.findParentNode(e.target, function (target) {
                        if (target.getAttribute("data-menu-item-index"))
                        {
                            return true;
                        }
                    });
                    if (target)
                    {
                        // click item
                        var item = (function(path){
                            var item;
                            try {
                                item = (Function("", "return this.config.items[" + path.substring(5).replace(/\./g, '].items[') + "];")).call(self);
                            }catch (e){
                                console.log(ax5.info.getError("ax5menu", "501", "menuItemClick"));
                            }
                            return item;
                        })(target.getAttribute("data-menu-item-path"));

                        if(self.onClick){
                            self.onClick.call(item, item);
                            if(!item.items || item.items.length == 0) self.close();
                        }
                        if(cfg.onClick){
                            cfg.onClick.call(item, item);
                            if(!item.items || item.items.length == 0) self.close();
                        }
                    }
                    else
                    {
                        self.close();
                    }
                });
                jQuery(window).bind("keydown.ax5menu", function (e) {
                    if (e.which == ax5.info.eventKeys.ESC) {
                        self.close();
                    }
                });
                jQuery(window).bind("resize.ax5menu", function (e) {
                    self.close();
                });
            }
            
            this.__align(activeMenu, data);
            return this;
        };
        
        /** private **/
        this.__align = function (activeMenu, data) {
            //console.log(activeMenu.height());
            
            activeMenu.css({
                left: data.left,
                top: data.top
            });
            
            return this;
        };
        
        /**
         * @method ax5.ui.menu.popup
         * @param {Event|Object} e - Event or Object
         * @param {Object} [opt]
         * @returns {ax5.ui.menu} this
         */
        this.popup = (function () {
            
            var getOption = {
                'event': function (e, opt) {
                    e = {
                        left: e.clientX,
                        top: e.clientY,
                        width: cfg.width,
                        theme: cfg.theme,
                        direction: cfg.direction
                    };
                    opt = jQuery.extend(true, e, opt);
                    return opt;
                },
                'object': function (e, opt) {
                    e = {
                        left: e.left,
                        top: e.top,
                        width: e.width || cfg.width,
                        theme: e.theme || cfg.theme,
                        direction: e.direction || cfg.direction
                    };
                    opt = jQuery.extend(true, e, opt);
                    return opt;
                }
            };
            
            return function (e, opt) {
                
                if (!e) return this;
                opt = getOption[((typeof e.clientX == "undefined") ? "object" : "event")].call(this, e, opt);
                this.__popup(opt, cfg.items, 0); // 0 is seq of queue
                
                return this;
            }
        })();
        
        /**
         * @method ax5.ui.menu.close
         * @returns {ax5.ui.menu} this
         */
        this.close = function () {
            jQuery(document).unbind("click.ax5menu");
            jQuery(window).unbind("keydown.ax5menu");
            jQuery(window).unbind("resize.ax5menu");

            this.queue.forEach(function (n) {
                n.$target.remove();
            });
            this.queue = [];
            return this;
        };
        
        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };
    //== UI Class
    
    root.menu = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결
    
})(ax5.ui, ax5.ui.root);