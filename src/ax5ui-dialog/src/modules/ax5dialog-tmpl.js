// ax5.ui.dialog.tmpl
(function () {

    var DIALOG = ax5.ui.dialog;

    var dialogDisplay = function(columnKeys) {
        return ` 
        <div id="{{dialogId}}" data-ax5-ui="dialog" class="ax5-ui-dialog {{theme}}">
            <div class="ax-dialog-header">
                {{{title}}}
            </div>
            <div class="ax-dialog-body">
                <div class="ax-dialog-msg">{{{msg}}}</div>
                
                {{#input}}
                <div class="ax-dialog-prompt">
                    {{#@each}}
                    <div class="form-group">
                    {{#@value.label}}
                    <label>{{#_crlf}}{{{.}}}{{/_crlf}}</label>
                    {{/@value.label}}
                    <input type="{{@value.type}}" placeholder="{{@value.placeholder}}" class="form-control {{@value.theme}}" data-dialog-prompt="{{@key}}" style="width:100%;" value="{{@value.value}}" />
                    {{#@value.help}}
                    <p class="help-block">{{#_crlf}}{{.}}{{/_crlf}}</p>
                    {{/@value.help}}
                    </div>
                    {{/@each}}
                </div>
                {{/input}}
                
                <div class="ax-dialog-buttons">
                    <div class="ax-button-wrap">
                    {{#btns}}
                        {{#@each}}
                        <button type="button" data-dialog-btn="{{@key}}" class="btn btn-{{@value.theme}}">{{@value.label}}</button>
                        {{/@each}}
                    {{/btns}}
                    </div>
                </div>
            </div>
        </div>  
        `;
    };

    DIALOG.tmpl = {
        "dialogDisplay": dialogDisplay,
        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(DIALOG.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();