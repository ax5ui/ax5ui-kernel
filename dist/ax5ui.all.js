'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};(function(){'use strict'; // root of function
var root=this,win=window,doc=document,docElem=document.documentElement,reIsJson=/^(["'](\\.|[^"\\\n\r])*?["']|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/,reMs=/^-ms-/,reSnakeCase=/[\-_]([\da-z])/gi,reCamelCase=/([A-Z])/g,reDot=/\./,reInt=/[-|+]?[\D]/gi,reNotNum=/\D/gi,reMoneySplit=new RegExp('([0-9])([0-9][0-9][0-9][,.])'),reAmp=/&/g,reEq=/=/,reClassNameSplit=/[ ]+/g, /** @namespace {Object} ax5 */ax5={},info,U,dom; /**
     * guid
     * @member {Number} ax5.guid
     */ax5.guid=1; /**
     * ax5.guid를 구하고 증가시킵니다.
     * @method ax5.getGuid
     * @returns {Number} guid
     */ax5.getGuid=function(){return ax5.guid++;}; /**
     * 상수모음
     * @namespace ax5.info
     */ax5.info=info=function(){ /**
         * ax5 version
         * @member {String} ax5.info.version
         */var version="0.0.1"; /**
         * ax5 library path
         * @member {String} ax5.info.baseUrl
         */var baseUrl=""; /**
         * ax5 에러 출력메세지 사용자 재 정의
         * @member {Object} ax5.info.onerror
         * @examples
         * ```
         * ax5.info.onerror = function(){
		 *  console.log(arguments);
		 * }
         * ```
         */var onerror=function onerror(){console.error(U.toArray(arguments).join(":"));}; /**
         * event keyCodes
         * @member {Object} ax5.info.eventKeys
         * @example
         * ```
         * {
		 * 	BACKSPACE: 8, TAB: 9,
		 * 	RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
		 * 	HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
		 * }
         * ```
         */var eventKeys={BACKSPACE:8,TAB:9,RETURN:13,ESC:27,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46,HOME:36,END:35,PAGEUP:33,PAGEDOWN:34,INSERT:45,SPACE:32};var weekNames=[{label:"SUN"},{label:"MON"},{label:"TUE"},{label:"WED"},{label:"THU"},{label:"FRI"},{label:"SAT"}]; /**
         * 사용자 브라우저 식별용 오브젝트
         * @member {Object} ax5.info.browser
         * @example
         * ```
         * console.log( ax5.info.browser );
         * //Object {name: "chrome", version: "39.0.2171.71", mobile: false}
         * ```
         */var browser=function(ua,mobile,browserName,match,browser,browserVersion){ua=navigator.userAgent.toLowerCase(),mobile=ua.search(/mobile/g)!=-1,browserName,match,browser,browserVersion;if(ua.search(/iphone/g)!=-1){return {name:"iphone",version:0,mobile:true};}else if(ua.search(/ipad/g)!=-1){return {name:"ipad",version:0,mobile:true};}else if(ua.search(/android/g)!=-1){match=/(android)[ \/]([\w.]+)/.exec(ua)||[];browserVersion=match[2]||"0";return {name:"android",version:browserVersion,mobile:mobile};}else {browserName="";match=/(opr)[ \/]([\w.]+)/.exec(ua)||/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];browser=match[1]||"";browserVersion=match[2]||"0";if(browser=="msie")browser="ie";return {name:browser,version:browserVersion,mobile:mobile};}ua=null,mobile=null,browserName=null,match=null,browser=null,browserVersion=null;}(); /**
         * 브라우저 여부
         * @member {Boolean} ax5.info.isBrowser
         */var isBrowser=!!(typeof window!=='undefined'&&typeof navigator!=='undefined'&&win.document); /**
         * 브라우저에 따른 마우스 휠 이벤트이름
         * @member {Object} ax5.info.wheelEnm
         */var wheelEnm=/Firefox/i.test(navigator.userAgent)?"DOMMouseScroll":"mousewheel"; /**
         * 첫번째 자리수 동사 - (필요한것이 없을때 : 4, 실행오류 : 5)
         * 두번째 자리수 목적어 - 문자열 0, 숫자 1, 배열 2, 오브젝트 3, 함수 4, DOM 5, 파일 6, 기타 7
         * 세번째 자리수 옵션
         * @member {Object} ax5.info.errorMsg
         */var errorMsg={}; /**
         * 현재 페이지의 Url 정보를 리턴합니다.
         * @method ax5.info.urlUtil
         * @returns {Object}
         * @example
         * ```
         * console.log( ax5.util.toJson( ax5.util.urlUtil() ) );
         * {
		 *	"baseUrl": "http://ax5:2018",
		 *	"href": "http://ax5:2018/samples/index.html?a=1&b=1#abc",
		 *	"param": "a=1&b=1",
		 *	"referrer": "",
		 *	"pathname": "/samples/index.html",
		 *	"hostname": "ax5",
		 *	"port": "2018",
		 *	"url": "http://ax5:2018/samples/index.html",
		 *	"hashdata": "abc"
		 * }
         * ```
         */function urlUtil(url,urls){url={href:win.location.href,param:win.location.search,referrer:doc.referrer,pathname:win.location.pathname,hostname:win.location.hostname,port:win.location.port},urls=url.href.split(/[\?#]/);url.param=url.param.replace("?","");url.url=urls[0];if(url.href.search("#")>-1){url.hashdata=U.last(urls);}urls=null;url.baseUrl=U.left(url.href,"?").replace(url.pathname,"");return url;} /**
         * ax5 error를 반환합니다.
         * @method ax5.info.getError
         * @returns {Object}
         * @example
         * ```
         * if(!this.selectedFile){
		 *      if (cfg.onEvent) {
		 *      	var that = {
		 *      		action: "error",
		 *      		error: ax5.info.getError("single-uploader", "460", "upload")
		 *      	};
		 *      	cfg.onEvent.call(that, that);
		 *      }
		 *      return this;
		 * }
         * ```
         */function getError(className,errorCode,methodName){if(info.errorMsg&&info.errorMsg[className]){return {className:className,errorCode:errorCode,methodName:methodName,msg:info.errorMsg[className][errorCode]};}else {return {className:className,errorCode:errorCode,methodName:methodName};}}return {errorMsg:errorMsg,version:version,baseUrl:baseUrl,onerror:onerror,eventKeys:eventKeys,weekNames:weekNames,browser:browser,isBrowser:isBrowser,wheelEnm:wheelEnm,urlUtil:urlUtil,getError:getError};}(); /**
     * Refer to this by {@link ax5}.
     * @namespace ax5.util
     */ax5['util']=U=function(){var _toString=Object.prototype.toString; /**
         * Object나 Array의 아이템으로 사용자 함수를 호출합니다.
         * @method ax5.util.each
         * @param {Object|Array} O
         * @param {Function} _fn
         * @example
         * ```js
         * var axf = ax5.util;
         * axf.each([0,1,2], function(){
		 * 	// with this
		 * });
         * axf.each({a:1, b:2}, function(){
		 * 	// with this
		 * });
         * ```
         */function each(O,_fn){if(isNothing(O))return [];var key,i=0,l=O.length,isObj=l===undefined||typeof O==="function";if(isObj){for(key in O){if(typeof O[key]!="undefined")if(_fn.call(O[key],key,O[key])===false)break;}}else {for(;i<l;){if(typeof O[i]!="undefined")if(_fn.call(O[i],i,O[i++])===false)break;}}return O;} // In addition to using the http://underscorejs.org : map, reduce, reduceRight, find
/**
         * 원본 아이템들을 이용하여 사용자 함수의 리턴값으로 이루어진 새로운 배열을 만듭니다.
         * @method ax5.util.map
         * @param {Object|Array} O
         * @param {Function} _fn
         * @returns {Array}
         * @example
         * ```js
         * var myArray = [0,1,2,3,4];
         * var myObject = {a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
		 *    fn: function(abcdd){
		 *        return abcdd;
		 *    }
		 * };
         *
         * var _arr = ax5.util.map( myArray,  function(index, I){
		 *    return index+1;
		 * });
         * console.log(_arr);
         * // [1, 2, 3, 4, 5]
         *
         * var _arr = ax5.util.map( myObject,  function(k, v){
		 *    return v * 2;
		 * });
         * console.log(_arr);
         * // [2, 4, NaN, NaN]
         * ```
         */function map(O,_fn){if(isNothing(O))return [];var key,i=0,l=O.length,results=[],fnResult;if(isObject(O)){for(key in O){if(typeof O[key]!="undefined"){fnResult=undefined;if((fnResult=_fn.call(O[key],key,O[key]))===false)break;else results.push(fnResult);}}}else {for(;i<l;){if(typeof O[i]!="undefined"){fnResult=undefined;if((fnResult=_fn.call(O[i],i,O[i++]))===false)break;else results.push(fnResult);}}}return results;} /**
         * 원본 아이템들을 이용하여 사용자 함수의 리턴값이 참인 아이템의 위치나 키값을 반환합니다.
         * @method ax5.util.search
         * @param {Object|Array} O
         * @param {Function|String|Number} _fn - 함수 또는 값
         * @returns {Number|String}
         * @example
         * ```js
         * var myArray = [0,1,2,3,4,5,6];
         * var myObject = {a:"123","b":"123",c:123};
         *
         * ax5.util.search(myArray,  function(){
		 *    return this > 3;
		 * });
         * // 4
         * ax5.util.search(myObject,  function(k, v){
		 *    return v === 123;
		 * });
         * // "c"
         * ax5.util.search([1,2,3,4], 3);
         * // 2
         * ax5.util.search([1,2], 4);
         * // -1
         * ax5.util.search(["name","value"], "value");
         * // 1
         * ax5.util.search(["name","value"], "values");
         * // -1
         * ax5.util.search({k1:"name",k2:"value"}, "value2");
         * // -1
         * ax5.util.search({k1:"name",k2:"value"}, "value");
         * // "k2"
         * ```
         */function search(O,_fn){if(isNothing(O))return -1;var key,i=0,l=O.length;if(isObject(O)){for(key in O){if(typeof O[key]!="undefined"&&isFunction(_fn)&&_fn.call(O[key],key,O[key])){return key;break;}else if(O[key]==_fn){return key;break;}}}else {for(;i<l;){if(typeof O[i]!="undefined"&&isFunction(_fn)&&_fn.call(O[i],i,O[i])){return i;break;}else if(O[i]==_fn){return i;break;}i++;}}return -1;} /**
         * 배열의 왼쪽에서 오른쪽으로 연산을 진행하는데 수행한 결과가 왼쪽 값으로 반영되어 최종 왼쪽 값을 반환합니다.
         * @method ax5.util.reduce
         * @param {Array|Object} O
         * @param {Function} _fn
         * @returns {Alltypes}
         * @example
         * ```js
         * var aarray = [5,4,3,2,1];
         * result = ax5.util.reduce( aarray, function(p, n){
		 *   return p * n;
		 * });
         * console.log(result, aarray);
         * // 120 [5, 4, 3, 2, 1]
         *
         * ax5.util.reduce({a:1, b:2}, function(p, n){
		 *    return parseInt(p|0) + parseInt(n);
		 * });
         * // 3
         * ```
         */function reduce(O,_fn){var i,l,tokenItem;if(isArray(O)){i=0,l=O.length,tokenItem=O[i];for(;i<l-1;){if(typeof O[i]!="undefined"){if((tokenItem=_fn.call(root,tokenItem,O[++i]))===false)break;}}return tokenItem;}else if(isObject(O)){for(i in O){if(typeof O[i]!="undefined"){if((tokenItem=_fn.call(root,tokenItem,O[i]))===false)break;}}return tokenItem;}else {console.error("argument error : ax5.util.reduce - use Array or Object");return null;}} /**
         * 배열의 오른쪽에서 왼쪽으로 연산을 진행하는데 수행한 결과가 오른쪽 값으로 반영되어 최종 오른쪽 값을 반환합니다.
         * @method ax5.util.reduceRight
         * @param {Array} O
         * @param {Function} _fn
         * @returns {Alltypes}
         * @example
         * ```js
         * var aarray = [5,4,3,2,1];
         * result = ax5.util.reduceRight( aarray, function(p, n){
		 *    console.log( n );
		 *    return p * n;
		 * });
         * console.log(result, aarray);
         * 120 [5, 4, 3, 2, 1]
         * ```
         */function reduceRight(O,_fn){var i=O.length-1,tokenItem=O[i];for(;i>0;){if(typeof O[i]!="undefined"){if((tokenItem=_fn.call(root,tokenItem,O[--i]))===false)break;}}return tokenItem;} /**
         * 배열또는 오브젝트의 각 아이템을 인자로 하는 사용자 함수의 결과가 참인 아이템들의 배열을 반환합니다.
         * @method ax5.util.filter
         * @param {Object|Array} O
         * @param {Function} _fn
         * @returns {Array}
         * @example
         * ```js
         * var aarray = [5,4,3,2,1];
         * result = ax5.util.filter( aarray, function(){
		 *    return this % 2;
		 * });
         * console.log(result);
         * // [5, 3, 1]
         *
         * var filObject = {a:1, s:"string", oa:{pickup:true, name:"AXISJ"}, os:{pickup:true, name:"AX5"}};
         * result = ax5.util.filter( filObject, function(){
		 * 	return this.pickup;
		 * });
         * console.log( ax5.util.toJson(result) );
         * // [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
         * ```
         */function filter(O,_fn){if(isNothing(O))return [];var k,i=0,l=O.length,results=[],fnResult;if(isObject(O)){for(k in O){if(typeof O[k]!="undefined"){if(fnResult=_fn.call(O[k],k,O[k]))results.push(O[k]);}}}else {for(;i<l;){if(typeof O[i]!="undefined"){if(fnResult=_fn.call(O[i],i,O[i]))results.push(O[i]);i++;}}}return results;} /**
         * Object를 JSONString 으로 반환합니다.
         * @method ax5.util.toJson
         * @param {Object|Array} O
         * @returns {String} JSON
         * @example
         * ```js
         * var ax = ax5.util;
         * var myObject = {
		 *    a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
		 *    fn: function(abcdd){
		 *        return abcdd;
		 *    }
		 * };
         * console.log( ax.toJson(myObject) );
         * ```
         */function toJson(O){var jsonString="";if(ax5.util.isArray(O)){var i=0,l=O.length;jsonString+="[";for(;i<l;i++){if(i>0)jsonString+=",";jsonString+=toJson(O[i]);}jsonString+="]";}else if(ax5.util.isObject(O)){jsonString+="{";var jsonObjectBody=[];each(O,function(key,value){jsonObjectBody.push('"'+key+'": '+toJson(value));});jsonString+=jsonObjectBody.join(", ");jsonString+="}";}else if(ax5.util.isString(O)){jsonString='"'+O+'"';}else if(ax5.util.isNumber(O)){jsonString=O;}else if(ax5.util.isUndefined(O)){jsonString="undefined";}else if(ax5.util.isFunction(O)){jsonString='"{Function}"';}return jsonString;} /**
         * 관용의 JSON Parser
         * @method ax5.util.parseJson
         * @param {String} JSONString
         * @param {Boolean} [force] - 강제 적용 여부 (json 문자열 검사를 무시하고 오브젝트 변환을 시도합니다.)
         * @returns {Object}
         * @example
         * ```
         * console.log(ax5.util.parseJson('{"a":1}'));
         * // Object {a: 1}
         * console.log(ax5.util.parseJson("{'a':1, 'b':'b'}"));
         * // Object {a: 1, b: "b"}
         * console.log(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", true));
         * // Object {a: 1, b: function}
         * console.log(ax5.util.parseJson("{a:1}"));
         * // Object {a: 1}
         * console.log(ax5.util.parseJson("[1,2,3]"));
         * // [1, 2, 3]
         * console.log(ax5.util.parseJson("['1','2','3']"));
         * // ["1", "2", "3"]
         * console.log(ax5.util.parseJson("[{'a':'99'},'2','3']"));
         * // [Object, "2", "3"]
         * ```
         */function parseJson(str,force){if(force||reIsJson.test(str)){try{return new Function('','return '+str)();}catch(e){return {error:500,msg:'syntax error'};}}else {return {error:500,msg:'syntax error'};}} /**
         * 인자의 타입을 반환합니다.
         * @method ax5.util.getType
         * @param {Object|Array|String|Number|Element|Etc} O
         * @returns {String} window|element|object|array|function|string|number|undefined|nodelist
         * @example
         * ```js
         * var axf = ax5.util;
         * var a = 11;
         * var b = "11";
         * console.log( axf.getType(a) );
         * console.log( axf.getType(b) );
         * ```
         */function getType(O){var typeName;if(O!=null&&O==O.window){typeName="window";}else if(!!(O&&O.nodeType==1)){typeName="element";}else if(!!(O&&O.nodeType==11)){typeName="fragment";}else if(typeof O==="undefined"){typeName="undefined";}else if(_toString.call(O)=="[object Object]"){typeName="object";}else if(_toString.call(O)=="[object Array]"){typeName="array";}else if(_toString.call(O)=="[object String]"){typeName="string";}else if(_toString.call(O)=="[object Number]"){typeName="number";}else if(_toString.call(O)=="[object NodeList]"){typeName="nodelist";}else if(typeof O==="function"){typeName="function";}return typeName;} /**
         * 오브젝트가 window 인지 판단합니다.
         * @method ax5.util.isWindow
         * @param {Object} O
         * @returns {Boolean}
         */function isWindow(O){return O!=null&&O==O.window;} /**
         * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
         * @method ax5.util.isElement
         * @param {Object} O
         * @returns {Boolean}
         */function isElement(O){return !!(O&&(O.nodeType==1||O.nodeType==11));} /**
         * 오브젝트가 Object인지 판단합니다.
         * @method ax5.util.isObject
         * @param {Object} O
         * @returns {Boolean}
         */function isObject(O){return _toString.call(O)=="[object Object]";} /**
         * 오브젝트가 Array인지 판단합니다.
         * @method ax5.util.isArray
         * @param {Object} O
         * @returns {Boolean}
         */function isArray(O){return _toString.call(O)=="[object Array]";} /**
         * 오브젝트가 Function인지 판단합니다.
         * @method ax5.util.isFunction
         * @param {Object} O
         * @returns {Boolean}
         */function isFunction(O){return typeof O==="function";} /**
         * 오브젝트가 String인지 판단합니다.
         * @method ax5.util.isString
         * @param {Object} O
         * @returns {Boolean}
         */function isString(O){return _toString.call(O)=="[object String]";} /**
         * 오브젝트가 Number인지 판단합니다.
         * @method ax5.util.isNumber
         * @param {Object} O
         * @returns {Boolean}
         */function isNumber(O){return _toString.call(O)=="[object Number]";} /**
         * 오브젝트가 NodeList인지 판단합니다.
         * @method ax5.util.isNodelist
         * @param {Object} O
         * @returns {Boolean}
         */function isNodelist(O){return _toString.call(O)=="[object NodeList]"||O&&O[0]&&O[0].nodeType==1;} /**
         * 오브젝트가 undefined인지 판단합니다.
         * @method ax5.util.isUndefined
         * @param {Object} O
         * @returns {Boolean}
         */function isUndefined(O){return typeof O==="undefined";} /**
         * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
         * @method ax5.util.isNothing
         * @param {Object} O
         * @returns {Boolean}
         */function isNothing(O){return typeof O==="undefined"||O===null||O==="";}function isDate(O){return O instanceof Date&&!isNaN(O.valueOf());}function isDateFormat(O){var result=false;if(!O){}else if(O instanceof Date&&!isNaN(O.valueOf())){result=true;}else {O=O.replace(/\D/g,'');if(O.length>7){var mm=O.substr(4,2),dd=O.substr(6,2);O=date(O);if(O.getMonth()==mm-1&&O.getDate()==dd){result=true;}}}return result;} /**
         * 오브젝트의 첫번째 아이템을 반환합니다.
         * @method ax5.util.first
         * @param {Object|Array} O
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.first({a:1, b:2});
         * // Object {a: 1}
         * ```
         */function first(O){if(isObject(O)){var keys=Object.keys(O);var item={};item[keys[0]]=O[keys[0]];return item;}else if(isArray(O)){return O[0];}else {console.error("ax5.util.object.first","argument type error");return undefined;}} /**
         * 오브젝트의 마지막 아이템을 반환합니다.
         * @method ax5.util.last
         * @param {Object|Array} O
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.last({a:1, b:2});
         * // Object {b: 2}
         * ```
         */function last(O){if(isObject(O)){var keys=Object.keys(O);var item={};item[keys[keys.length-1]]=O[keys[keys.length-1]];return item;}else if(isArray(O)){return O[O.length-1];}else {console.error("ax5.util.object.last","argument type error");return undefined;}} /**
         * 쿠키를 설정합니다.
         * @method ax5.util.setCookie
         * @param {String} cname - 쿠키이름
         * @param {String} cvalue - 쿠키값
         * @param {Number} [exdays] - 쿠키 유지일수
         * @param {Object} [opts] - path, domain 설정 옵션
         * @example
         * ```js
         * ax5.util.setCookie("jslib", "AX5");
         * ax5.util.setCookie("jslib", "AX5", 3);
         * ax5.util.setCookie("jslib", "AX5", 3, {path:"/", domain:".axisj.com"});
         * ```
         */function setCookie(cn,cv,exdays,opts){var expire;if(typeof exdays==="number"){expire=new Date();expire.setDate(expire.getDate()+exdays);}opts=opts||{};return doc.cookie=[escape(cn),'=',escape(cv),expire?"; expires="+expire.toUTCString():"", // use expires attribute, max-age is not supported by IE
opts.path?"; path="+opts.path:"",opts.domain?"; domain="+opts.domain:"",opts.secure?"; secure":""].join("");} /**
         * 쿠키를 가져옵니다.
         * @method ax5.util.getCookie
         * @param {String} cname
         * @returns {String} cookie value
         * @example
         * ```js
         * ax5.util.getCookie("jslib");
         * ```
         */function getCookie(cname){var name=cname+"=";var ca=doc.cookie.split(';'),i=0,l=ca.length;for(;i<l;i++){var c=ca[i];while(c.charAt(0)==' '){c=c.substring(1);}if(c.indexOf(name)!=-1)return unescape(c.substring(name.length,c.length));}return "";} /**
         * ax5 require
         * @method ax5.util.require
         * @param {Array} mods - load modules
         * @param {Function} callBack - 로드 성공시 호출함수
         * @param {Function} [errorBack] - 로드 실패시 호출함수
         * @example
         * ```js
         * ax5.info.baseUrl = "../src/";
         * ax5.util.require(["ax5_classSample.js"], function(){
		 * 	alert("ok");
		 * });
         * ```
         */ // RequireJS 2.1.15 소스코드 참고
function require(mods,callBack,errorBack){var head=doc.head||doc.getElementsByTagName("head")[0],readyRegExp=info.isBrowser&&navigator.platform==='PLAYSTATION 3'?/^complete$/:/^(complete|loaded)$/,loadCount=mods.length,loadErrors=[],loadedSrc={},onloadTimer,onerrorTimer,returned=false,scripts=dom.get("script[src]"),styles=dom.get("style[href]"),onload=function onload(){if(loadCount<1&&loadErrors.length==0&&!returned){if(callBack)callBack({});returned=true;}},onerror=function onerror(){if(loadCount<1&&loadErrors.length>0&&!returned){console.error(loadErrors);if(errorBack)errorBack({type:"loadFail",list:loadErrors});returned=true;}}; // 로드해야 할 모듈들을 doc.head에 삽입하고 로드가 성공여부를 리턴합니다.
for(var i=0,l=mods.length;i<l;i++){var src=mods[i],type=right(src,"."),hasPlugin=false,plugin,pluginSrc=info.baseUrl+src,attrNm=type==="js"?"src":"href",plugLoad,plugErr,s=scripts.length;while(s--){if(scripts[s].getAttribute(attrNm)===pluginSrc){hasPlugin=true;break;}}if(hasPlugin){loadCount--;onload();}else {plugin=type==="js"?dom.create("script",{type:"text/javascript",src:pluginSrc,"data-src":pluginSrc}):dom.create("link",{rel:"stylesheet",type:"text/css",href:pluginSrc});plugLoad=function plugLoad(e,pluginSrc){if(e&&(e.type==='load'||readyRegExp.test((e.currentTarget||e.srcElement).readyState))){if(!loadedSrc[pluginSrc])loadCount--;if(onloadTimer)clearTimeout(onloadTimer);onloadTimer=setTimeout(onload,1);}},plugErr=function plugErr(e){loadCount--;loadErrors.push({src:info.baseUrl+src,error:e});if(onerrorTimer)clearTimeout(onerrorTimer);onerrorTimer=setTimeout(onerror,1);};ax5.xhr({url:pluginSrc,contentType:"",res:function res(response,status){var timeId,hasPlugin=false,scripts=dom.get("script[src]"),s=scripts.length;while(s--){if(scripts[s].getAttribute(attrNm)===pluginSrc){hasPlugin=true;break;}}if(!hasPlugin)head.appendChild(plugin);plugin.onload=function(e){plugLoad(e,pluginSrc);if(timeId)clearTimeout(timeId);};timeId=setTimeout(function(){plugLoad({type:"load"},pluginSrc);},500);},error:function error(){plugErr(this);}});}}} /**
         * jsonString 으로 alert 합니다.
         * @method ax5.util.alert
         * @param {Object|Array|String|Number} O
         * @returns {Object|Array|String|Number} O
         * @example ```js
         * ax5.util.alert({a:1,b:2});
         * ax5.util.alert("정말?");
         * ```
         */function alert(O){win.alert(toJson(O));return O;} /**
         * 문자열의 특정 문자열까지 잘라주거나 원하는 포지션까지 잘라줍니다.
         * @method ax5.util.left
         * @param {String} str - 문자열
         * @param {String|Number} pos - 찾을 문자열 또는 포지션
         * @returns {String}
         * @example
         * ```js
         * ax5.util.left("abcd.efd", 3);
         * // abc
         * ax5.util.left("abcd.efd", ".");
         * // abcd
         * ```
         */function left(str,pos){if(typeof str==="undefined"||typeof pos==="undefined")return "";if(isString(pos)){return str.indexOf(pos)>-1?str.substr(0,str.indexOf(pos)):str;}else if(isNumber(pos)){return str.substr(0,pos);}else {return "";}} /**
         * 문자열의 특정 문자열까지 잘라주거나 원하는 포지션까지 잘라줍니다.
         * @method ax5.util.right
         * @param {String} str - 문자열
         * @param {String|Number} pos - 찾을 문자열 또는 포지션
         * @returns {String}
         * @example
         * ```js
         * ax5.util.right("abcd.efd", 3);
         * // efd
         * ax5.util.right("abcd.efd", ".");
         * // efd
         * ```
         */function right(str,pos){if(typeof str==="undefined"||typeof pos==="undefined")return "";str=''+str;if(isString(pos)){return str.lastIndexOf(pos)>-1?str.substr(str.lastIndexOf(pos)+1):str;}else if(isNumber(pos)){return str.substr(str.length-pos);}else {return "";}} /**
         * css형 문자열이나 특수문자가 포함된 문자열을 카멜케이스로 바꾸어 반환합니다.
         * @method ax5.util.camelCase
         * @param {String} str
         * @returns {String}
         * @example
         * ```js
         * ax5.util.camelCase("inner-width");
         * ax5.util.camelCase("innerWidth");
         * // innerWidth
         * ```
         */function camelCase(str){return str.replace(reMs,"ms-").replace(reSnakeCase,function(all,letter){return letter.toUpperCase();});} /**
         * css형 문자열이나 카멜케이스문자열을 스네이크 케이스 문자열로 바꾸어 반환합니다.
         * @method ax5.util.snakeCase
         * @param {String} str
         * @returns {String}
         * @example
         * ```js
         * ax5.util.snakeCase("innerWidth");
         * ax5.util.snakeCase("inner-Width");
         * ax5.util.snakeCase("innerWidth");
         * // inner-width
         * ```
         */function snakeCase(str){return camelCase(str).replace(reCamelCase,function(all,letter){return "-"+letter.toLowerCase();});} /**
         * 문자열에서 -. 을 제외한 모든 문자열을 제거하고 숫자로 반환합니다. 옵션에 따라 원하는 형식의 숫자로 변환 할 수 도 있습니다.
         * @method ax5.util.number
         * @param {String|Number} str
         * @param {Object} cond - 옵션
         * @returns {String|Number}
         * @example
         * ```js
         * var cond = {
		 * 	round: {Number|Boolean} - 반올림할 자릿수,
		 * 	money: {Boolean} - 통화,
		 * 	abs: {Boolean} - 절대값,
		 * 	byte: {Boolean} - 바이트
		 * }
         *
         * console.log(ax5.util.number(123456789.678, {round:1}));
         * console.log(ax5.util.number(123456789.678, {round:1, money:true}));
         * console.log(ax5.util.number(123456789.678, {round:2, byte:true}));
         * console.log(ax5.util.number(-123456789.8888, {abs:true, round:2, money:true}));
         * console.log(ax5.util.number("A-1234~~56789.8~888PX", {abs:true, round:2, money:true}));
         *
         * //123456789.7
         * //123,456,789.7
         * //117.7MB
         * //123,456,789.89
         * //123,456,789.89
         * ```
         */function number(str,cond){var result,pair=(''+str).split(reDot),isMinus=Number(pair[0])<0||pair[0]=="-0",returnValue=0.0;pair[0]=pair[0].replace(reInt,"");if(pair[1]){pair[1]=pair[1].replace(reNotNum,"");returnValue=Number(pair[0]+"."+pair[1])||0;}else {returnValue=Number(pair[0])||0;}result=isMinus?-returnValue:returnValue;each(cond,function(k,c){if(k=="round"){if(isNumber(c)){if(c<0){result=+(Math.round(result+"e-"+Math.abs(c))+"e+"+Math.abs(c));}else {result=+(Math.round(result+"e+"+c)+"e-"+c);}}else {result=Math.round(result);}}if(k=="floor"){result=Math.floor(result);}if(k=="ceil"){result=Math.ceil(result);}else if(k=="money"){result=function(val){var txtNumber=''+val;if(isNaN(txtNumber)||txtNumber==""){return "";}else {var arrNumber=txtNumber.split('.');arrNumber[0]+='.';do {arrNumber[0]=arrNumber[0].replace(reMoneySplit,'$1,$2');}while(reMoneySplit.test(arrNumber[0]));if(arrNumber.length>1){return arrNumber.join('');}else {return arrNumber[0].split('.')[0];}}}(result);}else if(k=="abs"){result=Math.abs(Number(result));}else if(k=="byte"){result=function(val){val=Number(result);var nUnit="KB";var myByte=val/1024;if(myByte/1024>1){nUnit="MB";myByte=myByte/1024;}if(myByte/1024>1){nUnit="GB";myByte=myByte/1024;}return number(myByte,{round:1})+nUnit;}(result);}});return result;} /**
         * 배열 비슷한 오브젝트를 배열로 변환해줍니다.
         * @method ax5.util.toArray
         * @param {Object|Elements|Arguments} O
         * @returns {Array}
         * @example
         * ```js
         * ax5.util.toArray(arguments);
         * //
         * ```
         */function toArray(O){if(typeof O.length!="undefined")return Array.prototype.slice.call(O);return [];} /**
         * 천번째 인자에 두번째 인자 아이템을 합쳐줍니다. concat과 같은 역할을 하지만. 인자가 Array타입이 아니어도 됩니다.
         * @method ax5.util.merge
         * @param {Array|ArrayLike} first
         * @param {Array|ArrayLike} second
         * @returns {Array} first
         * @example
         * ```
         *
         * ```
         */function merge(first,second){var l=second.length,i=first.length,j=0;if(typeof l==="number"){for(;j<l;j++){first[i++]=second[j];}}else {while(second[j]!==undefined){first[i++]=second[j++];}}first.length=i;return first;} /**
         * 오브젝트를 파라미터형식으로 또는 파라미터를 오브젝트 형식으로 변환합니다.
         * @method ax5.util.param
         * @param {Object|Array|String} O
         * @param {String} [cond] - param|object
         * @returns {Object|String}
         * @example
         * ```
         * ax5.util.param({a:1,b:'1232'}, "param");
         * ax5.util.param("a=1&b=1232", "param");
         * // "a=1&b=1232"
         * ax5.util.param("a=1&b=1232");
         * // {a: "1", b: "1232"}
         * ```
         */function param(O,cond){var p;if(isString(O)&&typeof cond!=="undefined"&&cond=="param"){return O;}else if(isString(O)&&typeof cond!=="undefined"&&cond=="object"||isString(O)&&typeof cond==="undefined"){p={};each(O.split(reAmp),function(){var item=this.split(reEq);if(!p[item[0]])p[item[0]]=item[1];else {if(isString(p[item[0]]))p[item[0]]=[p[item[0]]];p[item[0]].push(item[1]);}});return p;}else {p=[];each(O,function(k,v){p.push(k+"="+escape(v));});return p.join('&');}}function encode(s){return encodeURIComponent(s);}function decode(s){return decodeURIComponent(s);}function error(){ax5.info.onerror.apply(this,arguments);}function localDate(yy,mm,dd,hh,mi,ss){var utcD,localD;localD=new Date();if(typeof hh==="undefined")hh=23;if(typeof mi==="undefined")mi=59;utcD=new Date(Date.UTC(yy,mm,dd||1,hh,mi,ss||0));if(mm==0&&dd==1&&utcD.getUTCHours()+utcD.getTimezoneOffset()/60<0){utcD.setUTCHours(0);}else {utcD.setUTCHours(utcD.getUTCHours()+utcD.getTimezoneOffset()/60);}return utcD;} /**
         * 날짜 형식의 문자열이나 Date객체를 조건에 맞게 처리 한 후 원하는 return 값으로 반환합니다.
         * @method ax5.util.date
         * @param {String|Date} d
         * @param {Object} cond
         * @returns {Date|String}
         * @example
         * ```js
         * ax5.util.date('2013-01-01'); // Tue Jan 01 2013 23:59:00 GMT+0900 (KST)
         * ax5.util.date((new Date()), {add:{d:10}, return:'yyyy/mm/dd'}); // "2015/07/01"
         * ax5.util.date('1919-03-01', {add:{d:10}, return:'yyyy/mm/dd'}); // "1919/03/11"
         * ```
         */function date(d,cond){var yy,mm,dd,hh,mi,aDateTime,aTimes,aTime,aDate,utcD,localD,va;if(isString(d)){if(d.length==0){d=new Date();}else if(d.length>15){aDateTime=d.split(/ /g),aTimes,aTime,aDate=aDateTime[0].split(/\D/g),yy=aDate[0];mm=parseFloat(aDate[1]);dd=parseFloat(aDate[2]);aTime=aDateTime[1]||"09:00";aTimes=aTime.substring(0,5).split(":");hh=parseFloat(aTimes[0]);mi=parseFloat(aTimes[1]);if(right(aTime,2)==="AM"||right(aTime,2)==="PM")hh+=12;d=localDate(yy,mm-1,dd,hh,mi);}else if(d.length==14){va=d.replace(/\D/g,"");d=localDate(va.substr(0,4),va.substr(4,2)-1,number(va.substr(6,2)),number(va.substr(8,2)),number(va.substr(10,2)),number(va.substr(12,2)));}else if(d.length>7){va=d.replace(/\D/g,"");d=localDate(va.substr(0,4),va.substr(4,2)-1,number(va.substr(6,2)));}else if(d.length>4){va=d.replace(/\D/g,"");d=localDate(va.substr(0,4),va.substr(4,2)-1,1);}else if(d.length>2){va=d.replace(/\D/g,"");return localDate(va.substr(0,4),va.substr(4,2)-1,1);}else {d=new Date();}}if(typeof cond==="undefined"){return d;}else {if(cond["add"]){d=function(_d,opts){var yy,mm,dd,mxdd,DyMilli=1000*60*60*24;if(typeof opts["d"]!=="undefined"){_d.setTime(_d.getTime()+opts["d"]*DyMilli);}else if(typeof opts["m"]!=="undefined"){yy=_d.getFullYear();mm=_d.getMonth();dd=_d.getDate();yy=yy+parseInt(opts["m"]/12);mm+=opts["m"]%12;mxdd=daysOfMonth(yy,mm);if(mxdd<dd)dd=mxdd;_d=new Date(yy,mm,dd,12);}else if(typeof opts["y"]!=="undefined"){_d.setTime(_d.getTime()+opts["y"]*365*DyMilli);}else {_d.setTime(_d.getTime()+opts["y"]*DyMilli);}return _d;}(new Date(d),cond["add"]);}if(cond["return"]){return function(){var fStr=cond["return"],nY,nM,nD,nH,nMM,nS,nDW;nY=d.getUTCFullYear();nM=setDigit(d.getMonth()+1,2);nD=setDigit(d.getDate(),2);nH=setDigit(d.getHours(),2);nMM=setDigit(d.getMinutes(),2);nS=setDigit(d.getSeconds(),2);nDW=d.getDay();var yre=/[^y]*(yyyy)[^y]*/gi;yre.exec(fStr);var regY=RegExp.$1;var mre=/[^m]*(mm)[^m]*/gi;mre.exec(fStr);var regM=RegExp.$1;var dre=/[^d]*(dd)[^d]*/gi;dre.exec(fStr);var regD=RegExp.$1;var hre=/[^h]*(hh)[^h]*/gi;hre.exec(fStr);var regH=RegExp.$1;var mire=/[^m]*(mi)[^i]*/gi;mire.exec(fStr);var regMI=RegExp.$1;var sre=/[^s]*(ss)[^s]*/gi;sre.exec(fStr);var regS=RegExp.$1;var dwre=/[^d]*(dw)[^w]*/gi;dwre.exec(fStr);var regDW=RegExp.$1;if(regY==="yyyy"){fStr=fStr.replace(regY,right(nY,regY.length));}if(regM==="mm"){if(regM.length==1)nM=d.getMonth()+1;fStr=fStr.replace(regM,nM);}if(regD==="dd"){if(regD.length==1)nD=d.getDate();fStr=fStr.replace(regD,nD);}if(regH==="hh"){fStr=fStr.replace(regH,nH);}if(regMI==="mi"){fStr=fStr.replace(regMI,nMM);}if(regS==="ss"){fStr=fStr.replace(regS,nS);}if(regDW=="dw"){fStr=fStr.replace(regDW,info.weekNames[nDW].label);}return fStr;}();}else {return d;}}} /**
         * 인자인 날짜가 오늘부터 몇일전인지 반환합니다. 또는 인자인 날짜가 가까운 미래에 몇일 후인지 반환합니다.
         * @method ax5.util.dday
         * @param {String|Data} d
         * @param {Object} cond
         * @returns {Number}
         * @example
         * ```js
         * ax5.util.dday('2016-01-29');
         * // 1
         * ax5.util.dday('2016-01-29', {today:'2016-01-28'});
         * // 1
         * ax5.util.dday('1977-03-29', {today:'2016-01-28', age:true});
         * // 39
         * ```
         */function dday(d,cond){var memoryDay=date(d),DyMilli=1000*60*60*24,today=new Date(),diffnum,thisYearMemoryDay;function getDayTime(_d){return Math.floor(_d.getTime()/DyMilli)*DyMilli;}if(typeof cond==="undefined"){diffnum=number((getDayTime(memoryDay)-getDayTime(today))/DyMilli,{floor:true});return diffnum;}else {diffnum=number((getDayTime(memoryDay)-getDayTime(today))/DyMilli,{floor:true});if(cond["today"]){today=date(cond.today);diffnum=number((getDayTime(memoryDay)-getDayTime(today))/DyMilli,{floor:true});}if(cond["thisYear"]){thisYearMemoryDay=new Date(today.getFullYear(),memoryDay.getMonth(),memoryDay.getDate());diffnum=number((getDayTime(thisYearMemoryDay)-getDayTime(today))/DyMilli,{floor:true});if(diffnum<0){thisYearMemoryDay=new Date(today.getFullYear()+1,memoryDay.getMonth(),memoryDay.getDate());diffnum=number((getDayTime(thisYearMemoryDay)-getDayTime(today))/DyMilli,{floor:true});}}if(cond["age"]){thisYearMemoryDay=new Date(today.getFullYear(),memoryDay.getMonth(),memoryDay.getDate());diffnum=thisYearMemoryDay.getFullYear()-memoryDay.getFullYear();}return diffnum;}} /**
         * 인자인 날짜가 몇년 몇월의 몇번째 주차인지 반환합니다.
         * @method ax5.util.weeksOfMonth
         * @param {String|Data} d
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.weeksOfMonth("2015-10-01"); // {year: 2015, month: 10, count: 1}
         * ax5.util.weeksOfMonth("2015-09-19"); // {year: 2015, month: 10, count: 1}
         * ```
         */function weeksOfMonth(d){var myDate=date(d);return {year:myDate.getFullYear(),month:myDate.getMonth()+1,count:parseInt(myDate.getDate()/7+1)};} /**
         * 년월에 맞는 날자수를 반환합니다.
         * @method ax5.util.daysOfMonth
         * @param {Number} y
         * @param {Number} m
         * @returns {Number}
         * @examples
         * ```js
         * ax5.util.daysOfMonth(2015, 11); // 31
         * ax5.util.daysOfMonth(2015, 1); // 28
         * ```
         */function daysOfMonth(y,m){if(m==3||m==5||m==8||m==10){return 30;}else if(m==1){return y%4==0&&y%100!=0||y%400==0?29:28;}else {return 31;}} /**
         * 원하는 횟수 만큼 자릿수 맞춤 문자열을 포함한 문자열을 반환합니다.
         * @method ax5.util.setDigit
         * @param {String|Number} num
         * @param {Number} length
         * @param {String} [padder=0]
         * @param {Number} [radix]
         * @returns {String}
         */function setDigit(num,length,padder,radix){var s=num.toString(radix||10);return times(padder||'0',length-s.length)+s;}function times(s,count){return count<1?'':new Array(count+1).join(s);} /**
         * 타겟엘리먼트의 부모 엘리멘트 트리에서 원하는 조건의 엘리먼트를 얻습니다.
         * @method ax5.util.findParentNode
         * @param {Element} _target - target element
         * @param {Object|Function} cond - 원하는 element를 찾을 조건
         * @returns {Element}
         * @example
         * ```
         * // cond 속성정의
         * var cond = {
		 * 	tagname: {String} - 태그명 (ex. a, div, span..),
		 * 	clazz: {String} - 클래스명
		 * 	[, 그 외 찾고 싶은 attribute명들]
		 * };
         * console.log(
         *    ax5.util.findParentNode(e.target, {tagname:"a", clazz:"ax-menu-handel", "data-custom-attr":"attr_value"})
         * );
         * // cond 함수로 처리하기
         * jQuery('#id').bind("click.app_expand", function(e){
		 * 	var target = ax5.dom.findParentNode(e.target, function(target){
		 * 		if($(target).hasClass("aside")){
		 * 			return true;
		 * 		}
		 * 		else{
		 * 			return true;
		 * 		}
		 * 	});
		 * 	//client-aside
		 * 	if(target.id !== "client-aside"){
		 * 		// some action
		 * 	}
		 * });
         * ```
         */function findParentNode(_target,cond){if(_target){while(function(){var result=true;if(typeof cond==="undefined"){_target=_target.parentNode?_target.parentNode:false;}else if(isFunction(cond)){result=cond(_target);}else if(isObject(cond)){for(var k in cond){if(k==="tagname"){if(_target.tagName.toLocaleLowerCase()!=cond[k]){result=false;break;}}else if(k==="clazz"||k==="class_name"){if("className" in _target){var klasss=_target.className.split(reClassNameSplit);var hasClass=false;for(var a=0;a<klasss.length;a++){if(klasss[a]==cond[k]){hasClass=true;break;}}result=hasClass;}else {result=false;break;}}else { // 그외 속성값들.
if(_target.getAttribute){if(_target.getAttribute(k)!=cond[k]){result=false;break;}}else {result=false;break;}}}}return !result;}()){if(_target.parentNode&&_target.parentNode.parentNode){_target=_target.parentNode;}else {_target=false;break;}}}return _target;} /**
         * @method ax5.util.cssNumber
         * @param {String|Number} val
         * @returns {String}
         * @example
         * ```
         * console.log(ax5.util.cssNumber("100px"))
         * console.log(ax5.util.cssNumber("100%"))
         * console.log(ax5.util.cssNumber("100"))
         * console.log(ax5.util.cssNumber(100))
         * console.log(ax5.util.cssNumber("!!100@#"))
         * ```
         */function cssNumber(val){var re=/\D?(\d+)([a-zA-Z%]*)/i,found=(''+val).match(re),unit=found[2]||"px";return found[1]+unit;} /**
         * @method ax5.util.css
         * @param {Object|String} val - CSSString or CSSObject
         * @returns {String|Object}
         * @example
         * ```
         * console.log(ax5.util.css({background: "#ccc", padding: "50px", width: "100px"}));
         * console.log(ax5.util.css('width:100px;padding: 50px; background: #ccc'));
         * ```
         */function css(val){var returns;if(isObject(val)){returns='';for(var k in val){returns+=k+':'+val[k]+';';}return returns;}else if(isString(val)){returns={};var valSplited=val.split(/[ ]*;[ ]*/g);valSplited.forEach(function(v){if((v=v.trim())!==""){var vSplited=v.split(/[ ]*:[ ]*/g);returns[vSplited[0]]=vSplited[1];}});return returns;}} /**
         * @method ax5.util.stopEvent
         * @param {Event} e
         * @example
         * ```
         * ax5.util.stopEvent(e);
         * ```
         */function stopEvent(e){ // 이벤트 중지 구문
if(!e)var e=window.event; //e.cancelBubble is supported by IE -
// this will kill the bubbling process.
e.cancelBubble=true;e.returnValue=false; //e.stopPropagation works only in Firefox.
if(e.stopPropagation)e.stopPropagation();if(e.preventDefault)e.preventDefault();return false; // 이벤트 중지 구문 끝
}return {alert:alert,each:each,map:map,search:search,reduce:reduce,reduceRight:reduceRight,filter:filter,toJson:toJson,parseJson:parseJson,first:first,last:last,left:left,right:right,getType:getType,isWindow:isWindow,isElement:isElement,isObject:isObject,isArray:isArray,isFunction:isFunction,isString:isString,isNumber:isNumber,isNodelist:isNodelist,isUndefined:isUndefined,isNothing:isNothing,setCookie:setCookie,getCookie:getCookie,require:require,camelCase:camelCase,snakeCase:snakeCase,number:number,toArray:toArray,merge:merge,param:param,error:error,date:date,dday:dday,daysOfMonth:daysOfMonth,weeksOfMonth:weeksOfMonth,setDigit:setDigit,times:times,findParentNode:findParentNode,cssNumber:cssNumber,css:css,isDate:isDate,isDateFormat:isDateFormat,stopEvent:stopEvent};}();root.ax5=function(){return ax5;}(); // ax5.ui에 연결
}).call(window);ax5.info.errorMsg["ax5dialog"]={"501":"Duplicate call error"};ax5.info.errorMsg["ax5picker"]={"401":"Can not find target element","402":"Can not find boundID","501":"Can not find content key"};ax5.info.errorMsg["single-uploader"]={"460":"There are no files to be uploaded.","461":"There is no uploaded files."};ax5.info.errorMsg["ax5calendar"]={"401":"Can not find target element"};ax5.info.errorMsg["ax5formatter"]={"401":"Can not find target element","402":"Can not find boundID","501":"Can not find pattern"};ax5.info.errorMsg["ax5menu"]={"501":"Can not find menu item"};ax5.info.errorMsg["ax5select"]={"401":"Can not find target element","402":"Can not find boundID","501":"Can not find option"}; // 필수 Ployfill 확장 구문
(function(){'use strict';var root=this,re_trim=/^\s*|\s*$/g; // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if(!Object.keys){Object.keys=function(){var hwp=Object.prototype.hasOwnProperty,hdeb=!{toString:null}.propertyIsEnumerable('toString'),de=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','constructor'],del=de.length;return function(obj){if((typeof obj==='undefined'?'undefined':_typeof(obj))!=='object'&&(typeof obj!=='function'||obj===null))throw new TypeError('type err');var r=[],prop,i;for(prop in obj){if(hwp.call(obj,prop))r.push(prop);}if(hdeb){for(i=0;i<del;i++){if(hwp.call(obj,de[i]))r.push(de[i]);}}return r;};}();} // ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if(!Array.prototype.forEach){Array.prototype.forEach=function(fun /*, thisp */){if(this===void 0||this===null){throw TypeError();}var t=Object(this);var len=t.length>>>0;if(typeof fun!=="function"){throw TypeError();}var thisp=arguments[1],i;for(i=0;i<len;i++){if(i in t){fun.call(thisp,t[i],i,t);}}};} // ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if(!Function.prototype.bind){Function.prototype.bind=function(o){if(typeof this!=='function'){throw TypeError("function");}var slice=[].slice,args=slice.call(arguments,1),self=this,bound=function bound(){return self.apply(this instanceof nop?this:o,args.concat(slice.call(arguments)));};function nop(){}nop.prototype=self.prototype;bound.prototype=new nop();return bound;};} /*global document */ /**
     * define document.querySelector & document.querySelectorAll for IE7
     *
     * A not very fast but small hack. The approach is taken from
     * http://weblogs.asp.net/bleroy/archive/2009/08/31/queryselectorall-on-old-ie-versions-something-that-doesn-t-work.aspx
     *
     */(function(){if(document.querySelectorAll||document.querySelector){return;}if(!document.createStyleSheet)return;var style=document.createStyleSheet(),select=function select(selector,maxCount){var all=document.all,l=all.length,i,resultSet=[];style.addRule(selector,"foo:bar");for(i=0;i<l;i+=1){if(all[i].currentStyle.foo==="bar"){resultSet.push(all[i]);if(resultSet.length>maxCount){break;}}}style.removeRule(0);return resultSet;};document.querySelectorAll=function(selector){return select(selector,Infinity);};document.querySelector=function(selector){return select(selector,1)[0]||null;};})();if(!String.prototype.trim){(function(){String.prototype.trim=function(){return this.replace(re_trim,'');};})();}if(!window.JSON){window.JSON={parse:function parse(sJSON){return new Function('','return '+sJSON)();},stringify:function(){var r=/["]/g,_f;return _f=function f(vContent){var result,i,j;switch(result=typeof vContent==='undefined'?'undefined':_typeof(vContent)){case 'string':return '"'+vContent.replace(r,'\\"')+'"';case 'number':case 'boolean':return vContent.toString();case 'undefined':return 'undefined';case 'function':return '""';case 'object':if(!vContent)return 'null';result='';if(vContent.splice){for(i=0,j=vContent.length;i<j;i++){result+=','+_f(vContent[i]);}return '['+result.substr(1)+']';}else {for(i in vContent){if(vContent.hasOwnProperty(i)&&vContent[i]!==undefined&&typeof vContent[i]!='function')result+=',"'+i+'":'+_f(vContent[i]);}return '{'+result.substr(1)+'}';}}};}()};} // splice ie8 <= polyfill
(function(){if(!document.documentMode||document.documentMode>=9)return false;var _splice=Array.prototype.splice;Array.prototype.splice=function(){var args=Array.prototype.slice.call(arguments);if(typeof args[1]==="undefined")args[1]=this.length-args[0];return _splice.apply(this,args);};})(); /**
     * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
     * on host objects like NamedNodeMap, NodeList, and HTMLCollection
     * (technically, since host objects have been implementation-dependent,
     * at least before ES6, IE hasn't needed to work this way).
     * Also works on strings, fixes IE < 9 to allow an explicit undefined
     * for the 2nd argument (as in Firefox), and prevents errors when
     * called on other DOM objects.
     */(function(){'use strict';var _slice=Array.prototype.slice;try{ // Can't be used with DOM elements in IE < 9
_slice.call(document.documentElement);}catch(e){ // Fails in IE < 9
// This will work for genuine arrays, array-like objects,
// NamedNodeMap (attributes, entities, notations),
// NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
// and will not fail on other DOM objects (as do DOM elements in IE < 9)
Array.prototype.slice=function(begin,end){ // IE < 9 gets unhappy with an undefined end argument
end=typeof end!=='undefined'?end:this.length; // For native Array objects, we use the native slice function
if(Object.prototype.toString.call(this)==='[object Array]'){return _slice.call(this,begin,end);} // For array like object we handle it ourselves.
var i,cloned=[],size,len=this.length; // Handle negative value for "begin"
var start=begin||0;start=start>=0?start:Math.max(0,len+start); // Handle negative value for "end"
var upTo=typeof end=='number'?Math.min(end,len):len;if(end<0){upTo=len+end;} // Actual expected size of the slice
size=upTo-start;if(size>0){cloned=new Array(size);if(this.charAt){for(i=0;i<size;i++){cloned[i]=this.charAt(start+i);}}else {for(i=0;i<size;i++){cloned[i]=this[start+i];}}}return cloned;};}})(); // Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function(con){var prop,method;var empty={};var dummy=function dummy(){};var properties='memory'.split(',');var methods=('assert,clear,count,debug,dir,dirxml,error,exception,group,'+'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,'+'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');while(prop=properties.pop()){con[prop]=con[prop]||empty;}while(method=methods.pop()){con[method]=con[method]||dummy;}})(window.console||{}); // Using `this` for web workers.
// extend innerWidth ..
var html=document.getElementsByTagName('html')[0];var body=document.getElementsByTagName('body')[0];if(!window.innerWidth)window.innerWidth=html.clientWidth;if(!window.innerHeight)window.innerHeight=html.clientHeight;if(!window.scrollX)window.scrollX=window.pageXOffset||html.scrollLeft;if(!window.scrollY)window.scrollY=window.pageYOffset||html.scrollTop;}).call(window); /**
 * Refer to this by {@link ax5}.
 * @namespace ax5.ui
 */ /**
 * @class ax5.ui.root
 * @classdesc ax5 ui class
 * @version v0.0.1
 * @author tom@axisj.com
 * @logs
 * 2014-12-12 tom : start
 * @example
 * ```
 * var myui = new ax5.ui.root();
 * ```
 */ax5.ui=function(core){function axUi(){this.config={};this.name="root"; /**
         * 클래스의 속성 정의 메소드 속성 확장후에 내부에 init 함수를 호출합니다.
         * @method ax5.ui.root.setConfig
         * @param {Object} config - 클래스 속성값
         * @param {Boolean} [callInit=true] - init 함수 호출 여부
         * @returns {ax5.ui.axUi}
         * @example
         * ```
         * var myui = new ax5.ui.root();
         * myui.setConfig({
		 * 	id:"abcd"
		 * });
         * ```
         */this.setConfig=function(cfg,callInit){jQuery.extend(true,this.config,cfg,true);if(typeof callInit=="undefined"||callInit===true){this.init();}return this;};this.init=function(){console.log(this.config);};this.bindWindowResize=function(callBack){setTimeout(function(){jQuery(window).resize(function(){if(this.bindWindowResize__)clearTimeout(this.bindWindowResize__);this.bindWindowResize__=setTimeout(function(){callBack.call(this);}.bind(this),10);}.bind(this));}.bind(this),100);};this.stopEvent=function(e){if(e.preventDefault)e.preventDefault();if(e.stopPropagation)e.stopPropagation();e.cancelBubble=true;return false;}; // instance init
this.main=function(){}.apply(this,arguments);}return {root:axUi};}(ax5); /*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 * https://github.com/thomasJang/mustache.js -- imporove some variables
 */(function defineMustache(global,factory){factory(global.mustache={});})(window.ax5,function mustacheFactory(mustache){var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==='[object Array]';};function isFunction(object){return typeof object==='function';} /**
     * More correct typeof string handling array
     * which normally returns typeof 'object'
     */function typeStr(obj){return isArray(obj)?'array':typeof obj==='undefined'?'undefined':_typeof(obj);}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,'\\$&');} /**
     * Null safe way of checking whether or not an object,
     * including its prototype, has a given property
     */function hasProperty(obj,propName){return obj!=null&&(typeof obj==='undefined'?'undefined':_typeof(obj))==='object'&&propName in obj;} // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
// See https://github.com/janl/mustache.js/issues/189
var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string);}var nonSpaceRe=/\S/;function isWhitespace(string){return !testRegExp(nonSpaceRe,string);}var entityMap={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;'};function escapeHtml(string){return String(string).replace(/[&<>"'\/]/g,function fromEntityMap(s){return entityMap[s];});}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/; /**
     * Breaks up the given `template` string into a tree of tokens. If the `tags`
     * argument is given here it must be an array with two string values: the
     * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
     * course, the default is to use mustaches (i.e. mustache.tags).
     *
     * A token is an array with at least 4 elements. The first element is the
     * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
     * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
     * all text that appears outside a symbol this element is "text".
     *
     * The second element of a token is its "value". For mustache tags this is
     * whatever else was inside the tag besides the opening symbol. For text tokens
     * this is the text itself.
     *
     * The third and fourth elements of the token are the start and end indices,
     * respectively, of the token in the original template.
     *
     * Tokens that are the root node of a subtree contain two more elements: 1) an
     * array of tokens in the subtree and 2) the index in the original template at
     * which the closing tag for that section begins.
     */function parseTemplate(template,tags){if(!template)return [];var sections=[]; // Stack to hold section tokens
var tokens=[]; // Buffer to hold the tokens
var spaces=[]; // Indices of whitespace tokens on the current line
var hasTag=false; // Is there a {{tag}} on the current line?
var nonSpace=false; // Is there a non-space char on the current line?
// Strips all whitespace tokens array for the current line
// if there was a {{#tag}} on it and otherwise only space.
function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length){delete tokens[spaces.pop()];}}else {spaces=[];}hasTag=false;nonSpace=false;}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==='string')tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error('Invalid tags: '+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+'\\s*');closingTagRe=new RegExp('\\s*'+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp('\\s*'+escapeRegExp('}'+tagsToCompile[1]));}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos; // Match any text between tags.
value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);}else {nonSpace=true;}tokens.push(['text',chr,start,start+1]);start+=1; // Check for whitespace on the current line.
if(chr==='\n')stripSpace();}} // Match the opening tag.
if(!scanner.scan(openingTagRe))break;hasTag=true; // Get the tag type.
type=scanner.scan(tagRe)||'name';scanner.scan(whiteRe); // Get the tag value.
if(type==='='){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe);}else if(type==='{'){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type='&';}else {value=scanner.scanUntil(closingTagRe);} // Match the closing tag.
if(!scanner.scan(closingTagRe))throw new Error('Unclosed tag at '+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type==='#'||type==='^'){sections.push(token);}else if(type==='/'){ // Check section nesting.
openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start);}else if(type==='name'||type==='{'||type==='&'){nonSpace=true;}else if(type==='='){ // Set the tags for the next time around.
compileTags(value);}} // Make sure there are no open sections when we're done.
openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens));} /**
     * Combines the values of consecutive text tokens in the given `tokens` array
     * to a single token.
     */function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==='text'&&lastToken&&lastToken[0]==='text'){lastToken[1]+=token[1];lastToken[3]=token[3];}else {squashedTokens.push(token);lastToken=token;}}}return squashedTokens;} /**
     * Forms the given array of `tokens` into a nested tree structure where
     * tokens that represent a section have two additional items: 1) an array of
     * all tokens that appear in that section and 2) the index in the original
     * template that represents the end of that section.
     */function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case '#':case '^':collector.push(token);sections.push(token);collector=token[4]=[];break;case '/':section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token);}}return nestedTokens;} /**
     * A simple string scanner that is used by the template parser to find
     * tokens in template strings.
     */function Scanner(string){this.string=string;this.tail=string;this.pos=0;} /**
     * Returns `true` if the tail is empty (end of string).
     */Scanner.prototype.eos=function eos(){return this.tail==='';}; /**
     * Tries to match the given regular expression at the current position.
     * Returns the matched text if it can match, the empty string otherwise.
     */Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return '';var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string;}; /**
     * Skips all text until the given regular expression can be matched. Returns
     * the skipped string, which is the entire tail if no match can be made.
     */Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case -1:match=this.tail;this.tail='';break;case 0:match='';break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index);}this.pos+=match.length;return match;}; /**
     * Represents a rendering context by wrapping a view object and
     * maintaining a reference to the parent context.
     */function Context(view,parentContext){this.view=view;this.cache={'.':this.view,'@each':function each(){var returns=[];for(var k in this){returns.push({'@key':k,'@value':this[k]});}return returns;}};this.parent=parentContext;} /**
     * Creates a new context using the given view with this context
     * as the parent.
     */Context.prototype.push=function push(view){return new Context(view,this);}; /**
     * Returns the value of the given name in this context, traversing
     * up the context hierarchy if the value is absent in this context's view.
     */Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name];}else {var context=this,names,index,lookupHit=false;while(context){if(name.indexOf('.')>0){value=context.view;names=name.split('.');index=0; /**
                     * Using the dot notion path in `name`, we descend through the
                     * nested objects.
                     *
                     * To be certain that the lookup has been successful, we have to
                     * check if the last object in the path actually has the property
                     * we are looking for. We store the result in `lookupHit`.
                     *
                     * This is specially necessary for when the value has been set to
                     * `undefined` and we want to avoid looking up parent contexts.
                     **/while(value!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(value,names[index]);value=value[names[index++]];}}else {value=context.view[name];lookupHit=hasProperty(context.view,name);}if(lookupHit)break;context=context.parent;}cache[name]=value;}if(isFunction(value))value=value.call(this.view);return value;}; /**
     * A Writer knows how to take a stream of tokens and render them to a
     * string, given a context. It also maintains a cache of templates to
     * avoid the need to parse the same template twice.
     */function Writer(){this.cache={};} /**
     * Clears all cached templates in this writer.
     */Writer.prototype.clearCache=function clearCache(){this.cache={};}; /**
     * Parses and caches the given `template` and returns the array of tokens
     * that is generated from the parse.
     */Writer.prototype.parse=function parse(template,tags){var cache=this.cache;var tokens=cache[template];if(tokens==null)tokens=cache[template]=parseTemplate(template,tags);return tokens;}; /**
     * High-level method that is used to render the given `template` with
     * the given `view`.
     *
     * The optional `partials` argument may be an object that contains the
     * names and templates of partials that are used in the template. It may
     * also be a function that is used to load partial templates on the fly
     * that takes a single argument: the name of the partial.
     */Writer.prototype.render=function render(template,view,partials){var tokens=this.parse(template);var context=view instanceof Context?view:new Context(view);return this.renderTokens(tokens,context,partials,template);}; /**
     * Low-level method that renders the given array of `tokens` using
     * the given `context` and `partials`.
     *
     * Note: The `originalTemplate` is only ever used to extract the portion
     * of the original template that was contained in a higher-order section.
     * If the template doesn't use higher-order sections, this argument may
     * be omitted.
     */Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate){var buffer='';var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==='#')value=this.renderSection(token,context,partials,originalTemplate);else if(symbol==='^')value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol==='>')value=this.renderPartial(token,context,partials,originalTemplate);else if(symbol==='&')value=this.unescapedValue(token,context);else if(symbol==='name')value=this.escapedValue(token,context);else if(symbol==='text')value=this.rawValue(token);if(value!==undefined)buffer+=value;}return buffer;};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer='';var value=context.lookup(token[1]); // This function is used to render an arbitrary template
