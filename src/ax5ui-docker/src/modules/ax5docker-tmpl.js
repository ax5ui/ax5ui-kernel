// ax5.ui.docker.tmpl
(function () {

    let DOCKER = ax5.ui.docker;

    let stack_panel = function () {
        return `<div data-ax5docker-pane="" data-ax5docker-path="{{panelPath}}" style="flex-grow: {{#flexGrow}}{{.}}{{/flexGrow}}{{^flexGrow}}1{{/flexGrow}};">
    <ul data-ax5docker-pane-tabs=""></ul>
    <div data-ax5docker-pane-tabs-more="">{{{icons.more}}}</div>
    <div data-ax5docker-pane-item-views=""></div>
</div>`;
    };

    let panel_label = function () {
        return `<li data-ax5docker-pane-tab="{{pIndex}}" data-ax5docker-path="{{panelPath}}">
    <div class="title">{{{name}}}</div>
    {{^disableClosePanel}}<div class="close-icon">{{{icons.close}}}</div>{{/disableClosePanel}}
</li>`;
    };

    DOCKER.tmpl = {
        "stack-panel": stack_panel,
        "panel-label": panel_label,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(DOCKER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();