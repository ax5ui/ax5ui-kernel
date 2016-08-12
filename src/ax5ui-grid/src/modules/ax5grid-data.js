// ax5.ui.grid.layout
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function () {

    };

    var set = function (data) {

        if(U.isArray(data)){
            this.page = null;
            this.data = U.deepCopy(data);
        }else if("page" in data){
            this.page = jQuery.extend({}, data.page);
            this.data = U.deepCopy(data.list);
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.data.length) ? this.data.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var get = function () {

    };

    var add = function(_row, _dindex){
        var processor = {
            "first": function(){
                this.data = [].concat(_row).concat(this.data);
            },
            "last": function(){
                this.data = this.data.concat([].concat(_row));
            }
        };

        if(typeof _dindex === "undefined") _dindex = "last";
        if(_dindex in processor){
            processor[_dindex].call(this, _row);
        }else{
            if(!U.isNumber(_dindex)){
                throw 'invalid argument _dindex';
            }
            //
            this.data.splice(_dindex, [].concat(_row))
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.data.length) ? this.data.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var remove = function(_dindex){
        var processor = {
            "first": function(){
                //this.data = [].concat(_row).concat(this.data);
            },
            "last": function(){
                //this.data = this.data.concat([].concat(_row));
            }
        };

        if(typeof _dindex === "undefined") _dindex = "last";

    };

    var update = function(){

    };

    var setValue = function(){

    };

    var select = function(dindex, selected){
        if(typeof selected === "undefined") {
            this.data[dindex][this.config.columnKeys.selected] = !this.data[dindex][this.config.columnKeys.selected];
        }else{
            this.data[dindex][this.config.columnKeys.selected] = selected;
        }
        return this.data[dindex][this.config.columnKeys.selected];
    };

    GRID.data = {
        init: init,
        set: set,
        get: get,
        setValue: setValue,
        select: select,
        add: add,
        remove: remove,
        update: update
    };

})();