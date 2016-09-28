// ax5.ui.modal.tmpl
(function () {
    var MODAL = ax5.ui.modal;
    
    var content = function () {
        return ` 
        <div id="{{modalId}}" data-modal-els="root" class="ax5modal {{theme}} {{fullscreen}}" style="{{styles}}">
            {{#header}}
            <div class="ax-modal-header" data-modal-els="header">
                {{{title}}}
                {{#btns}}
                    <div class="ax-modal-header-addon">
                    {{#@each}}
                    <a tabindex="-1" data-modal-header-btn="{{@key}}" class="{{@value.theme}}">{{{@value.label}}}</a>
                    {{/@each}}
                    </div>
                {{/btns}}
            </div>
            {{/header}}
            <div class="ax-modal-body" data-modal-els="body">
            {{#iframe}}
            
                <div data-modal-els="iframe-wrap" style="-webkit-overflow-scrolling: touch; overflow: auto;position: relative;">
                    <table data-modal-els="iframe-loading" style="width:100%;height:100%;"><tr><td style="text-align: center;vertical-align: middle">{{{iframeLoadingMsg}}}</td></tr></table>
                    <iframe name="{{modalId}}-frame" src="" width="100%" height="100%" frameborder="0" data-modal-els="iframe" style="position: absolute;left:0;top:0;"></iframe>
                </div>
                <form name="{{modalId}}-form" data-modal-els="iframe-form">
                <input type="hidden" name="modalId" value="{{modalId}}" />
                {{#param}}
                {{#@each}}
                <input type="hidden" name="{{@key}}" value="{{@value}}" />
                {{/@each}}
                {{/param}}
                </form>
            {{/iframe}}
            </div>
        </div>
        `;
    };

    MODAL.tmpl = {
        "content" : content,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(MODAL.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();