// in the current context by higher-order sections.
function subRender(template){return self.render(template,context,partials);}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){value[j]['@i']=j;value[j]['@first']=j===0;buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate);}}else if((typeof value==='undefined'?'undefined':_typeof(value))==='object'||typeof value==='string'||typeof value==='number'){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate);}else if(isFunction(value)){if(typeof originalTemplate!=='string')throw new Error('Cannot use higher-order sections without the original template'); // Extract the portion of the original template that the section contains.
value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value;}else {buffer+=this.renderTokens(token[4],context,partials,originalTemplate);}return buffer;};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]); // Use JavaScript's definition of falsy. Include empty arrays.
// See https://github.com/janl/mustache.js/issues/186
if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate);};Writer.prototype.renderPartial=function renderPartial(token,context,partials){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)return this.renderTokens(this.parse(value),context,partials,value);};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value;};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return mustache.escape(value);};Writer.prototype.rawValue=function rawValue(token){return token[1];};mustache.name='mustache.js';mustache.version='2.1.3';mustache.tags=['{{','}}']; // All high-level mustache.* functions use this writer.
var defaultWriter=new Writer(); /**
     * Clears all cached templates in the default writer.
     */mustache.clearCache=function clearCache(){return defaultWriter.clearCache();}; /**
     * Parses and caches the given template in the default writer and returns the
     * array of tokens it contains. Doing this ahead of time avoids the need to
     * parse templates on the fly as they are rendered.
     */mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags);}; /**
     * Renders the `template` with the given `view` and `partials` using the
     * default writer.
     */mustache.render=function render(template,view,partials){if(typeof template!=='string'){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+'argument for mustache#render(template, view, partials)');}return defaultWriter.render(template,view,partials);}; // This is here for backwards compatibility with 0.4.x.,
