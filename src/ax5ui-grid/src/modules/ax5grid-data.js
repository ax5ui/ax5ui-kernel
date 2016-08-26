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
            var i = 0, l = _list.length;
            var returnList = [];
            for (; i < l; i++) {
                if (_list[i][self.config.columnKeys.selected]) {
                    self.selectedDataIndexs.push(i);
                }
                returnList.push(jQuery.extend({}, _list[i]));
            }
            return returnList;
        };

        if (U.isArray(data)) {
            this.page = null;
            this.list = initData(data);
        } else if ("page" in data) {
            this.page = jQuery.extend({}, data.page);
            this.list = initData(data.list);
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.list.length) ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var get = function () {

    };

    var add = function (_row, _dindex) {
        var processor = {
            "first": function () {
                this.list = [].concat(_row).concat(this.list);
            },
            "last": function () {
                this.list = this.list.concat([].concat(_row));
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
            this.list.splice(_dindex, [].concat(_row))
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.list.length) ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var remove = function (_dindex) {
        var processor = {
            "first": function () {
                this.list.splice(_dindex, 1);
            },
            "last": function () {
                this.list.splice(this.list.length - 1, 1);
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
            this.list.splice(_dindex, 1);
        }

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.list.length) ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var update = function (_row, _dindex) {
        if (!U.isNumber(_dindex)) {
            throw 'invalid argument _dindex';
        }
        //
        this.list.splice(_dindex, 1, _row);
    };

    var setValue = function () {

    };

    var clearSelect = function () {
        this.selectedDataIndexs = [];
    };

    var select = function (_dindex, _selected) {
        var cfg = this.config;
        if (typeof _selected === "undefined") {
            if (this.list[_dindex][cfg.columnKeys.selected] = !this.list[_dindex][cfg.columnKeys.selected]) {
                this.selectedDataIndexs.push(_dindex);
            }
        } else {
            if (this.list[_dindex][cfg.columnKeys.selected] = _selected) {
                this.selectedDataIndexs.push(_dindex);
            }
        }
        return this.list[_dindex][cfg.columnKeys.selected];
    };

    var sort = function (_sortInfo) {
        var self = this;
        var sortInfoArray = [];

        for (var k in _sortInfo) {
            sortInfoArray[_sortInfo[k].seq] = {key: k, order: _sortInfo[k].orderBy};
        }
        sortInfoArray = U.filter(sortInfoArray, function () {
            return typeof this !== "undefined";
        });

        var i = 0, l = sortInfoArray.length, _a_val, _b_val;

        this.list.sort(function (_a, _b) {
            i = 0;
            for (; i < l; i++) {
                _a_val = _a[sortInfoArray[i].key];
                _b_val = _b[sortInfoArray[i].key];
                if (typeof _a_val !== typeof _b_val) {
                    _a_val = '' + _a_val;
                    _b_val = '' + _b_val;
                }

                if (_a_val < _b_val) {
                    return (sortInfoArray[i].order === "asc") ? -1 : 1;
                } else if (_a_val > _b_val) {
                    return (sortInfoArray[i].order === "asc") ? 1 : -1;
                }
            }
        });

        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.list.length) ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
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
        update: update,
        sort: sort
    };

})();