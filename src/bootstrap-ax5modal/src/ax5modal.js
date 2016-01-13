// ax5.ui.modal
(function (root, _SUPER_) {
    
    /**
     * @class ax5.ui.modal
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @logs
     * 2014-06-23 tom : 시작
     * @example
     * ```
     * var my_modal = new ax5.ui.modal();
     * ```
     */
    
    var U = ax5.util;
    
    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;
        
        // 클래스 생성자
        this.main = (function () {
            if (_SUPER_) _SUPER_.call(this); // 부모호출
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
                theme: 'default',
                width: 300,
                height: 400,
                title: '',
                heading: {
                    height: 30
                },
                closeToEsc: true
            };
        }).apply(this, arguments);
        
        this.activeModal = null;
        this.els = {};
        
        // extended config copy cfg
        cfg = this.config;
        cfg.id = 'ax5-modal-' + ax5.getGuid();
        
        /**
         * Preferences of modal UI
         * @method ax5.ui.modal.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * ```
         */
            //== class body start
        this.init = function () {
            
        };
        
        this.getContent = function (modalId, opts) {
            var
                po = [];
            
            po.push('<div id="' + modalId + '" data-modal-els="root" class="ax5-ui-modal ' + opts.theme + '">');
            po.push('<div class="ax-modal-heading" data-modal-els="heading" style="height:' + cfg.heading.height + 'px;line-height:' + cfg.heading.height + 'px;">');
            po.push((opts.title || ""));
            po.push('</div>');
            po.push('<div class="ax-modal-body" data-modal-els="body">');
            // use iframe
            if (opts.http) {
                po.push('<iframe name="' + modalId + '-frame" src="" width="100%" height="100%" frameborder="0" data-modal-els="iframe"></iframe>');
                po.push('<form name="' + modalId + '-form" data-modal-els="iframe-form">');
                po.push('<input type="hidden" name="modalId" value="' + modalId + '" />');
                for (var p in opts.http.param) {
                    po.push('<input type="hidden" name="' + p + '" value="' + opts.http.param[p] + '" />');
                }
                po.push('</form>');
            }
            po.push('</div>');
            
            po.push('</div>');
            return po.join('');
        };
        
        this.open = function (opts) {
            var
                pos = {},
                box = {},
                po;
            
            opts.id = (opts.id);

            box = {
                width: opts.width || cfg.width,
                height: opts.height || cfg.height
            };
            axd.append(document.body, this.getContent(opts.id, opts));
            
            this.activeModal = jQuery('#' + opts.id);

            // 파트수집
            this.els = {
                "root": this.activeModal.find('[data-modal-els="root"]'),
                "heading": this.activeModal.find('[data-modal-els="heading"]'),
                "body": this.activeModal.find('[data-modal-els="body"]')
            };
            
            if (opts.http) {
                this.els["iframe"] = this.activeModal.find('[data-modal-els="iframe"]');
                this.els["iframe-form"] = this.activeModal.find('[data-modal-els="iframe-form"]');
            }
            
            //- position 정렬
            if (typeof opts.position === "undefined" || opts.position === "center") {
                box.top = ax5.dom.height(document.body) / 2 - box.height / 2;
                box.left = ax5.dom.width(document.body) / 2 - box.width / 2;
            }
            else {
                box.left = opts.position.left || 0;
                box.top = opts.position.top || 0;
            }
            this.activeModal.css(box);
            
            if (opts.http) {
                this.els["iframe"].css({height: box.height - cfg.heading.height});
                
                // iframe content load
                this.els["iframe-form"].attr({"method": opts.http.method});
                this.els["iframe-form"].attr({"target": opts.id + "-frame"});
                this.els["iframe-form"].attr({"action": opts.http.url});
                this.els["iframe"].on("load", (function () {
                    if (opts.onload) opts.onload.call(opts);
                    else if (cfg.onload) cfg.onload.call(opts);
                }).bind(this));
                this.els["iframe-form"].elements[0].submit();
            }
            else {
                var that = {
                    id: opts.id,
                    theme: opts.theme,
                    width: opts.width,
                    height: opts.height
                };
                U.extend(that, this.els);
                if (opts.onload) opts.onload.call(that);
                else if (cfg.onload) cfg.onload.call(that);
            }
            
            // bind key event
            if (cfg.closeToEsc) {
                axd(window).on("keydown.ax-modal", (function (e) {
                    this.onkeyup(e || window.event, opts);
                }).bind(this));
            }
        };
        
        this.onkeyup = function (e, opts, target, k) {
            if (e.keyCode == ax5.info.event_keys.ESC) {
                this.close();
                if (opts.onclose) opts.onclose.call(opts);
                else if (cfg.onclose) cfg.onclose.call(opts);
            }
        };
        
        /**
         * close the modal
         * @method ax5.ui.modal.close
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * my_modal.close();
         * ```
         */
        this.close = function () {
            if (this.activeModal) {
                this.activeModal.remove();
                this.mask.close();
                this.activeModal = null;
                axd(window).off("keydown.ax-modal");
            }
            return this;
        }
    };
    //== UI Class
    
    //== ui class 공통 처리 구문
    if (U.is_function(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
    root.modal = axClass; // ax5.ui에 연결
    //== ui class 공통 처리 구문
    
})(ax5.ui, ax5.ui.root);