describe('ax5.util.getObject TEST', function() {

    var array = [5,4,3,2,1];
    it('ax5.util.filter([5,4,3,2,1],function(){return this%2;})' , function(){
        var result = ax5.util.filter(array,function(){
            return this % 2;
        });

        _.isEqual(result , [5,3,1]).should.equal(true);
    });

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
});