/*eslint-disable */ // eslint wants camel cased function name
mustache.to_html=function to_html(template,view,partials,send){ /*eslint-enable*/var result=mustache.render(template,view,partials);if(isFunction(send)){send(result);}else {return result;}}; // Export the escaping function so that the user may override it.
// See https://github.com/janl/mustache.js/issues/244
mustache.escape=escapeHtml; // Export these mainly for testing, but also for advanced usage.
mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;}); // ax5.ui.dialog
(function(root,_SUPER_){ /**
     * @class ax5.ui.dialog
     * @classdesc
     * @version 0.6.7
     * @author tom@axisj.com
     * @example
     * ```
     * var myDialog = new ax5.ui.dialog();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.activeDialog=null;this.config={clickEventName:"click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
theme:'default',width:300,title:'',msg:'',lang:{"ok":"ok","cancel":"cancel"},animateTime:250};cfg=this.config;cfg.id='ax5-dialog-'+ax5.getGuid();var onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}that=null;return true;},getContentTmpl=function getContentTmpl(){return '\n                <div id="{{dialogId}}" data-ax5-ui="dialog" class="ax5-ui-dialog {{theme}}">\n                    <div class="ax-dialog-heading">\n                        {{{title}}}\n                    </div>\n                    <div class="ax-dialog-body">\n                        <div class="ax-dialog-msg">{{{msg}}}</div>\n                        \n                        {{#input}}\n                        <div class="ax-dialog-prompt">\n                            {{#@each}}\n                            <div class="form-group">\n                            {{#@value.label}}\n                            <label>{{#_crlf}}{{{.}}}{{/_crlf}}</label>\n                            {{/@value.label}}\n                            <input type="{{@value.type}}" placeholder="{{@value.placeholder}}" class="form-control {{@value.theme}}" data-dialog-prompt="{{@key}}" style="width:100%;" value="{{@value.value}}" />\n                            {{#@value.help}}\n                            <p class="help-block">{{#_crlf}}{{.}}{{/_crlf}}</p>\n                            {{/@value.help}}\n                            </div>\n                            {{/@each}}\n                        </div>\n                        {{/input}}\n                        \n                        <div class="ax-dialog-buttons">\n                            <div class="ax-button-wrap">\n                            {{#btns}}\n                                {{#@each}}\n                                <button type="button" data-dialog-btn="{{@key}}" class="btn btn-{{@value.theme}}">{{@value.label}}</button>\n                                {{/@each}}\n                            {{/btns}}\n                            </div>\n                        </div>\n                    </div>\n                </div>  \n                ';},getContent=function getContent(dialogId,opts){var data={dialogId:dialogId,title:opts.title||cfg.title||"",msg:(opts.msg||cfg.msg||"").replace(/\n/g,"<br/>"),input:opts.input,btns:opts.btns,'_crlf':function _crlf(){return this.replace(/\n/g,"<br/>");}};try{return ax5.mustache.render(getContentTmpl(),data);}finally {data=null;}},open=function open(opts,callBack){var pos={},box;opts.id=opts.id||cfg.id;box={width:opts.width};jQuery(document.body).append(getContent.call(this,opts.id,opts));this.activeDialog=jQuery('#'+opts.id);this.activeDialog.css({width:box.width}); // dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
opts.height=box.height=this.activeDialog.height(); //- position 정렬
if(typeof opts.position==="undefined"||opts.position==="center"){pos.top=jQuery(window).height()/2-box.height/2;pos.left=jQuery(window).width()/2-box.width/2;}else {pos.left=opts.position.left||0;pos.top=opts.position.top||0;}this.activeDialog.css(pos); // bind button event
if(opts.dialogType==="prompt"){this.activeDialog.find("[data-dialog-prompt]").get(0).focus();}else {this.activeDialog.find("[data-dialog-btn]").get(0).focus();}this.activeDialog.find("[data-dialog-btn]").on(cfg.clickEventName,function(e){btnOnClick.call(this,e||window.event,opts,callBack);}.bind(this)); // bind key event
jQuery(window).bind("keydown.ax5dialog",function(e){onKeyup.call(this,e||window.event,opts,callBack);}.bind(this));jQuery(window).bind("resize.ax5dialog",function(e){align.call(this,e||window.event);}.bind(this));onStateChanged.call(this,opts,{self:this,state:"open"});pos=null;box=null;},align=function align(e){if(!this.activeDialog)return this;var opts=self.dialogConfig,box={width:opts.width,height:opts.height}; //- position 정렬
if(typeof opts.position==="undefined"||opts.position==="center"){box.top=window.innerHeight/2-box.height/2;box.left=window.innerWidth/2-box.width/2;}else {box.left=opts.position.left||0;box.top=opts.position.top||0;}this.activeDialog.css(box);opts=null;box=null;return this;},btnOnClick=function btnOnClick(e,opts,callBack,target,k){var that;if(e.srcElement)e.target=e.srcElement;target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-dialog-btn")){return true;}});if(target){k=target.getAttribute("data-dialog-btn");that={self:this,key:k,value:opts.btns[k],dialogId:opts.id,btnTarget:target};if(opts.dialogType==="prompt"){var emptyKey=null;for(var oi in opts.input){that[oi]=this.activeDialog.find('[data-dialog-prompt='+oi+']').val();if(that[oi]==""||that[oi]==null){emptyKey=oi;break;}}}if(opts.btns[k].onClick){opts.btns[k].onClick.call(that,k);}else if(opts.dialogType==="alert"){if(callBack)callBack.call(that,k);this.close();}else if(opts.dialogType==="confirm"){if(callBack)callBack.call(that,k);this.close();}else if(opts.dialogType==="prompt"){if(k==='ok'){if(emptyKey){this.activeDialog.find('[data-dialog-prompt="'+emptyKey+'"]').get(0).focus();return false;}}if(callBack)callBack.call(that,k);this.close();}}that=null;opts=null;callBack=null;target=null;k=null;},onKeyup=function onKeyup(e,opts,callBack,target,k){var that,emptyKey=null;if(e.keyCode==ax5.info.eventKeys.ESC){this.close();}if(opts.dialogType==="prompt"){if(e.keyCode==ax5.info.eventKeys.RETURN){that={self:this,key:k,value:opts.btns[k],dialogId:opts.id,btnTarget:target};for(var oi in opts.input){that[oi]=this.activeDialog.find('[data-dialog-prompt='+oi+']').val();if(that[oi]==""||that[oi]==null){emptyKey=oi;break;}}if(emptyKey){that=null;emptyKey=null;return false;}if(callBack)callBack.call(that,k);this.close();}}that=null;emptyKey=null;opts=null;callBack=null;target=null;k=null;}; /**
         * Preferences of dialog UI
         * @method ax5.ui.dialog.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * ```
         */ //== class body start
this.init=function(){this.onStateChanged=cfg.onStateChanged; // this.onLoad = cfg.onLoad;
}; /**
         * open the dialog of alert type
         * @method ax5.ui.dialog.alert
         * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callBack] - 사용자 확인 이벤트시 호출될 callBack 함수
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.alert({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
         * ```
         */this.alert=function(opts,callBack){if(U.isString(opts)){opts={title:cfg.title,msg:opts};}if(this.activeDialog){console.log(ax5.info.getError("ax5dialog","501","alert"));return this;}self.dialogConfig={};jQuery.extend(true,self.dialogConfig,cfg,opts);opts=self.dialogConfig;opts.dialogType="alert";if(typeof opts.btns==="undefined"){opts.btns={ok:{label:cfg.lang["ok"],theme:opts.theme}};}open.call(this,opts,callBack);opts=null;callBack=null;return this;}; /**
         * open the dialog of confirm type
         * @method ax5.ui.dialog.confirm
         * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callBack] - 사용자 확인 이벤트시 호출될 callBack 함수
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.confirm({
		 *  title: 'app title',
		 *  msg: 'confirm'
		 * }, function(){});
         * ```
         */this.confirm=function(opts,callBack){if(U.isString(opts)){opts={title:cfg.title,msg:opts};}if(this.activeDialog){console.log(ax5.info.getError("ax5dialog","501","confirm"));return this;}self.dialogConfig={};jQuery.extend(true,self.dialogConfig,cfg,opts);opts=self.dialogConfig;opts.dialogType="confirm";opts.theme=opts.theme||cfg.theme||"";if(typeof opts.btns==="undefined"){opts.btns={ok:{label:cfg.lang["ok"],theme:opts.theme},cancel:{label:cfg.lang["cancel"]}};}open.call(this,opts,callBack);opts=null;callBack=null;return this;}; /**
         * open the dialog of prompt type
         * @method ax5.ui.dialog.prompt
         * @param {Object|String} [{theme, title, msg, btns, input}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callBack] - 사용자 확인 이벤트시 호출될 callBack 함수
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.prompt({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
         * ```
         */this.prompt=function(opts,callBack){if(U.isString(opts)){opts={title:cfg.title,msg:opts};}if(this.activeDialog){console.log(ax5.info.getError("ax5dialog","501","prompt"));return this;}self.dialogConfig={};jQuery.extend(true,self.dialogConfig,cfg,opts);opts=self.dialogConfig;opts.dialogType="prompt";opts.theme=opts.theme||cfg.theme||"";if(typeof opts.input==="undefined"){opts.input={value:{label:""}};}if(typeof opts.btns==="undefined"){opts.btns={ok:{label:cfg.lang["ok"],theme:opts.theme},cancel:{label:cfg.lang["cancel"]}};}open.call(this,opts,callBack);opts=null;callBack=null;return this;}; /**
         * close the dialog
         * @method ax5.ui.dialog.close
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.close();
         * ```
         */this.close=function(opts,that){if(this.activeDialog){opts=self.dialogConfig;this.activeDialog.addClass("destroy");jQuery(window).unbind("keydown.ax5dialog");jQuery(window).unbind("resize.ax5dialog");setTimeout(function(){this.activeDialog.remove();this.activeDialog=null;that={self:this,state:"close"};if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}opts=null;that=null;}.bind(this),cfg.animateTime);}return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.dialog=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root); // ax5.ui.mask
(function(root,_SUPER_){ /**
     * @class ax5.ui.mask
     * @classdesc
     * @version 0.6.7
     * @author tom@axisj.com
     * @example
     * ```
     * var my_mask = new ax5.ui.mask();
     * ```
     */var U=ax5.util;var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.maskContent='';this.status="off";this.config={theme:'',target:jQuery(document.body).get(0)};cfg=this.config;var onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}opts=null;that=null;return true;},getBodyTmpl=function getBodyTmpl(){return '\n                <div class="ax-mask {{theme}}" id="{{maskId}}">\n                    <div class="ax-mask-bg"></div>\n                    <div class="ax-mask-content">\n                        <div class="ax-mask-body">\n                        {{{body}}}\n                        </div>\n                    </div>\n                </div>\n                ';},setBody=function setBody(content){this.maskContent=content;}; /**
         * Preferences of Mask UI
         * @method ax5.ui.mask.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.mask}
         * @example
         * ```
         * setConfig({
		 *      target : {Element|AX5 nodelist}, // 마스크 처리할 대상
		 *      content : {String}, // 마스크안에 들어가는 내용물
		 *      onStateChanged: function(){} // 마스크 상태변경 시 호출되는 함수 this.type으로 예외처리 가능
		 * }
         * ```
         */this.init=function(){ // after setConfig();
this.onStateChanged=cfg.onStateChanged;this.onClick=cfg.onClick;if(this.config.content)setBody.call(this,this.config.content);}; /**
         * open mask
         * @method ax5.ui.mask.open
         * @param {Object} config
         * @returns {ax5.ui.mask}
         * @example
         * ```js
         * my_mask.open({
		 *     target: document.body,
		 *     content: "<h1>Loading..</h1>",
		 *     onStateChanged: function () {
		 *
		 *     }
		 * });
         *
         * my_mask.open({
		 *     target: $("#mask-target").get(0), // dom Element
		 *     content: "<h1>Loading..</h1>",
		 *     onStateChanged: function () {
		 *
		 *     }
		 * });
         * ```
         */this.open=function(options){if(this.status==="on")this.close();if(options&&options.content)setBody.call(this,options.content);self.maskConfig={};jQuery.extend(true,self.maskConfig,this.config,options);var _cfg=self.maskConfig,target=_cfg.target,$target=jQuery(target),maskId='ax-mask-'+ax5.getGuid(),$mask,css={},that={},bodyTmpl=getBodyTmpl(),body=ax5.mustache.render(bodyTmpl,{theme:_cfg.theme,maskId:maskId,body:this.maskContent});jQuery(document.body).append(body);if(target&&target!==jQuery(document.body).get(0)){css={position:_cfg.position||"absolute",left:$target.offset().left,top:$target.offset().top,width:$target.outerWidth(),height:$target.outerHeight()};if(typeof self.maskConfig.zIndex!=="undefined"){css["z-index"]=self.maskConfig.zIndex;}$target.addClass("ax-masking");}this.$mask=$mask=jQuery("#"+maskId);this.$target=$target;this.status="on";$mask.css(css);if(this.onClick){$mask.click(function(){that={self:this,state:"open",type:"click"};this.onClick.call(that,that);});}onStateChanged.call(this,null,{self:this,state:"open"});options=null;_cfg=null;target=null;$target=null;maskId=null;$mask=null;css=null;that=null;bodyTmpl=null;body=null;return this;}; /**
         * close mask
         * @method ax5.ui.mask.close
         * @returns {ax5.ui.mask}
         * @example
         * ```
         * my_mask.close();
         * ```
         */this.close=function(){if(this.$mask){this.$mask.remove();this.$target.removeClass("ax-masking");onStateChanged.call(this,null,{self:this,state:"close"});}return this;}; //== class body end
// 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);};root.mask=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root); // ax5.ui.toast
(function(root,_SUPER_){ /**
     * @class ax5.ui.toast
     * @classdesc
     * @version 0.2.4
     * @author tom@axisj.com
     * @example
     * ```
     * var my_toast = new ax5.ui.toast();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg,toastSeq=0,toastSeqClear=null;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.toastContainer=null;this.queue=[];this.config={clickEventName:"click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
theme:'default',width:300,icon:'',closeIcon:'',msg:'',lang:{"ok":"ok","cancel":"cancel"},displayTime:3000,animateTime:250,containerPosition:"bottom-left"};cfg=this.config;var onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}opts=null;that=null;return true;},getContentTmpl=function getContentTmpl(){return '\n                <div id="{{toastId}}" data-ax5-ui="toast" class="ax5-ui-toast {{theme}}">\n                    {{#icon}}\n                    <div class="ax-toast-icon">{{{.}}}</div>\n                    {{/icon}}\n                    <div class="ax-toast-body">{{{msg}}}</div>\n                    {{#btns}}\n                    <div class="ax-toast-buttons">\n                        <div class="ax-button-wrap">\n                        {{#@each}}\n                        <button type="button" data-ax-toast-btn="{{@key}}" class="btn btn-{{@value.theme}}">{{{@value.label}}}</button>\n                        {{/@each}}\n                        </div>\n                    </div>\n                    {{/btns}}\n                    {{^btns}}\n                    <a class="ax-toast-close" data-ax-toast-btn="ok">{{{closeIcon}}}</a>\n                    {{/btns}}\n                    <div style="clear:both;"></div>\n                </div>\n                ';},getContent=function getContent(toastId,opts){var data={toastId:toastId,theme:opts.theme,icon:opts.icon,msg:(opts.msg||"").replace(/\n/g,"<br/>"),btns:opts.btns,closeIcon:opts.closeIcon};try{return ax5.mustache.render(getContentTmpl(),data);}finally {toastId=null;data=null;}},open=function open(opts,callBack){if(toastSeqClear)clearTimeout(toastSeqClear);var toastBox,box={width:opts.width};opts.id='ax5-toast-'+self.containerId+'-'+ ++toastSeq;if(jQuery('#'+opts.id).get(0))return this;if(U.left(cfg.containerPosition,'-')=='bottom'){this.toastContainer.append(getContent(opts.id,opts));}else {this.toastContainer.prepend(getContent(opts.id,opts));}toastBox=jQuery('#'+opts.id);toastBox.css({width:box.width});opts.toastBox=toastBox;this.queue.push(opts);onStateChanged.call(this,opts,{self:this,state:"open",toastId:opts.id});if(opts.toastType==="push"){ // 자동 제거 타이머 시작
setTimeout(function(){this.close(opts,callBack);}.bind(this),cfg.displayTime);toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName,function(e){btnOnClick.call(this,e||window.event,opts,toastBox,callBack);}.bind(this));}else if(opts.toastType==="confirm"){toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName,function(e){btnOnClick.call(this,e||window.event,opts,toastBox,callBack);}.bind(this));}box=null;},btnOnClick=function btnOnClick(e,opts,toastBox,callBack,target,k){target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-ax-toast-btn")){return true;}});if(target){k=target.getAttribute("data-ax-toast-btn");var that={key:k,value:opts.btns?opts.btns[k]:k,toastId:opts.id,btn_target:target};if(opts.btns&&opts.btns[k].onClick){opts.btns[k].onClick.call(that,k);}else if(opts.toastType==="push"){if(callBack)callBack.call(that,k);this.close(opts,toastBox);}else if(opts.toastType==="confirm"){if(callBack)callBack.call(that,k);this.close(opts,toastBox);}}e=null;opts=null;toastBox=null;callBack=null;target=null;k=null;}; /**
         * Preferences of toast UI
         * @method ax5.ui.toast.set_config
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.toast}
         * @example
         * ```
         * ```
         */ //== class body start
this.init=function(){this.onStateChanged=cfg.onStateChanged; // after set_config();
self.containerId=ax5.getGuid();var styles=[];if(cfg.zIndex){styles.push("z-index:"+cfg.zIndex);}jQuery(document.body).append('<div class="ax5-ui-toast-container '+cfg.containerPosition+'" data-toast-container="'+''+self.containerId+'" style="'+styles.join(";")+'"></div>');this.toastContainer=jQuery('[data-toast-container="'+self.containerId+'"]');}; /**
         * @method ax5.ui.toast.push
         * @param opts
         * @param callBack
         * @returns {ax5.ui.toast}
         */this.push=function(opts,callBack){if(!self.containerId){this.init();}if(U.isString(opts)){opts={title:cfg.title,msg:opts};}opts.toastType="push";self.dialogConfig={};jQuery.extend(true,self.dialogConfig,cfg,opts);opts=self.dialogConfig;open.call(this,opts,callBack);opts=null;callBack=null;return this;}; /**
         * @method ax5.ui.toast.confirm
         * @param opts
         * @param callBack
         * @returns {ax5.ui.toast}
         */this.confirm=function(opts,callBack){if(!self.containerId){this.init();}if(U.isString(opts)){opts={title:cfg.title,msg:opts};}opts.toastType="confirm";self.dialogConfig={};jQuery.extend(true,self.dialogConfig,cfg,opts);opts=self.dialogConfig;if(typeof opts.btns==="undefined"){opts.btns={ok:{label:cfg.lang["ok"],theme:opts.theme}};}open.call(this,opts,callBack);opts=null;callBack=null;return this;}; /**
         * close the toast
         * @method ax5.ui.toast.close
         * @returns {ax5.ui.toast}
         * @example
         * ```
         * my_toast.close();
         * ```
         */this.close=function(opts,callBack){if(typeof opts==="undefined"){opts=U.last(this.queue);}var toastBox=opts.toastBox;toastBox.addClass(opts.toastType=="push"?"removed":"destroy");this.queue=U.filter(this.queue,function(){return opts.id!=this.id;});setTimeout(function(){var that={toastId:opts.id};toastBox.remove();if(callBack)callBack.call(that);that={self:this,state:"close",toastId:opts.id};onStateChanged.call(this,opts,that); // 3초후에도 아무 일이 없다면 완전히 제거
if(this.queue.length===0){if(toastSeqClear)clearTimeout(toastSeqClear);toastSeqClear=setTimeout(function(){ /// console.log("try clear seq");
if(this.queue.length===0)toastSeq=0;}.bind(this),3000);}that=null;opts=null;callBack=null;toastBox=null;}.bind(this),cfg.animateTime);return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.toast=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root); // ax5.ui.modal
(function(root,_SUPER_){ /**
     * @class ax5.ui.modal
     * @classdesc
     * @version 0.5.4
     * @author tom@axisj.com
     * @example
     * ```
     * var my_modal = new ax5.ui.modal();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.activeModal=null;this.$={}; // UI inside of the jQuery object store
this.config={position:{left:"center",top:"middle",margin:10},clickEventName:"click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
theme:'default',width:300,height:400,closeToEsc:true,animateTime:250};cfg=this.config; // extended config copy cfg
cfg.id='ax5-modal-'+ax5.getGuid(); // instance id
var onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}return true;},getContentTmpl=function getContentTmpl(){return '\n                <div id="{{modalId}}" data-modal-els="root" class="ax5-ui-modal {{theme}} {{fullscreen}}" style="{{styles}}">\n                    <div class="ax-modal-body" data-modal-els="body">\n                    {{#iframe}}\n                        <div data-modal-els="iframe-wrap" style="-webkit-overflow-scrolling: touch; overflow: auto;position: relative;">\n                        <iframe name="{{modalId}}-frame" src="" width="100%" height="100%" frameborder="0" data-modal-els="iframe" style="position: absolute;left:0;top:0;"></iframe>\n                        </div>\n                        <form name="{{modalId}}-form" data-modal-els="iframe-form">\n                        <input type="hidden" name="modalId" value="{{modalId}}" />\n                        {{#param}}\n                        {{#@each}}\n                        <input type="hidden" name="{{@key}}" value="{{@value}}" />\n                        {{/@each}}\n                        {{/param}}\n                        </form>\n                    {{/iframe}}\n                    </div>\n                </div>\n                ';},getContent=function getContent(modalId,opts){var data={modalId:modalId,theme:opts.theme,fullScreen:opts.fullScreen?"fullscreen":"",styles:[],iframe:opts.iframe};if(opts.zIndex){data.styles.push("z-index:"+opts.zIndex);}if(data.iframe&&typeof data.iframe.param==="string"){data.iframe.param=ax5.util.param(data.iframe.param);}return ax5.mustache.render(getContentTmpl(),data);},open=function open(opts,callBack){var that;jQuery(document.body).append(getContent.call(this,opts.id,opts));this.activeModal=jQuery('#'+opts.id); // 파트수집
this.$={"root":this.activeModal.find('[data-modal-els="root"]'),"body":this.activeModal.find('[data-modal-els="body"]')};if(opts.iframe){this.$["iframe-wrap"]=this.activeModal.find('[data-modal-els="iframe-wrap"]');this.$["iframe"]=this.activeModal.find('[data-modal-els="iframe"]');this.$["iframe-form"]=this.activeModal.find('[data-modal-els="iframe-form"]');} //- position 정렬
align.call(this);that={self:this,id:opts.id,theme:opts.theme,width:opts.width,height:opts.height,state:"open",$:this.$};if(opts.iframe){this.$["iframe-wrap"].css({height:opts.height});this.$["iframe"].css({height:opts.height}); // iframe content load
this.$["iframe-form"].attr({"method":opts.iframe.method});this.$["iframe-form"].attr({"target":opts.id+"-frame"});this.$["iframe-form"].attr({"action":opts.iframe.url});this.$["iframe"].on("load",function(){that.state="load";onStateChanged.call(this,opts,that);}.bind(this));this.$["iframe-form"].submit();}if(callBack)callBack.call(that);onStateChanged.call(this,opts,that); // bind key event
if(opts.closeToEsc){jQuery(window).bind("keydown.ax-modal",function(e){onkeyup.call(this,e||window.event);}.bind(this));}jQuery(window).bind("resize.ax-modal",function(e){align.call(this,null,e||window.event);}.bind(this));},align=function align(position,e){if(!this.activeModal)return this;var opts=self.modalConfig,box={width:opts.width,height:opts.height};if(opts.fullScreen){box.width=jQuery(window).width();box.height=jQuery(window).height();box.left=0;box.top=0;if(opts.iframe){this.$["iframe-wrap"].css({height:box.height});this.$["iframe"].css({height:box.height});}}else {if(position){jQuery.extend(true,opts.position,position);} //- position 정렬
if(opts.position.left=="left"){box.left=opts.position.margin||0;}else if(opts.position.left=="right"){ // window.innerWidth;
box.left=jQuery(window).width()-box.width-(opts.position.margin||0);}else if(opts.position.left=="center"){box.left=jQuery(window).width()/2-box.width/2;}else {box.left=opts.position.left||0;}if(opts.position.top=="top"){box.top=opts.position.margin||0;}else if(opts.position.top=="bottom"){box.top=jQuery(window).height()-box.height-(opts.position.margin||0);}else if(opts.position.top=="middle"){box.top=jQuery(window).height()/2-box.height/2;}else {box.top=opts.position.top||0;}}this.activeModal.css(box);return this;},onkeyup=function onkeyup(e){if(e.keyCode==ax5.info.eventKeys.ESC){this.close();}}; /// private end
/**
         * Preferences of modal UI
         * @method ax5.ui.modal.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * ```
         */ //== class body start
this.init=function(){this.onStateChanged=cfg.onStateChanged;}; /**
         * open the modal
         * @method ax5.ui.modal.open
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * my_modal.open();
         * ```
         */this.open=function(opts,callBack){if(U.isString(opts)){opts={title:cfg.title,msg:opts};}self.modalConfig={};jQuery.extend(true,self.modalConfig,cfg);jQuery.extend(true,self.modalConfig,opts);opts=self.modalConfig;open.call(this,opts,callBack);return this;}; /**
         * close the modal
         * @method ax5.ui.modal.close
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * my_modal.close();
         * ```
         */this.close=function(opts,that){if(this.activeModal){opts=self.modalConfig;this.activeModal.addClass("destroy");jQuery(window).unbind("keydown.ax-modal");jQuery(window).unbind("resize.ax-modal");setTimeout(function(){this.activeModal.remove();this.activeModal=null;that={self:this,state:"close"};onStateChanged.call(this,opts,{self:this,state:"close"});}.bind(this),cfg.animateTime);}return this;}; /**
         * setCSS
         * @method ax5.ui.modal.css
         * @param {Object} css -
         * @returns {ax5.ui.modal}
         */this.css=function(css){if(this.activeModal&&!self.fullScreen){this.activeModal.css(css);if(css.width){self.modalConfig.width=this.activeModal.width();}if(css.height){self.modalConfig.height=this.activeModal.height();if(this.$["iframe"]){this.$["iframe-wrap"].css({height:self.modalConfig.height});this.$["iframe"].css({height:self.modalConfig.height});}}}return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.modal=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root); // ax5.ui.calendar
(function(root,_SUPER_){ /**
     * @class ax5.ui.calendar
     * @classdesc
     * @version 0.7.9
     * @author tom@axisj.com
     * @logs
     * 2014-06-21 tom : 시작
     * @example
     * ```
     * var my_pad = new ax5.ui.calendar();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){if(_SUPER_)_SUPER_.call(this); // 부모호출
var self=this,cfg,selectableCount=1;this.target=null;this.selection=[];this.selectionMap={};this.selectableMap={};this.markerMap={};this.printedDay={start:"",end:""};this.config={clickEventName:"click",theme:'default',mode:'day', // day|month|year,
dateFormat:'yyyy-mm-dd',displayDate:new Date(),animateTime:250,dimensions:{controlHeight:'40',controlButtonWidth:'40',colHeadHeight:'30',itemPadding:2},lang:{yearHeading:"Choose the year",monthHeading:"Choose the month",yearTmpl:"%s",months:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],dayTmpl:"%s"},multipleSelect:false,selectMode:'day',defaultMarkerTheme:'holiday'};cfg=this.config;var onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}that=null;},getFrameTmpl=function getFrameTmpl(){return '\n                <div class="ax5-ui-calendar {{theme}}" data-calendar-els="root" onselectstart="return false;">\n                    {{#control}}\n                    <div class="calendar-control" data-calendar-els="control" style="{{controlCSS}}">\n                        <a class="date-move-left" data-calendar-move="left" style="{{controlButtonCSS}}">{{{left}}}</a>\n                        <div class="date-display" data-calendar-els="control-display" style="{{controlCSS}}"></div>\n                        <a class="date-move-right" data-calendar-move="right" style="{{controlButtonCSS}}">{{{right}}}</a>\n                    </div>\n                    {{/control}}\n                    <div class="calendar-body" data-calendar-els="body"></div>\n                </div>\n                ';},getFrame=function getFrame(){var data=jQuery.extend(true,{},cfg,{controlCSS:{},controlButtonCSS:{}}),tmpl=getFrameTmpl();data.controlButtonCSS["height"]=data.controlCSS["height"]=U.cssNumber(cfg.dimensions.controlHeight);data.controlButtonCSS["line-height"]=data.controlCSS["line-height"]=U.cssNumber(cfg.dimensions.controlHeight);data.controlButtonCSS["width"]=U.cssNumber(cfg.dimensions.controlHeight);data.controlCSS=U.css(data.controlCSS);data.controlButtonCSS=U.css(data.controlButtonCSS);try{return ax5.mustache.render(tmpl,data);}finally {data=null;tmpl=null;}},getDayTmpl=function getDayTmpl(){return '\n                <table data-calendar-table="day" cellpadding="0" cellspacing="0" style="width:100%;">\n                    <thead>\n                        <tr>\n                        {{#weekNames}}\n                            <td class="calendar-col-{{@i}}" style="height: {{colHeadHeight}}">\n                            {{label}}\n                            </td>\n                        {{/weekNames}}\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfWeek}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfWeek}}\n                            <td class="calendar-col-{{@i}}" style="{{itemStyles}}">\n                                <a class="calendar-item-day {{addClass}}" data-calendar-item-date="{{thisDate}}">\n                                    <span class="addon"></span>\n                                    {{thisDataLabel}}\n                                    <span class="lunar"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ';},getMonthTmpl=function getMonthTmpl(){return '\n                <table data-calendar-table="month" cellpadding="0" cellspacing="0" style="width:100%;">\n                    <thead>\n                        <tr>\n                            <td class="calendar-col-0" colspan="3" style="height: {{colHeadHeight}}">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class="calendar-col-{{@i}}" style="{{itemStyles}}">\n                                <a class="calendar-item-month {{addClass}}" data-calendar-item-month="{{thisMonth}}">\n                                    <span class="addon"></span>\n                                    {{thisMonthLabel}}\n                                    <span class="lunar"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ';},getYearTmpl=function getYearTmpl(){return '\n                <table data-calendar-table="year" cellpadding="0" cellspacing="0" style="width:100%;">\n                    <thead>\n                        <tr>\n                            <td class="calendar-col-0" colspan="4" style="height: {{colHeadHeight}}">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class="calendar-col-{{@i}}" style="{{itemStyles}}">\n                                <a class="calendar-item-year {{addClass}}" data-calendar-item-year="{{thisYear}}">\n                                    <span class="addon"></span>\n                                    {{thisYearLabel}}\n                                    <span class="lunar"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ';},setDisplay=function setDisplay(){var myDate=U.date(cfg.displayDate),yy="",mm="",yy1,yy2;if(cfg.control){if(cfg.mode=="day"||cfg.mode=="d"){yy=cfg.control.yearTmpl?cfg.control.yearTmpl.replace('%s',myDate.getFullYear()):myDate.getFullYear();mm=cfg.control.monthTmpl?cfg.control.monthTmpl.replace('%s',cfg.lang.months[myDate.getMonth()]):cfg.lang.months[myDate.getMonth()];this.$["control-display"].html(function(){if(cfg.control.yearFirst){return '<span data-calendar-display="year">'+yy+'</span>'+'<span data-calendar-display="month">'+mm+'</span>';}else {return '<span data-calendar-display="month">'+mm+'</span>'+'<span data-calendar-display="year">'+yy+'</span>';}}());}else if(cfg.mode=="month"||cfg.mode=="m"){yy=cfg.control.yearTmpl?cfg.control.yearTmpl.replace('%s',myDate.getFullYear()):myDate.getFullYear();this.$["control-display"].html('<span data-calendar-display="year">'+yy+'</span>');}else if(cfg.mode=="year"||cfg.mode=="y"){yy1=cfg.control.yearTmpl?cfg.control.yearTmpl.replace('%s',myDate.getFullYear()-10):myDate.getFullYear()-10;yy2=cfg.control.yearTmpl?cfg.control.yearTmpl.replace('%s',Number(myDate.getFullYear())+9):Number(myDate.getFullYear())+9;this.$["control-display"].html(yy1+' ~ '+yy2);}this.$["control-display"].find('[data-calendar-display]').on(cfg.clickEventName,function(e){var target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-calendar-display")){return true;}}),mode;if(target){mode=target.getAttribute("data-calendar-display");this.changeMode(mode);}target=null;mode=null;}.bind(this));}myDate=null;yy=null;mm=null;yy1=null;yy2=null;return this;},printDay=function printDay(nowDate){var dotDate=U.date(nowDate),monthStratDate=new Date(dotDate.getFullYear(),dotDate.getMonth(),1,12),_today=cfg.displayDate,tableStartDate=function(){var day=monthStratDate.getDay();if(day==0)day=7;try{return U.date(monthStratDate,{add:{d:-day}});}finally {day=null;}}(),loopDate,thisMonth=dotDate.getMonth(),itemStyles={},i,k,frameWidth=this.$["body"].width(),frameHeight=Math.floor(frameWidth*(6/7)), // 1week = 7days, 1month = 6weeks
data,tmpl=getDayTmpl();if(cfg.dimensions.height){frameHeight=U.number(cfg.dimensions.height)-U.number(cfg.dimensions.colHeadHeight);}itemStyles['height']=Math.floor(frameHeight/6)-U.number(cfg.dimensions.itemPadding)*2+'px';itemStyles['line-height']=itemStyles['height'];itemStyles['padding']=U.cssNumber(cfg.dimensions.itemPadding);data={weekNames:[].concat(ax5.info.weekNames),list:[]};data.weekNames.forEach(function(n){n.colHeadHeight=U.cssNumber(cfg.dimensions.colHeadHeight);});loopDate=tableStartDate;i=0;while(i<6){k=0;while(k<7){var thisDate=''+U.date(loopDate,{"return":cfg.dateFormat}),_date={isStartOfWeek:k==0,thisDate:''+thisDate,thisDataLabel:cfg.lang.dayTmpl.replace('%s',loopDate.getDate()),itemStyles:U.css(itemStyles),addClass:function(){if(cfg.selectable){if(self.selectableMap[thisDate]){return loopDate.getMonth()==thisMonth?"live":"";}else {return "disable";}}else {return loopDate.getMonth()==thisMonth?thisDate==U.date(_today,{"return":"yyyymmdd"})?"focus":"live":"";}}()+' '+function(){return self.markerMap[thisDate]?self.markerMap[thisDate].theme||cfg.defaultMarkerTheme:'';}()+' '+function(){return self.selectionMap[thisDate]?"selected-day":'';}()};data.list.push(_date);k++;loopDate=U.date(loopDate,{add:{d:1}});thisDate=null;_date=null;}i++;}this.$["body"].html(ax5.mustache.render(tmpl,data));this.$["body"].find('[data-calendar-item-date]').on(cfg.clickEventName,function(e){e=e||window.event;onclick.call(self,e,'date');U.stopEvent(e);});this.printedDay={start:tableStartDate,end:loopDate};onStateChanged.call(this,null,{self:this,action:"printDay",printedDay:this.printedDay});setDisplay.call(this);dotDate=null;monthStratDate=null;_today=null;tableStartDate=null;loopDate=null;thisMonth=null;itemStyles=null;i=null;k=null;frameWidth=null;frameHeight=null;data=null;tmpl=null;},printMonth=function printMonth(nowDate){var dotDate=U.date(nowDate),nMonth=dotDate.getMonth(),itemStyles={},i,k,m,tableStartMonth,frameWidth=this.$["body"].width(),frameHeight=Math.floor(frameWidth*(6/7)),data,tmpl=getMonthTmpl();if(cfg.dimensions.height){frameHeight=U.number(cfg.dimensions.height)-U.number(cfg.dimensions.colHeadHeight);}itemStyles['height']=Math.floor(frameHeight/4)-U.number(cfg.dimensions.itemPadding)*2+'px';itemStyles['line-height']=itemStyles['height'];itemStyles['padding']=U.cssNumber(cfg.dimensions.itemPadding);data={colHeadHeight:U.cssNumber(cfg.dimensions.colHeadHeight),colHeadLabel:cfg.lang.monthHeading,list:[]};tableStartMonth=0;m=0;i=0;while(i<4){k=0;while(k<3){var _month={row:i,col:k,isStartOfRow:k==0,thisMonth:dotDate.getFullYear()+'-'+U.setDigit(m+1,2)+'-'+U.setDigit(dotDate.getDate(),2),thisMonthLabel:cfg.lang.months[m],itemStyles:U.css(itemStyles),addClass:function(){if(cfg.selectable){return self.selectableMap[m]?'live':'disable';}else {return 'live';}}()+' '+function(){return m==nMonth?"focus":"";}()+' '+function(){return self.markerMap[m]?self.markerMap[m].theme||cfg.defaultMarkerTheme:'';}()};data.list.push(_month);m++;k++;_month=null;}i++;}this.$["body"].html(ax5.mustache.render(tmpl,data));this.$["body"].find('[data-calendar-item-month]').on(cfg.clickEventName,function(e){e=e||window.event;onclick.call(self,e,'month');U.stopEvent(e);});this.printedDay={start:dotDate.getFullYear()+'-'+U.setDigit(tableStartMonth+1,2),end:dotDate.getFullYear()+'-'+U.setDigit(m,2)};onStateChanged.call(this,null,{self:this,action:"printMonth",printedDay:this.printedDay});setDisplay.call(this);dotDate=null;nMonth=null;itemStyles=null;i=null;k=null;m=null;tableStartMonth=null;frameWidth=null;frameHeight=null;data=null;tmpl=null;},printYear=function printYear(nowDate){var dotDate=U.date(nowDate),nYear=dotDate.getFullYear(),itemStyles={},i,k,y,tableStartYear,frameWidth=this.$["body"].width(),frameHeight=Math.floor(frameWidth*(6/7)),data,tmpl=getYearTmpl();if(cfg.dimensions.height){frameHeight=U.number(cfg.dimensions.height)-U.number(cfg.dimensions.colHeadHeight);}itemStyles['height']=Math.floor(frameHeight/5)-U.number(cfg.dimensions.itemPadding)*2+'px';itemStyles['line-height']=itemStyles['height'];itemStyles['padding']=U.cssNumber(cfg.dimensions.itemPadding);data={colHeadHeight:U.cssNumber(cfg.dimensions.colHeadHeight),colHeadLabel:cfg.lang.yearHeading,list:[]};tableStartYear=nYear-10;y=nYear-10;i=0;while(i<5){k=0;while(k<4){var _year={row:i,col:k,isStartOfRow:k==0,thisYear:y+'-'+U.setDigit(dotDate.getMonth()+1,2)+'-'+U.setDigit(dotDate.getDate(),2),thisYearLabel:cfg.lang.yearTmpl.replace('%s',y),itemStyles:U.css(itemStyles),addClass:function(){if(cfg.selectable){return self.selectableMap[y]?'live':'disable';}else {return 'live';}}()+' '+function(){return y==nYear?"focus":"";}()+' '+function(){return self.selectableMap[y]?self.selectableMap[y].theme||cfg.defaultMarkerTheme:'';}()};data.list.push(_year);y++;k++;_year=null;}i++;}this.$["body"].html(ax5.mustache.render(tmpl,data));this.$["body"].find('[data-calendar-item-year]').on(cfg.clickEventName,function(e){e=e||window.event;onclick.call(this,e,'year');U.stopEvent(e);});this.printedDay={start:tableStartYear,end:y-1};onStateChanged.call(this,null,{self:this,action:"printYear",printedDay:this.printedDay});setDisplay.call(this);dotDate=null;nYear=null;itemStyles=null;i=null;k=null;y=null;tableStartYear=null;frameWidth=null;frameHeight=null;data=null;tmpl=null;},onclick=function onclick(e,mode,target,value){var removed,dt,selectable;mode=mode||"date";target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-calendar-item-"+mode)){return true;}});if(target){value=target.getAttribute("data-calendar-item-"+mode);dt=U.date(value,{"return":cfg.dateFormat});selectable=true;selectableCount=cfg.multipleSelect?U.isNumber(cfg.multipleSelect)?cfg.multipleSelect:2:1;if(cfg.selectable){if(!self.selectableMap[dt])selectable=false;}if(mode=="date"){if(selectable){if(self.selection.length>=selectableCount){removed=self.selection.splice(0,self.selection.length-(selectableCount-1));removed.forEach(function(d){self.$["body"].find('[data-calendar-item-date="'+U.date(d,{"return":cfg.dateFormat})+'"]').removeClass("selected-day");});}jQuery(target).addClass("selected-day");self.selection.push(value);if(self.onClick){self.onClick.call({self:this,date:value,target:this.target,dateElement:target});}}}else if(mode=="month"){if(cfg.selectMode=="month"){if(selectable){if(self.selection.length>=selectableCount){removed=self.selection.splice(0,self.selection.length-(selectableCount-1));removed.forEach(function(d){self.$["body"].find('[data-calendar-item-month="'+U.date(d,{"return":'yyyy-mm-dd'})+'"]').removeClass("selected-month");});}jQuery(target).addClass("selected-month");self.selection.push(value);if(self.onClick){self.onClick.call({self:this,date:value,target:this.target,dateElement:target});}}}else {self.changeMode("day",value);}}else if(mode=="year"){if(cfg.selectMode=="year"){if(selectable){if(self.selection.length>=selectableCount){removed=self.selection.splice(0,self.selection.length-(selectableCount-1));removed.forEach(function(d){self.$["body"].find('[data-calendar-item-year="'+U.date(d,{"return":'yyyy-mm-dd'})+'"]').removeClass("selected-year");});}jQuery(target).addClass("selected-year");self.selection.push(value);if(self.onClick){self.onClick.call({self:this,date:value,target:this.target,dateElement:target});}}}else {self.changeMode("month",value);}}}mode=null;target=null;value=null;removed=null;dt=null;selectable=null;},move=function move(e,target,value){target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-calendar-move")){return true;}});if(target){value=target.getAttribute("data-calendar-move");if(cfg.mode=="day"){if(value=="left"){cfg.displayDate=U.date(cfg.displayDate,{add:{m:-1}});}else {cfg.displayDate=U.date(cfg.displayDate,{add:{m:1}});}printDay.call(this,cfg.displayDate);}else if(cfg.mode=="month"){if(value=="left"){cfg.displayDate=U.date(cfg.displayDate,{add:{y:-1}});}else {cfg.displayDate=U.date(cfg.displayDate,{add:{y:1}});}printMonth.call(this,cfg.displayDate);}else if(cfg.mode=="year"){if(value=="left"){cfg.displayDate=U.date(cfg.displayDate,{add:{y:-10}});}else {cfg.displayDate=U.date(cfg.displayDate,{add:{y:10}});}printYear.call(this,cfg.displayDate);}}target=null;value=null;},applyMarkerMap=function applyMarkerMap(){setTimeout(function(){if(cfg.mode==="day"||cfg.mode==="d"){for(var k in this.markerMap){this.$["body"].find('[data-calendar-item-date="'+k+'"]').addClass(this.markerMap[k].theme||cfg.defaultMarkerTheme);}}}.bind(this));},applySelectionMap=function applySelectionMap(){setTimeout(function(){for(var k in this.selectionMap){this.$["body"].find('[data-calendar-item-date="'+k+'"]').addClass("selected-day");}}.bind(this));}; /**
         * Preferences of calendar UI
         * @method ax5.ui.calendar.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.calendar}
         * @example
         * ```
         * setConfig({
		 *      target : {Element|AX5 nodelist}, // 메뉴 UI를 출력할 대상
		 *      mode: {String}, // [day|month|year] - 화면 출력 모드
		 *      onclick: {Function} // [onclick] - 아이템 클릭이벤트 처리자
		 * });
         * ```
         */ //== class body start
this.init=function(){ // after setConfig();
this.onStateChanged=cfg.onStateChanged;this.onClick=cfg.onClick;if(!cfg.target){console.log(ax5.info.getError("ax5calendar","401","setConfig"));}this.target=jQuery(cfg.target);cfg.displayDate=U.date(cfg.displayDate);this.target.html(getFrame.call(this)); // 파트수집
this.$={"root":this.target.find('[data-calendar-els="root"]'),"control":this.target.find('[data-calendar-els="control"]'),"control-display":this.target.find('[data-calendar-els="control-display"]'),"body":this.target.find('[data-calendar-els="body"]')};if(cfg.control){this.$["control"].find('[data-calendar-move]').on(cfg.clickEventName,function(e){move.call(this,e||window.event);}.bind(this));} // collect selectableMap
if(cfg.selection){this.setSelection(cfg.selection,false);} // collect selectableMap
if(cfg.selectable){this.setSelectable(cfg.selectable,false);} // collect markerMap
if(cfg.marker){this.setMarker(cfg.marker,false);}setTimeout(function(){if(cfg.mode==="day"||cfg.mode==="d"){printDay.call(this,cfg.displayDate);}else if(cfg.mode==="month"||cfg.mode==="m"){printMonth.call(this,cfg.displayDate);}else if(cfg.mode==="year"||cfg.mode==="y"){printYear.call(this,cfg.displayDate);}}.bind(this));}; /**
         * @method ax5.ui.calendar.changeMode
         * @param {String} mode
         * @param {String} changeDate
         * @returns {ax5.ui.calendar}
         */this.changeMode=function(mode,changeDate){if(typeof changeDate!="undefined")cfg.displayDate=changeDate;if(mode)cfg.mode=mode;this.$["body"].removeClass("fadein").addClass("fadeout");setTimeout(function(){if(cfg.mode=="day"||cfg.mode=="d"){printDay.call(this,cfg.displayDate);}else if(cfg.mode=="month"||cfg.mode=="m"){printMonth.call(this,cfg.displayDate);}else if(cfg.mode=="year"||cfg.mode=="y"){printYear.call(this,cfg.displayDate);}this.$["body"].removeClass("fadeout").addClass("fadein");}.bind(this),cfg.animateTime);return this;}; /**
         * @method ax5.ui.calendar.setSelection
         * @param {Array} selection
         * @returns {ax5.ui.calendar}
         * @example
         * ```
         *
         * ```
         */this.setSelection=function(){self.selectionMap={};var processor={'arr':function arr(v,map,count){map={};if(!U.isArray(v))return map;self.selection=v=v.splice(0,count);v.forEach(function(n){if(U.isDate(n))n=U.date(n,{'return':cfg.dateFormat});map[n]=true;});return map;}};return function(selection,isPrint){var result={};selectableCount=cfg.multipleSelect?U.isNumber(cfg.multipleSelect)?cfg.multipleSelect:2:1;if(cfg.selection=selection){if(U.isArray(selection)){result=processor.arr(selection,{},selectableCount);}else {return this;}}this.selectionMap=jQuery.extend({},result); // 변경내용 적용하여 출력
if(isPrint!==false)applySelectionMap.call(this);result=null;return this;};}(); /**
         * @method ax5.ui.calendar.getSelection
         */this.getSelection=function(){return this.selection;}; /**
         * @method ax5.ui.calendar.setSelectable
         */this.setSelectable=function(){self.selectableMap={};var processor={'arr':function arr(v,map){map={};if(!U.isArray(v))return map;v.forEach(function(n){if(U.isDate(n))n=U.date(n,{'return':cfg.dateFormat});map[n]=true;});return map;},'obj':function obj(v,map){map={};if(U.isArray(v))return map;if(v.range)return map;for(var k in v){map[k]=v[k];}return map;},'range':function range(v,map){map={};if(U.isArray(v))return map;if(!v.range)return map;v.range.forEach(function(n){if(U.isDateFormat(n.from)&&U.isDateFormat(n.to)){for(var d=U.date(n.from);d<=U.date(n.to);d.setDate(d.getDate()+1)){map[U.date(d,{"return":cfg.dateFormat})]=true;}}else {for(var i=n.from;i<=n.to;i++){map[i]=true;}}});return map;}};return function(selectable,isPrint){var key,result={};if(cfg.selectable=selectable){if(U.isArray(selectable)){result=processor.arr(selectable);}else {for(key in processor){if(selectable[key]){result=processor[key](selectable);break;}}if(Object.keys(result).length===0){result=processor.obj(selectable);}}}this.selectableMap=result; // 변경내용 적용하여 출력
if(isPrint!==false)this.changeMode();return this;};}(); /**
         * @method ax5.ui.calendar.setMarker
         */this.setMarker=function(){self.markerMap={};var processor={'obj':function obj(v,map){map={};if(U.isArray(v))return map;if(v.range)return map;for(var k in v){map[k]=v[k];}v=null;return map;},'range':function range(v,map){map={};if(U.isArray(v))return map;if(!v.range)return map;v.range.forEach(function(n){if(U.isDateFormat(n.from)&&U.isDateFormat(n.to)){for(var d=U.date(n.from);d<=U.date(n.to);d.setDate(d.getDate()+1)){map[U.date(d,{"return":cfg.dateFormat})]={theme:n.theme,label:n.label};}}else {for(var i=n.from;i<=n.to;i++){map[i]={theme:n.theme,label:n.label};}}});v=null;return map;}};return function(marker,isApply){var key,result={};if(cfg.marker=marker){for(key in processor){if(marker[key]){result=processor[key](marker);break;}}if(Object.keys(result).length===0){result=processor.obj(marker);}}this.markerMap=result; // 변경내용 적용하여 출력
if(isApply!==false)applyMarkerMap.call(this);return this;};}(); // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.calendar=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root); // ax5.ui.picker
(function(root,_SUPER_){ /**
     * @class ax5.ui.picker
     * @classdesc
     * @version 0.6.1
     * @author tom@axisj.com
     * @example
     * ```
     * var myPicker = new ax5.ui.picker();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.queue=[];this.config={clickEventName:"click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
theme:'default',title:'',lang:{"ok":"ok","cancel":"cancel"},animateTime:250};this.activePicker=null;this.activePickerQueueIndex=-1;this.openTimer=null;this.closeTimer=null;cfg=this.config;var onStateChanged=function onStateChanged(item,that){if(item&&item.onStateChanged){item.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}return true;},bindPickerTarget=function(){var pickerEvent={'focus':function focus(queIdx,e){this.open(queIdx);},'click':function click(queIdx,e){this.open(queIdx);}};var pickerType={'@fn':function fn(queIdx){var item=this.queue[queIdx],config={},inputLength=item.$target.find('input[type="text"]').length;config={inputLength:inputLength||1};if(inputLength>1){config.btns={ok:{label:cfg.lang["ok"],theme:cfg.theme}};}this.queue[queIdx]=jQuery.extend(true,config,item);config=null;inputLength=null;},'date':function date(queIdx){ // 1. 이벤트 바인딩
// 2. ui 준비
var item=this.queue[queIdx],contentWidth=item.content?item.content.width||270:270,contentMargin=item.content?item.content.margin||5:5,config={},inputLength=item.$target.find('input[type="text"]').length;config={contentWidth:contentWidth*inputLength+(inputLength-1)*contentMargin,content:{width:contentWidth,margin:contentMargin},inputLength:inputLength||1};if(inputLength>1&&!item.btns){config.btns={ok:{label:cfg.lang["ok"],theme:cfg.theme}};}this.queue[queIdx]=jQuery.extend(true,config,item);contentWidth=null;contentMargin=null;config=null;inputLength=null;},'secure-num':function secureNum(queIdx){var item=this.queue[queIdx],config={},inputLength=item.$target.find('input[type="text"]').length;config={inputLength:inputLength||1};this.queue[queIdx]=jQuery.extend(true,config,item);config=null;inputLength=null;}};return function(queIdx){var item=this.queue[queIdx],_input;if(!item.content){console.log(ax5.info.getError("ax5picker","501","bind"));return this;} // 함수타입
if(U.isFunction(item.content)){pickerType["@fn"].call(this,queIdx);}else {for(var key in pickerType){if(item.content.type==key){pickerType[key].call(this,queIdx);break;}}}_input=item.$target.get(0).tagName.toUpperCase()=="INPUT"?item.$target:item.$target.find('input[type]');_input.unbind('focus.ax5picker').unbind('click.ax5picker').bind('focus.ax5picker',pickerEvent.focus.bind(this,queIdx)).bind('click.ax5picker',pickerEvent.click.bind(this,queIdx));item.$target.find('.input-group-addon').unbind('click.ax5picker').bind('click.ax5picker',pickerEvent.click.bind(this,queIdx));if(item.content.formatter&&ax5.ui.formatter){_input.ax5formatter(item.content.formatter);}_input=null;item=null;queIdx=null;return this;};}(),getTmpl=function getTmpl(queIdx){return '\n                <div class="ax5-ui-picker {{theme}}" id="{{id}}" data-picker-els="root">\n                    {{#title}}\n                        <div class="ax-picker-heading">{{title}}</div>\n                    {{/title}}\n                    <div class="ax-picker-body">\n                        <div class="ax-picker-content" data-picker-els="content" style="width:{{contentWidth}}px;"></div>\n                        {{#btns}}\n                            <div class="ax-picker-buttons">\n                            {{#btns}}\n                                {{#@each}}\n                                <button data-picker-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>\n                                {{/@each}}\n                            {{/btns}}\n                            </div>\n                        {{/btns}}\n                    </div>\n                    <div class="ax-picker-arrow"></div>\n                </div>\n                ';},alignPicker=function alignPicker(append){if(!this.activePicker)return this;var item=this.queue[this.activePickerQueueIndex],pos={},dim={};if(append)jQuery(document.body).append(this.activePicker);pos=item.$target.offset();dim={width:item.$target.outerWidth(),height:item.$target.outerHeight()}; // picker css(width, left, top) & direction 결정
if(!item.direction||item.direction===""||item.direction==="auto"){ // set direction
item.direction="top";}if(append){this.activePicker.addClass("direction-"+item.direction);}this.activePicker.css(function(){if(item.direction=="top"){return {left:pos.left+dim.width/2-this.activePicker.outerWidth()/2,top:pos.top+dim.height+12};}else if(item.direction=="bottom"){return {left:pos.left+dim.width/2-this.activePicker.outerWidth()/2,top:pos.top-this.activePicker.outerHeight()-12};}else if(item.direction=="left"){return {left:pos.left+dim.width+12,top:pos.top-dim.height/2};}else if(item.direction=="right"){return {left:pos.left-this.activePicker.outerWidth()-12,top:pos.top-dim.height/2};}}.call(this));},onBodyClick=function onBodyClick(e,target){if(!this.activePicker)return this;var item=this.queue[this.activePickerQueueIndex];target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-picker-els")){return true;}else if(item.$target.get(0)==target){return true;}});if(!target){ //console.log("i'm not picker");
this.close();return this;} //console.log("i'm picker");
return this;},onBtnClick=function onBtnClick(e,target){ // console.log('btn click');
if(e.srcElement)e.target=e.srcElement;target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-picker-btn")){return true;}});if(target){var item=this.queue[this.activePickerQueueIndex],k=target.getAttribute("data-picker-btn");if(item.btns&&item.btns[k].onClick){var that={key:k,value:item.btns[k],self:this,item:item};item.btns[k].onClick.call(that,k);}else {this.close();}}},onBodyKeyup=function onBodyKeyup(e){if(e.keyCode==ax5.info.eventKeys.ESC){this.close();}},getQueIdx=function getQueIdx(boundID){if(!U.isString(boundID)){boundID=jQuery(boundID).data("data-axpicker-id");}if(!U.isString(boundID)){console.log(ax5.info.getError("ax5picker","402","getQueIdx"));return;}return U.search(this.queue,function(){return this.id==boundID;});}; /// private end
/**
         * Preferences of picker UI
         * @method ax5.ui.picker.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.picker}
         * @example
         * ```
         * ```
         */this.init=function(){this.onStateChanged=cfg.onStateChanged;};this.bind=function(item){var pickerConfig={},queIdx;item=jQuery.extend(true,pickerConfig,cfg,item);if(!item.target){console.log(ax5.info.getError("ax5picker","401","bind"));return this;}item.$target=jQuery(item.target);if(!item.id)item.id=item.$target.data("data-axpicker-id");if(!item.id){item.id='ax5-picker-'+ax5.getGuid();item.$target.data("data-axpicker-id",item.id);}queIdx=U.search(this.queue,function(){return this.id==item.id;});if(queIdx===-1){this.queue.push(item);bindPickerTarget.call(this,this.queue.length-1);}else {this.queue[queIdx]=jQuery.extend(true,{},this.queue[queIdx],item);bindPickerTarget.call(this,queIdx);}pickerConfig=null;queIdx=null;return this;}; /**
         * @method ax5.ui.picker.setContentValue
         * @param {String} boundID
         * @param {Number} inputIndex
         * @param {String} val
         * @returns {ax5.ui.picker} this
         */this.setContentValue=function(boundID,inputIndex,val){var queIdx=U.isNumber(boundID)?boundID:getQueIdx.call(this,boundID);var item=this.queue[queIdx];var _input;if(item){_input=item.$target.get(0).tagName.toUpperCase()=="INPUT"?item.$target:jQuery(item.$target.find('input[type]').get(inputIndex));_input.val(val);onStateChanged.call(this,item,{self:self,state:"changeValue",item:item,value:val});if(item.inputLength==1){this.close();}}item=null;boundID=null;inputIndex=null;val=null;return this;}; /**
         * @method ax5.ui.picker.open
         * @param {String} boundObjectId
         * @returns {ax5.ui.picker} this
         */this.open=function(){var pickerContent={'@fn':function fn(queIdx,callBack){var item=this.queue[queIdx];item.content.call(item,function(html){callBack(html);});return true;},'date':function date(queIdx){var item=this.queue[queIdx];var html=[];for(var i=0;i<item.inputLength;i++){html.push('<div '+'style="width:'+U.cssNumber(item.content.width)+';float:left;" '+'class="ax-picker-content-box" '+'data-calendar-target="'+i+'"></div>');if(i<item.inputLength-1)html.push('<div style="width:'+item.content.margin+'px;float:left;height: 5px;"></div>');}html.push('<div style="clear:both;"></div>');item.pickerContent.html(html.join(''));var calendarConfig={displayDate:new Date(),control:{left:'<i class="fa fa-chevron-left"></i>',yearTmpl:'%s',monthTmpl:'%s',right:'<i class="fa fa-chevron-right"></i>',yearFirst:true}}; // calendar bind
item.pickerContent.find('[data-calendar-target]').each(function(){ // calendarConfig extend ~
var idx=this.getAttribute("data-calendar-target"),dValue=item.$target.find('input[type]').get(idx).value,d=ax5.util.date(dValue);calendarConfig.displayDate=d;if(dValue)calendarConfig.selection=[d];calendarConfig=jQuery.extend(true,calendarConfig,item.content.config||{});calendarConfig.target=this;calendarConfig.onClick=function(){self.setContentValue(item.id,idx,this.date);};new ax5.ui.calendar(calendarConfig);});},'secure-num':function secureNum(queIdx){var item=this.queue[queIdx];var html=[];for(var i=0;i<item.inputLength;i++){html.push('<div '+'style="width:'+U.cssNumber(item.content.width)+';float:left;" '+'class="ax-picker-content-box" '+'data-secure-num-target="'+i+'"></div>');if(i<item.inputLength-1)html.push('<div style="width:'+item.content.margin+'px;float:left;height: 5px;"></div>');}html.push('<div style="clear:both;"></div>');item.pickerContent.html(html.join('')); // secure-num bind
item.pickerContent.find('[data-secure-num-target]').each(function(){var idx=this.getAttribute("data-secure-num-target"),po=[];var numArray=function(a){var j,x,i;for(i=a.length;i;i-=1){j=Math.floor(Math.random()*i);x=a[i-1];a[i-1]=a[j];a[j]=x;}return a;}([0,1,2,3,4,5,6,7,8,9]);var specialArray=[{label:"&#x02190",fn:"back"},{label:"C",fn:"clear"}];numArray.forEach(function(n){po.push('<div style="float:left;'+item.content.config.btnWrapStyle+'">');po.push('<button class="btn btn-default btn-'+item.content.config.btnTheme+'" '+'style="'+item.content.config.btnStyle+'" data-secure-num-value="'+n+'">'+n+'</button>');po.push('</div>');});specialArray.forEach(function(n){po.push('<div style="float:left;'+item.content.config.btnWrapStyle+'">');po.push('<button class="btn btn-default btn-'+item.content.config.specialBtnTheme+'" '+'style="'+item.content.config.btnStyle+'" data-secure-num-value="'+n.fn+'">'+n.label+'</button>');po.push('</div>');});po.push('<div style="clear:both;"></div>');$(this).html(po.join('')).find('[data-secure-num-value]').click(function(){var act=this.getAttribute("data-secure-num-value");var _input=item.$target.get(0).tagName.toUpperCase()=="INPUT"?item.$target:jQuery(item.$target.find('input[type]').get(idx));var val=_input.val();if(act=="back"){_input.val(val.substring(0,val.length-1));}else if(act=="clear"){_input.val('');}else {_input.val(val+act);}onStateChanged.call(this,item,{self:self,state:"changeValue",item:item,value:_input.val()});});});}};return function(boundID,tryCount){var queIdx=U.isNumber(boundID)?boundID:getQueIdx.call(this,boundID);var item=this.queue[queIdx]; /**
                 다른 피커가 있는 경우와 다른 피커를 닫고 다시 오픈 명령이 내려진 경우에 대한 예외 처리 구문
                 */if(this.openTimer)clearTimeout(this.openTimer);if(this.activePicker){if(this.activePickerQueueIndex==queIdx){return this;}if(tryCount>2)return this;this.close();this.openTimer=setTimeout(function(){this.open(queIdx,(tryCount||0)+1);}.bind(this),cfg.animateTime);return this;}this.activePicker=jQuery(ax5.mustache.render(getTmpl.call(this,item,queIdx),item));this.activePickerQueueIndex=queIdx;item.pickerContent=this.activePicker.find('[data-picker-els="content"]');if(U.isFunction(item.content)){ // 함수타입
item.pickerContent.html("Loading..");pickerContent["@fn"].call(this,queIdx,function(html){item.pickerContent.html(html);});}else {for(var key in pickerContent){if(item.content.type==key){pickerContent[key].call(this,queIdx);break;}}} // bind event picker btns
this.activePicker.find("[data-picker-btn]").on(cfg.clickEventName,function(e){onBtnClick.call(this,e||window.event,queIdx);}.bind(this));alignPicker.call(this,"append");jQuery(window).bind("resize.ax5picker",function(){alignPicker.call(this);}.bind(this)); // bind key event
jQuery(window).bind("keyup.ax5picker",function(e){e=e||window.event;onBodyKeyup.call(this,e);U.stopEvent(e);}.bind(this));jQuery(window).bind("click.ax5picker",function(e){e=e||window.event;onBodyClick.call(this,e);U.stopEvent(e);}.bind(this));onStateChanged.call(this,item,{self:this,state:"open",item:item});return this;};}(); /**
         * @method ax5.ui.picker.close
         * @returns {ax5.ui.picker} this
         */this.close=function(item){if(this.closeTimer)clearTimeout(this.closeTimer);if(!this.activePicker)return this;item=this.queue[this.activePickerQueueIndex];this.activePicker.addClass("destroy");jQuery(window).unbind("resize.ax5picker");jQuery(window).unbind("click.ax5picker");jQuery(window).unbind("keyup.ax5picker");this.closeTimer=setTimeout(function(){if(this.activePicker)this.activePicker.remove();this.activePicker=null;this.activePickerQueueIndex=-1;onStateChanged.call(this,item,{self:this,state:"close"});}.bind(this),cfg.animateTime);return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.picker=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root);ax5.ui.picker_instance=new ax5.ui.picker();jQuery.fn.ax5picker=function(){return function(config){if(ax5.util.isString(arguments[0])){var methodName=arguments[0];switch(methodName){case "open":return ax5.ui.select_instance.open(this);break;case "close":return ax5.ui.select_instance.close(this);break;case "setValue":return ax5.ui.select_instance.setContentValue(this,arguments[1],arguments[2]);break;default:return this;}}else {if(typeof config=="undefined")config={};jQuery.each(this,function(){var defaultConfig={target:this};config=jQuery.extend(true,config,defaultConfig);ax5.ui.picker_instance.bind(config);});}return this;};}(); // ax5.ui.formatter
(function(root,_SUPER_){ /**
     * @class ax5.ui.formatter
     * @classdesc
     * @version 0.4.1
     * @author tom@axisj.com
     * @example
     * ```
     * var formatter = new ax5.ui.formatter();
     * ```
     */var U=ax5.util,TODAY=new Date();var setSelectionRange=function setSelectionRange(input,pos){if(typeof pos=="undefined"){pos=input.value.length;}if(input.setSelectionRange){input.focus();input.setSelectionRange(pos,pos);}else if(input.createTextRange){var range=input.createTextRange();range.collapse(true);range.moveEnd('character',pos);range.moveStart('character',pos);range.select();}else if(input.selectionStart){input.focus();input.selectionStart=pos;input.selectionEnd=pos;}}; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.queue=[];this.config={animateTime:250};this.openTimer=null;this.closeTimer=null;cfg=this.config;var ctrlKeys={"18":"KEY_ALT","8":"KEY_BACKSPACE","17":"KEY_CONTROL","46":"KEY_DELETE","40":"KEY_DOWN","35":"KEY_END","187":"KEY_EQUAL","27":"KEY_ESC","36":"KEY_HOME","45":"KEY_INSERT","37":"KEY_LEFT","189":"KEY_MINUS","34":"KEY_PAGEDOWN","33":"KEY_PAGEUP", // "190": "KEY_PERIOD",
"13":"KEY_RETURN","39":"KEY_RIGHT","16":"KEY_SHIFT", // "32": "KEY_SPACE",
"9":"KEY_TAB","38":"KEY_UP","91":"KEY_WINDOW" //"107" : "NUMPAD_ADD",
//"194" : "NUMPAD_COMMA",
//"110" : "NUMPAD_DECIMAL",
//"111" : "NUMPAD_DIVIDE",
//"12" : "NUMPAD_EQUAL",
//"106" : "NUMPAD_MULTIPLY",
//"109" : "NUMPAD_SUBTRACT"
},numKeys={'48':1,'49':1,'50':1,'51':1,'52':1,'53':1,'54':1,'55':1,'56':1,'57':1,'96':1,'97':1,'98':1,'99':1,'100':1,'101':1,'102':1,'103':1,'104':1,'105':1},setEnterableKeyCodes={"money":function money(opts,optIdx){var enterableKeyCodes={'188':','};if(opts.patternArgument=="int"){ // 소수점 입력 안됨
}else {enterableKeyCodes['190']="."; // 소수점 입력 허용
}opts.enterableKeyCodes=$.extend(enterableKeyCodes,ctrlKeys,numKeys);},"number":function number(opts,optIdx){var enterableKeyCodes={'190':'.'};opts.enterableKeyCodes=$.extend(enterableKeyCodes,ctrlKeys,numKeys);},"date":function date(opts,optIdx){var enterableKeyCodes={'189':'-','191':'/'};opts.enterableKeyCodes=$.extend(enterableKeyCodes,ctrlKeys,numKeys);},"time":function time(opts,optIdx){var enterableKeyCodes={'186':':'};opts.enterableKeyCodes=$.extend(enterableKeyCodes,ctrlKeys,numKeys);},"bizno":function bizno(opts,optIdx){var enterableKeyCodes={'189':'-'};opts.enterableKeyCodes=$.extend(enterableKeyCodes,ctrlKeys,numKeys);},"phone":function phone(opts,optIdx){var enterableKeyCodes={'189':'-','188':','};opts.enterableKeyCodes=$.extend(enterableKeyCodes,ctrlKeys,numKeys);},"custom":function custom(opts,optIdx){if(opts.getEnterableKeyCodes){opts.enterableKeyCodes=opts.getEnterableKeyCodes.call(opts,{$input:opts.$input});}else {opts.enterableKeyCodes=null;}}},getPatternValue={"money":function money(opts,optIdx,e,val,eType){var val=val.replace(/[^0-9^\.^\-]/g,""),regExpPattern=new RegExp('([0-9])([0-9][0-9][0-9][,.])'),arrNumber=val.split('.'),returnValue;arrNumber[0]+='.';do {arrNumber[0]=arrNumber[0].replace(regExpPattern,'$1,$2');}while(regExpPattern.test(arrNumber[0]));if(arrNumber.length>1){if(U.isNumber(opts.maxRound)){returnValue=arrNumber[0]+U.left(arrNumber[1],opts.maxRound);}else {returnValue=arrNumber.join('');}}else {returnValue=arrNumber[0].split('.')[0];}return returnValue;},"number":function number(opts,optIdx,e,val,eType){val=val.replace(/[^0-9^\.^\-]/g,"");var arrNumber=val.split('.'),returnValue;if(arrNumber.length>1){if(U.isNumber(opts.maxRound)){returnValue=arrNumber[0]+U.left(arrNumber[1],opts.maxRound);}else {returnValue=arrNumber.join('');}}else {returnValue=arrNumber[0].split('.')[0];}return returnValue;},"date":function date(opts,optIdx,e,val,eType){val=val.replace(/\D/g,"");if(val=="")return val;var regExpPattern=/^([0-9]{4})\-?([0-9]{1,2})?\-?([0-9]{1,2})?.*$/;if(opts.patternArgument=="time"){regExpPattern=/^([0-9]{4})\-?([0-9]{1,2})?\-?([0-9]{1,2})? ?([0-9]{1,2})?:?([0-9]{1,2})?:?([0-9]{1,2})?.*$/;}var matchedPattern=val.match(regExpPattern),returnValue="",inspectValue=function inspectValue(val,format,inspect,data){var _val={'Y':function Y(v){if(typeof v=="undefined")v=TODAY.getFullYear();if(v==''||v=='0000')v=TODAY.getFullYear();return v.length<4?U.setDigit(v,4):v;},'M':function M(v){if(typeof v=="undefined")v=TODAY.getMonth()+1;return v>12?12:v==0?'01':U.setDigit(v,2);},'D':function D(v){if(typeof v=="undefined")v=TODAY.getDate()+1;var dLen=U.daysOfMonth(data[1],data[2]-1);return v>dLen?dLen:v==0?'01':U.setDigit(v,2);},'h':function h(v){if(!v)v=0;return v>23?23:U.setDigit(v,2);},'m':function m(v){if(!v)v=0;return v>59?59:U.setDigit(v,2);},'s':function s(v){if(!v)v=0;return v>59?59:U.setDigit(v,2);}};return inspect?_val[format](val):val;};returnValue=val.replace(regExpPattern,function(a,b){var nval=[inspectValue(arguments[1],"Y",eType)];if(arguments[2]||eType)nval.push('-'+inspectValue(arguments[2],"M",eType));if(arguments[3]||eType)nval.push('-'+inspectValue(arguments[3],"D",eType,arguments));if(opts.patternArgument=="time"){if(arguments[4]||eType)nval.push(' '+inspectValue(arguments[4],"h",eType));if(arguments[5]||eType)nval.push(':'+inspectValue(arguments[5],"m",eType));if(arguments[6]||eType)nval.push(':'+inspectValue(arguments[6],"s",eType));}return nval.join('');});if(eType=='blur'&&!matchedPattern){returnValue=function(){var nval=[inspectValue(returnValue,"Y",eType)];nval.push('-'+inspectValue(0,"M",eType));nval.push('-'+inspectValue(0,"D",eType,arguments));if(opts.patternArgument=="time"){nval.push(' '+inspectValue(0,"h",eType));nval.push(':'+inspectValue(0,"m",eType));nval.push(':'+inspectValue(0,"s",eType));}return nval.join('');}();}else if(!matchedPattern)returnValue=returnValue.length>4?U.left(returnValue,4):returnValue;return returnValue;},"time":function time(opts,optIdx,e,val,eType){val=val.replace(/\D/g,"");var regExpPattern=/^([0-9]{1,2})?:?([0-9]{1,2})?:?([0-9]{1,2})?.*$/;var matchedPattern=val.match(regExpPattern),returnValue=val.replace(regExpPattern,function(a,b){var nval=[arguments[1]];if(arguments[2])nval.push(':'+arguments[2]);if(arguments[3])nval.push(':'+arguments[3]);return nval.join('');});if(!matchedPattern)returnValue=returnValue.length>2?U.left(returnValue,2):returnValue;return returnValue;},"bizno":function bizno(opts,optIdx,e,val,eType){val=val.replace(/\D/g,"");var regExpPattern=/^([0-9]{3})\-?([0-9]{1,2})?\-?([0-9]{1,5})?.*$/,returnValue=val.replace(regExpPattern,function(a,b){var nval=[arguments[1]];if(arguments[2])nval.push(arguments[2]);if(arguments[3])nval.push(arguments[3]);return nval.join("-");});return returnValue;},"phone":function phone(opts,optIdx,e,val,eType){val=val.replace(/\D/g,"");var regExpPattern3=/^([0-9]{3})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/,returnValue=val.replace(regExpPattern3,function(a,b){var nval=[arguments[1]];if(arguments[2])nval.push(arguments[2]);if(arguments[3])nval.push(arguments[3]);if(arguments[4])nval.push(arguments[4]);if(arguments[5])nval.push(arguments[5]);return nval.join("-");});return returnValue;},"custom":function custom(opts,optIdx,e,val,eType){if(opts.getPatternValue){return opts.getPatternValue.call(opts,{event:e,$input:opts.$input,value:val});}}},formatterEvent={'focus':function focus(opts,optIdx,e){if(!opts.$input.data("__originValue__"))opts.$input.data("__originValue__",opts.$input.val());}, /* 키 다운 이벤트에서 입력할 수 없는 키 입력을 방어 */'keydown':function keydown(opts,optIdx,e){var isStop=false;if(!opts.enterableKeyCodes){}else if(e.which&&opts.enterableKeyCodes[e.which]){}else if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey){ //console.log(e.which, opts.enterableKeyCodes);
isStop=true;}if(isStop)ax5.util.stopEvent(e);}, /* 키 업 이벤트에서 패턴을 적용 */'keyup':function keyup(opts,optIdx,e){var elem=opts.$input.get(0),elemFocusPosition,beforeValue,newValue,selection,selectionLength;if('selectionStart' in elem){ // Standard-compliant browsers
elemFocusPosition=elem.selectionStart;}else if(document.selection){ // IE
//elem.focus();
selection=document.selection.createRange();selectionLength=document.selection.createRange().text.length;selection.moveStart('character',-elem.value.length);elemFocusPosition=selection.text.length-selectionLength;}beforeValue=elem.value;newValue=getPatternValue[opts.pattern]?getPatternValue[opts.pattern].call(this,opts,optIdx,e,elem.value):beforeValue;if(newValue!=beforeValue){opts.$input.val(newValue).trigger("change");setSelectionRange(elem,elemFocusPosition+newValue.length-beforeValue.length);}},'blur':function blur(opts,optIdx,e){var elem=opts.$input.get(0),beforeValue,newValue;opts.$input.removeData("__originValue__");beforeValue=elem.value;newValue=getPatternValue[opts.pattern]?getPatternValue[opts.pattern].call(this,opts,optIdx,e,elem.value,'blur'):beforeValue;if(newValue!=beforeValue){opts.$input.val(newValue).trigger("change");}}},bindFormatterTarget=function bindFormatterTarget(opts,optIdx){if(!opts.pattern){if(opts.$target.get(0).tagName=="INPUT"){opts.pattern=opts.$target.attr('data-ax5formatter');}else {opts.pattern=opts.$target.find('input[type="text"]').attr('data-ax5formatter');}if(!opts.pattern){console.log(ax5.info.getError("ax5formatter","501","bind"));console.log(opts.target);return this;}}var re=/[^\(^\))]+/gi,matched=opts.pattern.match(re);opts.pattern=matched[0];opts.patternArgument=matched[1]||""; // 함수타입
for(var key in setEnterableKeyCodes){if(opts.pattern==key){setEnterableKeyCodes[key].call(this,opts,optIdx);break;}}opts.$input.unbind('focus.ax5formatter').bind('focus.ax5formatter',formatterEvent.focus.bind(this,this.queue[optIdx],optIdx));opts.$input.unbind('keydown.ax5formatter').bind('keydown.ax5formatter',formatterEvent.keydown.bind(this,this.queue[optIdx],optIdx));opts.$input.unbind('keyup.ax5formatter').bind('keyup.ax5formatter',formatterEvent.keyup.bind(this,this.queue[optIdx],optIdx));opts.$input.unbind('blur.ax5formatter').bind('blur.ax5formatter',formatterEvent.blur.bind(this,this.queue[optIdx],optIdx));formatterEvent.blur.call(this,this.queue[optIdx],optIdx);return this;}; /**
         * Preferences of formatter UI
         * @method ax5.ui.formatter.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.formatter}
         * @example
         * ```
         * ```
         */this.init=function(){};this.bind=function(opts){var formatterConfig={},optIdx;jQuery.extend(true,formatterConfig,cfg);if(opts)jQuery.extend(true,formatterConfig,opts);opts=formatterConfig;if(!opts.target){console.log(ax5.info.getError("ax5formatter","401","bind"));return this;}opts.$target=jQuery(opts.target);if(opts.$target.get(0).tagName=="INPUT"){opts.$input=opts.$target;}else {opts.$input=opts.$target.find('input[type="text"]');if(opts.$input.length>1){opts.$input.each(function(){opts.target=this;self.bind(opts);});return this;}}opts.$input=opts.$target.get(0).tagName=="INPUT"?opts.$target:opts.$target.find('input[type="text"]');if(!opts.id)opts.id=opts.$input.data("ax5-formatter");if(!opts.id){opts.id='ax5-formatter-'+ax5.getGuid();opts.$input.data("ax5-formatter",opts.id);}optIdx=U.search(this.queue,function(){return this.id==opts.id;});if(optIdx===-1){this.queue.push(opts);bindFormatterTarget.call(this,this.queue[this.queue.length-1],this.queue.length-1);}else {this.queue[optIdx]=opts;bindFormatterTarget.call(this,this.queue[optIdx],optIdx);}return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.formatter=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root);ax5.ui.formatter_instance=new ax5.ui.formatter();$.fn.ax5formatter=function(){return function(config){if(typeof config=="undefined")config={};$.each(this,function(){var defaultConfig={target:this};config=$.extend(true,config,defaultConfig);ax5.ui.formatter_instance.bind(config);});return this;};}(); // ax5.ui.menu
(function(root,_SUPER_){ /**
     * @class ax5.ui.menu
     * @classdesc
     * @version 0.5.1
     * @author tom@axisj.com
     * @example
     * ```
     * var menu = new ax5.ui.menu();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.config={theme:"default",iconWidth:22,acceleratorWidth:100,menuBodyPadding:5, //direction: "top", // top|bottom
offset:{left:0,top:0},position:"fixed",animateTime:250,items:[],itemClickAndClose:true};this.openTimer=null;this.closeTimer=null;this.queue=[];this.menuBar={};this.state=undefined;cfg=this.config;var appEventAttach=function appEventAttach(active){if(active){jQuery(document).unbind("click.ax5menu-"+this.menuId).bind("click.ax5menu-"+this.menuId,clickItem.bind(this));jQuery(window).unbind("keydown.ax5menu-"+this.menuId).bind("keydown.ax5menu-"+this.menuId,function(e){if(e.which==ax5.info.eventKeys.ESC){self.close();}});jQuery(window).unbind("resize.ax5menu-"+this.menuId).bind("resize.ax5menu-"+this.menuId,function(e){self.close();});}else {jQuery(document).unbind("click.ax5menu-"+this.menuId);jQuery(window).unbind("keydown.ax5menu-"+this.menuId);jQuery(window).unbind("resize.ax5menu-"+this.menuId);}},onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}self.state=that.state;opts=null;that=null;return true;},onLoad=function onLoad(that){if(this.onLoad){this.onLoad.call(that,that);}that=null;return true;},getTmpl=function getTmpl(){return '\n                <div class="ax5-ui-menu {{theme}}" {{#width}}style="width:{{width}}px;"{{/width}}>\n                    <div class="ax-menu-body">\n                        {{#items}}\n                            {{^@isMenu}}\n                                {{#divide}}\n                                <div class="ax-menu-item-divide" data-menu-item-index="{{@i}}"></div>\n                                {{/divide}}\n                                {{#html}}\n                                <div class="ax-menu-item-html" data-menu-item-index="{{@i}}">{{{@html}}}</div>\n                                {{/html}}\n                            {{/@isMenu}}\n                            {{#@isMenu}}\n                            <div class="ax-menu-item" data-menu-item-depth="{{@depth}}" data-menu-item-index="{{@i}}" data-menu-item-path="{{@path}}.{{@i}}">\n                                <span class="ax-menu-item-cell ax-menu-item-checkbox">\n                                    {{#check}}\n                                    <span class="item-checkbox-wrap useCheckBox" {{#checked}}data-item-checked="true"{{/checked}}></span>\n                                    {{/check}}\n                                    {{^check}}\n                                    <span class="item-checkbox-wrap"></span>\n                                    {{/check}}\n                                </span>\n                                {{#icon}}\n                                <span class="ax-menu-item-cell ax-menu-item-icon" style="width:{{cfg.iconWidth}}px;">{{{.}}}</span>\n                                {{/icon}}\n                                <span class="ax-menu-item-cell ax-menu-item-label">{{{label}}}</span>\n                                {{#accelerator}}\n                                <span class="ax-menu-item-cell ax-menu-item-accelerator" style="width:{{cfg.acceleratorWidth}}px;"><span class="item-wrap">{{.}}</span></span>\n                                {{/accelerator}}\n                                {{#@hasChild}}\n                                <span class="ax-menu-item-cell ax-menu-item-handle">{{{cfg.icons.arrow}}}</span>\n                                {{/@hasChild}}\n                            </div>\n                            {{/@isMenu}}\n    \n                        {{/items}}\n                    </div>\n                    <div class="ax-menu-arrow"></div>\n                </div>\n                ';},getTmpl_menuBar=function getTmpl_menuBar(){return '\n                <div class="ax5-ui-menubar {{theme}}">\n                    <div class="ax-menu-body">\n                        {{#items}}\n                            {{^@isMenu}}\n                                {{#divide}}\n                                <div class="ax-menu-item-divide" data-menu-item-index="{{@i}}"></div>\n                                {{/divide}}\n                                {{#html}}\n                                <div class="ax-menu-item-html" data-menu-item-index="{{@i}}">{{{@html}}}</div>\n                                {{/html}}\n                            {{/@isMenu}}\n                            {{#@isMenu}}\n                            <div class="ax-menu-item" data-menu-item-index="{{@i}}">\n                                {{#icon}}\n                                <span class="ax-menu-item-cell ax-menu-item-icon" style="width:{{cfg.iconWidth}}px;">{{{.}}}</span>\n                                {{/icon}}\n                                <span class="ax-menu-item-cell ax-menu-item-label">{{{label}}}</span>\n                            </div>\n                            {{/@isMenu}}\n                        {{/items}}\n                    </div>\n                </div>\n                ';},popup=function popup(opt,items,depth,path){var data=opt,activeMenu,removed;data.theme=opt.theme||cfg.theme;data.cfg={icons:jQuery.extend({},cfg.icons),iconWidth:opt.iconWidth||cfg.iconWidth,acceleratorWidth:opt.acceleratorWidth||cfg.acceleratorWidth};items.forEach(function(n){if(n.html||n.divide){n['@isMenu']=false;if(n.html){n['@html']=n.html.call({item:n,config:cfg,opt:opt});}}else {n['@isMenu']=true;}});data.items=items;data['@depth']=depth;data['@path']=path||"root";data['@hasChild']=function(){return this.items&&this.items.length>0;};activeMenu=jQuery(ax5.mustache.render(getTmpl(),data));jQuery(document.body).append(activeMenu); // remove queue
removed=this.queue.splice(depth);removed.forEach(function(n){n.$target.remove();});this.queue.push({'$target':activeMenu,'data':jQuery.extend({},data)});activeMenu.find('[data-menu-item-index]').bind("mouseover",function(){var depth=this.getAttribute("data-menu-item-depth"),index=this.getAttribute("data-menu-item-index"),path=this.getAttribute("data-menu-item-path"),$this,offset,scrollTop,childOpt,_items,_activeMenu;if(depth!=null&&typeof depth!="undefined"){_items=self.queue[depth].data.items[index].items;_activeMenu=self.queue[depth].$target;_activeMenu.find('[data-menu-item-index]').removeClass("hover");jQuery(this).addClass("hover");if(_activeMenu.attr("data-selected-menu-item-index")!=index){_activeMenu.attr("data-selected-menu-item-index",index);if(_items&&_items.length>0){$this=$(this);offset=$this.offset();scrollTop=cfg.position=="fixed"?$(document).scrollTop():0;childOpt={'@parent':{left:offset.left,top:offset.top,width:$this.outerWidth(),height:$this.outerHeight()},left:offset.left+$this.outerWidth()-cfg.menuBodyPadding,top:offset.top-cfg.menuBodyPadding-1-scrollTop};childOpt=jQuery.extend(true,opt,childOpt);popup.call(self,childOpt,_items,Number(depth)+1,path);}else {self.queue.splice(Number(depth)+1).forEach(function(n){n.$target.remove();});}}}depth=null;index=null;path=null;$this=null;offset=null;scrollTop=null;childOpt=null;_items=null;_activeMenu=null;}); // is Root
if(depth==0){if(data.direction)activeMenu.addClass("direction-"+data.direction);onStateChanged.call(this,null,{self:this,items:items,parent:function(path){if(!path)return false;var item=null;try{item=Function("","return this.config.items["+path.substring(5).replace(/\./g,'].items[')+"];").call(self);}catch(e){}return item;}(data['@path']),state:"popup"});}align.call(this,activeMenu,data);onLoad.call(this,{self:this,items:items,element:activeMenu.get(0)});data=null;activeMenu=null;removed=null;opt=null;items=null;depth=null;path=null;return this;},clickItem=function clickItem(e,target,item){target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-menu-item-index")){return true;}});if(target){item=function(path){if(!path)return false;var item;try{item=Function("","return this.config.items["+path.substring(5).replace(/\./g,'].items[')+"];").call(self);}catch(e){console.log(ax5.info.getError("ax5menu","501","menuItemClick"));}try{return item;}finally {item=null;}}(target.getAttribute("data-menu-item-path"));if(!item)return this;if(item.check){(function(items){var setValue={'checkbox':function checkbox(value){this.checked=!value;},'radio':function radio(value){var name=this.name;items.forEach(function(n){if(n.check&&n.check.type==='radio'&&n.check.name==name){n.check.checked=false;}});this.checked=!value;}};if(setValue[this.type])setValue[this.type].call(this,this.checked);setValue=null;}).call(item.check,cfg.items);if(!cfg.itemClickAndClose){self.queue.forEach(function(n){n.$target.find('[data-menu-item-index]').each(function(){var item=n.data.items[this.getAttribute("data-menu-item-index")];if(item.check){jQuery(this).find(".item-checkbox-wrap").attr("data-item-checked",item.check.checked);}});});}}if(self.onClick){self.onClick.call(item,item);}if((!item.items||item.items.length==0)&&cfg.itemClickAndClose)self.close();}else {self.close();}target=null;item=null;return this;},align=function align(activeMenu,data){ //console.log(data['@parent']);
var $window=$(window),$document=$(document),wh=cfg.position=="fixed"?$window.height():$document.height(),ww=$window.width(),h=activeMenu.outerHeight(),w=activeMenu.outerWidth(),l=data.left,t=data.top,position=cfg.position||"fixed";if(l+w>ww){if(data['@parent']){l=data['@parent'].left-w+cfg.menuBodyPadding;}else {l=ww-w;}}if(t+h>wh){t=wh-h;}activeMenu.css({left:l,top:t,position:position});activeMenu=null;data=null;$window=null;$document=null;wh=null;ww=null;h=null;w=null;l=null;t=null;position=null;return this;}; /// private end
this.init=function(){self.menuId=ax5.getGuid(); /**
             * config에 선언된 이벤트 함수들을 this로 이동시켜 주어 나중에 인스턴스.on... 으로 처리 가능 하도록 변경
             */this.onStateChanged=cfg.onStateChanged;this.onClick=cfg.onClick;this.onLoad=cfg.onLoad;onStateChanged.call(this,null,{self:this,state:"init"});}; /**
         * @method ax5.ui.menu.popup
         * @param {Event|Object} e - Event or Object
         * @param {Object} [opt]
         * @returns {ax5.ui.menu} this
         */this.popup=function(){var getOption={'event':function event(e,opt){ //var xOffset = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
//var yOffset = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
//console.log(e.pageY);
e={left:e.clientX,top:cfg.position=="fixed"?e.clientY:e.pageY,width:cfg.width,theme:cfg.theme};if(cfg.offset){if(cfg.offset.left)e.left+=cfg.offset.left;if(cfg.offset.top)e.top+=cfg.offset.top;}opt=jQuery.extend(true,e,opt);try{return opt;}finally {e=null; //opt = null;
}},'object':function object(e,opt){e={left:e.left,top:e.top,width:e.width||cfg.width,theme:e.theme||cfg.theme};if(cfg.offset){if(cfg.offset.left)e.left+=cfg.offset.left;if(cfg.offset.top)e.top+=cfg.offset.top;}opt=jQuery.extend(true,e,opt);try{return opt;}finally {e=null; //opt = null;
}}};var updateTheme=function updateTheme(theme){if(theme)cfg.theme=theme;};return function(e,opt){if(!e)return this;opt=getOption[typeof e.clientX=="undefined"?"object":"event"].call(this,e,opt);updateTheme(opt.theme);popup.call(this,opt,cfg.items,0); // 0 is seq of queue
appEventAttach.call(this,true); // 이벤트 연결
e=null; //opt = null;
return this;};}(); /**
         * @method ax5.ui.menu.attach
         * @param {Element|jQueryObject} el
         * @returns {ax5.ui.menu} this
         */this.attach=function(){var getOption={'object':function object(e,opt){e={left:e.left,top:e.top,width:e.width||cfg.width,theme:e.theme||cfg.theme,direction:e.direction||cfg.direction};opt=jQuery.extend(true,opt,e);try{return opt;}finally {e=null;opt=null;}}};var popUpChildMenu=function popUpChildMenu(target,opt){var $target=$(target),offset=$target.offset(),height=$target.outerHeight(),index=Number(target.getAttribute("data-menu-item-index")),scrollTop=cfg.position=="fixed"?$(document).scrollTop():0;if(self.menuBar.openedIndex==index)return false;self.menuBar.target.find('[data-menu-item-index]').removeClass("hover");self.menuBar.opened=true;self.menuBar.openedIndex=index;$target.attr("data-menu-item-opened","true");$target.addClass("hover");if(cfg.offset){if(cfg.offset.left)offset.left+=cfg.offset.left;if(cfg.offset.top)offset.top+=cfg.offset.top;}opt=getOption["object"].call(this,{left:offset.left,top:offset.top+height-scrollTop},opt);if(cfg.items&&cfg.items[index].items&&cfg.items[index].items.length){popup.call(self,opt,cfg.items[index].items,0,'root.'+target.getAttribute("data-menu-item-index")); // 0 is seq of queue
appEventAttach.call(self,true); // 이벤트 연결
}target=null;opt=null;$target=null;offset=null;height=null;index=null;scrollTop=null;};return function(el,opt){var data={},items=cfg.items,activeMenu;if(typeof opt==="undefined")opt={};data.theme=opt.theme||cfg.theme;data.cfg={icons:jQuery.extend({},cfg.icons),iconWidth:opt.iconWidth||cfg.iconWidth,acceleratorWidth:opt.acceleratorWidth||cfg.acceleratorWidth};items.forEach(function(n){if(n.html||n.divide){n['@isMenu']=false;if(n.html){n['@html']=n.html.call({item:n,config:cfg,opt:opt});}}else {n['@isMenu']=true;}});data.items=items;activeMenu=jQuery(ax5.mustache.render(getTmpl_menuBar(),data));self.menuBar={target:jQuery(el),opened:false};self.menuBar.target.html(activeMenu); // click, mouseover
self.menuBar.target.bind("click",function(e){if(!e)return this;var target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-menu-item-index")){return true;}});if(target)popUpChildMenu(target,opt);target=null;});self.menuBar.target.bind("mouseover",function(e){if(!self.menuBar.opened)return false;var target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-menu-item-index")){return true;}});if(target)popUpChildMenu(target,opt);target=null;});el=null;opt=null;data=null;items=null;activeMenu=null;return this;};}(); /**
         * @method ax5.ui.menu.close
         * @returns {ax5.ui.menu} this
         */this.close=function(){if(self.menuBar&&self.menuBar.target){self.menuBar.target.find('[data-menu-item-index]').removeClass("hover");self.menuBar.opened=false;self.menuBar.openedIndex=null;}appEventAttach.call(this,false); // 이벤트 제거
this.queue.forEach(function(n){n.$target.remove();});this.queue=[];onStateChanged.call(this,null,{self:this,state:"close"});return this;}; /**
         * @method ax5.ui.menu.getCheckValue
         * @returns {Object} statusCheckItem
         */this.getCheckValue=function(){var checkItems={},_collectItem=function collectItem(items){var i=items.length;while(i--){if(items[i].check&&items[i].check.checked){if(!checkItems[items[i].check.name])checkItems[items[i].check.name]=items[i].check.value;else {if(U.isString(checkItems[items[i].check.name]))checkItems[items[i].check.name]=[checkItems[items[i].check.name]];checkItems[items[i].check.name].push(items[i].check.value);}}if(items[i].items&&items[i].items.length>0)_collectItem(items[i].items);}};_collectItem(cfg.items);try{return checkItems;}finally {checkItems=null;_collectItem=null;}}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.menu=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root); /*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */ // ax5.ui.select
(function(root,_SUPER_){ /**
     * @class ax5.ui.select
     * @classdesc
     * @version 0.3.4
     * @author tom@axisj.com
     * @example
     * ```
     * var myselect = new ax5.ui.select();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.instanceId=ax5.getGuid();this.queue=[];this.config={theme:'default',animateTime:250,lang:{noSelected:'',noOptions:'no options',loading:'now loading..',multipleLabel:'"{{label}}"외 {{length}}건'},columnKeys:{optionValue:'value',optionText:'text',optionSelected:'selected'}};this.activeSelectOptionGroup=null;this.activeSelectQueueIndex=-1;this.openTimer=null;this.closeTimer=null;this.waitOptionsCallback=null;this.keyUpTimer=null;cfg=this.config;var ctrlKeys={"18":"KEY_ALT","8":"KEY_BACKSPACE","17":"KEY_CONTROL","46":"KEY_DELETE","40":"KEY_DOWN","35":"KEY_END","187":"KEY_EQUAL","27":"KEY_ESC","36":"KEY_HOME","45":"KEY_INSERT","37":"KEY_LEFT","189":"KEY_MINUS","34":"KEY_PAGEDOWN","33":"KEY_PAGEUP", // "190": "KEY_PERIOD",
"13":"KEY_RETURN","39":"KEY_RIGHT","16":"KEY_SHIFT", // "32": "KEY_SPACE",
"9":"KEY_TAB","38":"KEY_UP","91":"KEY_WINDOW" //"107" : "NUMPAD_ADD",
//"194" : "NUMPAD_COMMA",
//"110" : "NUMPAD_DECIMAL",
//"111" : "NUMPAD_DIVIDE",
//"12" : "NUMPAD_EQUAL",
//"106" : "NUMPAD_MULTIPLY",
//"109" : "NUMPAD_SUBTRACT"
},onStateChanged=function onStateChanged(item,that){if(item&&item.onStateChanged){item.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}if(that.state=="changeValue"){if(item&&item.onChange){item.onChange.call(that,that);}else if(this.onChange){this.onChange.call(that,that);}}item=null;that=null;return true;},getOptionGroupTmpl=function getOptionGroupTmpl(columnKeys){return '\n                <div class="ax5-ui-select-option-group {{theme}} {{size}}" data-ax5-select-option-group="{{id}}">\n                    <div class="ax-select-body">\n                        <div class="ax-select-option-group-content" data-select-els="content"></div>\n                    </div>\n                    <div class="ax-select-arrow"></div> \n                </div>\n                ';},getTmpl=function getTmpl(){return '\n                <a {{^tabIndex}}href="#ax5select-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}class="form-control {{formSize}} ax5-ui-select-display {{theme}}" \n                data-ax5-select-display="{{id}}" data-ax5-select-instance="{{instanceId}}">\n                    <div class="ax5-ui-select-display-table" data-select-els="display-table">\n                        <div data-ax5-select-display="label">{{label}}</div>\n                        <div data-ax5-select-display="addon"> \n                            {{#multiple}}{{#reset}}\n                            <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>\n                            {{/reset}}{{/multiple}}\n                            {{#icons}}\n                            <span class="addon-icon-closed">{{clesed}}</span>\n                            <span class="addon-icon-opened">{{opened}}</span>\n                            {{/icons}}\n                            {{^icons}}\n                            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n                            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n                            {{/icons}}\n                        </div>\n                    </div>\n                    <input type="text" tabindex="-1" data-ax5-select-display="input" \n                    style="position:absolute;z-index:0;left:0px;top:0px;font-size:1px;opacity: 0;border: 0px none;color : transparent;text-indent: -9999em;" />\n                </a>\n                ';},getSelectTmpl=function getSelectTmpl(){return '\n                <select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>\n                ';},getOptionsTmpl=function getOptionsTmpl(columnKeys){return '\n                {{#waitOptions}}\n                    <div class="ax-select-option-item">\n                            <div class="ax-select-option-item-holder">\n                                <span class="ax-select-option-item-cell ax-select-option-item-label">\n                                    {{{lang.loading}}}\n                                </span>\n                            </div>\n                        </div>\n                {{/waitOptions}}\n                {{^waitOptions}}\n                    {{#options}}\n                        {{#optgroup}}\n                            <div class="ax-select-option-group">\n                                <div class="ax-select-option-item-holder">\n                                    <span class="ax-select-option-group-label">\n                                        {{{.}}}\n                                    </span>\n                                </div>\n                                {{#options}}\n                                <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" \n                                data-option-value="{{'+columnKeys.optionValue+'}}" \n                                {{#'+columnKeys.optionSelected+'}}data-option-selected="true"{{/'+columnKeys.optionSelected+'}}>\n                                    <div class="ax-select-option-item-holder">\n                                        {{#multiple}}\n                                        <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                                            <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                        </span>\n                                        {{/multiple}}\n                                        <span class="ax-select-option-item-cell ax-select-option-item-label">{{'+columnKeys.optionText+'}}</span>\n                                    </div>\n                                </div>\n                                {{/options}}\n                            </div>                            \n                        {{/optgroup}}\n                        {{^optgroup}}\n                        <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{'+columnKeys.optionValue+'}}" {{#'+columnKeys.optionSelected+'}}data-option-selected="true"{{/'+columnKeys.optionSelected+'}}>\n                            <div class="ax-select-option-item-holder">\n                                {{#multiple}}\n                                <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                                    <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                </span>\n                                {{/multiple}}\n                                <span class="ax-select-option-item-cell ax-select-option-item-label">{{'+columnKeys.optionText+'}}</span>\n                            </div>\n                        </div>\n                        {{/optgroup}}\n                    {{/options}}\n                    {{^options}}\n                        <div class="ax-select-option-item">\n                            <div class="ax-select-option-item-holder">\n                                <span class="ax-select-option-item-cell ax-select-option-item-label">\n                                    {{{lang.noOptions}}}\n                                </span>\n                            </div>\n                        </div>\n                    {{/options}}\n                {{/waitOptions}}\n                ';},alignSelectDisplay=function alignSelectDisplay(){var i=this.queue.length,w;while(i--){if(this.queue[i].$display){w=Math.max(this.queue[i].$select.outerWidth(),U.number(this.queue[i].minWidth));this.queue[i].$display.css({"min-width":w});if(this.queue[i].reset){this.queue[i].$display.find(".addon-icon-reset").css({"line-height":this.queue[i].$display.height()+"px"});}}}i=null;w=null;return this;},alignSelectOptionGroup=function alignSelectOptionGroup(append){if(!this.activeSelectOptionGroup)return this;var item=this.queue[this.activeSelectQueueIndex],pos={},dim={};if(append)jQuery(document.body).append(this.activeSelectOptionGroup);pos=item.$target.offset();dim={width:item.$target.outerWidth(),height:item.$target.outerHeight()}; // picker css(width, left, top) & direction 결정
if(!item.direction||item.direction===""||item.direction==="auto"){ // set direction
item.direction="top";}if(append){this.activeSelectOptionGroup.addClass("direction-"+item.direction);}this.activeSelectOptionGroup.css(function(){if(item.direction=="top"){return {left:pos.left,top:pos.top+dim.height+1,width:dim.width};}else if(item.direction=="bottom"){return {left:pos.left,top:pos.top-this.activeSelectOptionGroup.outerHeight()-1,width:dim.width};}}.call(this));},onBodyClick=function onBodyClick(e,target){if(!this.activeSelectOptionGroup)return this;var item=this.queue[this.activeSelectQueueIndex],clickEl="display";target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-option-value")){clickEl="optionItem";return true;}else if(item.$target.get(0)==target){clickEl="display";return true;}});if(!target){this.close();return this;}else if(clickEl==="optionItem"){this.val(item.id,{index:{gindex:target.getAttribute("data-option-group-index"),index:target.getAttribute("data-option-index")}},undefined,"internal");item.$display.focus();if(!item.multiple)this.close();}else { //open and display click
//console.log(this.instanceId);
}return this;},onBodyKeyup=function onBodyKeyup(e){if(e.keyCode==ax5.info.eventKeys.ESC){this.close();}else if(e.which==ax5.info.eventKeys.RETURN){if(this.queue[this.activeSelectQueueIndex].optionFocusIndex>-1){ // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
var $option=this.activeSelectOptionGroup.find('[data-option-focus-index="'+this.queue[this.activeSelectQueueIndex].optionFocusIndex+'"]');this.val(this.queue[this.activeSelectQueueIndex].id,{index:{gindex:$option.attr("data-option-group-index"),index:$option.attr("data-option-index")}},undefined,"internal");if(!this.queue[this.activeSelectQueueIndex].multiple)this.close();}}},getLabel=function getLabel(queIdx){var item=this.queue[queIdx];var labels=[];if(U.isArray(item.selected)&&item.selected.length>0){item.selected.forEach(function(n){if(n.selected)labels.push(n[item.columnKeys.optionText]);});}else {if(!item.multiple&&item.options&&item.options[0]){if(item.options[0].optgroup){labels[0]=item.options[0].options[0][item.columnKeys.optionText];}else {labels[0]=item.options[0][item.columnKeys.optionText];}}else {labels[0]=item.lang.noSelected;}}return function(){if(item.multiple&&labels.length>1){var data={label:labels[0],length:labels.length-1};return ax5.mustache.render(item.lang.multipleLabel,data);}else {return labels[0];}}();},syncLabel=function syncLabel(queIdx){this.queue[queIdx].$display.find('[data-ax5-select-display="label"]').html(getLabel.call(this,queIdx));},focusWord=function focusWord(queIdx,searchWord){var options=[],i=0,l=this.queue[queIdx].indexedOptions.length,n;while(l-i++){n=this.queue[queIdx].indexedOptions[i];if((''+n.value).toLowerCase()==searchWord.toLowerCase()){options=[{'@findex':n['@findex'],optionsSort:0}];break;}else {var sort=(''+n.value).toLowerCase().search(searchWord.toLowerCase());if(sort>-1){options.push({'@findex':n['@findex'],optionsSort:sort});if(options.length>2)break;}sort=null;}}options.sort(function(a,b){return a.optionsSort-b.optionsSort;});if(options&&options.length>0){focusMove.call(this,queIdx,undefined,options[0]['@findex']);}try{return options;}finally {options=null;i=null;l=null;n=null;}},focusMove=function focusMove(queIdx,direction,findex){var _focusIndex,_prevFocusIndex,focusOptionEl,optionGroupScrollContainer;if(this.activeSelectOptionGroup&&this.queue[queIdx].options&&this.queue[queIdx].options.length>0){if(typeof findex!=="undefined"){_focusIndex=findex;}else {_prevFocusIndex=this.queue[queIdx].optionFocusIndex==-1?this.queue[queIdx].optionSelectedIndex||-1:this.queue[queIdx].optionFocusIndex;if(_prevFocusIndex==-1){_focusIndex=direction>0?0:this.queue[queIdx].optionItemLength-1;}else {_focusIndex=_prevFocusIndex+direction;if(_focusIndex<0)_focusIndex=0;else if(_focusIndex>this.queue[queIdx].optionItemLength-1)_focusIndex=this.queue[queIdx].optionItemLength-1;}}this.queue[queIdx].optionFocusIndex=_focusIndex;this.activeSelectOptionGroup.find('[data-option-focus-index]').removeClass("hover");focusOptionEl=this.activeSelectOptionGroup.find('[data-option-focus-index="'+_focusIndex+'"]').addClass("hover");optionGroupScrollContainer=this.activeSelectOptionGroup.find('[data-select-els="content"]');var focusOptionElHeight=focusOptionEl.outerHeight(),optionGroupScrollContainerHeight=optionGroupScrollContainer.innerHeight(),optionGroupScrollContainerScrollTop=optionGroupScrollContainer.scrollTop(),focusOptionElTop=focusOptionEl.position().top+optionGroupScrollContainer.scrollTop();if(optionGroupScrollContainerHeight+optionGroupScrollContainerScrollTop<focusOptionElTop+focusOptionElHeight){optionGroupScrollContainer.scrollTop(focusOptionElTop+focusOptionElHeight-optionGroupScrollContainerHeight);}else if(optionGroupScrollContainerScrollTop>focusOptionElTop){optionGroupScrollContainer.scrollTop(focusOptionElTop);} // optionGroup scroll check
}},bindSelectTarget=function(){var selectEvent={'click':function click(queIdx,e){var target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-selected-clear")){ //clickEl = "clear";
return true;}});if(target){ // selected clear
this.val(queIdx,{clear:true});}else {if(self.activeSelectQueueIndex==queIdx){if(this.queue[queIdx].optionFocusIndex==-1){ // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
self.close();}}else {self.open(queIdx);}} //U.stopEvent(e);
},'keyUp':function keyUp(queIdx,e){if(e.which==ax5.info.eventKeys.SPACE){selectEvent.click.call(this,queIdx,e);}else if(!ctrlKeys[e.which]){ // 사용자 입력이 뜸해지면 찾고 검색 값 제거...
if(this.keyUpTimer)clearTimeout(this.keyUpTimer);this.keyUpTimer=setTimeout(function(){var searchWord=this.queue[queIdx].$displayInput.val();focusWord.call(this,queIdx,searchWord);this.queue[queIdx].$displayInput.val('');}.bind(this),500);}},'keyDown':function keyDown(queIdx,e){if(e.which==ax5.info.eventKeys.DOWN){focusMove.call(this,queIdx,1);U.stopEvent(e);}else if(e.which==ax5.info.eventKeys.UP){focusMove.call(this,queIdx,-1);U.stopEvent(e);}},'blur':function blur(queIdx,e){},'selectChange':function selectChange(queIdx,e){this.val(queIdx,this.queue[queIdx].$select.val(),true);}};return function(queIdx){var item=this.queue[queIdx];var data={};item.selected=[];if(!item.$display){ /// 템플릿에 전달할 오브젝트 선언
data.instanceId=this.instanceId;data.id=item.id;data.name=item.name;data.theme=item.theme;data.tabIndex=item.tabIndex;data.multiple=item.multiple;data.reset=item.reset;data.label=getLabel.call(this,queIdx);data.formSize=function(){return item.size?"input-"+item.size:"";}();item.$display=jQuery(ax5.mustache.render(getTmpl.call(this,queIdx),data));if(item.$target.find("select").get(0)){item.$select=item.$target.find("select"); // select 속성만 변경
item.$select.attr("tabindex","-1").attr("class","form-control "+data.formSize);if(data.name){item.$select.attr("name","name");}if(data.multiple){item.$select.attr("multiple","multiple");}}else {item.$select=jQuery(ax5.mustache.render(getSelectTmpl.call(this,queIdx),data));item.$target.append(item.$select); // select append
}item.$target.append(item.$display);item.$displayInput=item.$display.find('[data-ax5-select-display="input"]'); // 사용자 입력값을 받기위한 숨음 입력필드
item.options=syncSelectOptions.call(this,queIdx,item.options);alignSelectDisplay.call(this);item.$displayInput.unbind("blur.ax5select").bind("blur.ax5select",selectEvent.blur.bind(this,queIdx)).unbind('keyup.ax5select').bind('keyup.ax5select',selectEvent.keyUp.bind(this,queIdx)).unbind("keydown.ax5select").bind("keydown.ax5select",selectEvent.keyDown.bind(this,queIdx));}else {item.$display.find('[data-ax5-select-display="label"]').html(getLabel.call(this,queIdx));item.options=syncSelectOptions.call(this,queIdx,item.options);alignSelectDisplay.call(this);}item.$display.unbind('click.ax5select').bind('click.ax5select',selectEvent.click.bind(this,queIdx)).unbind('keyup.ax5select').bind('keyup.ax5select',selectEvent.keyUp.bind(this,queIdx)); // select 태그에 대한 change 이벤트 감시
item.$select.unbind('change.ax5select').bind('change.ax5select',selectEvent.selectChange.bind(this,queIdx));data=null;item=null;queIdx=null;return this;};}(),syncSelectOptions=function(){var setSelected=function setSelected(queIdx,O){if(!O){this.queue[queIdx].selected=[];}else {if(this.queue[queIdx].multiple)this.queue[queIdx].selected.push(jQuery.extend({},O));else this.queue[queIdx].selected[0]=jQuery.extend({},O);}};return function(queIdx,options){var item=this.queue[queIdx];var po,elementOptions,newOptions,focusIndex=0;setSelected.call(this,queIdx,false); // item.selected 초기화
if(options){item.options=options;item.indexedOptions=[]; // select options 태그 생성
po=[];item.options.forEach(function(O,OIndex){if(O.optgroup){ // todo
O['@gindex']=OIndex;O.options.forEach(function(OO,OOIndex){OO['@index']=OOIndex;OO['@findex']=focusIndex;po.push('<option value="'+OO[item.columnKeys.optionValue]+'" '+(OO[item.columnKeys.optionSelected]?' selected="selected"':'')+'>'+OO[item.columnKeys.optionText]+'</option>');if(OO[item.columnKeys.optionSelected]){setSelected.call(self,queIdx,OO);}item.indexedOptions.push({'@findex':focusIndex,value:OO[item.columnKeys.optionValue],text:OO[item.columnKeys.optionText]});focusIndex++;});}else {O['@index']=OIndex;O['@findex']=focusIndex;po.push('<option value="'+O[item.columnKeys.optionValue]+'" '+(O[item.columnKeys.optionSelected]?' selected="selected"':'')+'>'+O[item.columnKeys.optionText]+'</option>');if(O[item.columnKeys.optionSelected]){setSelected.call(self,queIdx,O);}item.indexedOptions.push({'@findex':focusIndex,value:O[item.columnKeys.optionValue],text:O[item.columnKeys.optionText]});focusIndex++;}});item.optionItemLength=focusIndex;item.$select.html(po.join(''));}else { /// 현재 사용되지 않는 옵션
/// select > options 태그로 스크립트 options를 만들어주는 역할
elementOptions=U.toArray(item.$select.get(0).options); // select option 스크립트 생성
newOptions=[];elementOptions.forEach(function(O,OIndex){var option={};option[item.columnKeys.optionValue]=O.value;option[item.columnKeys.optionText]=O.text;option[item.columnKeys.optionSelected]=O.selected;option['@index']=OIndex;if(O.selected)setSelected.call(self,queIdx,option);newOptions.push(option);option=null;});item.options=newOptions;item.indexedOptions=newOptions;}if(!item.multiple&&item.selected.length==0&&item.options&&item.options[0]){if(item.options[0].optgroup){item.options[0].options[0][item.columnKeys.optionSelected]=true;item.selected.push(jQuery.extend({},item.options[0].options[0]));}else {item.options[0][item.columnKeys.optionSelected]=true;item.selected.push(jQuery.extend({},item.options[0]));}}po=null;elementOptions=null;newOptions=null;return item.options;};}(),getQueIdx=function getQueIdx(boundID){if(!U.isString(boundID)){boundID=jQuery(boundID).data("data-ax5select-id");}if(!U.isString(boundID)){console.log(ax5.info.getError("ax5select","402","getQueIdx"));return;}return U.search(this.queue,function(){return this.id==boundID;});}; /// private end
/**
         * Preferences of select UI
         * @method ax5.ui.select.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.select}
         * @example
         * ```
         * ```
         */this.init=function(){this.onStateChanged=cfg.onStateChanged;this.onChange=cfg.onChange;jQuery(window).bind("resize.ax5select-display-"+this.instanceId,function(){alignSelectDisplay.call(this);}.bind(this));}; /**
         * bind select
         * @method ax5.ui.select.bind
         * @param {Object} item
         * @param {String} [item.id]
         * @param {String} [item.theme]
         * @param {Boolean} [item.multiple]
         * @param {Element} item.target
         * @param {Object[]} item.options
         * @returns {ax5.ui.select}
         */this.bind=function(item){var selectConfig={},queIdx;item=jQuery.extend(true,selectConfig,cfg,item);if(!item.target){console.log(ax5.info.getError("ax5select","401","bind"));return this;}item.$target=jQuery(item.target);if(!item.id)item.id=item.$target.data("data-ax5select-id");if(!item.id){item.id='ax5-select-'+ax5.getGuid();item.$target.data("data-ax5select-id",item.id);}item.name=item.$target.attr("data-ax5select");if(item.options){item.options=JSON.parse(JSON.stringify(item.options));} // target attribute data
(function(data){if(U.isObject(data)&&!data.error){item=jQuery.extend(true,item,data);}})(U.parseJson(item.$target.attr("data-ax5select-config"),true));queIdx=U.search(this.queue,function(){return this.id==item.id;});if(queIdx===-1){this.queue.push(item);bindSelectTarget.call(this,this.queue.length-1);}else {this.queue[queIdx]=jQuery.extend(true,{},this.queue[queIdx],item);bindSelectTarget.call(this,queIdx);}selectConfig=null;queIdx=null;return this;}; /**
         * open the optionBox of select
         * @method ax5.ui.select.open
         * @param {(String|Number|Element)} boundID
         * @param {Number} [tryCount]
         * @returns {ax5.ui.select}
         */this.open=function(){var onExpand=function onExpand(item){item.onExpand.call({self:this,item:item},function(O){if(this.waitOptionsCallback){var data={};var item=this.queue[this.activeSelectQueueIndex]; /// 현재 selected 검증후 처리
(function(item,O){var optionsMap={};O.options.forEach(function(_O,_OIndex){_O["@index"]=_OIndex;optionsMap[_O[item.columnKeys.optionValue]]=_O;});if(U.isArray(item.selected)){item.selected.forEach(function(_O){if(optionsMap[_O[item.columnKeys.optionValue]]){O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected]=true;}});}})(item,O);item.$display.find('[data-ax5-select-display="label"]').html(getLabel.call(this,this.activeSelectQueueIndex));item.options=syncSelectOptions.call(this,this.activeSelectQueueIndex,O.options);alignSelectDisplay.call(this); /// 템플릿에 전달할 오브젝트 선언
data.id=item.id;data.theme=item.theme;data.size="ax5-ui-select-option-group-"+item.size;data.multiple=item.multiple;data.lang=item.lang;data.options=item.options;this.activeSelectOptionGroup.find('[data-select-els="content"]').html(jQuery(ax5.mustache.render(getOptionsTmpl.call(this,item.columnKeys),data)));}}.bind(this));};return function(boundID,tryCount){this.waitOptionsCallback=null; /**
                 * open select from the outside
                 */var queIdx=U.isNumber(boundID)?boundID:getQueIdx.call(this,boundID);var item=this.queue[queIdx];var data={},focusTop,selectedOptionEl;if(item.$display.attr("disabled"))return this;if(this.openTimer)clearTimeout(this.openTimer);if(this.activeSelectOptionGroup){if(this.activeSelectQueueIndex==queIdx){return this;}if(tryCount>2)return this;this.close();this.openTimer=setTimeout(function(){this.open(queIdx,(tryCount||0)+1);}.bind(this),cfg.animateTime);return this;}item.optionFocusIndex=-1; // optionGroup이 열리면 포커스 인덱스 초기화 -1로
if(item.selected&&item.selected.length>0){item.optionSelectedIndex=item.selected[0]["@findex"];} /// 템플릿에 전달할 오브젝트 선언
data.id=item.id;data.theme=item.theme;data.size="ax5-ui-select-option-group-"+item.size;data.multiple=item.multiple;data.lang=item.lang;item.$display.attr("data-select-option-group-opened","true"); //console.log(data.lang);
if(item.onExpand){ // onExpand 인 경우 UI 대기모드 추가
data.waitOptions=true;}data.options=item.options;this.activeSelectOptionGroup=jQuery(ax5.mustache.render(getOptionGroupTmpl.call(this,item.columnKeys),data));this.activeSelectOptionGroup.find('[data-select-els="content"]').html(jQuery(ax5.mustache.render(getOptionsTmpl.call(this,item.columnKeys),data)));this.activeSelectQueueIndex=queIdx;alignSelectOptionGroup.call(this,"append"); // alignSelectOptionGroup 에서 body append
jQuery(window).bind("resize.ax5select-"+this.instanceId,function(){alignSelectOptionGroup.call(this);}.bind(this));if(item.selected&&item.selected.length>0){selectedOptionEl=this.activeSelectOptionGroup.find('[data-option-index="'+item.selected[0]["@index"]+'"]');if(selectedOptionEl.get(0)){focusTop=selectedOptionEl.position().top-this.activeSelectOptionGroup.height()/3;this.activeSelectOptionGroup.find('[data-select-els="content"]').stop().animate({scrollTop:focusTop},item.animateTime,'swing',function(){});}} /// 사용자 입력으로 옵션을 검색하기 위한 시나리오
// 옵션그룹이 활성화 되면 사용자 입력을 받기위한 input 값 초기화 및 포커스 다른 select가 닫히면서 display focus 이벤트와 충돌하는 문제가 있으므로
// 1밀리세컨 지연후 포커스 처리. input에 포커스가 되므로 input value로 options를 검색 할 수 있게 됩니다.
item.$displayInput.val('');setTimeout(function(){item.$displayInput.trigger("focus");},1); //item.$display.find('[data-ax5-select-display="input"]')
jQuery(window).bind("keyup.ax5select-"+this.instanceId,function(e){e=e||window.event;onBodyKeyup.call(this,e);U.stopEvent(e);}.bind(this));jQuery(window).bind("click.ax5select-"+this.instanceId,function(e){e=e||window.event;onBodyClick.call(this,e);U.stopEvent(e);}.bind(this));onStateChanged.call(this,item,{self:this,state:"open",item:item}); // waitOption timer
if(item.onExpand){this.waitOptionsCallback=true;onExpand.call(this,item);}data=null;focusTop=null;selectedOptionEl=null;return this;};}(); /**
         * @method ax5.ui.select.update
         * @param {(Object|String)} item
         * @returns {ax5.ui.select}
         */this.update=function(_item){this.bind(_item);return this;}; /**
         * @method ax5.ui.select.val
         * @param {(String|Number|Element)} boundID
         * @param {(String|Object|Array)} [value]
         * @param {Boolean} [selected]
         * @returns {ax5.ui.select}
         */this.val=function(){ // todo : val 함수 리팩토링 필요
var getSelected=function getSelected(_item,o,selected){if(typeof selected==="undefined"){return _item.multiple?!o:true;}else {return selected;}};var clearSelected=function clearSelected(queIdx){this.queue[queIdx].options.forEach(function(n){if(n.optgroup){n.options.forEach(function(nn){nn.selected=false;});}else {n.selected=false;}});};var processor={'index':function index(queIdx,value,selected){ // 클래스 내부에서 호출된 형태, 그런 이유로 옵션그룹에 대한 상태를 변경 하고 있다.
var item=this.queue[queIdx]; /*
                     if (U.isArray(value.index)) {
                     value.index.forEach(function (n) {
                     item.options[n][item.columnKeys.optionSelected] = getSelected(item, item.options[n][item.columnKeys.optionSelected], selected);
                     self.activeSelectOptionGroup
                     .find('[data-option-index="' + n + '"]')
                     .attr("data-option-selected", item.options[n][item.columnKeys.optionSelected].toString());
                     });
                     }
                     else {
                     }
                     */if(U.isString(value.index.gindex)){item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected]=getSelected(item,item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected],selected);self.activeSelectOptionGroup.find('[data-option-group-index="'+value.index.gindex+'"][data-option-index="'+value.index.index+'"]').attr("data-option-selected",item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected].toString());}else {item.options[value.index.index][item.columnKeys.optionSelected]=getSelected(item,item.options[value.index.index][item.columnKeys.optionSelected],selected);self.activeSelectOptionGroup.find('[data-option-index="'+value.index.index+'"]').attr("data-option-selected",item.options[value.index.index][item.columnKeys.optionSelected].toString());}syncSelectOptions.call(this,queIdx,item.options);syncLabel.call(this,queIdx);alignSelectOptionGroup.call(this);},'arr':function arr(queIdx,values,selected){values.forEach(function(value){if(U.isString(value)||U.isNumber(value)){processor.value.call(self,queIdx,value,selected);}else {for(var key in processor){if(value[key]){processor[key].call(self,queIdx,value,selected);break;}}}});},'value':function value(queIdx,_value,selected){var item=this.queue[queIdx];var optionIndex=U.search(item.options,function(){return this[item.columnKeys.optionValue]==_value;});if(optionIndex>-1){item.options[optionIndex][item.columnKeys.optionSelected]=getSelected(item,item.options[optionIndex][item.columnKeys.optionSelected],selected);}else {console.log(ax5.info.getError("ax5select","501","val"));return;}syncSelectOptions.call(this,queIdx,item.options);syncLabel.call(this,queIdx);},'text':function text(queIdx,value,selected){var item=this.queue[queIdx];var optionIndex=U.search(item.options,function(){return this[item.columnKeys.optionText]==value;});if(optionIndex>-1){item.options[optionIndex][item.columnKeys.optionSelected]=getSelected(item,item.options[optionIndex][item.columnKeys.optionSelected],selected);}else {console.log(ax5.info.getError("ax5select","501","val"));return;}syncSelectOptions.call(this,queIdx,item.options);syncLabel.call(this,queIdx);},'clear':function clear(queIdx){clearSelected.call(this,queIdx);syncSelectOptions.call(this,queIdx,this.queue[queIdx].options);syncLabel.call(this,queIdx);if(this.activeSelectOptionGroup){this.activeSelectOptionGroup.find('[data-option-index]').attr("data-option-selected","false");}}};return function(boundID,value,selected,internal){var queIdx=U.isNumber(boundID)?boundID:getQueIdx.call(this,boundID);if(queIdx===-1){console.log(ax5.info.getError("ax5select","402","val"));return;} // setValue 이면 현재 선택값 초기화
if(typeof value!=="undefined"&&!this.queue[queIdx].multiple){clearSelected.call(this,queIdx);}if(typeof value=="undefined"){return this.queue[queIdx].selected;}else if(U.isArray(value)){processor.arr.call(this,queIdx,value,selected);}else if(U.isString(value)||U.isNumber(value)){processor.value.call(this,queIdx,value,selected);}else {if(value===null){processor.clear.call(this,queIdx);}else {for(var key in processor){if(value[key]){processor[key].call(this,queIdx,value,selected);break;}}}}if(typeof value!=="undefined"){onStateChanged.call(this,this.queue[queIdx],{self:this,item:this.queue[queIdx],state:internal?"changeValue":"setValue",value:this.queue[queIdx].selected,internal:internal});}boundID=null;return this;};}(); /**
         * @method ax5.ui.select.close
         * @returns {ax5.ui.select}
         */this.close=function(item){if(this.closeTimer)clearTimeout(this.closeTimer);if(!this.activeSelectOptionGroup)return this;item=this.queue[this.activeSelectQueueIndex];item.optionFocusIndex=-1;item.$displayInput.val('').trigger("blur");item.$display.removeAttr("data-select-option-group-opened").trigger("focus");this.activeSelectOptionGroup.addClass("destroy");jQuery(window).unbind("resize.ax5select-"+this.instanceId).unbind("click.ax5select-"+this.instanceId).unbind("keyup.ax5select-"+this.instanceId);this.closeTimer=setTimeout(function(){if(this.activeSelectOptionGroup)this.activeSelectOptionGroup.remove();this.activeSelectOptionGroup=null;this.activeSelectQueueIndex=-1;onStateChanged.call(this,item,{self:this,state:"close"});}.bind(this),cfg.animateTime);this.waitOptionsCallback=null;return this;};this.enable=function(boundID){var queIdx=getQueIdx.call(this,boundID);this.queue[queIdx].$display.removeAttr("disabled");this.queue[queIdx].$select.removeAttr("disabled");onStateChanged.call(this,this.queue[queIdx],{self:this,state:"enable"});return this;};this.disable=function(boundID){var queIdx=getQueIdx.call(this,boundID);this.queue[queIdx].$display.attr("disabled","disabled");this.queue[queIdx].$select.attr("disabled","disabled");onStateChanged.call(this,this.queue[queIdx],{self:this,state:"disable"});return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}else {this.init();}}.apply(this,arguments);}; //== UI Class
root.select=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root);ax5.ui.select_instance=new ax5.ui.select();jQuery.fn.ax5select=function(){return function(config){if(ax5.util.isString(arguments[0])){var methodName=arguments[0];switch(methodName){case "open":return ax5.ui.select_instance.open(this);break;case "close":return ax5.ui.select_instance.close(this);break;case "setValue":return ax5.ui.select_instance.val(this,arguments[1],arguments[2]);break;case "getValue":return ax5.ui.select_instance.val(this);break;case "enable":return ax5.ui.select_instance.enable(this);break;case "disable":return ax5.ui.select_instance.disable(this);break;default:return this;}}else {if(typeof config=="undefined")config={};jQuery.each(this,function(){var defaultConfig={target:this};config=jQuery.extend({},config,defaultConfig);ax5.ui.select_instance.bind(config);});}return this;};}(); // ax5.ui.select
(function(root,_SUPER_){ /**
     * @class ax5.ui.select
     * @classdesc
     * @version 0.4.5
     * @author tom@axisj.com
     * @example
     * ```
     * var myselect = new ax5.ui.select();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.queue=[];this.config={clickEventName:"click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
theme:'default',title:'',animateTime:250};this.activeselect=null;this.activeselectQueueIndex=-1;this.openTimer=null;this.closeTimer=null;cfg=this.config;var onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}return true;}; /// private end
/**
         * Preferences of select UI
         * @method ax5.ui.select.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.select}
         * @example
         * ```
         * ```
         */this.init=function(){this.onStateChanged=cfg.onStateChanged;};this.bind=function(opts){var selectConfig={},optIdx;jQuery.extend(true,selectConfig,cfg);if(opts)jQuery.extend(true,selectConfig,opts);opts=selectConfig;if(!opts.target){console.log(ax5.info.getError("ax5select","401","bind"));return this;}opts.$target=jQuery(opts.target);if(!opts.id)opts.id=opts.$target.data("ax5-select");if(!opts.id){opts.id='ax5-select-'+ax5.getGuid();opts.$target.data("ax5-select",opts.id);}optIdx=U.search(this.queue,function(){return this.id==opts.id;});if(optIdx===-1){this.queue.push(opts);bindselectTarget.call(this,opts,this.queue.length-1);}else {this.queue[optIdx]=opts;bindselectTarget.call(this,this.queue[optIdx],optIdx);}selectConfig=null;optIdx=null;return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}}.apply(this,arguments);}; //== UI Class
