/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5layout TEST', function () {

    var tmpl = '<div data-ax5layout="ax1" data-config="{layout:\'dock-panel\'"}" style="height: 500px;border:1px solid #ccc;">' +
        '<div data-dock-panel="{dock:\'top\', split:true, height: 100, maxHeight: 300}" style="text-align: center;"><h4>TOP</h4></div>' +
        '<div data-dock-panel="{dock:\'bottom\', split:"true", height: 100, minHeight: 10, maxHeight: 300}" style="text-align: center;"><h4>BOTTOM</h4></div>' +
        '<div data-dock-panel="{dock:\'left\', split:true, width: 100, minWidth: 10, maxWidth: 300}"><h4>LEFT</h4></div>' +
        '<div data-dock-panel="{dock:\'right\', split:true, width: 100, minWidth: 10, maxWidth: 300}"><h4>RIGHT</h4></div>' +
        '<div data-dock-panel="{dock:\'center\'}" style="padding: 5px;text-align: center;">' +
        '<h4>CENTER</h4>' +
        '</div>' +
        '</div>';

    $(document.body).append(tmpl);

    ///
    it('bind ax5layout', function (done) {
        jQuery('[data-ax5layout]').ax5layout();
        done(ax5.ui.layout_instance.queue.length == 1 ? "" : "bind layout error");
    });

});