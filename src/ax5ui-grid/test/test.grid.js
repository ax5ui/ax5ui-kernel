/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5grid TEST', function () {
    var myUI;
    var tmpl = '<div data-ax5grid="first-grid" data-ax5grid-config="" style="height: 300px;"></div>';

    $(document.body).append(tmpl);
    
    ///
    it('new ax5grid', function (done) {
        try {
            myUI = new ax5.ui.grid();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('setConfig ax5grid', function (done) {
        myUI.setConfig({
            target: $('[data-ax5grid="first-grid"]'),
            frozenColumnIndex: 3,
            frozenRowIndex: 1,
            showLineNumber: true,
            showRowSelector: true,
            multipleSelect: true,
            lineNumberColumnWidth: 40,
            rowSelectorColumnWidth: 28,
            sortable: true, // 모든 컬럼에 정렬 아이콘 표시
            multiSort: false, // 다중 정렬 여부
            remoteSort: false, // remoteSort에 함수를 sortable 컬럼이 클릭되었을때 실행 setColumnSort를 직접 구현. (remoteSort를 사용하면 헤더에 정렬 상태만 표시 하고 데이터 정렬은 처리 안함)
            header: {
                align: "center",
                columnHeight: 28
            },
            body: {
                mergeCells: true,
                align: "center",
                columnHeight: 28,
                onClick: function () {

                },
                grouping: {
                    by: ["b"],
                    columns: [
                        {
                            label: function () {
                                return this.groupBy.labels.join(", ") + " 합계";
                            }, colspan: 2
                        },
                        {key: "price", collector: "avg", formatter: "money", align: "right"},
                        {key: "amount", collector: "sum", formatter: "money", align: "right"},
                        {
                            key: "cost", collector: function () {
                            var value = 0;
                            this.list.forEach(function (n) {
                                if (!n.__isGrouping) value += (n.price * n.amount);
                            });
                            return ax5.util.number(value, {"money": 1});
                        }, align: "right"
                        },
                        {label: "~~~", colspan: 3}
                    ]
                }
            },
            page: {
                navigationItemCount: 9,
                height: 30,
                display: true,
                firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
                prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                onChange: function () {

                }
            },
            columns: [
                {
                    key: "a",
                    label: "필드A",
                    width: 80,
                    styleClass: function () {
                        return "ABC";
                    },
                    enableFilter: true,
                    align: "center",
                    editor: {
                        type: "text", disabled: function () {
                            // item, value
                            return false;
                        }
                    }
                },
                {key: "b", label: "필드B", align: "center", editor: {type: "text"}},
                {
                    key: undefined,
                    label: "필드C", columns: [
                    {key: "price", label: "단가", align: "right", editor: {type: "money", updateWith: ['cost']}},
                    {key: "amount", label: "수량", align: "right", formatter: "money", editor: {type: "number", updateWith: ['cost']}},
                    {
                        key: "cost", label: "금액", align: "right", formatter: function () {
                        return ax5.util.number(this.item.price * this.item.amount, {"money": true});
                    }
                    }
                ]
                },
                {
                    key: "saleDt", label: "판매일자", align: "center", editor: {
                    type: "date", config: {}
                }
                },
                {
                    key: "isChecked", label: "체크박스", width: 50, sortable: false, editor: {
                    type: "checkbox", config: {height: 17, trueValue: "Y", falseValue: "N"}
                }
                },
                {
                    key: "saleType", label: "판매타입", editor: {
                    type: "select", config: {
                        columnKeys: {
                            optionValue: "CD", optionText: "NM"
                        },
                        options: [
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "D", NM: "D: substring"}
                        ]
                    }
                }
                },

                {
                    key: "customer", label: "고객명", editor: {type: "text"}
                }
            ],
            footSum: [
                [
                    {label: "전체 합계", colspan: 2, align: "center"},
                    {key: "price", collector: "avg", formatter: "money", align: "right"},
                    {key: "amount", collector: "sum", formatter: "money", align: "right"},
                    {
                        key: "cost", collector: function () {
                        var value = 0;
                        this.list.forEach(function (n) {
                            if (!n.__isGrouping) value += (n.price * n.amount);
                        });
                        return ax5.util.number(value, {"money": 1});
                    }, align: "right"
                    }
                ]]
        });

        done();
    });

    it('setData', function (done) {
        myUI.setData([
            {a:"1"}
        ]);
        // has body.grouping
        done(myUI.list.length == 2 ? "" : "error");
    });

});