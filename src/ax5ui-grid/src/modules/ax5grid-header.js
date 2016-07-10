// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function () {
        this.header = []; // 헤더 초기화
        this.headerMap = {}; // 컬럼의 __id값으로 빠르게 데이터를 접근하기 위한 map

        var colIndex = 0, fieldID = 0;
        var makeHeader = function (columns, parentField) {
            var i = 0, l = columns.length;
            for (; i < l; i++) {
                var field = columns[i];
                field.__id = fieldID++;
                if ('columns' in field) {
                    field.childColumnIndexs = [];
                    makeHeader.call(this, field.columns, field);
                }
                else{
                    field["columnIndex"] = colIndex++;
                    if(parentField){
                        parentField.childColumnIndexs.push(field["columnIndex"]);
                    }
                }
                this.headerMap[field.__id] = field;
            }
        };
        makeHeader.call(this, this.columns);

        //console.log(JSON.stringify(this.columns));
        // console.log(this.headerMap);
    };

    var render = function(){

    };

    root.header = {
        init: init,
        render: render
    };

})(ax5.ui.grid);