root.select=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root);ax5.ui.select_instance=new ax5.ui.select();$.fn.ax5select=function(){return function(config){if(typeof config=="undefined")config={};$.each(this,function(){var defaultConfig={target:this};config=$.extend(true,config,defaultConfig);ax5.ui.select_instance.bind(config);});return this;};}(); /*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */ // ax5.ui.media-viewer
(function(root,_SUPER_){ /**
     * @class ax5.ui.mediaViewer
     * @classdesc
     * @version 0.2.0
     * @author tom@axisj.com
     * @example
     * ```
     * var myViewer = new ax5.ui.mediaViewer();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.queue=[];this.config={clickEventName:"click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
theme:'default',animateTime:250,columnKeys:{src:'src',poster:'poster',html:'html'},loading:{icon:'',text:'Now Loading'},viewer:{prevHandle:false,nextHandle:false,ratio:16/9},media:{prevHandle:'<',nextHandle:'>',width:36,height:36,list:[]}};this.openTimer=null;this.closeTimer=null;this.selectedIndex=0;cfg=this.config;var onStateChanged=function onStateChanged(opts,that){if(opts&&opts.onStateChanged){opts.onStateChanged.call(that,that);}else if(this.onStateChanged){this.onStateChanged.call(that,that);}return true;},getFrameTmpl=function getFrameTmpl(columnKeys){return '\n                <div data-ax5-ui-media-viewer="{{id}}" class="{{theme}}">\n                    <div data-media-viewer-els="viewer"></div>\n                    <div data-media-viewer-els="viewer-loading">\n                        <div class="ax5-ui-media-viewer-loading-holder">\n                            <div class="ax5-ui-media-viewer-loading-cell">\n                                {{{loading.icon}}}\n                                {{{loading.text}}}\n                            </div>\n                        </div>\n                    </div>\n                    {{#media}}\n                    <div data-media-viewer-els="media-list-holder">\n                        <div data-media-viewer-els="media-list-prev-handle">{{{prevHandle}}}</div>\n                        <div data-media-viewer-els="media-list">\n                            <div data-media-viewer-els="media-list-table">\n                            {{#list}}\n                                <div data-media-viewer-els="media-list-table-td">\n                                    {{#image}}\n                                    <div data-media-thumbnail="{{@i}}">\n                                        <img src="{{'+columnKeys.poster+'}}" data-media-thumbnail-image="{{@i}}" />\n                                    </div>\n                                    {{/image}}\n                                    {{#video}}\n                                    <div data-media-thumbnail="{{@i}}">{{#'+columnKeys.poster+'}}<img src="{{.}}" data-media-thumbnail-video="{{@i}}" />>{{/'+columnKeys.poster+'}}{{^'+columnKeys.poster+'}}<a data-media-thumbnail-video="{{@i}}">{{{media.'+columnKeys.poster+'}}}</a>{{/'+columnKeys.poster+'}}</div>\n                                    {{/video}}\n                                </div>\n                            {{/list}}\n                            </div>\n                        </div>\n                        <div data-media-viewer-els="media-list-next-handle">{{{nextHandle}}}</div>\n                    </div>\n                    {{/media}}\n                </div>\n                ';},getFrame=function getFrame(){var data=jQuery.extend(true,{},cfg),tmpl=getFrameTmpl(cfg.columnKeys);data.id=this.id;try{return ax5.mustache.render(tmpl,data);}finally {data=null;tmpl=null;}},onClick=function onClick(e,target){var result,elementType="",processor={'thumbnail':function thumbnail(target){this.select(target.getAttribute("data-media-thumbnail"));},'prev':function prev(target){if(this.selectedIndex>0){this.select(this.selectedIndex-1);}},'next':function next(target){if(this.selectedIndex<cfg.media.list.length-1){this.select(this.selectedIndex+1);}},'viewer':function viewer(target){if(self.onClick){self.onClick.call({media:cfg.media.list[this.selectedIndex]});}}};target=U.findParentNode(e.target,function(target){if(target.getAttribute("data-media-thumbnail")){elementType="thumbnail";return true;}else if(target.getAttribute("data-media-viewer-els")=="media-list-prev-handle"){elementType="prev";return true;}else if(target.getAttribute("data-media-viewer-els")=="media-list-next-handle"){elementType="next";return true;}else if(target.getAttribute("data-media-viewer-els")=="viewer"){elementType="viewer";return true;}else if(self.target.get(0)==target){return true;}});if(target){for(var key in processor){if(key==elementType){result=processor[key].call(this,target);break;}}return this;}return this;},getSelectedIndex=function getSelectedIndex(){if(cfg.media&&cfg.media.list&&cfg.media.list.length>0){var i=cfg.media.list.length,selecteIndex=0;while(i--){if(cfg.media.list[i].selected){selecteIndex=i;break;}}if(selecteIndex==0){cfg.media.list[0].selected=true;}try{return selecteIndex;}finally {i=null;selecteIndex=null;}}else {return;}},alignMediaList=function alignMediaList(){var thumbnail=this.$["list"].find('[data-media-thumbnail='+this.selectedIndex+']'),pos=thumbnail.position(),thumbnailWidth=thumbnail.width(),containerWidth=this.$["list"].width(),parentLeft=this.$["list-table"].position().left,parentWidth=this.$["list-table"].width(),newLeft=0;if(pos.left+thumbnailWidth+parentLeft>containerWidth){newLeft=containerWidth-(pos.left+thumbnailWidth);if(parentLeft!=newLeft)this.$["list-table"].css({left:parentLeft=newLeft});}else if(pos.left+parentLeft<0){newLeft=pos.left;if(newLeft>0)newLeft=0;if(parentLeft!=newLeft)this.$["list-table"].css({left:parentLeft=newLeft});}if(parentLeft!=newLeft){if(parentLeft+parentWidth<containerWidth){newLeft=containerWidth-parentWidth;if(newLeft>0)newLeft=0;this.$["list-table"].css({left:newLeft});}}thumbnail=null;pos=null;thumbnailWidth=null;containerWidth=null;parentLeft=null;newLeft=null;}; /// private end
/**
         * Preferences of mediaViewer UI
         * @method ax5.ui.mediaViewer.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.mediaViewer}
         * @example
         * ```
         * ```
         */this.init=function(){this.onStateChanged=cfg.onStateChanged;this.onClick=cfg.onClick;this.id='ax5-media-viewer-'+ax5.getGuid();if(cfg.target&&cfg.media&&cfg.media.list&&cfg.media.list.length>0){this.attach(cfg.target);}}; /**
         * @method ax5.ui.mediaViewer.attach
         * @param target
         * @param options
         * @returns {ax5.ui.mediaViewer}
         */this.attach=function(target,options){if(!target){console.log(ax5.info.getError("ax5mediaViewer","401","setConfig"));}if(typeof options!="undefined"){this.setConfig(options,false);}this.target=jQuery(target);this.target.html(getFrame.call(this)); // 파트수집
this.$={"root":this.target.find('[data-ax5-ui-media-viewer]'),"viewer":this.target.find('[data-media-viewer-els="viewer"]'),"viewer-loading":this.target.find('[data-media-viewer-els="viewer-loading"]'),"list-holder":this.target.find('[data-media-viewer-els="media-list-holder"]'),"list-prev-handle":this.target.find('[data-media-viewer-els="media-list-prev-handle"]'),"list":this.target.find('[data-media-viewer-els="media-list"]'),"list-table":this.target.find('[data-media-viewer-els="media-list-table"]'),"list-next-handle":this.target.find('[data-media-viewer-els="media-list-next-handle"]')};this.align();jQuery(window).unbind("resize.ax5media-viewer-"+this.id).bind("resize.ax5media-viewer-"+this.id,function(){this.align();alignMediaList.call(this);}.bind(this));this.target.unbind("click").bind("click",function(e){e=e||window.event;onClick.call(this,e);U.stopEvent(e);}.bind(this));this.select(getSelectedIndex.call(this));return this;}; /**
         * @method ax5.ui.mediaViewer.align
         * @returns {axClass}
         */this.align=function(){ // viewer width, height
this.$["viewer"].css({height:this.$["viewer"].width()/cfg.viewer.ratio});if(this.$["viewer"].data("media-type")=="image"){var $img=this.$["viewer"].find("img");$img.css({width:this.$["viewer"].height()*this.$["viewer"].data("img-ratio"),height:this.$["viewer"].height()});setTimeout(function(_img){_img.css({left:(this.$["viewer"].width()-_img.width())/2});}.bind(this,$img),1);}else if(this.$["viewer"].data("media-type")=="video"){this.$["viewer"].find("iframe").css({width:this.$["viewer"].height()*this.$["viewer"].data("img-ratio"),height:this.$["viewer"].height()});}this.$["viewer-loading"].css({height:this.$["viewer"].height()});var mediaThumbnailWidth=U.right(cfg.media.width,1)=='%'?U.number(cfg.media.width)/100*this.$["viewer"].width():U.number(cfg.media.width),mediaThumbnailHeight=U.right(cfg.media.height,1)=='%'?U.number(cfg.media.height)/100*this.$["viewer"].width():U.number(cfg.media.height);mediaThumbnailWidth=Math.floor(mediaThumbnailWidth);mediaThumbnailHeight=Math.floor(mediaThumbnailHeight);this.$["list-prev-handle"].css({width:mediaThumbnailWidth*1.5});this.$["list-next-handle"].css({width:mediaThumbnailWidth*1.5});this.$["list"].css({height:mediaThumbnailHeight});this.$["list-table"].find('[data-media-thumbnail]').css({width:mediaThumbnailWidth,height:mediaThumbnailHeight});this.$["list-table"].find('[data-media-thumbnail-video]').css({width:mediaThumbnailWidth,height:mediaThumbnailHeight});return this;}; /**
         * @method ax5.ui.mediaViewer.select
         * @param index
         * @returns {axClass}
         */this.select=function(){var mediaView={image:function image(obj,callBack){self.$["viewer-loading"].show();var dim=[this.$["viewer"].width(),this.$["viewer"].height()];var img=new Image();img.src=obj.image[cfg.columnKeys.src];img.onload=function(){self.$["viewer-loading"].fadeOut();var h=dim[1];var w=h*img.width/img.height;callBack(img,Math.floor(w),h);};return img;},video:function video(obj,callBack){self.$["viewer-loading"].show();var dim=[this.$["viewer"].width(),this.$["viewer"].height()];var html=jQuery(obj.video[cfg.columnKeys.html]);callBack(html,dim[0],dim[1]);self.$["viewer-loading"].fadeOut();}};var onLoad={image:function image(img,w,h){img.width=w;img.height=h;var $img=$(img);this.$["viewer"].html($img);$img.css({left:(this.$["viewer"].width()-w)/2});this.$["viewer"].data("media-type","image");this.$["viewer"].data("img-ratio",w/h);},video:function video(html,w,h){html.css({width:w,height:h});this.$["viewer"].html(html);this.$["viewer"].data("media-type","video");this.$["viewer"].data("img-ratio",w/h);}};var select=function select(index){this.$["list"].find('[data-media-thumbnail]').removeClass("selected");this.$["list"].find('[data-media-thumbnail='+index+']').addClass("selected");alignMediaList.call(this);};return function(index){if(typeof index==="undefined")return this;this.selectedIndex=Number(index);var media=cfg.media.list[index];select.call(this,index);for(var key in mediaView){if(media[key]){mediaView[key].call(this,media,onLoad[key].bind(this));break;}}return this;};}(); /**
         * @method ax5.ui.mediaViewer.setMediaList
         * @param list
         * @returns {axClass}
         */this.setMediaList=function(list){cfg.media.list=[].concat(list);this.attach(cfg.target);return this;}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}else {this.init();}}.apply(this,arguments);}; //== UI Class
