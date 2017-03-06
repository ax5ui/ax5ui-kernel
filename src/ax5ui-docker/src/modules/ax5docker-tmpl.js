// ax5.ui.docker.tmpl
(function () {

    let DOCKER = ax5.ui.docker;

    let stack_panel = function (columnKeys, data) {
        if(data.labelDirection === "bottom"){
            return `<div data-ax5docker-pane="{{id}}" data-ax5docker-label-direction="{{labelDirection}}" data-ax5docker-path="{{panelPath}}" style="flex-grow: {{#flexGrow}}{{.}}{{/flexGrow}}{{^flexGrow}}1{{/flexGrow}};">
    <div data-ax5docker-pane-item-views="{{id}}"></div>
    <ul data-ax5docker-pane-tabs="{{id}}" data-ax5docker-id="{{id}}" data-ax5docker-path="{{panelPath}}"></ul>
    <div data-ax5docker-pane-tabs-more="{{id}}">{{{icons.more}}}</div>
</div>`;
        }else{
            return `<div data-ax5docker-pane="{{id}}" data-ax5docker-label-direction="{{labelDirection}}" data-ax5docker-path="{{panelPath}}" style="flex-grow: {{#flexGrow}}{{.}}{{/flexGrow}}{{^flexGrow}}1{{/flexGrow}};">
    <ul data-ax5docker-pane-tabs="{{id}}" data-ax5docker-id="{{id}}" data-ax5docker-path="{{panelPath}}"></ul>
    <div data-ax5docker-pane-tabs-more="{{id}}">{{{icons.more}}}</div>
    <div data-ax5docker-pane-item-views="{{id}}"></div>
</div>`;
        }
    };

    let panel_label = function () {
        return `<li data-ax5docker-pane-tab="{{pIndex}}" data-ax5docker-id="{{id}}" data-ax5docker-path="{{panelPath}}">
    <div class="title">{{{name}}}</div>
    {{^disableClosePanel}}<div class="close-icon">{{{icons.close}}}</div>{{/disableClosePanel}}
</li><li class="pane-tab-margin"></li>`;
    };

    DOCKER.tmpl = {
        "stack-panel": stack_panel,
        "panel-label": panel_label,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(DOCKER.tmpl[tmplName].call(this, columnKeys, data), data);
        }
    };

})();