describe('ax5.util.getObject TEST', function() {

    /* ax5.util.filter */
    //example 01
    var array = [5,4,3,2,1];
    it('ax5.util.filter([5,4,3,2,1],function(){return this%2;})' , function(){
        var result = ax5.util.filter(array,function(){
            return this % 2;
        });

        _.isEqual(result , [5,3,1]).should.equal(true);
    });

    //example 02
    var list = [
        {isdel : 1 , name : "ax5-1"},
        {name : "ax5-2"},
        {isdel : 1 , name : "ax5-3"},
        {name : "ax5-4"},
        {name : "ax5-5"}
    ];

    it('ax5.util.filter([{isdel : 1 , name : "ax5-1"},{name : "ax5-2"},{isdel : 1 , name : "ax5-3"},{name : "ax5-4"},{name : "ax5-5"}] , function(){return (this.isdel !=1)})' , function(){
        var result = ax5.util.filter(list , function(){
            return (this.isdel != 1);
        });
        
        _.isEqual(result , [{name : "ax5-2"},{name : "ax5-4"},{name : "ax5-5"}  ]).should.equal(true);
    });

    //example03
    var filObject = {
        a : 1, 
        s : "string", 
        oa : {pickup:true, name:"AXISJ"}, 
        os : {pickup:true, name:"AX5"}
    };

    it('ax5.util.filter( {a : 1, s : "string", oa : {pickup:true, name:"AXISJ"}, os : {pickup:true, name:"AX5"}}; , function(){return this.pickup;})' , function(){
        var result = ax5.util.filter(filObject , function(){
            return this.pickup;
        });

        _.isEqual(ax5.util.toJson(result) , [{"pickup": true, "name": "AXISJ"}, {"pickup": true , "name": "AX5"}]).should.equal(true);
    });
    
    /* end ax5.util.filter */
    /*ax5.util.search */
    //example01
    var a = ["A" , "X" , "5"];

    it('ax5.util.search(["A" , "X" , "5"], function(){return this == "X"})' , function(){
        var idx = ax5.util.search(a , function(){
            return this == "X";
        });

        _.isEqual(a[idx] , "X").should.equal(true);
    });

    //example02
    var a = ["A" , "X" ,"5"];

    it('["A" , "X" ,"5"][ax5.util.search(["A" , "X" ,"5"] , function(idx){return idx == 2;})]' , function(){
        var result = a[ax5.util.search(a,function(idx){
            return idx == 2;})
        ];

        _.isEqual(result,"5").should.equal(true);
    });

    //example03
    var b = {a:"AX5-0" , x: "AX5-1" , 5:"AX5-2"};

    it('{a:"AX5-0" , x:"AX5-1" , 5:"AX5-2"}[ax5.util.search(b , function(k){return k == "x"})]' , function(){
        var result = b[ax5.util.search(b,function(k){
            return k == "x";
        })];

        _.isEqual(result , "AX5-1").should.equal(true);
    });
    /*end ax5.util.search */

    /*ax5.util.map*/
    //Usage 01
    var map_a = [1,2,3,4,5];

    it('[1,2,3,4,5] = ax5.util.map([1,2,3,4,5] , function(){return {id : this}})' , function(){
        map_a = ax5.util.map(map_a, function(){
            return {id: this}
        });

        _.isEqual(map_a , [{"id": 1},{"id": 2},{"id": 3},{"id": 4},{"id": 5}]).should.equal(true);
    });

    //Usage 02
    it('ax5.util.map({a: 1, b: 2}, function (k, v) {return {id: k, value: v};})' , function(){
    
        _.isEqual(ax5.util.map({a: 1, b: 2}, function (k, v) {return {id: k, value: v};}) , [{"id":"a","value":1},{"id":"b","value":2}]).should.equal(true);   
    });
    /*end ax5.util.map*/

     /*ax5.util.merge*/
    it('ax5.util.merge([1,2,3],[7,8,9])' , function(){
        _.isEqual(ax5.util.merge([1,2,3],[7,8,9]) , [1,2,3,7,8,9]).should.equal(true);
    });
    /*end ax5.util.merge*/

    /*ax5.util.reduce*/
    //Example01
    it('ax5.util.reduce([5,4,3,2,1]) , function(p , n){return p*n;}' , function(){
        should.deepEqual(ax5.util.reduce([5,4,3,2,1] , function(p,n){return p*n;}) , 120);
    });
    //Example02
    it('ax5.util.reduce({a:1,b:2} , function(p,n){ return parseInt(p || 0) + parseInt(n);})' , function(){
        should.deepEqual(ax5.util.reduce({a:1,b:2} , function(p,n){ return parseInt(p || 0) + parseInt(n);}), 3);
    });
    /*end ax5.util.reduce*/

    /*ax5.util.reduceRight*/
    it('ax5.util.reduceRight([5,4,3,2,1] , function(p,n){return p-n;})' ,function(){
        should.deepEqual(ax5.util.reduceRight([5,4,3,2,1] , function(p,n){return p-n;}) , -13);
    });
    /*end ax5.util.reduceRight*/
});