root.mediaViewer=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root); /*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */ // ax5.ui.select
(function(root,_SUPER_){ /**
     * @class ax5.ui.uploader
     * @classdesc
     * @version 0.4.6
     * @author tom@axisj.com
     * @example
     * ```
     * var myuploader = new ax5.ui.uploader();
     * ```
     */var U=ax5.util; //== UI Class
var axClass=function axClass(){var self=this,cfg;if(_SUPER_)_SUPER_.call(this); // 부모호출
this.queue=[];this.config={clickEventName:"click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
theme:'default',file_types:"*/*"};this.target=null;this.selectedFile=null;this.uploadedFile=null;cfg=this.config;this.init=function(){console.log(cfg.target);this.target=$(cfg.target);this.target.html(this.__get_layout());this.els={"container":this.target.find('[data-ui-els="container"]'),"preview":this.target.find('[data-ui-els="preview"]'),"preview-img":this.target.find('[data-ui-els="preview-img"]'),"input-file":this.target.find('[data-ui-els="input-file"]'),"progress":this.target.find('[data-ui-els="progress"]'),"progress-bar":this.target.find('[data-ui-els="progress-bar"]')};this.els["preview"].bind("click",function(){this.__request_select_file();}.bind(this));this.els["input-file"].bind("change",function(e){this.__on_select_file(e||window.event);}.bind(this));(function(){var dragZone=this.els["container"],preview_img=this.els["preview-img"],_this=this,timer;console.log(dragZone.get(0));dragZone.get(0).addEventListener('dragover',function(e){e.stopPropagation();e.preventDefault();preview_img.hide();if(timer)clearTimeout(timer);dragZone.addClass("dragover");},false);dragZone.get(0).addEventListener('dragleave',function(e){e.stopPropagation();e.preventDefault();if(timer)clearTimeout(timer);timer=setTimeout(function(){preview_img.show();},100);dragZone.removeClass("dragover");},false);dragZone.get(0).addEventListener('drop',function(e){e.stopPropagation();e.preventDefault();dragZone.removeClass("dragover");_this.__on_select_file(e||window.event);},false);}).call(this);setTimeout(function(){this.__set_size_layout();}.bind(this),1);};this.__get_layout=function(){var po=[],inputFileMultiple="", // inputFileMultiple = 'multiple="multiple"',  support multifile
inputFileAccept=cfg.file_types;po.push('<div class="ax5-ui-single-uploader '+cfg.theme+'" data-ui-els="container">');po.push('<div class="upload-preview" data-ui-els="preview">');po.push('<img class="upload-preview-img" data-ui-els="preview-img" src="" style="display:none;width:100%;height:100%;" />');po.push('<span class="empty-msg">'+cfg.empty_msg+'<span>');po.push('</div>');po.push('<div class="ax5-ui-progress '+(cfg.progress_theme||"")+'" data-ui-els="progress" style="display: none;"><div class="progress-bar" data-ui-els="progress-bar"></div></div>');po.push('<input type="file" '+inputFileMultiple+' accept="'+inputFileAccept+'" capture="camera" data-ui-els="input-file" />');po.push('</div>');return po.join('');};this.__set_size_layout=this.align=function(){var progress_margin=20,progress_height=this.els["progress"].height(),ct_width=this.els["container"].width(),ct_height=this.els["container"].height();if(ct_width!=0&&ct_height!=0){this.els["progress"].css({left:progress_margin,top:ct_height/2-progress_height/2,width:ct_width-progress_margin*2});} //this.els["preview-img"].css({width: ct_width, height: ct_height});
};this.__request_select_file=function(){if(cfg.before_select_file){if(!cfg.before_select_file.call()){return false; // 중지
}}if(window.imagePicker){window.imagePicker.getPictures(function(results){for(var i=0;i<results.length;i++){console.log('Image URI: '+results[i]);}_this.__on_select_file(results);},function(error){console.log('Error: '+error);});}else {this.els["input-file"].trigger("click");}};this.__on_select_file=function(evt){var file,target_id=this.target.id,preview=this.els["preview-img"].get(0);console.log(evt);if('dataTransfer' in evt){file=evt.dataTransfer.files[0];}else if('target' in evt){file=evt.target.files[0];}else if(evt){file=evt[0];}if(!file)return false; // todo : size over check
this.selected_file=file; // 선택된 이미지 프리뷰 기능
(function(root){root.els["preview-img"].css({display:"block"});function setcss_preview(img,box_width,box_height){var css={};var image=new Image();image.src=img.src;image.onload=function(){ // access image size here
//console.log(this.width, this.height);
if(this.width>this.height){ // 가로형
if(this.height>box_height){css={width:this.width*(box_height/this.height),height:box_height};css.left=(box_width-css.width)/2;}else {css={width:this.width,height:this.height};css.top=(box_height-css.height)/2;}}else { // 세로형
if(this.width>box_width){css={height:this.height*(box_width/this.width),width:box_width};css.top=(box_height-css.height)/2;}else {css={width:this.width,height:this.height};css.left=(box_width-css.width)/2;}}console.log(css);root.els["preview-img"].css(css);};}if(window.imagePicker){preview.src=file;setcss_preview(preview,root.els["container"].width(),root.els["container"].height());}else {var reader=new FileReader(target_id);reader.onloadend=function(){try{preview.src=reader.result;setcss_preview(preview,root.els["container"].width(),root.els["container"].height());}catch(ex){console.log(ex);}};if(file){reader.readAsDataURL(file);}}})(this);if(cfg.on_event){var that={action:"fileselect",file:file};cfg.on_event.call(that,that);} /// 파일 선택하면 업로드
// if(file) this.upload(file);
};this.upload=function(){var _this=this;if(!this.selected_file){if(cfg.on_event){var that={action:"error",error:ax5.info.get_error("single-uploader","460","upload")};cfg.on_event.call(that,that);}return this;}var formData=new FormData(),progress_bar=this.els["progress-bar"];this.els["progress"].css({display:"block"});progress_bar.css({width:'0%'});if(window.imagePicker){formData.append(cfg.upload_http.filename_param_key,this.selected_file); // 다른 처리 방법 적용 필요
}else {formData.append(cfg.upload_http.filename_param_key,this.selected_file);}for(var k in cfg.upload_http.data){formData.append(k,cfg.upload_http.data[k]);}this.xhr=new XMLHttpRequest();this.xhr.open(cfg.upload_http.method,cfg.upload_http.url,true);this.xhr.onload=function(e){var res=e.target.response;try{if(typeof res=="string")res=U.parseJson(res);}catch(e){console.log(e);return false;}if(res.error){console.log(res.error);return false;}_this.upload_complete(res);};this.xhr.upload.onprogress=function(e){progress_bar.css({width:U.number(e.loaded/e.total*100,{round:2})+'%'});if(e.lengthComputable){if(e.loaded>=e.total){ //_this.upload_complete();
setTimeout(function(){_this.els["progress"].css({display:"none"});},300);}}};this.xhr.send(formData); // multipart/form-data
};this.upload_complete=function(res){this.selected_file=null;this.uploaded_file=res;this.els["container"].addClass("uploaded");if(cfg.on_event){var that={action:"uploaded",file:res};cfg.on_event.call(that,that);}};this.set_uploaded_file=function(file){this.uploaded_file=file;if(this.uploaded_file){this.els["container"].addClass("uploaded");}else {this.els["container"].removeClass("uploaded");}};this.set_preview_img=function(src){if(src){this.els["preview-img"].attr({"src":src});}else {this.els["preview-img"].attr({"src":null});}}; // 클래스 생성자
this.main=function(){if(arguments&&U.isObject(arguments[0])){this.setConfig(arguments[0]);}else { //this.init();
}}.apply(this,arguments);}; //== UI Class
root.uploader=function(){if(U.isFunction(_SUPER_))axClass.prototype=new _SUPER_(); // 상속
return axClass;}(); // ax5.ui에 연결
})(ax5.ui,ax5.ui.root);