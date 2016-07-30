// ax5.ui.grid.tmpl
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var main =
        `<div data-ax5grid-container="root" data-ax5grid-instance="{{instanceId}}">
            <div data-ax5grid-container="header">
                <div data-ax5grid-panel="aside-header"></div>
                <div data-ax5grid-panel="left-header"></div>
                <div data-ax5grid-panel="header">
                    <div data-ax5grid-panel-scroll="header"></div>
                </div>
                <div data-ax5grid-panel="right-header"></div>
            </div>
            <div data-ax5grid-container="body">
                <div data-ax5grid-panel="top-aside-body"></div>
                <div data-ax5grid-panel="top-left-body"></div>
                <div data-ax5grid-panel="top-body">
                    <div data-ax5grid-panel-scroll="top-body"></div>
                </div>
                <div data-ax5grid-panel="top-right-body"></div>
                <div data-ax5grid-panel="aside-body">
                    <div data-ax5grid-panel-scroll="aside-body"></div>
                </div>
                <div data-ax5grid-panel="left-body">
                    <div data-ax5grid-panel-scroll="left-body"></div>
                </div>
                <div data-ax5grid-panel="body">
                    <div data-ax5grid-panel-scroll="body"></div>
                </div>
                <div data-ax5grid-panel="right-body">
                  <div data-ax5grid-panel-scroll="right-body"></div>
                </div>
                <div data-ax5grid-panel="bottom-aside-body"></div>
                <div data-ax5grid-panel="bottom-left-body"></div>
                <div data-ax5grid-panel="bottom-body">
                    <div data-ax5grid-panel-scroll="bottom-body"></div>
                </div>
                <div data-ax5grid-panel="bottom-right-body"></div>
            </div>
            <div data-ax5grid-container="scroller">
                <div data-ax5grid-scroller="vertical">
                    <div data-ax5grid-scroller="vertical-bar"></div>    
                </div>
                <div data-ax5grid-scroller="horizontal">
                    <div data-ax5grid-scroller="horizontal-bar"></div>
                </div>
                <div data-ax5grid-scroller="corner"></div>
            </div>
        </div>`;


    GRID.tmpl = {
        "main": main,

        get: function (tmplName, data) {
            return ax5.mustache.render(GRID.tmpl[tmplName], data);
        }
    };

})();