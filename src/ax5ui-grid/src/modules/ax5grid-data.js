// ax5.ui.grid.layout
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function () {

    };

    var set = function (data) {
        var self = this;
        var initData = function (_list) {
            // selected 데이터 초기화
            self.selectedDataIndexs = [];
            var i = _list.length;
            var returnList = [];
            while (i--) {
                if (_list[i][self.config.columnKeys.selected]) {
                    self.selectedDataIndexs.push(i);
                }
                returnList.push(jQuery.extend({}, _list[i]));
            }
            return returnList;
        };

        if (U.isArray(data)) {
            this.page = null;
            this.data = initData(data);
        } else if ("page" in data) {
            this.page = jQuery.extend({}, data.page);
            this.data = initData(data.list);
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.data.length) ? this.data.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var get = function () {

    };

    var add = function (_row, _dindex) {
        var processor = {
            "first": function () {
                this.data = [].concat(_row).concat(this.data);
            },
            "last": function () {
                this.data = this.data.concat([].concat(_row));
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";
        if (_dindex in processor) {
            processor[_dindex].call(this, _row);
        } else {
            if (!U.isNumber(_dindex)) {
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

    var remove = function (_dindex) {
        var processor = {
            "first": function () {
                this.data.splice(_dindex, 1);
            },
            "last": function () {
                this.data.splice(this.data.length - 1, 1);
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";
        if (_dindex in processor) {
            processor[_dindex].call(this, _dindex);
        } else {
            if (!U.isNumber(_dindex)) {
                throw 'invalid argument _dindex';
            }
            //
            this.data.splice(_dindex, 1);
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.data.length) ? this.data.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var update = function (_row, _dindex) {
        if (!U.isNumber(_dindex)) {
            throw 'invalid argument _dindex';
        }
        //
        this.data.splice(_dindex, 1, _row);
    };

    var setValue = function () {

    };

    var clearSelect = function(){
        this.selectedDataIndexs = [];
    };

    var select = function (dindex, selected) {
        if (typeof selected === "undefined") {
            if(this.data[dindex][this.config.columnKeys.selected] = !this.data[dindex][this.config.columnKeys.selected]){
                this.selectedDataIndexs.push(dindex);
            }
        } else {
            if(this.data[dindex][this.config.columnKeys.selected] = selected){
                this.selectedDataIndexs.push(dindex);
            }
        }
        return this.data[dindex][this.config.columnKeys.selected];
    };


    GRID.data = {
        init: init,
        set: set,
        get: get,
        setValue: setValue,
        clearSelect: clearSelect,
        select: select,
        add: add,
        remove: remove,
        update: update
    };

})();