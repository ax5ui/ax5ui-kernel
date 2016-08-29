// ax5.ui.grid.layout
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function () {

    };

    var clearGroupingData = function(_list){
        var i = 0, l = _list.length;
        var returnList = [];
        for (; i < l; i++) {
            if (_list[i] && !("__groupingList" in _list[i])) {
                if (_list[i][this.config.columnKeys.selected]) {
                    this.selectedDataIndexs.push(i);
                }
                returnList.push(_list[i]);
            }
        }
        return returnList;
    };

    var initData = function (_list) {
        this.selectedDataIndexs = [];
        var i = 0, l = _list.length;
        var returnList = [];

        if (this.config.body.grouping) {
            // 데이터 그룹핑 해야 하면.
            //this.bodyGrouping.by
            // 1. sortInfo에 grouping.by 로 정렬되게함.
            var sortInfo = {};
            for (var k = 0, kl = this.bodyGrouping.by.length; k < kl; k++) {
                sortInfo[this.bodyGrouping.by[k]] = {
                    orderBy: "asc",
                    seq: k
                }
            }
            // 2. sortInfo로 list 정렬
            _list = sort.call(this, sortInfo, _list);
            // 3. grouping.by로 grouping.columns 열 삽입

            var groupingKeys = U.map(this.bodyGrouping.by, function () {
                return {
                    key: this,
                    compareString: "",
                    grouping: false,
                    list: []
                }
            });
            var gi = 0, gl = groupingKeys.length, compareString, appendRow = [], ari;

            for (; i < l + 1; i++) {
                gi = 0;

                compareString = "";
                appendRow = [];
                for (; gi < gl; gi++) {
                    if (_list[i]) {
                        compareString += "$|$" + _list[i][groupingKeys[gi].key];
                    }
                    if (i > 0 && compareString != groupingKeys[gi].compareString) {
                        var appendRowItem = {keys:[], labels:[], list: groupingKeys[gi].list};
                        for(var ki =0;ki<gi+1;ki++){
                            appendRowItem.keys.push(groupingKeys[ki].key);
                            appendRowItem.labels.push(_list[i - 1][groupingKeys[ki].key]);
                        }
                        appendRow.push(appendRowItem);
                        groupingKeys[gi].list = [];
                    }
                    groupingKeys[gi].list.push(_list[i]);
                    groupingKeys[gi].compareString = compareString;
                }

                ari = appendRow.length;
                while (ari--) {
                    returnList.push({__groupingList: appendRow[ari].list, __groupingBy:{ keys: appendRow[ari].keys, labels: appendRow[ari].labels }});
                }

                if (_list[i]) {
                    if (_list[i][this.config.columnKeys.selected]) {
                        this.selectedDataIndexs.push(i);
                    }
                    returnList.push(_list[i]);
                }
            }
        }
        else {
            for (; i < l; i++) {
                if (_list[i]) {
                    if (_list[i][this.config.columnKeys.selected]) {
                        this.selectedDataIndexs.push(i);
                    }
                    returnList.push(_list[i]);
                }
            }
        }

        return returnList;
    };

    var set = function (data) {
        var self = this;

        if (U.isArray(data)) {
            this.page = null;
            this.list = initData.call(this, data);
        } else if ("page" in data) {
            this.page = jQuery.extend({}, data.page);
            this.list = initData.call(this, data.list);
        }

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.list.length) ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);

        if (this.config.body.grouping) {

        }
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

        if (this.config.body.grouping) {
            this.list = initData.call(this, clearGroupingData.call(this, this.list));
        }

        this.needToPaintSum = true;
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
                var lastIndex = this.list.length - 1;
                if (this.config.body.grouping && lastIndex > 0) {
                    while(lastIndex){
                        if("__groupingList" in this.list[lastIndex]){
                            lastIndex--;
                        }else{
                            break;
                        }
                    }
                }
                this.list.splice(lastIndex, 1);
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

        if (this.config.body.grouping) {
            this.list = initData.call(this, clearGroupingData.call(this, this.list));
        }

        this.needToPaintSum = true;
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
        this.needToPaintSum = true;
        this.list.splice(_dindex, 1, _row);

        if (this.config.body.grouping) {
            this.list = initData.call(this, clearGroupingData.call(this, this.list));
        }
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

    var sort = function (_sortInfo, _list) {
        var self = this;
        var list = _list || this.list;
        var sortInfoArray = [];

        for (var k in _sortInfo) {
            sortInfoArray[_sortInfo[k].seq] = {key: k, order: _sortInfo[k].orderBy};
        }
        sortInfoArray = U.filter(sortInfoArray, function () {
            return typeof this !== "undefined";
        });

        var i = 0, l = sortInfoArray.length, _a_val, _b_val;

        list.sort(function (_a, _b) {
            i = 0;
            if(_a.__groupingList || _a.__groupingList){
                return 0;
            }
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

        if (_list) {
            return list;
        } else {
            this.xvar.frozenRowIndex = (this.config.frozenRowIndex > this.list.length) ? this.list.length : this.config.frozenRowIndex;
            this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
            GRID.page.navigationUpdate.call(this);
            return this;
        }

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
        sort: sort,
        clearGroupingData: clearGroupingData
    };

})();