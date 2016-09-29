'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
    'use strict';

    // root of function

    var root = this,
        win = this;
    var doc = win ? win.document : null,
        docElem = win ? win.document.documentElement : null;
    var reIsJson = /^(["'](\\.|[^"\\\n\r])*?["']|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/,
        reMs = /^-ms-/,
        reSnakeCase = /[\-_]([\da-z])/gi,
        reCamelCase = /([A-Z])/g,
        reDot = /\./,
        reInt = /[-|+]?[\D]/gi,
        reNotNum = /\D/gi,
        reMoneySplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])'),
        reAmp = /&/g,
        reEq = /=/,
        reClassNameSplit = /[ ]+/g,


    /** @namespace {Object} ax5 */
    ax5 = {},
        info,
        U,
        dom;

    /**
     * guid
     * @member {Number} ax5.guid
     */
    ax5.guid = 1;
    /**
     * ax5.guid를 구하고 증가시킵니다.
     * @method ax5.getGuid
     * @returns {Number} guid
     */
    ax5.getGuid = function () {
        return ax5.guid++;
    };

    /**
     * 상수모음
     * @namespace ax5.info
     */
    ax5.info = info = function () {
        /**
         * ax5 version
         * @member {String} ax5.info.version
         */
        var version = "0.0.1";
        /**
         * ax5 library path
         * @member {String} ax5.info.baseUrl
         */
        var baseUrl = "";
        /**
         * ax5 에러 출력메세지 사용자 재 정의
         * @member {Object} ax5.info.onerror
         * @examples
         * ```
         * ax5.info.onerror = function(){
        *  console.log(arguments);
        * }
         * ```
         */
        var onerror = function onerror() {
            console.error(U.toArray(arguments).join(":"));
        };

        /**
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
         */
        var eventKeys = {
            BACKSPACE: 8, TAB: 9,
            RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
            HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
        };

        var weekNames = [{ label: "SUN" }, { label: "MON" }, { label: "TUE" }, { label: "WED" }, { label: "THU" }, { label: "FRI" }, { label: "SAT" }];

        /**
         * 사용자 브라우저 식별용 오브젝트
         * @member {Object} ax5.info.browser
         * @example
         * ```
         * console.log( ax5.info.browser );
         * //Object {name: "chrome", version: "39.0.2171.71", mobile: false}
         * ```
         */
        var browser = function (ua, mobile, browserName, match, browser, browserVersion) {
            if (!win || !win.navigator) return {};

            ua = navigator.userAgent.toLowerCase(), mobile = ua.search(/mobile/g) != -1, browserName, match, browser, browserVersion;

            if (ua.search(/iphone/g) != -1) {
                return { name: "iphone", version: 0, mobile: true };
            } else if (ua.search(/ipad/g) != -1) {
                return { name: "ipad", version: 0, mobile: true };
            } else if (ua.search(/android/g) != -1) {
                match = /(android)[ \/]([\w.]+)/.exec(ua) || [];
                browserVersion = match[2] || "0";
                return { name: "android", version: browserVersion, mobile: mobile };
            } else {
                browserName = "";
                match = /(opr)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
                browser = match[1] || "";
                browserVersion = match[2] || "0";

                if (browser == "msie") browser = "ie";
                return {
                    name: browser,
                    version: browserVersion,
                    mobile: mobile
                };
            }
            ua = null, mobile = null, browserName = null, match = null, browser = null, browserVersion = null;
        }();
        /**
         * 브라우저 여부
         * @member {Boolean} ax5.info.isBrowser
         */
        var isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && win.document);
        /**
         * 브라우저에 따른 마우스 휠 이벤트이름
         * @member {Object} ax5.info.wheelEnm
         */
        var wheelEnm = win && /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";

        /**
         * 첫번째 자리수 동사 - (필요한것이 없을때 : 4, 실행오류 : 5)
         * 두번째 자리수 목적어 - 문자열 0, 숫자 1, 배열 2, 오브젝트 3, 함수 4, DOM 5, 파일 6, 기타 7
         * 세번째 자리수 옵션
         * @member {Object} ax5.info.errorMsg
         */
        var errorMsg = {};

        /**
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
         */
        function urlUtil(url, urls) {
            url = {
                href: win.location.href,
                param: win.location.search,
                referrer: doc.referrer,
                pathname: win.location.pathname,
                hostname: win.location.hostname,
                port: win.location.port
            }, urls = url.href.split(/[\?#]/);
            url.param = url.param.replace("?", "");
            url.url = urls[0];
            if (url.href.search("#") > -1) {
                url.hashdata = U.last(urls);
            }
            urls = null;
            url.baseUrl = U.left(url.href, "?").replace(url.pathname, "");
            return url;
        }

        /**
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
         */
        function getError(className, errorCode, methodName) {
            if (info.errorMsg && info.errorMsg[className]) {
                return {
                    className: className,
                    errorCode: errorCode,
                    methodName: methodName,
                    msg: info.errorMsg[className][errorCode]
                };
            } else {
                return { className: className, errorCode: errorCode, methodName: methodName };
            }
        }

        var supportTouch = win ? 'ontouchstart' in win || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 : false;

        return {
            errorMsg: errorMsg,
            version: version,
            baseUrl: baseUrl,
            onerror: onerror,
            eventKeys: eventKeys,
            weekNames: weekNames,
            browser: browser,
            isBrowser: isBrowser,
            supportTouch: supportTouch,
            wheelEnm: wheelEnm,
            urlUtil: urlUtil,
            getError: getError
        };
    }();

    /**
     * Refer to this by {@link ax5}.
     * @namespace ax5.util
     */
    ax5['util'] = U = function () {
        var _toString = Object.prototype.toString;

        /**
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
         */
        function each(O, _fn) {
            if (isNothing(O)) return [];
            var key,
                i = 0,
                l = O.length,
                isObj = l === undefined || typeof O === "function";
            if (isObj) {
                for (key in O) {
                    if (typeof O[key] != "undefined") if (_fn.call(O[key], key, O[key]) === false) break;
                }
            } else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined") if (_fn.call(O[i], i, O[i++]) === false) break;
                }
            }
            return O;
        }

        // In addition to using the http://underscorejs.org : map, reduce, reduceRight, find
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
         */
        function map(O, _fn) {
            if (isNothing(O)) return [];
            var key,
                i = 0,
                l = O.length,
                results = [],
                fnResult;
            if (isObject(O)) {
                for (key in O) {
                    if (typeof O[key] != "undefined") {
                        fnResult = undefined;
                        if ((fnResult = _fn.call(O[key], key, O[key])) === false) break;else results.push(fnResult);
                    }
                }
            } else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined") {
                        fnResult = undefined;
                        if ((fnResult = _fn.call(O[i], i, O[i++])) === false) break;else results.push(fnResult);
                    }
                }
            }
            return results;
        }

        /**
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
         */
        function search(O, _fn) {
            if (isNothing(O)) return -1;
            var key,
                i = 0,
                l = O.length;
            if (isObject(O)) {
                for (key in O) {
                    if (typeof O[key] != "undefined" && isFunction(_fn) && _fn.call(O[key], key, O[key])) {
                        return key;
                        break;
                    } else if (O[key] == _fn) {
                        return key;
                        break;
                    }
                }
            } else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined" && isFunction(_fn) && _fn.call(O[i], i, O[i])) {
                        return i;
                        break;
                    } else if (O[i] == _fn) {
                        return i;
                        break;
                    }
                    i++;
                }
            }
            return -1;
        }

        /**
         * @method ax5.util.sum
         * @param {Array|Object} O
         * @param {Number} [defaultValue]
         * @param {Function} _fn
         * @returns {Number}
         * @example
         * ```js
         * var arr = [
         *  {name: "122", value: 9},
         *  {name: "122", value: 10},
         *  {name: "123", value: 11}
         * ];
         *
         * var rs = ax5.util.sum(arr, function () {
         *  if(this.name == "122") {
         *      return this.value;
         *  }
         * });
         * console.log(rs); // 19
         *
         * console.log(ax5.util.sum(arr, 10, function () {
         *   return this.value;
         * }));
         * // 40
         * ```
         */
        function sum(O, defaultValue, _fn) {
            var i, l, tokenValue;
            if (isFunction(defaultValue) && typeof _fn === "undefined") {
                _fn = defaultValue;
                defaultValue = 0;
            }
            if (typeof defaultValue === "undefined") defaultValue = 0;

            if (isArray(O)) {
                i = 0;
                l = O.length;
                for (; i < l; i++) {
                    if (typeof O[i] !== "undefined") {
                        if ((tokenValue = _fn.call(O[i], O[i])) === false) break;else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue;
            } else if (isObject(O)) {
                for (i in O) {
                    if (typeof O[i] != "undefined") {
                        if ((tokenValue = _fn.call(O[i], O[i])) === false) break;else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue;
            } else {
                console.error("argument error : ax5.util.sum - use Array or Object");
                return defaultValue;
            }
        }

        /**
         * @method ax5.util.avg
         * @param {Array|Object} O
         * @param {Number} [defaultValue]
         * @param {Function} _fn
         * @returns {Number}
         * @example
         * ```js
         * var arr = [
         *  {name: "122", value: 9},
         *  {name: "122", value: 10},
         *  {name: "123", value: 11}
         * ];
         *
         * var rs = ax5.util.avg(arr, function () {
         *      return this.value;
         * });
         *
         * console.log(rs); // 10
         * ```
         */
        function avg(O, defaultValue, _fn) {
            var i, l, tokenValue;
            if (isFunction(defaultValue) && typeof _fn === "undefined") {
                _fn = defaultValue;
                defaultValue = 0;
            }
            if (typeof defaultValue === "undefined") defaultValue = 0;

            if (isArray(O)) {
                i = 0;
                l = O.length;
                for (; i < l; i++) {
                    if (typeof O[i] !== "undefined") {
                        if ((tokenValue = _fn.call(O[i], O[i])) === false) break;else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue / l;
            } else if (isObject(O)) {
                for (i in O) {
                    if (typeof O[i] != "undefined") {
                        if ((tokenValue = _fn.call(O[i], O[i])) === false) break;else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue / l;
            } else {
                console.error("argument error : ax5.util.sum - use Array or Object");
                return defaultValue;
            }
        }

        /**
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
         */
        function reduce(O, _fn) {
            var i, l, tokenItem;
            if (isArray(O)) {
                i = 0, l = O.length, tokenItem = O[i];
                for (; i < l - 1;) {
                    if (typeof O[i] != "undefined") {
                        if ((tokenItem = _fn.call(root, tokenItem, O[++i])) === false) break;
                    }
                }
                return tokenItem;
            } else if (isObject(O)) {
                for (i in O) {
                    if (typeof O[i] != "undefined") {
                        if ((tokenItem = _fn.call(root, tokenItem, O[i])) === false) break;
                    }
                }
                return tokenItem;
            } else {
                console.error("argument error : ax5.util.reduce - use Array or Object");
                return null;
            }
        }

        /**
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
         */
        function reduceRight(O, _fn) {
            var i = O.length - 1,
                tokenItem = O[i];
            for (; i > 0;) {
                if (typeof O[i] != "undefined") {
                    if ((tokenItem = _fn.call(root, tokenItem, O[--i])) === false) break;
                }
            }
            return tokenItem;
        }

        /**
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
         */
        function filter(O, _fn) {
            if (isNothing(O)) return [];
            var k,
                i = 0,
                l = O.length,
                results = [],
                fnResult;
            if (isObject(O)) {
                for (k in O) {
                    if (typeof O[k] != "undefined") {
                        if (fnResult = _fn.call(O[k], k, O[k])) results.push(O[k]);
                    }
                }
            } else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined") {
                        if (fnResult = _fn.call(O[i], i, O[i])) results.push(O[i]);
                        i++;
                    }
                }
            }
            return results;
        }

        /**
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
         */
        function toJson(O) {
            var jsonString = "";
            if (ax5.util.isArray(O)) {
                var i = 0,
                    l = O.length;
                jsonString += "[";
                for (; i < l; i++) {
                    if (i > 0) jsonString += ",";
                    jsonString += toJson(O[i]);
                }
                jsonString += "]";
            } else if (ax5.util.isObject(O)) {
                jsonString += "{";
                var jsonObjectBody = [];
                each(O, function (key, value) {
                    jsonObjectBody.push('"' + key + '": ' + toJson(value));
                });
                jsonString += jsonObjectBody.join(", ");
                jsonString += "}";
            } else if (ax5.util.isString(O)) {
                jsonString = '"' + O + '"';
            } else if (ax5.util.isNumber(O)) {
                jsonString = O;
            } else if (ax5.util.isUndefined(O)) {
                jsonString = "undefined";
            } else if (ax5.util.isFunction(O)) {
                jsonString = '"{Function}"';
            } else {
                jsonString = O;
            }
            return jsonString;
        }

        /**
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
         */
        function parseJson(str, force) {
            if (force || reIsJson.test(str)) {
                try {
                    return new Function('', 'return ' + str)();
                } catch (e) {
                    return { error: 500, msg: 'syntax error' };
                }
            } else {
                return { error: 500, msg: 'syntax error' };
            }
        }

        /**
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
         */
        function getType(O) {
            var typeName;
            if (O != null && O == O.window) {
                typeName = "window";
            } else if (!!(O && O.nodeType == 1)) {
                typeName = "element";
            } else if (!!(O && O.nodeType == 11)) {
                typeName = "fragment";
            } else if (O === null) {
                typeName = "null";
            } else if (typeof O === "undefined") {
                typeName = "undefined";
            } else if (_toString.call(O) == "[object Object]") {
                typeName = "object";
            } else if (_toString.call(O) == "[object Array]") {
                typeName = "array";
            } else if (_toString.call(O) == "[object String]") {
                typeName = "string";
            } else if (_toString.call(O) == "[object Number]") {
                typeName = "number";
            } else if (_toString.call(O) == "[object NodeList]") {
                typeName = "nodelist";
            } else if (typeof O === "function") {
                typeName = "function";
            }
            return typeName;
        }

        /**
         * 오브젝트가 window 인지 판단합니다.
         * @method ax5.util.isWindow
         * @param {Object} O
         * @returns {Boolean}
         */
        function isWindow(O) {
            return O != null && O == O.window;
        }

        /**
         * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
         * @method ax5.util.isElement
         * @param {Object} O
         * @returns {Boolean}
         */
        function isElement(O) {
            return !!(O && (O.nodeType == 1 || O.nodeType == 11));
        }

        /**
         * 오브젝트가 Object인지 판단합니다.
         * @method ax5.util.isObject
         * @param {Object} O
         * @returns {Boolean}
         */
        function isObject(O) {
            return _toString.call(O) == "[object Object]";
        }

        /**
         * 오브젝트가 Array인지 판단합니다.
         * @method ax5.util.isArray
         * @param {Object} O
         * @returns {Boolean}
         */
        function isArray(O) {
            return _toString.call(O) == "[object Array]";
        }

        /**
         * 오브젝트가 Function인지 판단합니다.
         * @method ax5.util.isFunction
         * @param {Object} O
         * @returns {Boolean}
         */
        function isFunction(O) {
            return typeof O === "function";
        }

        /**
         * 오브젝트가 String인지 판단합니다.
         * @method ax5.util.isString
         * @param {Object} O
         * @returns {Boolean}
         */
        function isString(O) {
            return _toString.call(O) == "[object String]";
        }

        /**
         * 오브젝트가 Number인지 판단합니다.
         * @method ax5.util.isNumber
         * @param {Object} O
         * @returns {Boolean}
         */
        function isNumber(O) {
            return _toString.call(O) == "[object Number]";
        }

        /**
         * 오브젝트가 NodeList인지 판단합니다.
         * @method ax5.util.isNodelist
         * @param {Object} O
         * @returns {Boolean}
         */
        function isNodelist(O) {
            return !!(_toString.call(O) == "[object NodeList]" || typeof O !== "undefined" && O && O[0] && O[0].nodeType == 1);
        }

        /**
         * 오브젝트가 undefined인지 판단합니다.
         * @method ax5.util.isUndefined
         * @param {Object} O
         * @returns {Boolean}
         */
        function isUndefined(O) {
            return typeof O === "undefined";
        }

        /**
         * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
         * @method ax5.util.isNothing
         * @param {Object} O
         * @returns {Boolean}
         */
        function isNothing(O) {
            return typeof O === "undefined" || O === null || O === "";
        }

        function isDate(O) {
            return O instanceof Date && !isNaN(O.valueOf());
        }

        function isDateFormat(O) {
            var result = false;
            if (!O) {} else if (O instanceof Date && !isNaN(O.valueOf())) {
                result = true;
            } else {
                if (O.length > 7) {
                    if (date(O) instanceof Date) {
                        return true;
                    }
                }
                O = O.replace(/\D/g, '');
                if (O.length > 7) {
                    var mm = O.substr(4, 2),
                        dd = O.substr(6, 2);
                    O = date(O);
                    if (O.getMonth() == mm - 1 && O.getDate() == dd) {
                        result = true;
                    }
                }
            }
            return result;
        }

        /**
         * 오브젝트의 첫번째 아이템을 반환합니다.
         * @method ax5.util.first
         * @param {Object|Array} O
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.first({a:1, b:2});
         * // Object {a: 1}
         * ```
         */
        function first(O) {
            if (isObject(O)) {
                var keys = Object.keys(O);
                var item = {};
                item[keys[0]] = O[keys[0]];
                return item;
            } else if (isArray(O)) {
                return O[0];
            } else {
                console.error("ax5.util.object.first", "argument type error");
                return undefined;
            }
        }

        /**
         * 오브젝트의 마지막 아이템을 반환합니다.
         * @method ax5.util.last
         * @param {Object|Array} O
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.last({a:1, b:2});
         * // Object {b: 2}
         * ```
         */
        function last(O) {
            if (isObject(O)) {
                var keys = Object.keys(O);
                var item = {};
                item[keys[keys.length - 1]] = O[keys[keys.length - 1]];
                return item;
            } else if (isArray(O)) {
                return O[O.length - 1];
            } else {
                console.error("ax5.util.object.last", "argument type error");
                return undefined;
            }
        }

        /**
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
         */
        function setCookie(cn, cv, exdays, opts) {
            var expire;
            if (typeof exdays === "number") {
                expire = new Date();
                expire.setDate(expire.getDate() + exdays);
            }
            opts = opts || {};
            return doc.cookie = [escape(cn), '=', escape(cv), expire ? "; expires=" + expire.toUTCString() : "", // use expires attribute, max-age is not supported by IE
            opts.path ? "; path=" + opts.path : "", opts.domain ? "; domain=" + opts.domain : "", opts.secure ? "; secure" : ""].join("");
        }

        /**
         * 쿠키를 가져옵니다.
         * @method ax5.util.getCookie
         * @param {String} cname
         * @returns {String} cookie value
         * @example
         * ```js
         * ax5.util.getCookie("jslib");
         * ```
         */
        function getCookie(cname) {
            var name = cname + "=";
            var ca = doc.cookie.split(';'),
                i = 0,
                l = ca.length;
            for (; i < l; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
            }
            return "";
        }

        /**
         * jsonString 으로 alert 합니다.
         * @method ax5.util.alert
         * @param {Object|Array|String|Number} O
         * @returns {Object|Array|String|Number} O
         * @example ```js
         * ax5.util.alert({a:1,b:2});
         * ax5.util.alert("정말?");
         * ```
         */
        function alert(O) {
            win.alert(toJson(O));
            return O;
        }

        /**
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
         */
        function left(str, pos) {
            if (typeof str === "undefined" || typeof pos === "undefined") return "";
            if (isString(pos)) {
                return str.indexOf(pos) > -1 ? str.substr(0, str.indexOf(pos)) : "";
            } else if (isNumber(pos)) {
                return str.substr(0, pos);
            } else {
                return "";
            }
        }

        /**
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
         */
        function right(str, pos) {
            if (typeof str === "undefined" || typeof pos === "undefined") return "";
            str = '' + str;
            if (isString(pos)) {
                return str.lastIndexOf(pos) > -1 ? str.substr(str.lastIndexOf(pos) + 1) : "";
            } else if (isNumber(pos)) {
                return str.substr(str.length - pos);
            } else {
                return "";
            }
        }

        /**
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
         */
        function camelCase(str) {
            return str.replace(reMs, "ms-").replace(reSnakeCase, function (all, letter) {
                return letter.toUpperCase();
            });
        }

        /**
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
         */
        function snakeCase(str) {
            return camelCase(str).replace(reCamelCase, function (all, letter) {
                return "-" + letter.toLowerCase();
            });
        }

        /**
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
         */
        function number(str, cond) {
            var result,
                pair = ('' + str).split(reDot),
                isMinus = Number(pair[0]) < 0 || pair[0] == "-0",
                returnValue = 0.0;
            pair[0] = pair[0].replace(reInt, "");
            if (pair[1]) {
                pair[1] = pair[1].replace(reNotNum, "");
                returnValue = Number(pair[0] + "." + pair[1]) || 0;
            } else {
                returnValue = Number(pair[0]) || 0;
            }
            result = isMinus ? -returnValue : returnValue;

            each(cond, function (k, c) {
                if (k == "round") {
                    if (isNumber(c)) {
                        if (c < 0) {
                            result = +(Math.round(result + "e-" + Math.abs(c)) + "e+" + Math.abs(c));
                        } else {
                            result = +(Math.round(result + "e+" + c) + "e-" + c);
                        }
                    } else {
                        result = Math.round(result);
                    }
                }
                if (k == "floor") {
                    result = Math.floor(result);
                }
                if (k == "ceil") {
                    result = Math.ceil(result);
                } else if (k == "money") {
                    result = function (val) {
                        var txtNumber = '' + val;
                        if (isNaN(txtNumber) || txtNumber == "") {
                            return "";
                        } else {
                            var arrNumber = txtNumber.split('.');
                            arrNumber[0] += '.';
                            do {
                                arrNumber[0] = arrNumber[0].replace(reMoneySplit, '$1,$2');
                            } while (reMoneySplit.test(arrNumber[0]));
                            if (arrNumber.length > 1) {
                                return arrNumber.join('');
                            } else {
                                return arrNumber[0].split('.')[0];
                            }
                        }
                    }(result);
                } else if (k == "abs") {
                    result = Math.abs(Number(result));
                } else if (k == "byte") {
                    result = function (val) {
                        val = Number(result);
                        var nUnit = "KB";
                        var myByte = val / 1024;
                        if (myByte / 1024 > 1) {
                            nUnit = "MB";
                            myByte = myByte / 1024;
                        }
                        if (myByte / 1024 > 1) {
                            nUnit = "GB";
                            myByte = myByte / 1024;
                        }
                        return number(myByte, { round: 1 }) + nUnit;
                    }(result);
                }
            });

            return result;
        }

        /**
         * 배열 비슷한 오브젝트를 배열로 변환해줍니다.
         * @method ax5.util.toArray
         * @param {Object|Elements|Arguments} O
         * @returns {Array}
         * @example
         * ```js
         * ax5.util.toArray(arguments);
         * //
         * ```
         */
        function toArray(O) {
            if (typeof O.length != "undefined") return Array.prototype.slice.call(O);
            return [];
        }

        /**
         * 천번째 인자에 두번째 인자 아이템을 합쳐줍니다. concat과 같은 역할을 하지만. 인자가 Array타입이 아니어도 됩니다.
         * @method ax5.util.merge
         * @param {Array|ArrayLike} first
         * @param {Array|ArrayLike} second
         * @returns {Array} first
         * @example
         * ```
         *
         * ```
         */
        function merge(first, second) {
            var l = second.length,
                i = first.length,
                j = 0;

            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        }

        /**
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
         */
        function param(O, cond) {
            var p;
            if (isString(O) && typeof cond !== "undefined" && cond == "param") {
                return O;
            } else if (isString(O) && typeof cond !== "undefined" && cond == "object" || isString(O) && typeof cond === "undefined") {
                p = {};
                each(O.split(reAmp), function () {
                    var item = this.split(reEq);
                    if (!p[item[0]]) p[item[0]] = item[1];else {
                        if (isString(p[item[0]])) p[item[0]] = [p[item[0]]];
                        p[item[0]].push(item[1]);
                    }
                });
                return p;
            } else {
                p = [];
                each(O, function (k, v) {
                    p.push(k + "=" + escape(v));
                });
                return p.join('&');
            }
        }

        function encode(s) {
            return encodeURIComponent(s);
        }

        function decode(s) {
            return decodeURIComponent(s);
        }

        function error() {
            ax5.info.onerror.apply(this, arguments);
        }

        function localDate(yy, mm, dd, hh, mi, ss) {
            var utcD, localD;
            localD = new Date();
            if (typeof hh === "undefined") hh = 23;
            if (typeof mi === "undefined") mi = 59;
            utcD = new Date(Date.UTC(yy, mm, dd || 1, hh, mi, ss || 0));

            if (mm == 0 && dd == 1 && utcD.getUTCHours() + utcD.getTimezoneOffset() / 60 < 0) {
                utcD.setUTCHours(0);
            } else {
                utcD.setUTCHours(utcD.getUTCHours() + utcD.getTimezoneOffset() / 60);
            }
            return utcD;
        }

        /**
         * 날짜 형식의 문자열이나 Date객체를 조건에 맞게 처리 한 후 원하는 return 값으로 반환합니다.
         * @method ax5.util.date
         * @param {String|Date} d
         * @param {Object} cond
         * @returns {Date|String}
         * @example
         * ```js
         * ax5.util.date('2013-01-01'); // Tue Jan 01 2013 23:59:00 GMT+0900 (KST)
         * ax5.util.date((new Date()), {add:{d:10}, return:'yyyy/MM/dd'}); // "2015/07/01"
         * ax5.util.date('1919-03-01', {add:{d:10}, return:'yyyy/MM/dd hh:mm:ss'}); // "1919/03/11 23:59:00"
         * ```
         */
        function date(d, cond) {
            var yy, mm, dd, hh, mi, aDateTime, aTimes, aTime, aDate, utcD, localD, va;
            var ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;
            var ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

            if (isString(d)) {
                if (d.length == 0) {
                    d = new Date();
                } else if (d.length > 15) {
                    if (ISO_8601_FULL.test(d) || ISO_8601.test(d)) {
                        d = new Date(d);
                    } else {
                        aDateTime = d.split(/ /g), aTimes, aTime, aDate = aDateTime[0].split(/\D/g), yy = aDate[0];
                        mm = parseFloat(aDate[1]);
                        dd = parseFloat(aDate[2]);
                        aTime = aDateTime[1] || "09:00";
                        aTimes = aTime.substring(0, 5).split(":");
                        hh = parseFloat(aTimes[0]);
                        mi = parseFloat(aTimes[1]);
                        if (right(aTime, 2) === "AM" || right(aTime, 2) === "PM") hh += 12;
                        d = localDate(yy, mm - 1, dd, hh, mi);
                    }
                } else if (d.length == 14) {
                    va = d.replace(/\D/g, "");
                    d = localDate(va.substr(0, 4), va.substr(4, 2) - 1, number(va.substr(6, 2)), number(va.substr(8, 2)), number(va.substr(10, 2)), number(va.substr(12, 2)));
                } else if (d.length > 7) {
                    va = d.replace(/\D/g, "");
                    d = localDate(va.substr(0, 4), va.substr(4, 2) - 1, number(va.substr(6, 2)));
                } else if (d.length > 4) {
                    va = d.replace(/\D/g, "");
                    d = localDate(va.substr(0, 4), va.substr(4, 2) - 1, 1);
                } else if (d.length > 2) {
                    va = d.replace(/\D/g, "");
                    return localDate(va.substr(0, 4), va.substr(4, 2) - 1, 1);
                } else {
                    d = new Date();
                }
            }

            if (typeof cond === "undefined") {
                return d;
            } else {
                if (cond["add"]) {
                    d = function (_d, opts) {
                        var yy,
                            mm,
                            dd,
                            mxdd,
                            DyMilli = 1000 * 60 * 60 * 24;

                        if (typeof opts["d"] !== "undefined") {
                            _d.setTime(_d.getTime() + opts["d"] * DyMilli);
                        } else if (typeof opts["m"] !== "undefined") {
                            yy = _d.getFullYear();
                            mm = _d.getMonth();
                            dd = _d.getDate();
                            yy = yy + parseInt(opts["m"] / 12);
                            mm += opts["m"] % 12;
                            mxdd = daysOfMonth(yy, mm);
                            if (mxdd < dd) dd = mxdd;
                            _d = new Date(yy, mm, dd, 12);
                        } else if (typeof opts["y"] !== "undefined") {
                            _d.setTime(_d.getTime() + opts["y"] * 365 * DyMilli);
                        } else {
                            _d.setTime(_d.getTime() + opts["y"] * DyMilli);
                        }
                        return _d;
                    }(new Date(d), cond["add"]);
                }
                if (cond["return"]) {
                    return function () {
                        var fStr = cond["return"],
                            nY,
                            nM,
                            nD,
                            nH,
                            nMM,
                            nS,
                            nDW;

                        nY = d.getUTCFullYear();
                        nM = setDigit(d.getMonth() + 1, 2);
                        nD = setDigit(d.getDate(), 2);
                        nH = setDigit(d.getHours(), 2);
                        nMM = setDigit(d.getMinutes(), 2);
                        nS = setDigit(d.getSeconds(), 2);
                        nDW = d.getDay();

                        var yre = /[^y]*(yyyy)[^y]*/gi;
                        yre.exec(fStr);
                        var regY = RegExp.$1;
                        var mre = /[^m]*(MM)[^m]*/g;
                        mre.exec(fStr);
                        var regM = RegExp.$1;
                        var dre = /[^d]*(dd)[^d]*/gi;
                        dre.exec(fStr);
                        var regD = RegExp.$1;
                        var hre = /[^h]*(hh)[^h]*/gi;
                        hre.exec(fStr);
                        var regH = RegExp.$1;
                        var mire = /[^m]*(mm)[^i]*/g;
                        mire.exec(fStr);
                        var regMI = RegExp.$1;
                        var sre = /[^s]*(ss)[^s]*/gi;
                        sre.exec(fStr);
                        var regS = RegExp.$1;
                        var dwre = /[^d]*(dw)[^w]*/gi;
                        dwre.exec(fStr);
                        var regDW = RegExp.$1;

                        if (regY === "yyyy") {
                            fStr = fStr.replace(regY, right(nY, regY.length));
                        }
                        if (regM === "MM") {
                            if (regM.length == 1) nM = d.getMonth() + 1;
                            fStr = fStr.replace(regM, nM);
                        }
                        if (regD === "dd") {
                            if (regD.length == 1) nD = d.getDate();
                            fStr = fStr.replace(regD, nD);
                        }
                        if (regH === "hh") {
                            fStr = fStr.replace(regH, nH);
                        }
                        if (regMI === "mm") {
                            fStr = fStr.replace(regMI, nMM);
                        }
                        if (regS === "ss") {
                            fStr = fStr.replace(regS, nS);
                        }
                        if (regDW == "dw") {
                            fStr = fStr.replace(regDW, info.weekNames[nDW].label);
                        }
                        return fStr;
                    }();
                } else {
                    return d;
                }
            }
        }

        /**
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
         */
        function dday(d, cond) {
            var memoryDay = date(d),
                DyMilli = 1000 * 60 * 60 * 24,
                today = new Date(),
                diffnum,
                thisYearMemoryDay;

            function getDayTime(_d) {
                return Math.floor(_d.getTime() / DyMilli) * DyMilli;
            }

            if (typeof cond === "undefined") {
                diffnum = number((getDayTime(memoryDay) - getDayTime(today)) / DyMilli, { floor: true });
                return diffnum;
            } else {
                diffnum = number((getDayTime(memoryDay) - getDayTime(today)) / DyMilli, { floor: true });
                if (cond["today"]) {
                    today = date(cond.today);
                    diffnum = number((getDayTime(memoryDay) - getDayTime(today)) / DyMilli, { floor: true });
                }
                if (cond["thisYear"]) {
                    thisYearMemoryDay = new Date(today.getFullYear(), memoryDay.getMonth(), memoryDay.getDate());
                    diffnum = number((getDayTime(thisYearMemoryDay) - getDayTime(today)) / DyMilli, { floor: true });
                    if (diffnum < 0) {
                        thisYearMemoryDay = new Date(today.getFullYear() + 1, memoryDay.getMonth(), memoryDay.getDate());
                        diffnum = number((getDayTime(thisYearMemoryDay) - getDayTime(today)) / DyMilli, { floor: true });
                    }
                }
                if (cond["age"]) {
                    thisYearMemoryDay = new Date(today.getFullYear(), memoryDay.getMonth(), memoryDay.getDate());
                    diffnum = thisYearMemoryDay.getFullYear() - memoryDay.getFullYear();
                }

                return diffnum;
            }
        }

        /**
         * 인자인 날짜가 몇년 몇월의 몇번째 주차인지 반환합니다.
         * @method ax5.util.weeksOfMonth
         * @param {String|Data} d
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.weeksOfMonth("2015-10-01"); // {year: 2015, month: 10, count: 1}
         * ax5.util.weeksOfMonth("2015-09-19"); // {year: 2015, month: 10, count: 1}
         * ```
         */
        function weeksOfMonth(d) {
            var myDate = date(d);
            return {
                year: myDate.getFullYear(),
                month: myDate.getMonth() + 1,
                count: parseInt(myDate.getDate() / 7 + 1)
            };
        }

        /**
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
         */
        function daysOfMonth(y, m) {
            if (m == 3 || m == 5 || m == 8 || m == 10) {
                return 30;
            } else if (m == 1) {
                return y % 4 == 0 && y % 100 != 0 || y % 400 == 0 ? 29 : 28;
            } else {
                return 31;
            }
        }

        /**
         * 원하는 횟수 만큼 자릿수 맞춤 문자열을 포함한 문자열을 반환합니다.
         * @method ax5.util.setDigit
         * @param {String|Number} num
         * @param {Number} length
         * @param {String} [padder=0]
         * @param {Number} [radix]
         * @returns {String}
         */
        function setDigit(num, length, padder, radix) {
            var s = num.toString(radix || 10);
            return times(padder || '0', length - s.length) + s;
        }

        function times(s, count) {
            return count < 1 ? '' : new Array(count + 1).join(s);
        }

        /**
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
         * console.log(
         *    ax5.util.findParentNode(e.target, {tagname:"a", clazz:"ax-menu-handel", "data-custom-attr":"attr_value"})
         * );
         * // cond 함수로 처리하기
         * jQuery('#id').bind("click.app_expand", function(e){
        * 	var target = ax5.util.findParentNode(e.target, function(target){
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
         */

        function findParentNode(_target, cond) {
            if (_target) {
                while (function () {
                    var result = true;
                    if (typeof cond === "undefined") {
                        _target = _target.parentNode ? _target.parentNode : false;
                    } else if (isFunction(cond)) {
                        result = cond(_target);
                    } else if (isObject(cond)) {
                        for (var k in cond) {
                            if (k === "tagname") {
                                if (_target.tagName.toLocaleLowerCase() != cond[k]) {
                                    result = false;
                                    break;
                                }
                            } else if (k === "clazz" || k === "class_name") {
                                if ("className" in _target) {
                                    var klasss = _target.className.split(reClassNameSplit);
                                    var hasClass = false;
                                    for (var a = 0; a < klasss.length; a++) {
                                        if (klasss[a] == cond[k]) {
                                            hasClass = true;
                                            break;
                                        }
                                    }
                                    result = hasClass;
                                } else {
                                    result = false;
                                    break;
                                }
                            } else {
                                // 그외 속성값들.
                                if (_target.getAttribute) {
                                    if (_target.getAttribute(k) != cond[k]) {
                                        result = false;
                                        break;
                                    }
                                } else {
                                    result = false;
                                    break;
                                }
                            }
                        }
                    }
                    return !result;
                }()) {
                    if (_target.parentNode && _target.parentNode.parentNode) {
                        _target = _target.parentNode;
                    } else {
                        _target = false;
                        break;
                    }
                }
            }
            return _target;
        }

        /**
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
         */
        function cssNumber(val) {
            var re = /\D?(\d+)([a-zA-Z%]*)/i,
                found = ('' + val).match(re),
                unit = found[2] || "px";

            return found[1] + unit;
        }

        /**
         * @method ax5.util.css
         * @param {Object|String} val - CSSString or CSSObject
         * @returns {String|Object}
         * @example
         * ```
         * console.log(ax5.util.css({background: "#ccc", padding: "50px", width: "100px"}));
         * console.log(ax5.util.css('width:100px;padding: 50px; background: #ccc'));
         * ```
         */
        function css(val) {
            var returns;
            if (isObject(val)) {
                returns = '';
                for (var k in val) {
                    returns += k + ':' + val[k] + ';';
                }
                return returns;
            } else if (isString(val)) {
                returns = {};
                var valSplited = val.split(/[ ]*;[ ]*/g);
                valSplited.forEach(function (v) {
                    if ((v = v.trim()) !== "") {
                        var vSplited = v.split(/[ ]*:[ ]*/g);
                        returns[vSplited[0]] = vSplited[1];
                    }
                });
                return returns;
            }
        }

        /**
         * @method ax5.util.stopEvent
         * @param {Event} e
         * @example
         * ```
         * ax5.util.stopEvent(e);
         * ```
         */
        function stopEvent(e) {
            // 이벤트 중지 구문
            if (!e) var e = window.event;

            //e.cancelBubble is supported by IE -
            // this will kill the bubbling process.
            e.cancelBubble = true;
            e.returnValue = false;

            //e.stopPropagation works only in Firefox.
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            return false;
            // 이벤트 중지 구문 끝
        }

        /**
         * @method ax5.util.selectRange
         * @param {Element} el
         * @param {Element} offset
         * @example
         * ```
         * ax5.util.selectRange($("#select-test-0")); // selectAll
         * ax5.util.selectRange($("#select-test-0"), "selectAll"); //selectAll
         * ax5.util.selectRange($("#select-test-0"), "start"); // focus on start
         * ax5.util.selectRange($("#select-test-0"), "end"); // focus on end
         * ax5.util.selectRange($("#select-test-0"), [1, 5]); // select 1~5
         * ```
         */
        var selectRange = function () {
            var processor = {
                'textRange': {
                    'selectAll': function selectAll(el, range, offset) {},
                    'arr': function arr(el, range, offset) {
                        range.moveStart("character", offset[0]); // todo ie node select 체크필요
                        range.collapse();
                        range.moveEnd("character", offset[1]);
                    },
                    'start': function start(el, range, offset) {
                        range.moveStart("character", 0);
                        range.collapse();
                    },
                    'end': function end(el, range, offset) {
                        range.moveStart("character", range.text.length);
                        range.collapse();
                    }
                },
                'range': {
                    'selectAll': function selectAll(el, range, offset) {
                        range.selectNodeContents(el);
                    },
                    'arr': function arr(el, range, offset) {
                        if (isObject(offset[0])) {
                            range.setStart(offset[0].node, offset[0].offset);
                            range.setEnd(offset[1].node, offset[1].offset);
                        } else {
                            range.setStart(el.firstChild, offset[0]);
                            range.setEnd(el.firstChild, offset[1]);
                        }
                    },
                    'start': function start(el, range, offset) {
                        range.selectNodeContents(el);
                        range.collapse(true);
                    },
                    'end': function end(el, range, offset) {
                        range.selectNodeContents(el);
                        range.collapse(false);
                    }
                }
            };
            return function (el, offset) {
                var range, rangeType, selection;

                if (el instanceof jQuery) {
                    el = el.get(0);
                }
                if (!el) return;

                // 레인지 타입 선택
                if (doc.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(el);
                    rangeType = "textRange";
                } else if (window.getSelection) {
                    selection = window.getSelection();
                    range = document.createRange();
                    rangeType = "range";
                }

                // range 적용
                if (typeof offset == "undefined") {
                    processor[rangeType].selectAll.call(this, el, range, offset);
                } else if (isArray(offset)) {
                    processor[rangeType].arr.call(this, el, range, offset);
                } else {
                    for (var key in processor[rangeType]) {
                        if (offset == key) {
                            processor[rangeType][key].call(this, el, range, offset);
                            break;
                        }
                    }
                }

                // 포커스 및 셀렉트
                if (doc.body.createTextRange) {
                    range.select();
                    el.focus();
                } else if (window.getSelection) {
                    el.focus();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            };
        }();

        /**
         * @method ax5.util.debounce
         * @param {Function} func
         * @param {Number} wait
         * @param {Boolean} immediately
         * @returns {debounced}
         * @example
         * ```js
         * var debounceFn = ax5.util.debounce(function( val ) { console.log(val); }, 300);
         * $(document.body).click(function(){
         *  debounceFn(new Date());
         * });
         * ```
         */
        var debounce = function debounce(func, wait, immediately) {
            var timeout, removeTimeout;
            var debounced = function debounced() {
                var args = toArray(arguments);

                if (removeTimeout) clearTimeout(removeTimeout);
                if (timeout) {
                    // 두번째 호출
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(function (args) {
                        func.apply(this, args);
                    }.bind(this, args), wait);
                } else {
                    // 첫 호출
                    timeout = setTimeout(function (args) {
                        func.apply(this, args);
                    }.bind(this, args), immediately ? 0 : wait);
                }
                removeTimeout = setTimeout(function () {
                    clearTimeout(timeout);
                    timeout = null;
                }, wait);
            };
            debounced.cancel = function () {
                clearTimeout(timeout);
                clearTimeout(removeTimeout);
                timeout = null;
            };

            return debounced;
        };

        /**
         * @method ax5.util.deepCopy
         * @param {Object} obj
         * @returns {Object}
         * @example
         * ```js
         * var obj = [
         *  {name:"A", child:[{name:"a-1"}]},
         *  {name:"B", child:[{name:"b-1"}], callBack: function(){ console.log('callBack'); }}
         * ];
         * var copiedObj = ax5.util.deepCopy(obj)
         * ```
         */
        function deepCopy(obj) {
            var r, l;
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
                if (U.isArray(obj)) {
                    l = obj.length;
                    r = new Array(l);
                    for (var i = 0; i < l; i++) {
                        r[i] = deepCopy(obj[i]);
                    }
                    return r;
                } else {
                    return jQuery.extend({}, obj);
                }
            }
            return obj;
        }

        return {
            alert: alert,
            each: each,
            map: map,
            search: search,
            reduce: reduce,
            reduceRight: reduceRight,
            filter: filter,
            sum: sum,
            avg: avg,
            toJson: toJson,
            parseJson: parseJson,
            first: first,
            last: last,
            deepCopy: deepCopy,

            left: left,
            right: right,
            getType: getType,
            isWindow: isWindow,
            isElement: isElement,
            isObject: isObject,
            isArray: isArray,
            isFunction: isFunction,
            isString: isString,
            isNumber: isNumber,
            isNodelist: isNodelist,
            isUndefined: isUndefined,
            isNothing: isNothing,
            setCookie: setCookie,
            getCookie: getCookie,
            camelCase: camelCase,
            snakeCase: snakeCase,
            number: number,
            toArray: toArray,
            merge: merge,
            param: param,
            error: error,
            date: date,
            dday: dday,
            daysOfMonth: daysOfMonth,
            weeksOfMonth: weeksOfMonth,
            setDigit: setDigit,
            times: times,
            findParentNode: findParentNode,
            cssNumber: cssNumber,
            css: css,
            isDate: isDate,
            isDateFormat: isDateFormat,
            stopEvent: stopEvent,
            selectRange: selectRange,
            debounce: debounce
        };
    }();

    if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
        module.exports = ax5;
    } else {
        root.ax5 = function () {
            return ax5;
        }(); // ax5.ui에 연결
    }
}).call(typeof window !== "undefined" ? window : undefined);

ax5.def = {};
ax5.info.errorMsg["ax5dialog"] = {
    "501": "Duplicate call error"
};

ax5.info.errorMsg["ax5picker"] = {
    "401": "Can not find target element",
    "402": "Can not find boundID",
    "501": "Can not find content key"
};

ax5.info.errorMsg["single-uploader"] = {
    "460": "There are no files to be uploaded.",
    "461": "There is no uploaded files."
};

ax5.info.errorMsg["ax5calendar"] = {
    "401": "Can not find target element"
};

ax5.info.errorMsg["ax5formatter"] = {
    "401": "Can not find target element",
    "402": "Can not find boundID",
    "501": "Can not find pattern"
};

ax5.info.errorMsg["ax5menu"] = {
    "501": "Can not find menu item"
};

ax5.info.errorMsg["ax5select"] = {
    "401": "Can not find target element",
    "402": "Can not find boundID",
    "501": "Can not find option"
};

ax5.info.errorMsg["ax5combobox"] = {
    "401": "Can not find target element",
    "402": "Can not find boundID",
    "501": "Can not find option"
};
// 필수 Ployfill 확장 구문
(function () {
    'use strict';

    var root = this,
        re_trim = /^\s*|\s*$/g;

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = function () {
            var hwp = Object.prototype.hasOwnProperty,
                hdeb = !{ toString: null }.propertyIsEnumerable('toString'),
                de = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
                del = de.length;

            return function (obj) {
                if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) throw new TypeError('type err');
                var r = [],
                    prop,
                    i;
                for (prop in obj) {
                    if (hwp.call(obj, prop)) r.push(prop);
                }if (hdeb) {
                    for (i = 0; i < del; i++) {
                        if (hwp.call(obj, de[i])) r.push(de[i]);
                    }
                }
                return r;
            };
        }();
    }

    // ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
    // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fun /*, thisp */) {
            if (this === void 0 || this === null) {
                throw TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") {
                throw TypeError();
            }
            var thisp = arguments[1],
                i;
            for (i = 0; i < len; i++) {
                if (i in t) {
                    fun.call(thisp, t[i], i, t);
                }
            }
        };
    }

    // ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (o) {
            if (typeof this !== 'function') {
                throw TypeError("function");
            }
            var slice = [].slice,
                args = slice.call(arguments, 1),
                self = this,
                bound = function bound() {
                return self.apply(this instanceof nop ? this : o, args.concat(slice.call(arguments)));
            };

            function nop() {}

            nop.prototype = self.prototype;
            bound.prototype = new nop();
            return bound;
        };
    }

    /*global document */
    /**
     * define document.querySelector & document.querySelectorAll for IE7
     *
     * A not very fast but small hack. The approach is taken from
     * http://weblogs.asp.net/bleroy/archive/2009/08/31/queryselectorall-on-old-ie-versions-something-that-doesn-t-work.aspx
     *
     */
    (function () {
        if (document.querySelectorAll || document.querySelector) {
            return;
        }
        if (!document.createStyleSheet) return;
        var style = document.createStyleSheet(),
            select = function select(selector, maxCount) {
            var all = document.all,
                l = all.length,
                i,
                resultSet = [];

            style.addRule(selector, "foo:bar");
            for (i = 0; i < l; i += 1) {
                if (all[i].currentStyle.foo === "bar") {
                    resultSet.push(all[i]);
                    if (resultSet.length > maxCount) {
                        break;
                    }
                }
            }
            style.removeRule(0);
            return resultSet;
        };

        document.querySelectorAll = function (selector) {
            return select(selector, Infinity);
        };
        document.querySelector = function (selector) {
            return select(selector, 1)[0] || null;
        };
    })();

    if (!String.prototype.trim) {
        (function () {
            String.prototype.trim = function () {
                return this.replace(re_trim, '');
            };
        })();
    }

    if (!window.JSON) {
        window.JSON = {
            parse: function parse(sJSON) {
                return new Function('', 'return ' + sJSON)();
            },
            stringify: function () {
                var r = /["]/g,
                    _f;
                return _f = function f(vContent) {
                    var result, i, j;
                    switch (result = typeof vContent === 'undefined' ? 'undefined' : _typeof(vContent)) {
                        case 'string':
                            return '"' + vContent.replace(r, '\\"') + '"';
                        case 'number':
                        case 'boolean':
                            return vContent.toString();
                        case 'undefined':
                            return 'undefined';
                        case 'function':
                            return '""';
                        case 'object':
                            if (!vContent) return 'null';
                            result = '';
                            if (vContent.splice) {
                                for (i = 0, j = vContent.length; i < j; i++) {
                                    result += ',' + _f(vContent[i]);
                                }return '[' + result.substr(1) + ']';
                            } else {
                                for (i in vContent) {
                                    if (vContent.hasOwnProperty(i) && vContent[i] !== undefined && typeof vContent[i] != 'function') result += ',"' + i + '":' + _f(vContent[i]);
                                }return '{' + result.substr(1) + '}';
                            }
                    }
                };
            }()
        };
    }

    // splice ie8 <= polyfill
    (function () {
        if (!document.documentMode || document.documentMode >= 9) return false;
        var _splice = Array.prototype.splice;
        Array.prototype.splice = function () {
            var args = Array.prototype.slice.call(arguments);
            if (typeof args[1] === "undefined") args[1] = this.length - args[0];
            return _splice.apply(this, args);
        };
    })();

    /**
     * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
     * on host objects like NamedNodeMap, NodeList, and HTMLCollection
     * (technically, since host objects have been implementation-dependent,
     * at least before ES6, IE hasn't needed to work this way).
     * Also works on strings, fixes IE < 9 to allow an explicit undefined
     * for the 2nd argument (as in Firefox), and prevents errors when
     * called on other DOM objects.
     */
    (function () {
        'use strict';

        var _slice = Array.prototype.slice;

        try {
            // Can't be used with DOM elements in IE < 9
            _slice.call(document.documentElement);
        } catch (e) {
            // Fails in IE < 9
            // This will work for genuine arrays, array-like objects,
            // NamedNodeMap (attributes, entities, notations),
            // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
            // and will not fail on other DOM objects (as do DOM elements in IE < 9)
            Array.prototype.slice = function (begin, end) {
                // IE < 9 gets unhappy with an undefined end argument
                end = typeof end !== 'undefined' ? end : this.length;

                // For native Array objects, we use the native slice function
                if (Object.prototype.toString.call(this) === '[object Array]') {
                    return _slice.call(this, begin, end);
                }

                // For array like object we handle it ourselves.
                var i,
                    cloned = [],
                    size,
                    len = this.length;

                // Handle negative value for "begin"
                var start = begin || 0;
                start = start >= 0 ? start : Math.max(0, len + start);

                // Handle negative value for "end"
                var upTo = typeof end == 'number' ? Math.min(end, len) : len;
                if (end < 0) {
                    upTo = len + end;
                }

                // Actual expected size of the slice
                size = upTo - start;

                if (size > 0) {
                    cloned = new Array(size);
                    if (this.charAt) {
                        for (i = 0; i < size; i++) {
                            cloned[i] = this.charAt(start + i);
                        }
                    } else {
                        for (i = 0; i < size; i++) {
                            cloned[i] = this[start + i];
                        }
                    }
                }

                return cloned;
            };
        }
    })();

    // Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
    // Make it safe to do console.log() always.
    (function (con) {
        var prop, method;
        var empty = {};
        var dummy = function dummy() {};
        var properties = 'memory'.split(',');
        var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
        while (prop = properties.pop()) {
            con[prop] = con[prop] || empty;
        }while (method = methods.pop()) {
            con[method] = con[method] || dummy;
        }
    })(window.console || {}); // Using `this` for web workers.

    // extend innerWidth ..
    var html = document.getElementsByTagName('html')[0];
    var body = document.getElementsByTagName('body')[0];

    if (!window.innerWidth) window.innerWidth = html.clientWidth;
    if (!window.innerHeight) window.innerHeight = html.clientHeight;
    if (!window.scrollX) window.scrollX = window.pageXOffset || html.scrollLeft;
    if (!window.scrollY) window.scrollY = window.pageYOffset || html.scrollTop;
}).call(window);
/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.ui
 */

/**
 * @class ax5.ui.root
 * @classdesc ax5 ui class
 * @author tom@axisj.com
 * @example
 * ```
 * var myui = new ax5.ui.root();
 * ```
 */
ax5.ui = function () {

    function axUi() {
        this.config = {};
        this.name = "root";

        /**
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
         */
        this.setConfig = function (cfg, callInit) {
            jQuery.extend(true, this.config, cfg);
            if (typeof callInit == "undefined" || callInit === true) {
                this.init();
            }
            return this;
        };
        this.init = function () {
            console.log(this.config);
        };

        this.bindWindowResize = function (callBack) {
            setTimeout(function () {
                jQuery(window).resize(function () {
                    if (this.bindWindowResize__) clearTimeout(this.bindWindowResize__);
                    this.bindWindowResize__ = setTimeout(function () {
                        callBack.call(this);
                    }.bind(this), 10);
                }.bind(this));
            }.bind(this), 100);
        };

        this.stopEvent = function (e) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
            return false;
        };

        this.toString = function () {
            return this.name + '@' + this.version;
        };

        // instance init
        this.main = function () {}.apply(this, arguments);
    }

    /**
     * @method ax5.ui.addClass
     * @param {Object} config
     * @param {String} config.className - name of Class
     * @param {String} [config.version=""] - version of Class
     * @param {Object} [config.classStore=ax5.ui] - 클래스가 저장될 경로
     * @param {Function} [config.superClass=ax5.ui.root]
     * @param {Function} cls - Class Function
     */
    function addClass(config, cls) {
        if (!config || !config.className) throw 'invalid call';
        var classStore = config.classStore ? config.classStore : ax5.ui;
        if (!classStore) throw 'invalid classStore';

        // make ui definition variable
        ax5.def[config.className] = {
            version: config.version
        };

        var factory = function factory(cls, arg) {
            switch (arg.length) {
                case 0:
                    return new cls();
                    break;
                case 1:
                    return new cls(arg[0]);
                    break;
                case 2:
                    return new cls(arg[0], arg[1]);
                    break;
                case 3:
                    return new cls(arg[0], arg[1], arg[2]);
                    break;
            }
        };
        var initInstance = function initInstance(name, version, instance) {
            instance.name = name;
            instance.version = version;
            instance.instanceId = ax5.getGuid();
            return instance;
        };
        var initPrototype = function initPrototype(cls) {
            var superClass = config.superClass ? config.superClass : ax5.ui.root;
            if (!ax5.util.isFunction(superClass)) throw 'invalid superClass';
            superClass.call(this); // 부모호출
            cls.prototype = new superClass(); // 상속
        };
        var wrapper = function wrapper() {
            if (!this || !(this instanceof wrapper)) throw 'invalid call';
            var instance = factory(cls, arguments);
            return initInstance(config.className, config.version || "", instance);
        };
        initPrototype.call(this, cls);
        classStore[config.className] = wrapper;
    }

    return {
        root: axUi,
        addClass: addClass
    };
}();

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 * https://github.com/thomasJang/mustache.js -- imporove some variables
 */

(function defineMustache(global, factory) {

    factory(global.mustache = {});
})(window.ax5, function mustacheFactory(mustache) {

    var objectToString = Object.prototype.toString;
    var isArray = Array.isArray || function isArrayPolyfill(object) {
        return objectToString.call(object) === '[object Array]';
    };

    function isFunction(object) {
        return typeof object === 'function';
    }

    /**
     * More correct typeof string handling array
     * which normally returns typeof 'object'
     */
    function typeStr(obj) {
        return isArray(obj) ? 'array' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    }

    function escapeRegExp(string) {
        return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    }

    /**
     * Null safe way of checking whether or not an object,
     * including its prototype, has a given property
     */
    function hasProperty(obj, propName) {
        return obj != null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && propName in obj;
    }

    // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
    // See https://github.com/janl/mustache.js/issues/189
    var regExpTest = RegExp.prototype.test;

    function testRegExp(re, string) {
        return regExpTest.call(re, string);
    }

    var nonSpaceRe = /\S/;

    function isWhitespace(string) {
        return !testRegExp(nonSpaceRe, string);
    }

    var entityMap = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function fromEntityMap(s) {
            return entityMap[s];
        });
    }

    var whiteRe = /\s*/;
    var spaceRe = /\s+/;
    var equalsRe = /\s*=/;
    var curlyRe = /\s*\}/;
    var tagRe = /#|\^|\/|>|\{|&|=|!/;

    /**
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
     */
    function parseTemplate(template, tags) {
        if (!template) return [];

        var sections = []; // Stack to hold section tokens
        var tokens = []; // Buffer to hold the tokens
        var spaces = []; // Indices of whitespace tokens on the current line
        var hasTag = false; // Is there a {{tag}} on the current line?
        var nonSpace = false; // Is there a non-space char on the current line?

        // Strips all whitespace tokens array for the current line
        // if there was a {{#tag}} on it and otherwise only space.
        function stripSpace() {
            if (hasTag && !nonSpace) {
                while (spaces.length) {
                    delete tokens[spaces.pop()];
                }
            } else {
                spaces = [];
            }

            hasTag = false;
            nonSpace = false;
        }

        var openingTagRe, closingTagRe, closingCurlyRe;

        function compileTags(tagsToCompile) {
            if (typeof tagsToCompile === 'string') tagsToCompile = tagsToCompile.split(spaceRe, 2);

            if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) throw new Error('Invalid tags: ' + tagsToCompile);

            openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
            closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
            closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
        }

        compileTags(tags || mustache.tags);

        var scanner = new Scanner(template);

        var start, type, value, chr, token, openSection;
        while (!scanner.eos()) {
            start = scanner.pos;

            // Match any text between tags.
            value = scanner.scanUntil(openingTagRe);

            if (value) {
                for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
                    chr = value.charAt(i);

                    if (isWhitespace(chr)) {
                        spaces.push(tokens.length);
                    } else {
                        nonSpace = true;
                    }

                    tokens.push(['text', chr, start, start + 1]);
                    start += 1;

                    // Check for whitespace on the current line.
                    if (chr === '\n') stripSpace();
                }
            }

            // Match the opening tag.
            if (!scanner.scan(openingTagRe)) break;

            hasTag = true;

            // Get the tag type.
            type = scanner.scan(tagRe) || 'name';
            scanner.scan(whiteRe);

            // Get the tag value.
            if (type === '=') {
                value = scanner.scanUntil(equalsRe);
                scanner.scan(equalsRe);
                scanner.scanUntil(closingTagRe);
            } else if (type === '{') {
                value = scanner.scanUntil(closingCurlyRe);
                scanner.scan(curlyRe);
                scanner.scanUntil(closingTagRe);
                type = '&';
            } else {
                value = scanner.scanUntil(closingTagRe);
            }

            // Match the closing tag.
            if (!scanner.scan(closingTagRe)) throw new Error('Unclosed tag at ' + scanner.pos);

            token = [type, value, start, scanner.pos];
            tokens.push(token);

            if (type === '#' || type === '^') {
                sections.push(token);
            } else if (type === '/') {
                // Check section nesting.
                openSection = sections.pop();

                if (!openSection) throw new Error('Unopened section "' + value + '" at ' + start);

                if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
            } else if (type === 'name' || type === '{' || type === '&') {
                nonSpace = true;
            } else if (type === '=') {
                // Set the tags for the next time around.
                compileTags(value);
            }
        }

        // Make sure there are no open sections when we're done.
        openSection = sections.pop();

        if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

        return nestTokens(squashTokens(tokens));
    }

    /**
     * Combines the values of consecutive text tokens in the given `tokens` array
     * to a single token.
     */
    function squashTokens(tokens) {
        var squashedTokens = [];

        var token, lastToken;
        for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
            token = tokens[i];

            if (token) {
                if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
                    lastToken[1] += token[1];
                    lastToken[3] = token[3];
                } else {
                    squashedTokens.push(token);
                    lastToken = token;
                }
            }
        }

        return squashedTokens;
    }

    /**
     * Forms the given array of `tokens` into a nested tree structure where
     * tokens that represent a section have two additional items: 1) an array of
     * all tokens that appear in that section and 2) the index in the original
     * template that represents the end of that section.
     */
    function nestTokens(tokens) {
        var nestedTokens = [];
        var collector = nestedTokens;
        var sections = [];

        var token, section;
        for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
            token = tokens[i];

            switch (token[0]) {
                case '#':
                case '^':
                    collector.push(token);
                    sections.push(token);
                    collector = token[4] = [];
                    break;
                case '/':
                    section = sections.pop();
                    section[5] = token[2];
                    collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
                    break;
                default:
                    collector.push(token);
            }
        }

        return nestedTokens;
    }

    /**
     * A simple string scanner that is used by the template parser to find
     * tokens in template strings.
     */
    function Scanner(string) {
        this.string = string;
        this.tail = string;
        this.pos = 0;
    }

    /**
     * Returns `true` if the tail is empty (end of string).
     */
    Scanner.prototype.eos = function eos() {
        return this.tail === '';
    };

    /**
     * Tries to match the given regular expression at the current position.
     * Returns the matched text if it can match, the empty string otherwise.
     */
    Scanner.prototype.scan = function scan(re) {
        var match = this.tail.match(re);

        if (!match || match.index !== 0) return '';

        var string = match[0];

        this.tail = this.tail.substring(string.length);
        this.pos += string.length;

        return string;
    };

    /**
     * Skips all text until the given regular expression can be matched. Returns
     * the skipped string, which is the entire tail if no match can be made.
     */
    Scanner.prototype.scanUntil = function scanUntil(re) {
        var index = this.tail.search(re),
            match;

        switch (index) {
            case -1:
                match = this.tail;
                this.tail = '';
                break;
            case 0:
                match = '';
                break;
            default:
                match = this.tail.substring(0, index);
                this.tail = this.tail.substring(index);
        }

        this.pos += match.length;

        return match;
    };

    /**
     * Represents a rendering context by wrapping a view object and
     * maintaining a reference to the parent context.
     */
    function Context(view, parentContext) {
        this.view = view;
        this.cache = {
            '.': this.view,
            '@each': function each() {
                var returns = [];
                for (var k in this) {
                    returns.push({ '@key': k, '@value': this[k] });
                }
                return returns;
            }
        };
        this.parent = parentContext;
    }

    /**
     * Creates a new context using the given view with this context
     * as the parent.
     */
    Context.prototype.push = function push(view) {
        return new Context(view, this);
    };

    /**
     * Returns the value of the given name in this context, traversing
     * up the context hierarchy if the value is absent in this context's view.
     */
    Context.prototype.lookup = function lookup(name) {
        var cache = this.cache;

        var value;
        if (cache.hasOwnProperty(name)) {
            value = cache[name];
        } else {
            var context = this,
                names,
                index,
                lookupHit = false;

            while (context) {
                if (name.indexOf('.') > 0) {
                    value = context.view;
                    names = name.split('.');
                    index = 0;

                    /**
                     * Using the dot notion path in `name`, we descend through the
                     * nested objects.
                     *
                     * To be certain that the lookup has been successful, we have to
                     * check if the last object in the path actually has the property
                     * we are looking for. We store the result in `lookupHit`.
                     *
                     * This is specially necessary for when the value has been set to
                     * `undefined` and we want to avoid looking up parent contexts.
                     **/
                    while (value != null && index < names.length) {
                        if (index === names.length - 1) lookupHit = hasProperty(value, names[index]);

                        value = value[names[index++]];
                    }
                } else {
                    value = context.view[name];
                    lookupHit = hasProperty(context.view, name);
                }

                if (lookupHit) break;

                context = context.parent;
            }

            cache[name] = value;
        }

        if (isFunction(value)) value = value.call(this.view);

        return value;
    };

    /**
     * A Writer knows how to take a stream of tokens and render them to a
     * string, given a context. It also maintains a cache of templates to
     * avoid the need to parse the same template twice.
     */
    function Writer() {
        this.cache = {};
    }

    /**
     * Clears all cached templates in this writer.
     */
    Writer.prototype.clearCache = function clearCache() {
        this.cache = {};
    };

    /**
     * Parses and caches the given `template` and returns the array of tokens
     * that is generated from the parse.
     */
    Writer.prototype.parse = function parse(template, tags) {
        var cache = this.cache;
        var tokens = cache[template];

        if (tokens == null) tokens = cache[template] = parseTemplate(template, tags);

        return tokens;
    };

    /**
     * High-level method that is used to render the given `template` with
     * the given `view`.
     *
     * The optional `partials` argument may be an object that contains the
     * names and templates of partials that are used in the template. It may
     * also be a function that is used to load partial templates on the fly
     * that takes a single argument: the name of the partial.
     */
    Writer.prototype.render = function render(template, view, partials) {
        var tokens = this.parse(template);
        var context = view instanceof Context ? view : new Context(view);
        return this.renderTokens(tokens, context, partials, template);
    };

    /**
     * Low-level method that renders the given array of `tokens` using
     * the given `context` and `partials`.
     *
     * Note: The `originalTemplate` is only ever used to extract the portion
     * of the original template that was contained in a higher-order section.
     * If the template doesn't use higher-order sections, this argument may
     * be omitted.
     */
    Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate) {
        var buffer = '';
        var token, symbol, value;
        for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
            value = undefined;
            token = tokens[i];
            symbol = token[0];

            if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);else if (symbol === '&') value = this.unescapedValue(token, context);else if (symbol === 'name') value = this.escapedValue(token, context);else if (symbol === 'text') value = this.rawValue(token);

            if (value !== undefined) buffer += value;
        }

        return buffer;
    };

    Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate) {
        var self = this;
        var buffer = '';

        var value = context.lookup(token[1]);

        // This function is used to render an arbitrary template
        // in the current context by higher-order sections.
        function subRender(template) {
            return self.render(template, context, partials);
        }

        if (!value) return;

        if (isArray(value)) {
            for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
                if (value[j]) {
                    value[j]['@i'] = j;
                    value[j]['@first'] = j === 0;
                    buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
                }
            }
        } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'string' || typeof value === 'number') {
            buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
        } else if (isFunction(value)) {
            if (typeof originalTemplate !== 'string') throw new Error('Cannot use higher-order sections without the original template');

            // Extract the portion of the original template that the section contains.
            value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

            if (value != null) buffer += value;
        } else {
            buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }
        return buffer;
    };

    Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate) {
        var value = context.lookup(token[1]);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || isArray(value) && value.length === 0) return this.renderTokens(token[4], context, partials, originalTemplate);
    };

    Writer.prototype.renderPartial = function renderPartial(token, context, partials) {
        if (!partials) return;

        var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
        if (value != null) return this.renderTokens(this.parse(value), context, partials, value);
    };

    Writer.prototype.unescapedValue = function unescapedValue(token, context) {
        var value = context.lookup(token[1]);
        if (value != null) return value;
    };

    Writer.prototype.escapedValue = function escapedValue(token, context) {
        var value = context.lookup(token[1]);
        if (value != null) return mustache.escape(value);
    };

    Writer.prototype.rawValue = function rawValue(token) {
        return token[1];
    };

    mustache.name = 'mustache.js';
    mustache.version = '2.1.3';
    mustache.tags = ['{{', '}}'];

    // All high-level mustache.* functions use this writer.
    var defaultWriter = new Writer();

    /**
     * Clears all cached templates in the default writer.
     */
    mustache.clearCache = function clearCache() {
        return defaultWriter.clearCache();
    };

    /**
     * Parses and caches the given template in the default writer and returns the
     * array of tokens it contains. Doing this ahead of time avoids the need to
     * parse templates on the fly as they are rendered.
     */
    mustache.parse = function parse(template, tags) {
        return defaultWriter.parse(template, tags);
    };

    /**
     * Renders the `template` with the given `view` and `partials` using the
     * default writer.
     */
    mustache.render = function render(template, view, partials) {
        if (typeof template !== 'string') {
            throw new TypeError('Invalid template! Template should be a "string" ' + 'but "' + typeStr(template) + '" was given as the first ' + 'argument for mustache#render(template, view, partials)');
        }

        return defaultWriter.render(template, view, partials);
    };

    // This is here for backwards compatibility with 0.4.x.,
    /*eslint-disable */ // eslint wants camel cased function name
    mustache.to_html = function to_html(template, view, partials, send) {
        /*eslint-enable*/

        var result = mustache.render(template, view, partials);

        if (isFunction(send)) {
            send(result);
        } else {
            return result;
        }
    };

    // Export the escaping function so that the user may override it.
    // See https://github.com/janl/mustache.js/issues/244
    mustache.escape = escapeHtml;

    // Export these mainly for testing, but also for advanced usage.
    mustache.Scanner = Scanner;
    mustache.Context = Context;
    mustache.Writer = Writer;
});
// ax5.ui.dialog
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var DIALOG;

    UI.addClass({
        className: "dialog",
        version: "0.8.6"
    }, function () {
        /**
         * @class ax5dialog
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myDialog = new ax5.ui.dialog();
         * ```
         */
        var ax5dialog = function ax5dialog() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                id: 'ax5-dialog-' + this.instanceId,
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                width: 300,
                title: '',
                msg: '',
                lang: {
                    "ok": "ok", "cancel": "cancel"
                },
                animateTime: 150
            };
            this.activeDialog = null;
            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
                return true;
            },
                getContent = function getContent(dialogId, opts) {
                var data = {
                    dialogId: dialogId,
                    title: opts.title || cfg.title || "",
                    msg: (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>"),
                    input: opts.input,
                    btns: opts.btns,
                    '_crlf': function _crlf() {
                        return this.replace(/\n/g, "<br/>");
                    }
                };

                try {
                    return DIALOG.tmpl.get.call(this, "dialogDisplay", data);
                } finally {
                    data = null;
                }
            },
                open = function open(opts, callback) {
                var pos = {},
                    box;

                opts.id = opts.id || cfg.id;

                box = {
                    width: opts.width
                };
                jQuery(document.body).append(getContent.call(this, opts.id, opts));

                this.activeDialog = jQuery('#' + opts.id);
                this.activeDialog.css({ width: box.width });

                // dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
                opts.height = box.height = this.activeDialog.height();

                //- position 정렬
                if (typeof opts.position === "undefined" || opts.position === "center") {
                    pos.top = jQuery(window).height() / 2 - box.height / 2;
                    pos.left = jQuery(window).width() / 2 - box.width / 2;
                } else {
                    pos.left = opts.position.left || 0;
                    pos.top = opts.position.top || 0;
                }
                if (cfg.zIndex) {
                    pos["z-index"] = cfg.zIndex;
                }
                this.activeDialog.css(pos);

                // bind button event
                if (opts.dialogType === "prompt") {
                    this.activeDialog.find("[data-dialog-prompt]").get(0).focus();
                } else {
                    this.activeDialog.find("[data-dialog-btn]").get(0).focus();
                }

                this.activeDialog.find("[data-dialog-btn]").on(cfg.clickEventName, function (e) {
                    btnOnClick.call(this, e || window.event, opts, callback);
                }.bind(this));

                // bind key event
                jQuery(window).bind("keydown.ax5dialog", function (e) {
                    onKeyup.call(this, e || window.event, opts, callback);
                }.bind(this));

                jQuery(window).bind("resize.ax5dialog", function (e) {
                    align.call(this, e || window.event);
                }.bind(this));

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "open"
                });

                pos = null;
                box = null;
            },
                align = function align(e) {
                if (!this.activeDialog) return this;
                var opts = self.dialogConfig,
                    box = {
                    width: opts.width,
                    height: opts.height
                };
                //- position 정렬
                if (typeof opts.position === "undefined" || opts.position === "center") {
                    box.top = window.innerHeight / 2 - box.height / 2;
                    box.left = window.innerWidth / 2 - box.width / 2;
                } else {
                    box.left = opts.position.left || 0;
                    box.top = opts.position.top || 0;
                }
                if (box.left < 0) box.left = 0;
                if (box.top < 0) box.top = 0;

                this.activeDialog.css(box);

                opts = null;
                box = null;

                return this;
            },
                btnOnClick = function btnOnClick(e, opts, callback, target, k) {
                var that;
                if (e.srcElement) e.target = e.srcElement;

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-dialog-btn")) {
                        return true;
                    }
                });

                if (target) {
                    k = target.getAttribute("data-dialog-btn");

                    that = {
                        self: this,
                        key: k, value: opts.btns[k],
                        dialogId: opts.id,
                        btnTarget: target
                    };
                    if (opts.dialogType === "prompt") {
                        var emptyKey = null;
                        for (var oi in opts.input) {
                            that[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                            if (that[oi] == "" || that[oi] == null) {
                                emptyKey = oi;
                                break;
                            }
                        }
                    }
                    if (opts.btns[k].onClick) {
                        opts.btns[k].onClick.call(that, k);
                    } else if (opts.dialogType === "alert") {
                        if (callback) callback.call(that, k);
                        this.close();
                    } else if (opts.dialogType === "confirm") {
                        if (callback) callback.call(that, k);
                        this.close();
                    } else if (opts.dialogType === "prompt") {
                        if (k === 'ok') {
                            if (emptyKey) {
                                this.activeDialog.find('[data-dialog-prompt="' + emptyKey + '"]').get(0).focus();
                                return false;
                            }
                        }
                        if (callback) callback.call(that, k);
                        this.close();
                    }
                }

                that = null;
                opts = null;
                callback = null;
                target = null;
                k = null;
            },
                onKeyup = function onKeyup(e, opts, callback, target, k) {
                var that,
                    emptyKey = null;

                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                }
                if (opts.dialogType === "prompt") {
                    if (e.keyCode == ax5.info.eventKeys.RETURN) {
                        that = {
                            self: this,
                            key: k, value: opts.btns[k],
                            dialogId: opts.id,
                            btnTarget: target
                        };

                        for (var oi in opts.input) {
                            that[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                            if (that[oi] == "" || that[oi] == null) {
                                emptyKey = oi;
                                break;
                            }
                        }
                        if (emptyKey) {
                            that = null;
                            emptyKey = null;
                            return false;
                        }
                        if (callback) callback.call(that, k);
                        this.close();
                    }
                }

                that = null;
                emptyKey = null;
                opts = null;
                callback = null;
                target = null;
                k = null;
            };

            /**
             * Preferences of dialog UI
             * @method ax5dialog.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Number} [config.zIndex]
             * @returns {ax5dialog}
             * @example
             * ```
             * ```
             */
            //== class body start
            this.init = function () {

                this.onStateChanged = cfg.onStateChanged;
                // this.onLoad = cfg.onLoad;
            };

            /**
             * open the dialog of alert type
             * @method ax5dialog.alert
             * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.alert({
             *  title: 'app title',
             *  msg: 'alert'
             * }, function(){});
             * ```
             */
            this.alert = function (opts, callback, tryCount) {
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }

                if (this.activeDialog) {
                    // try one more
                    if (!tryCount) {
                        setTimeout(function () {
                            this.alert(opts, callback, 1);
                        }.bind(this), Number(cfg.animateTime) + 100);
                    } else {
                        console.log(ax5.info.getError("ax5dialog", "501", "alert"));
                    }
                    return this;
                }

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                opts.dialogType = "alert";
                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme }
                    };
                }
                open.call(this, opts, callback);

                opts = null;
                callback = null;
                return this;
            };

            /**
             * open the dialog of confirm type
             * @method ax5dialog.confirm
             * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.confirm({
             *  title: 'app title',
             *  msg: 'confirm'
             * }, function(){});
             * ```
             */
            this.confirm = function (opts, callback, tryCount) {
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }

                if (this.activeDialog) {
                    // try one more
                    if (!tryCount) {
                        setTimeout(function () {
                            this.confirm(opts, callback, 1);
                        }.bind(this), Number(cfg.animateTime) + 100);
                    } else {
                        console.log(ax5.info.getError("ax5dialog", "501", "confirm"));
                    }
                    return this;
                }

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                opts.dialogType = "confirm";
                opts.theme = opts.theme || cfg.theme || "";
                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme },
                        cancel: { label: cfg.lang["cancel"] }
                    };
                }
                open.call(this, opts, callback);

                opts = null;
                callback = null;
                return this;
            };

            /**
             * open the dialog of prompt type
             * @method ax5dialog.prompt
             * @param {Object|String} [{theme, title, msg, btns, input}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.prompt({
             *  title: 'app title',
             *  msg: 'alert'
             * }, function(){});
             * ```
             */
            this.prompt = function (opts, callback, tryCount) {
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }

                if (this.activeDialog) {
                    // try one more
                    if (!tryCount) {
                        setTimeout(function () {
                            this.prompt(opts, callback, 1);
                        }.bind(this), Number(cfg.animateTime) + 100);
                    } else {
                        console.log(ax5.info.getError("ax5dialog", "501", "prompt"));
                    }
                    return this;
                }

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;
                opts.dialogType = "prompt";
                opts.theme = opts.theme || cfg.theme || "";

                if (typeof opts.input === "undefined") {
                    opts.input = {
                        value: { label: "" }
                    };
                }
                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme },
                        cancel: { label: cfg.lang["cancel"] }
                    };
                }
                open.call(this, opts, callback);

                opts = null;
                callback = null;
                return this;
            };

            /**
             * close the dialog
             * @method ax5dialog.close
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.close();
             * ```
             */
            this.close = function (opts, that) {
                if (this.activeDialog) {
                    opts = self.dialogConfig;
                    this.activeDialog.addClass("destroy");
                    jQuery(window).unbind("keydown.ax5dialog");
                    jQuery(window).unbind("resize.ax5dialog");

                    setTimeout(function () {
                        this.activeDialog.remove();
                        this.activeDialog = null;

                        that = {
                            self: this,
                            state: "close"
                        };
                        if (opts && opts.onStateChanged) {
                            opts.onStateChanged.call(that, that);
                        } else if (this.onStateChanged) {
                            this.onStateChanged.call(that, that);
                        }

                        opts = null;
                        that = null;
                    }.bind(this), cfg.animateTime);
                }
                return this;
            };

            // 클래스 생성자
            this.main = function () {

                UI.dialog_instance = UI.dialog_instance || [];
                UI.dialog_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5dialog;
    }());
    DIALOG = ax5.ui.dialog;
})();

// ax5.ui.dialog.tmpl
(function () {

    var DIALOG = ax5.ui.dialog;

    var dialogDisplay = function dialogDisplay(columnKeys) {
        return ' \n        <div id="{{dialogId}}" data-ax5-ui="dialog" class="ax5-ui-dialog {{theme}}">\n            <div class="ax-dialog-header">\n                {{{title}}}\n            </div>\n            <div class="ax-dialog-body">\n                <div class="ax-dialog-msg">{{{msg}}}</div>\n                \n                {{#input}}\n                <div class="ax-dialog-prompt">\n                    {{#@each}}\n                    <div class="form-group">\n                    {{#@value.label}}\n                    <label>{{#_crlf}}{{{.}}}{{/_crlf}}</label>\n                    {{/@value.label}}\n                    <input type="{{@value.type}}" placeholder="{{@value.placeholder}}" class="form-control {{@value.theme}}" data-dialog-prompt="{{@key}}" style="width:100%;" value="{{@value.value}}" />\n                    {{#@value.help}}\n                    <p class="help-block">{{#_crlf}}{{.}}{{/_crlf}}</p>\n                    {{/@value.help}}\n                    </div>\n                    {{/@each}}\n                </div>\n                {{/input}}\n                \n                <div class="ax-dialog-buttons">\n                    <div class="ax-button-wrap">\n                    {{#btns}}\n                        {{#@each}}\n                        <button type="button" data-dialog-btn="{{@key}}" class="btn btn-{{@value.theme}}">{{@value.label}}</button>\n                        {{/@each}}\n                    {{/btns}}\n                    </div>\n                </div>\n            </div>\n        </div>  \n        ';
    };

    DIALOG.tmpl = {
        "dialogDisplay": dialogDisplay,
        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(DIALOG.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.mask
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var MASK;

    UI.addClass({
        className: "mask",
        version: "0.7.5"
    }, function () {
        /**
         * @class ax5mask
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var my_mask = new ax5.ui.mask();
         * ```
         */
        var ax5mask = function ax5mask() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: '',
                target: jQuery(document.body).get(0)
            };
            this.maskContent = '';
            this.status = "off";

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                opts = null;
                that = null;
                return true;
            },
                getBodyTmpl = function getBodyTmpl(data) {
                return MASK.tmpl.get.call(this, "defaultMask", data);
            },
                setBody = function setBody(content) {
                this.maskContent = content;
            };

            /**
             * Preferences of Mask UI
             * @method ax5mask.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5mask}
             * @example
             * ```
             * setConfig({
             *      target : {Element|AX5 nodelist}, // 마스크 처리할 대상
             *      content : {String}, // 마스크안에 들어가는 내용물
             *      onStateChanged: function(){} // 마스크 상태변경 시 호출되는 함수 this.type으로 예외처리 가능
             * }
             * ```
             */
            this.init = function () {
                // after setConfig();
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                if (this.config.content) setBody.call(this, this.config.content);
            };

            /**
             * open mask
             * @method ax5mask.open
             * @param {Object} config
             * @returns {ax5mask}
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
             */
            this.open = function (options) {

                if (this.status === "on") this.close();
                if (options && options.content) setBody.call(this, options.content);
                self.maskConfig = {};

                jQuery.extend(true, self.maskConfig, this.config, options);

                var _cfg = self.maskConfig,
                    target = _cfg.target,
                    $target = jQuery(target),
                    maskId = 'ax-mask-' + ax5.getGuid(),
                    $mask,
                    css = {},
                    that = {},

                /*
                bodyTmpl = getBodyTmpl(),
                body = ax5.mustache.render(bodyTmpl, {
                    theme: _cfg.theme,
                    maskId: maskId,
                    body: this.maskContent
                });
                */

                body = getBodyTmpl({
                    theme: _cfg.theme,
                    maskId: maskId,
                    body: this.maskContent
                });

                jQuery(document.body).append(body);

                if (target && target !== jQuery(document.body).get(0)) {
                    css = {
                        position: _cfg.position || "absolute",
                        left: $target.offset().left,
                        top: $target.offset().top,
                        width: $target.outerWidth(),
                        height: $target.outerHeight()
                    };

                    if (typeof self.maskConfig.zIndex !== "undefined") {
                        css["z-index"] = self.maskConfig.zIndex;
                    }
                    $target.addClass("ax-masking");
                }

                this.$mask = $mask = jQuery("#" + maskId);

                this.$target = $target;
                this.status = "on";
                $mask.css(css);

                if (_cfg.onClick) {
                    $mask.on("click", function (e) {
                        that = {
                            self: self,
                            state: "open",
                            type: "click"
                        };
                        self.maskConfig.onClick.call(that, that);
                    });
                }

                onStateChanged.call(this, null, {
                    self: this,
                    state: "open"
                });

                options = null;
                _cfg = null;
                target = null;
                $target = null;
                maskId = null;
                $mask = null;
                css = null;
                that = null;
                //bodyTmpl = null;
                body = null;

                return this;
            };

            /**
             * close mask
             * @method ax5mask.close
             * @param {Number} [_delay=0]
             * @returns {ax5mask}
             * @example
             * ```
             * my_mask.close();
             * ```
             */
            this.close = function (_delay) {
                if (this.$mask) {
                    var _close = function _close() {
                        this.status = "off";
                        this.$mask.remove();
                        this.$target.removeClass("ax-masking");

                        onStateChanged.call(this, null, {
                            self: this,
                            state: "close"
                        });
                    };

                    if (_delay) {
                        setTimeout(function () {
                            _close.call(this);
                        }.bind(this), _delay);
                    } else {
                        _close.call(this);
                    }
                }
                return this;
            };
            //== class body end

            // 클래스 생성자
            this.main = function () {

                UI.mask_instance = UI.mask_instance || [];
                UI.mask_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5mask;
    }());
    MASK = ax5.ui.mask;
})();
// ax5.ui.toast
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var TOAST;

    UI.addClass({
        className: "toast",
        version: "0.4.1"
    }, function () {
        /**
         * @class ax5toast
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var my_toast = new ax5.ui.toast();
         * ```
         */
        var ax5toast = function ax5toast() {
            var self = this,
                cfg,
                toastSeq = 0,
                toastSeqClear = null;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
                theme: 'default',
                width: 300,
                icon: '',
                closeIcon: '',
                msg: '',
                lang: {
                    "ok": "ok", "cancel": "cancel"
                },
                displayTime: 3000,
                animateTime: 250,
                containerPosition: "bottom-left"
            };
            this.toastContainer = null;
            this.queue = [];

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                opts = null;
                that = null;
                return true;
            },
                getContent = function getContent(toastId, opts) {
                var data = {
                    toastId: toastId,
                    theme: opts.theme,
                    icon: opts.icon,
                    msg: (opts.msg || "").replace(/\n/g, "<br/>"),
                    btns: opts.btns,
                    closeIcon: opts.closeIcon
                };

                try {
                    return TOAST.tmpl.get.call(this, "toastDisplay", data);
                } finally {
                    toastId = null;
                    data = null;
                }
            },
                open = function open(opts, callBack) {
                if (toastSeqClear) clearTimeout(toastSeqClear);

                var toastBox,
                    box = {
                    width: opts.width
                };

                opts.id = 'ax5-toast-' + self.containerId + '-' + ++toastSeq;
                if (jQuery('#' + opts.id).get(0)) return this;

                if (U.left(cfg.containerPosition, '-') == 'bottom') {
                    this.toastContainer.append(getContent(opts.id, opts));
                } else {
                    this.toastContainer.prepend(getContent(opts.id, opts));
                }

                toastBox = jQuery('#' + opts.id);
                toastBox.css({ width: box.width });
                opts.toastBox = toastBox;
                this.queue.push(opts);

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "open",
                    toastId: opts.id
                });

                if (opts.toastType === "push") {
                    // 자동 제거 타이머 시작
                    setTimeout(function () {
                        this.close(opts, callBack);
                    }.bind(this), cfg.displayTime);

                    toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName, function (e) {
                        btnOnClick.call(this, e || window.event, opts, toastBox, callBack);
                    }.bind(this));
                } else if (opts.toastType === "confirm") {
                    toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName, function (e) {
                        btnOnClick.call(this, e || window.event, opts, toastBox, callBack);
                    }.bind(this));
                }

                box = null;
            },
                btnOnClick = function btnOnClick(e, opts, toastBox, callBack, target, k) {
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-ax-toast-btn")) {
                        return true;
                    }
                });

                if (target) {
                    k = target.getAttribute("data-ax-toast-btn");

                    var that = {
                        key: k, value: opts.btns ? opts.btns[k] : k,
                        toastId: opts.id,
                        btn_target: target
                    };

                    if (opts.btns && opts.btns[k].onClick) {
                        opts.btns[k].onClick.call(that, k);
                    } else if (opts.toastType === "push") {
                        if (callBack) callBack.call(that, k);
                        this.close(opts, callBack);
                    } else if (opts.toastType === "confirm") {
                        if (callBack) callBack.call(that, k);
                        this.close(opts, callBack);
                    }
                }

                e = null;
                opts = null;
                toastBox = null;
                callBack = null;
                target = null;
                k = null;
            };

            /**
             * Preferences of toast UI
             * @method ax5toast.set_config
             * @param {Object} config - 클래스 속성값
             * @returns {ax5toast}
             * @example
             * ```
             * ```
             */
            //== class body start
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                // after set_config();
                self.containerId = ax5.getGuid();
                var styles = [];
                if (cfg.zIndex) {
                    styles.push("z-index:" + cfg.zIndex);
                }
                jQuery(document.body).append('<div class="ax5-ui-toast-container ' + cfg.containerPosition + '" data-toast-container="' + '' + self.containerId + '" style="' + styles.join(";") + '"></div>');
                this.toastContainer = jQuery('[data-toast-container="' + self.containerId + '"]');
            };

            /**
             * @method ax5toast.push
             * @param opts
             * @param callBack
             * @returns {ax5toast}
             */
            this.push = function (opts, callBack) {
                if (!self.containerId) {
                    this.init();
                }
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }
                opts.toastType = "push";

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                open.call(this, opts, callBack);

                opts = null;
                callBack = null;
                return this;
            };

            /**
             * @method ax5toast.confirm
             * @param opts
             * @param callBack
             * @returns {ax5toast}
             */
            this.confirm = function (opts, callBack) {
                if (!self.containerId) {
                    this.init();
                }
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }
                opts.toastType = "confirm";

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme }
                    };
                }
                open.call(this, opts, callBack);

                opts = null;
                callBack = null;
                return this;
            };

            /**
             * close the toast
             * @method ax5toast.close
             * @returns {ax5toast}
             * @example
             * ```
             * my_toast.close();
             * ```
             */
            this.close = function (opts, callBack) {
                if (typeof opts === "undefined") {
                    opts = U.last(this.queue);
                }

                var toastBox = opts.toastBox;
                toastBox.addClass(opts.toastType == "push" ? "removed" : "destroy");
                this.queue = U.filter(this.queue, function () {
                    return opts.id != this.id;
                });
                setTimeout(function () {
                    var that = {
                        toastId: opts.id
                    };

                    toastBox.remove();
                    if (callBack) callBack.call(that);

                    that = {
                        self: this,
                        state: "close",
                        toastId: opts.id
                    };
                    onStateChanged.call(this, opts, that);

                    // 3초후에도 아무 일이 없다면 완전히 제거
                    if (this.queue.length === 0) {
                        if (toastSeqClear) clearTimeout(toastSeqClear);
                        toastSeqClear = setTimeout(function () {
                            /// console.log("try clear seq");
                            if (this.queue.length === 0) toastSeq = 0;
                        }.bind(this), 3000);
                    }

                    that = null;
                    opts = null;
                    callBack = null;
                    toastBox = null;
                }.bind(this), cfg.animateTime);

                return this;
            };

            // 클래스 생성자
            this.main = function () {

                UI.toast_instance = UI.toast_instance || [];
                UI.toast_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5toast;
    }());
    TOAST = ax5.ui.toast;
})();
// ax5.ui.toast.tmpl
(function () {

    var TOAST = ax5.ui.toast;

    var toastDisplay = function toastDisplay(columnKeys) {
        return '\n        <div id="{{toastId}}" data-ax5-ui="toast" class="ax5-ui-toast {{theme}}">\n            {{#icon}}\n            <div class="ax-toast-icon">{{{.}}}</div>\n            {{/icon}}\n            <div class="ax-toast-body">{{{msg}}}</div>\n            {{#btns}}\n            <div class="ax-toast-buttons">\n                <div class="ax-button-wrap">\n                    {{#@each}}\n                    <button type="button" data-ax-toast-btn="{{@key}}" class="btn btn-{{@value.theme}}">{{{@value.label}}}</button>\n                    {{/@each}}\n                </div>\n            </div>\n            {{/btns}}\n            {{^btns}}\n                <a class="ax-toast-close" data-ax-toast-btn="ok">{{{closeIcon}}}</a>\n            {{/btns}}\n            <div style="clear:both;"></div>\n        </div>';
    };

    TOAST.tmpl = {
        "toastDisplay": toastDisplay,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(TOAST.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.modal
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var MODAL;

    UI.addClass({
        className: "modal",
        version: "0.7.9"
    }, function () {
        /**
         * @class ax5modal
         * @alias ax5.ui.modal
         * @author tom@axisj.com
         * @example
         * ```
         * var my_modal = new ax5.ui.modal();
         * ```
         */
        var ax5modal = function ax5modal() {
            var self = this,
                cfg,
                ENM = {
                "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
                "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
                "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
            },
                getMousePosition = function getMousePosition(e) {
                var mouseObj = e;
                if ('changedTouches' in e) {
                    mouseObj = e.changedTouches[0];
                }
                return {
                    clientX: mouseObj.clientX,
                    clientY: mouseObj.clientY
                };
            };

            this.instanceId = ax5.getGuid();
            this.config = {
                id: 'ax5-modal-' + this.instanceId,
                position: {
                    left: "center",
                    top: "middle",
                    margin: 10
                },
                minimizePosition: "bottom-right",
                clickEventName: "mousedown", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
                theme: 'default',
                width: 300,
                height: 400,
                closeToEsc: true,
                animateTime: 250
            };
            this.activeModal = null;
            this.$ = {}; // UI inside of the jQuery object store

            cfg = this.config; // extended config copy cfg

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
                getContent = function getContent(modalId, opts) {
                var data = {
                    modalId: modalId,
                    theme: opts.theme,
                    header: opts.header,
                    fullScreen: opts.fullScreen ? "fullscreen" : "",
                    styles: [],
                    iframe: opts.iframe,
                    iframeLoadingMsg: opts.iframeLoadingMsg
                };

                if (opts.zIndex) {
                    data.styles.push("z-index:" + opts.zIndex);
                }
                if (data.iframe && typeof data.iframe.param === "string") {
                    data.iframe.param = ax5.util.param(data.iframe.param);
                }

                return MODAL.tmpl.get.call(this, "content", data, {});
            },
                open = function open(opts, callback) {
                var that;
                jQuery(document.body).append(getContent.call(this, opts.id, opts));

                this.activeModal = jQuery('#' + opts.id);

                // 파트수집
                this.$ = {
                    "root": this.activeModal.find('[data-modal-els="root"]'),
                    "header": this.activeModal.find('[data-modal-els="header"]'),
                    "body": this.activeModal.find('[data-modal-els="body"]')
                };

                if (opts.iframe) {
                    this.$["iframe-wrap"] = this.activeModal.find('[data-modal-els="iframe-wrap"]');
                    this.$["iframe"] = this.activeModal.find('[data-modal-els="iframe"]');
                    this.$["iframe-form"] = this.activeModal.find('[data-modal-els="iframe-form"]');
                    this.$["iframe-loading"] = this.activeModal.find('[data-modal-els="iframe-loading"]');
                }

                //- position 정렬
                this.align();

                that = {
                    self: this,
                    id: opts.id,
                    theme: opts.theme,
                    width: opts.width,
                    height: opts.height,
                    state: "open",
                    $: this.$
                };

                if (opts.iframe) {
                    this.$["iframe-wrap"].css({ height: opts.height });
                    this.$["iframe"].css({ height: opts.height });

                    // iframe content load
                    this.$["iframe-form"].attr({ "method": opts.iframe.method });
                    this.$["iframe-form"].attr({ "target": opts.id + "-frame" });
                    this.$["iframe-form"].attr({ "action": opts.iframe.url });
                    this.$["iframe"].on("load", function () {
                        that.state = "load";
                        if (opts.iframeLoadingMsg) {
                            this.$["iframe-loading"].hide();
                        }
                        onStateChanged.call(this, opts, that);
                    }.bind(this));
                    if (!opts.iframeLoadingMsg) {
                        this.$["iframe"].show();
                    }
                    this.$["iframe-form"].submit();
                }

                if (callback) callback.call(that);
                onStateChanged.call(this, opts, that);

                // bind key event
                if (opts.closeToEsc) {
                    jQuery(window).bind("keydown.ax-modal", function (e) {
                        onkeyup.call(this, e || window.event);
                    }.bind(this));
                }
                jQuery(window).bind("resize.ax-modal", function (e) {
                    this.align(null, e || window.event);
                }.bind(this));

                this.activeModal.find("[data-modal-header-btn]").on(cfg.clickEventName, function (e) {
                    btnOnClick.call(this, e || window.event, opts);
                }.bind(this));

                this.$.header.bind(ENM["mousedown"], function (e) {
                    self.mousePosition = getMousePosition(e);
                    moveModal.on.call(self);
                }).bind("dragstart", function (e) {
                    U.stopEvent(e);
                    return false;
                });
            },
                btnOnClick = function btnOnClick(e, opts, callback, target, k) {
                var that;
                if (e.srcElement) e.target = e.srcElement;

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-modal-header-btn")) {
                        return true;
                    }
                });

                if (target) {
                    k = target.getAttribute("data-modal-header-btn");

                    that = {
                        self: this,
                        key: k, value: opts.header.btns[k],
                        dialogId: opts.id,
                        btnTarget: target
                    };

                    if (opts.header.btns[k].onClick) {
                        opts.header.btns[k].onClick.call(that, k);
                    }
                }

                that = null;
                opts = null;
                callback = null;
                target = null;
                k = null;
            },
                onkeyup = function onkeyup(e) {
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                }
            },
                alignProcessor = {
                "top-left": function topLeft() {
                    this.align({ left: "left", top: "top" });
                },
                "top-right": function topRight() {
                    this.align({ left: "right", top: "top" });
                },
                "bottom-left": function bottomLeft() {
                    this.align({ left: "left", top: "bottom" });
                },
                "bottom-right": function bottomRight() {
                    this.align({ left: "right", top: "bottom" });
                },
                "center-middle": function centerMiddle() {
                    this.align({ left: "center", top: "middle" });
                }
            },
                moveModal = {
                "on": function on() {
                    var modalOffset = this.activeModal.position();
                    var modalBox = {
                        width: this.activeModal.outerWidth(), height: this.activeModal.outerHeight()
                    };
                    var windowBox = {
                        width: jQuery(window).width(),
                        height: jQuery(window).height()
                    };
                    var getResizerPosition = function getResizerPosition(e) {
                        self.__dx = e.clientX - self.mousePosition.clientX;
                        self.__dy = e.clientY - self.mousePosition.clientY;

                        var minX = 0;
                        var maxX = windowBox.width - modalBox.width;
                        var minY = 0;
                        var maxY = windowBox.height - modalBox.height;

                        if (minX > modalOffset.left + self.__dx) {
                            self.__dx = -modalOffset.left;
                        } else if (maxX < modalOffset.left + self.__dx) {
                            self.__dx = maxX - modalOffset.left;
                        }

                        if (minY > modalOffset.top + self.__dy) {
                            self.__dy = -modalOffset.top;
                        } else if (maxY < modalOffset.top + self.__dy) {
                            self.__dy = maxY - modalOffset.top;
                        }

                        return {
                            left: modalOffset.left + self.__dx + $(document).scrollLeft(),
                            top: modalOffset.top + self.__dy + $(document).scrollTop()
                        };
                    };

                    self.__dx = 0; // 변화량 X
                    self.__dy = 0; // 변화량 Y

                    jQuery(document.body).bind(ENM["mousemove"] + ".ax5modal-" + cfg.id, function (e) {
                        if (!self.resizer) {
                            // self.resizerBg : body 가 window보다 작을 때 문제 해결을 위한 DIV
                            self.resizerBg = jQuery('<div class="ax5modal-resizer-background" ondragstart="return false;"></div>');
                            self.resizer = jQuery('<div class="ax5modal-resizer" ondragstart="return false;"></div>');
                            self.resizer.css({
                                left: modalOffset.left,
                                top: modalOffset.top,
                                width: modalBox.width,
                                height: modalBox.height
                            });
                            jQuery(document.body).append(self.resizerBg).append(self.resizer);
                            self.activeModal.addClass("draged");
                        }
                        self.resizer.css(getResizerPosition(e));
                    }).bind(ENM["mouseup"] + ".ax5layout-" + this.instanceId, function (e) {
                        moveModal.off.call(self);
                    }).bind("mouseleave.ax5layout-" + this.instanceId, function (e) {
                        moveModal.off.call(self);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
                },
                "off": function off() {
                    var setModalPosition = function setModalPosition() {
                        //console.log(this.activeModal.offset(), this.__dx);
                        var box = this.activeModal.offset();
                        box.left += this.__dx - $(document).scrollLeft();
                        box.top += this.__dy - $(document).scrollTop();
                        this.activeModal.css(box);
                    };

                    if (this.resizer) {
                        this.activeModal.removeClass("draged");
                        this.resizer.remove();
                        this.resizer = null;
                        this.resizerBg.remove();
                        this.resizerBg = null;
                        setModalPosition.call(this);
                        //this.align();
                    }

                    jQuery(document.body).unbind(ENM["mousemove"] + ".ax5modal-" + cfg.id).unbind(ENM["mouseup"] + ".ax5modal-" + cfg.id).unbind("mouseleave.ax5modal-" + cfg.id);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
                }
            };

            /// private end

            /**
             * Preferences of modal UI
             * @method ax5modal.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5modal}
             * @example
             * ```
             * ```
             */
            //== class body start
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
            };

            /**
             * open the modal
             * @method ax5modal.open
             * @returns {ax5modal}
             * @example
             * ```
             * my_modal.open();
             * ```
             */
            this.open = function (opts, callback) {
                if (!this.activeModal) {
                    opts = self.modalConfig = jQuery.extend(true, {}, cfg, opts);
                    open.call(this, opts, callback);
                }
                return this;
            };

            /**
             * close the modal
             * @method ax5modal.close
             * @returns {ax5modal}
             * @example
             * ```
             * my_modal.close();
             * ```
             */
            this.close = function (opts) {
                if (this.activeModal) {
                    opts = self.modalConfig;
                    this.activeModal.addClass("destroy");
                    jQuery(window).unbind("keydown.ax-modal");
                    jQuery(window).unbind("resize.ax-modal");

                    setTimeout(function () {
                        if (this.activeModal) {
                            this.activeModal.remove();
                            this.activeModal = null;
                        }
                        onStateChanged.call(this, opts, {
                            self: this,
                            state: "close"
                        });
                    }.bind(this), cfg.animateTime);
                }

                this.minimized = false; // hoksi

                return this;
            };

            /**
             * @method ax5modal.minimize
             * @returns {ax5modal}
             */
            this.minimize = function () {

                return function (minimizePosition) {

                    if (this.minimized !== true) {

                        var opts = self.modalConfig;
                        if (typeof minimizePosition === "undefined") minimizePosition = cfg.minimizePosition;

                        this.minimized = true;
                        this.$.body.hide();
                        self.modalConfig.originalHeight = opts.height;
                        self.modalConfig.height = 0;
                        alignProcessor[minimizePosition].call(this);

                        onStateChanged.call(this, opts, {
                            self: this,
                            state: "minimize"
                        });
                    }

                    return this;
                };
            }();

            /**
             * @method ax5modal.maximize
             * @returns {ax5modal}
             */
            this.maximize = function () {
                var opts = self.modalConfig;
                if (this.minimized) {
                    this.minimized = false;
                    this.$.body.show();
                    self.modalConfig.height = self.modalConfig.originalHeight;
                    self.modalConfig.originalHeight = undefined;

                    this.align({ left: "center", top: "middle" });
                    onStateChanged.call(this, opts, {
                        self: this,
                        state: "restore"
                    });
                }
                return this;
            };

            /**
             * setCSS
             * @method ax5modal.css
             * @param {Object} css -
             * @returns {ax5modal}
             */
            this.css = function (css) {
                if (this.activeModal && !self.fullScreen) {
                    this.activeModal.css(css);
                    if (css.width) {
                        self.modalConfig.width = this.activeModal.width();
                    }
                    if (css.height) {
                        self.modalConfig.height = this.activeModal.height();
                        if (this.$["iframe"]) {
                            this.$["iframe-wrap"].css({ height: self.modalConfig.height });
                            this.$["iframe"].css({ height: self.modalConfig.height });
                        }
                    }
                }
                return this;
            };

            /**
             * @method ax5modal.setModalConfig
             * @param _config
             * @returns {ax5.ui.ax5modal}
             */
            this.setModalConfig = function (_config) {
                self.modalConfig = jQuery.extend({}, self.modalConfig, _config);
                this.align();
                return this;
            };

            /**
             * @method ax5modal.align
             * @param position
             * @param e
             * @returns {ax5modal}
             */
            this.align = function () {

                return function (position, e) {
                    if (!this.activeModal) return this;

                    var opts = self.modalConfig,
                        box = {
                        width: opts.width,
                        height: opts.height
                    };

                    var fullScreen = function (_fullScreen) {
                        if (typeof _fullScreen === "undefined") {
                            return false;
                        } else if (U.isFunction(_fullScreen)) {
                            return _fullScreen();
                        }
                    }(opts.fullScreen);

                    if (fullScreen) {
                        if (opts.header) this.$.header.hide();
                        box.width = jQuery(window).width();
                        box.height = opts.height;
                        box.left = 0;
                        box.top = 0;
                    } else {
                        if (opts.header) this.$.header.show();
                        if (position) {
                            jQuery.extend(true, opts.position, position);
                        }

                        if (opts.header) {
                            box.height += this.$.header.outerHeight();
                        }

                        //- position 정렬
                        if (opts.position.left == "left") {
                            box.left = opts.position.margin || 0;
                        } else if (opts.position.left == "right") {
                            // window.innerWidth;
                            box.left = jQuery(window).width() - box.width - (opts.position.margin || 0);
                        } else if (opts.position.left == "center") {
                            box.left = jQuery(window).width() / 2 - box.width / 2;
                        } else {
                            box.left = opts.position.left || 0;
                        }

                        if (opts.position.top == "top") {
                            box.top = opts.position.margin || 0;
                        } else if (opts.position.top == "bottom") {
                            box.top = jQuery(window).height() - box.height - (opts.position.margin || 0);
                        } else if (opts.position.top == "middle") {
                            box.top = jQuery(window).height() / 2 - box.height / 2;
                        } else {
                            box.top = opts.position.top || 0;
                        }
                        if (box.left < 0) box.left = 0;
                        if (box.top < 0) box.top = 0;
                    }

                    this.activeModal.css(box);

                    if (opts.iframe) {
                        this.$["iframe-wrap"].css({ height: box.height });
                        this.$["iframe"].css({ height: box.height });
                    }
                    return this;
                };
            }();

            // 클래스 생성자
            this.main = function () {

                UI.modal_instance = UI.modal_instance || [];
                UI.modal_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5modal;
    }());

    MODAL = ax5.ui.modal;
})();
// ax5.ui.modal.tmpl
(function () {
    var MODAL = ax5.ui.modal;

    var content = function content() {
        return ' \n        <div id="{{modalId}}" data-modal-els="root" class="ax5modal {{theme}} {{fullscreen}}" style="{{styles}}">\n            {{#header}}\n            <div class="ax-modal-header" data-modal-els="header">\n                {{{title}}}\n                {{#btns}}\n                    <div class="ax-modal-header-addon">\n                    {{#@each}}\n                    <a tabindex="-1" data-modal-header-btn="{{@key}}" class="{{@value.theme}}">{{{@value.label}}}</a>\n                    {{/@each}}\n                    </div>\n                {{/btns}}\n            </div>\n            {{/header}}\n            <div class="ax-modal-body" data-modal-els="body">\n            {{#iframe}}\n            \n                <div data-modal-els="iframe-wrap" style="-webkit-overflow-scrolling: touch; overflow: auto;position: relative;">\n                    <table data-modal-els="iframe-loading" style="width:100%;height:100%;"><tr><td style="text-align: center;vertical-align: middle">{{{iframeLoadingMsg}}}</td></tr></table>\n                    <iframe name="{{modalId}}-frame" src="" width="100%" height="100%" frameborder="0" data-modal-els="iframe" style="position: absolute;left:0;top:0;"></iframe>\n                </div>\n                <form name="{{modalId}}-form" data-modal-els="iframe-form">\n                <input type="hidden" name="modalId" value="{{modalId}}" />\n                {{#param}}\n                {{#@each}}\n                <input type="hidden" name="{{@key}}" value="{{@value}}" />\n                {{/@each}}\n                {{/param}}\n                </form>\n            {{/iframe}}\n            </div>\n        </div>\n        ';
    };

    MODAL.tmpl = {
        "content": content,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(MODAL.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.calendar
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var CALENDAR;

    UI.addClass({
        className: "calendar",
        version: "0.9.0"
    }, function () {

        /**
         * @class ax5calendar
         * @classdesc
         * @author tom@axisj.com
         * @logs
         * 2014-06-21 tom : 시작
         * @example
         * ```
         * var my_pad = new ax5.ui.calendar();
         * ```
         */
        var ax5calendar = function ax5calendar() {
            var self = this,
                cfg,
                selectableCount = 1;

            this.instanceId = ax5.getGuid();
            this.target = null;
            this.selection = [];
            this.selectionMap = {};
            this.selectableMap = {};
            this.markerMap = {};
            this.printedDay = {
                start: "", end: ""
            };
            this.config = {
                clickEventName: "click",
                theme: 'default',
                mode: 'day', // day|month|year,
                dateFormat: 'yyyy-MM-dd',
                displayDate: new Date(),
                animateTime: 250,
                dimensions: {
                    controlHeight: '40',
                    controlButtonWidth: '40',
                    colHeadHeight: '30',
                    itemPadding: 2
                },
                lang: {
                    yearHeading: "Choose the year",
                    monthHeading: "Choose the month",
                    yearTmpl: "%s",
                    months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                    dayTmpl: "%s"
                },
                multipleSelect: false,
                selectMode: 'day',
                defaultMarkerTheme: 'holiday',
                defaultPeriodTheme: 'period'
            };

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
            },
                getFrame = function getFrame() {
                var data = jQuery.extend(true, {}, cfg, {
                    controlCSS: {},
                    controlButtonCSS: {}
                });

                data.controlButtonCSS["height"] = data.controlCSS["height"] = U.cssNumber(cfg.dimensions.controlHeight);
                data.controlButtonCSS["line-height"] = data.controlCSS["line-height"] = U.cssNumber(cfg.dimensions.controlHeight);
                data.controlButtonCSS["width"] = U.cssNumber(cfg.dimensions.controlHeight);

                data.controlCSS = U.css(data.controlCSS);
                data.controlButtonCSS = U.css(data.controlButtonCSS);

                try {
                    return CALENDAR.tmpl.get.call(this, "frameTmpl", data);
                } finally {
                    data = null;
                }
            },
                setDisplay = function setDisplay() {
                var myDate = U.date(cfg.displayDate),
                    yy = "",
                    mm = "",
                    yy1,
                    yy2;

                if (cfg.control) {
                    if (cfg.mode == "day" || cfg.mode == "d") {
                        yy = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear()) : myDate.getFullYear();
                        mm = cfg.control.monthTmpl ? cfg.control.monthTmpl.replace('%s', cfg.lang.months[myDate.getMonth()]) : cfg.lang.months[myDate.getMonth()];

                        this.$["control-display"].html(function () {
                            if (cfg.control.yearFirst) {
                                return '<span data-calendar-display="year">' + yy + '</span>' + '<span data-calendar-display="month">' + mm + '</span>';
                            } else {
                                return '<span data-calendar-display="month">' + mm + '</span>' + '<span data-calendar-display="year">' + yy + '</span>';
                            }
                        }());
                    } else if (cfg.mode == "month" || cfg.mode == "m") {
                        yy = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear()) : myDate.getFullYear();
                        this.$["control-display"].html('<span data-calendar-display="year">' + yy + '</span>');
                    } else if (cfg.mode == "year" || cfg.mode == "y") {
                        yy1 = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear() - 10) : myDate.getFullYear() - 10;
                        yy2 = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', Number(myDate.getFullYear()) + 9) : Number(myDate.getFullYear()) + 9;
                        this.$["control-display"].html(yy1 + ' ~ ' + yy2);
                    }

                    this.$["control-display"].find('[data-calendar-display]').on(cfg.clickEventName, function (e) {
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-calendar-display")) {
                                return true;
                            }
                        }),
                            mode;
                        if (target) {
                            mode = target.getAttribute("data-calendar-display");
                            this.changeMode(mode);
                        }
                        target = null;
                        mode = null;
                    }.bind(this));
                }

                myDate = null;
                yy = null;
                mm = null;
                yy1 = null;
                yy2 = null;
                return this;
            },
                printDay = function printDay(nowDate) {
                var dotDate = U.date(nowDate),
                    monthStratDate = new Date(dotDate.getFullYear(), dotDate.getMonth(), 1, 12),
                    _today = cfg.displayDate,
                    tableStartDate = function () {
                    var day = monthStratDate.getDay();
                    if (day == 0) day = 7;
                    try {
                        return U.date(monthStratDate, { add: { d: -day } });
                    } finally {
                        day = null;
                    }
                }(),
                    loopDate,
                    thisMonth = dotDate.getMonth(),
                    itemStyles = {},
                    i,
                    k,
                    frameWidth = this.$["body"].width(),
                    frameHeight = Math.floor(frameWidth * (6 / 7)),
                    // 1week = 7days, 1month = 6weeks
                data,
                    tmpl;

                if (cfg.dimensions.height) {
                    frameHeight = U.number(cfg.dimensions.height) - U.number(cfg.dimensions.colHeadHeight);
                }

                itemStyles['height'] = Math.floor(frameHeight / 6) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
                itemStyles['line-height'] = itemStyles['height'];
                itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

                data = {
                    weekNames: [].concat(ax5.info.weekNames),
                    list: []
                };

                data.weekNames.forEach(function (n) {
                    n.colHeadHeight = U.cssNumber(cfg.dimensions.colHeadHeight);
                });

                loopDate = tableStartDate;
                i = 0;
                while (i < 6) {
                    k = 0;
                    while (k < 7) {
                        var thisDate = '' + U.date(loopDate, { "return": cfg.dateFormat }),
                            _date = {
                            'row': i,
                            'col': k,
                            isStartOfWeek: k == 0,
                            thisDate: '' + thisDate,
                            thisDataLabel: cfg.lang.dayTmpl.replace('%s', loopDate.getDate()),
                            itemStyles: U.css(itemStyles),
                            addClass: function () {
                                if (cfg.selectable) {
                                    if (self.selectableMap[thisDate]) {
                                        return loopDate.getMonth() == thisMonth ? "live" : "";
                                    } else {
                                        return "disable";
                                    }
                                } else {
                                    return loopDate.getMonth() == thisMonth ? thisDate == U.date(_today, { "return": "yyyyMMdd" }) ? "focus" : "live" : "";
                                }
                            }() + ' ' + function () {
                                return self.markerMap[thisDate] ? self.markerMap[thisDate].theme || cfg.defaultMarkerTheme : '';
                            }() + ' ' + function () {
                                return self.selectionMap[thisDate] ? "selected-day" : '';
                            }()
                        };
                        data.list.push(_date);

                        k++;
                        loopDate = U.date(loopDate, { add: { d: 1 } });

                        thisDate = null;
                        _date = null;
                    }
                    i++;
                }
                tmpl = CALENDAR.tmpl.get.call(this, "dayTmpl", data);
                this.$["body"].html(tmpl);
                this.$["body"].find('[data-calendar-item-date]').on(cfg.clickEventName, function (e) {
                    e = e || window.event;
                    onclick.call(self, e, 'date');
                    U.stopEvent(e);
                });

                this.printedDay = {
                    start: tableStartDate, end: loopDate
                };

                onStateChanged.call(this, null, {
                    self: this,
                    action: "printDay",
                    printedDay: this.printedDay
                });
                setDisplay.call(this);

                dotDate = null;
                monthStratDate = null;
                _today = null;
                tableStartDate = null;
                loopDate = null;
                thisMonth = null;
                itemStyles = null;
                i = null;
                k = null;
                frameWidth = null;
                frameHeight = null;
                data = null;
                tmpl = null;
            },
                printMonth = function printMonth(nowDate) {
                var dotDate = U.date(nowDate),
                    nMonth = dotDate.getMonth(),
                    itemStyles = {},
                    i,
                    k,
                    m,
                    tableStartMonth,
                    frameWidth = this.$["body"].width(),
                    frameHeight = Math.floor(frameWidth * (6 / 7)),
                    data,
                    tmpl;

                if (cfg.dimensions.height) {
                    frameHeight = U.number(cfg.dimensions.height) - U.number(cfg.dimensions.colHeadHeight);
                }

                itemStyles['height'] = Math.floor(frameHeight / 4) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
                itemStyles['line-height'] = itemStyles['height'];
                itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

                data = {
                    colHeadHeight: U.cssNumber(cfg.dimensions.colHeadHeight),
                    colHeadLabel: cfg.lang.monthHeading,
                    list: []
                };

                tableStartMonth = 0;
                m = 0;
                i = 0;
                while (i < 4) {
                    k = 0;
                    while (k < 3) {
                        var _month = {
                            row: i,
                            col: k,
                            isStartOfRow: k == 0,
                            thisMonth: dotDate.getFullYear() + '-' + U.setDigit(m + 1, 2) + '-' + U.setDigit(dotDate.getDate(), 2),
                            thisMonthLabel: cfg.lang.months[m],
                            itemStyles: U.css(itemStyles),
                            addClass: function () {
                                if (cfg.selectable) {
                                    return self.selectableMap[m] ? 'live' : 'disable';
                                } else {
                                    return 'live';
                                }
                            }() + ' ' + function () {
                                return m == nMonth ? "focus" : "";
                            }() + ' ' + function () {
                                return self.markerMap[m] ? self.markerMap[m].theme || cfg.defaultMarkerTheme : '';
                            }()
                        };
                        data.list.push(_month);
                        m++;
                        k++;
                        _month = null;
                    }
                    i++;
                }
                tmpl = CALENDAR.tmpl.get.call(this, "monthTmpl", data);
                this.$["body"].html(tmpl);
                this.$["body"].find('[data-calendar-item-month]').on(cfg.clickEventName, function (e) {
                    e = e || window.event;
                    onclick.call(self, e, 'month');
                    U.stopEvent(e);
                });

                this.printedDay = {
                    start: dotDate.getFullYear() + '-' + U.setDigit(tableStartMonth + 1, 2),
                    end: dotDate.getFullYear() + '-' + U.setDigit(m, 2)
                };

                onStateChanged.call(this, null, {
                    self: this,
                    action: "printMonth",
                    printedDay: this.printedDay
                });
                setDisplay.call(this);

                dotDate = null;
                nMonth = null;
                itemStyles = null;
                i = null;
                k = null;
                m = null;
                tableStartMonth = null;
                frameWidth = null;
                frameHeight = null;
                data = null;
                tmpl = null;
            },
                printYear = function printYear(nowDate) {
                var dotDate = U.date(nowDate),
                    nYear = dotDate.getFullYear(),
                    itemStyles = {},
                    i,
                    k,
                    y,
                    tableStartYear,
                    frameWidth = this.$["body"].width(),
                    frameHeight = Math.floor(frameWidth * (6 / 7)),
                    data,
                    tmpl;

                if (cfg.dimensions.height) {
                    frameHeight = U.number(cfg.dimensions.height) - U.number(cfg.dimensions.colHeadHeight);
                }

                itemStyles['height'] = Math.floor(frameHeight / 5) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
                itemStyles['line-height'] = itemStyles['height'];
                itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

                data = {
                    colHeadHeight: U.cssNumber(cfg.dimensions.colHeadHeight),
                    colHeadLabel: cfg.lang.yearHeading,
                    list: []
                };

                tableStartYear = nYear - 10;
                y = nYear - 10;
                i = 0;
                while (i < 5) {
                    k = 0;
                    while (k < 4) {
                        var _year = {
                            row: i,
                            col: k,
                            isStartOfRow: k == 0,
                            thisYear: y + '-' + U.setDigit(dotDate.getMonth() + 1, 2) + '-' + U.setDigit(dotDate.getDate(), 2),
                            thisYearLabel: cfg.lang.yearTmpl.replace('%s', y),
                            itemStyles: U.css(itemStyles),
                            addClass: function () {
                                if (cfg.selectable) {
                                    return self.selectableMap[y] ? 'live' : 'disable';
                                } else {
                                    return 'live';
                                }
                            }() + ' ' + function () {
                                return y == nYear ? "focus" : "";
                            }() + ' ' + function () {
                                return self.selectableMap[y] ? self.selectableMap[y].theme || cfg.defaultMarkerTheme : '';
                            }()
                        };
                        data.list.push(_year);
                        y++;
                        k++;
                        _year = null;
                    }
                    i++;
                }
                tmpl = CALENDAR.tmpl.get.call(this, "yearTmpl", data);
                this.$["body"].html(tmpl);
                this.$["body"].find('[data-calendar-item-year]').on(cfg.clickEventName, function (e) {
                    e = e || window.event;
                    onclick.call(this, e, 'year');
                    U.stopEvent(e);
                });

                this.printedDay = {
                    start: tableStartYear, end: y - 1
                };

                onStateChanged.call(this, null, {
                    self: this,
                    action: "printYear",
                    printedDay: this.printedDay
                });
                setDisplay.call(this);

                dotDate = null;
                nYear = null;
                itemStyles = null;
                i = null;
                k = null;
                y = null;
                tableStartYear = null;
                frameWidth = null;
                frameHeight = null;
                data = null;
                tmpl = null;
            },
                onclick = function onclick(e, mode, target, value) {
                var removed, dt, selectable;

                mode = mode || "date";
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-calendar-item-" + mode)) {
                        return true;
                    }
                });
                if (target) {
                    value = target.getAttribute("data-calendar-item-" + mode);

                    dt = U.date(value, { "return": cfg.dateFormat });
                    selectable = true;
                    selectableCount = cfg.multipleSelect ? U.isNumber(cfg.multipleSelect) ? cfg.multipleSelect : 2 : 1;

                    if (cfg.selectable) {
                        if (!self.selectableMap[dt]) selectable = false;
                    }

                    if (mode == "date") {
                        if (selectable) {

                            if (self.selection.length >= selectableCount) {
                                removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                removed.forEach(function (d) {
                                    self.$["body"].find('[data-calendar-item-date="' + U.date(d, { "return": cfg.dateFormat }) + '"]').removeClass("selected-day");
                                });
                            }

                            jQuery(target).addClass("selected-day");
                            self.selection.push(value);

                            if (self.onClick) {
                                self.onClick.call({
                                    self: this, date: value, target: this.target, dateElement: target
                                });
                            }
                        }
                    } else if (mode == "month") {
                        if (cfg.selectMode == "month") {
                            if (selectable) {
                                if (self.selection.length >= selectableCount) {
                                    removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                    removed.forEach(function (d) {
                                        self.$["body"].find('[data-calendar-item-month="' + U.date(d, { "return": 'yyyy-MM-dd' }) + '"]').removeClass("selected-month");
                                    });
                                }

                                jQuery(target).addClass("selected-month");
                                self.selection.push(value);

                                if (self.onClick) {
                                    self.onClick.call({
                                        self: this, date: value, target: this.target, dateElement: target
                                    });
                                }
                            }
                        } else {
                            self.changeMode("day", value);
                        }
                    } else if (mode == "year") {
                        if (cfg.selectMode == "year") {
                            if (selectable) {
                                if (self.selection.length >= selectableCount) {
                                    removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                    removed.forEach(function (d) {
                                        self.$["body"].find('[data-calendar-item-year="' + U.date(d, { "return": 'yyyy-MM-dd' }) + '"]').removeClass("selected-year");
                                    });
                                }

                                jQuery(target).addClass("selected-year");
                                self.selection.push(value);

                                if (self.onClick) {
                                    self.onClick.call({
                                        self: this, date: value, target: this.target, dateElement: target
                                    });
                                }
                            }
                        } else {
                            self.changeMode("month", value);
                        }
                    }
                }

                mode = null;
                target = null;
                value = null;
                removed = null;
                dt = null;
                selectable = null;
            },
                move = function move(e, target, value) {
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-calendar-move")) {
                        return true;
                    }
                });
                if (target) {
                    value = target.getAttribute("data-calendar-move");

                    if (cfg.mode == "day") {
                        if (value == "left") {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { m: -1 } });
                        } else {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { m: 1 } });
                        }
                        printDay.call(this, cfg.displayDate);
                    } else if (cfg.mode == "month") {
                        if (value == "left") {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: -1 } });
                        } else {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: 1 } });
                        }
                        printMonth.call(this, cfg.displayDate);
                    } else if (cfg.mode == "year") {
                        if (value == "left") {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: -10 } });
                        } else {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: 10 } });
                        }
                        printYear.call(this, cfg.displayDate);
                    }
                }

                target = null;
                value = null;
            },
                applyMarkerMap = function applyMarkerMap() {
                setTimeout(function () {
                    if (cfg.mode === "day" || cfg.mode === "d") {
                        for (var k in this.markerMap) {
                            this.$["body"].find('[data-calendar-item-date="' + k + '"]').addClass(this.markerMap[k].theme || cfg.defaultMarkerTheme);
                        }
                    }
                }.bind(this));
            },
                applySelectionMap = function applySelectionMap() {
                setTimeout(function () {
                    for (var k in this.selectionMap) {
                        this.$["body"].find('[data-calendar-item-date="' + k + '"]').addClass("selected-day");
                    }
                }.bind(this));
            },
                applyPeriodMap = function applyPeriodMap() {
                setTimeout(function () {
                    if (cfg.mode === "day" || cfg.mode === "d") {
                        for (var k in this.periodMap) {
                            if (this.periodMap[k].label) {
                                this.$["body"].find('[data-calendar-item-date="' + k + '"]').find(".addon-footer").html(this.periodMap[k].label);
                            }
                            this.$["body"].find('[data-calendar-item-date="' + k + '"]').addClass(this.periodMap[k].theme);
                        }
                    }
                }.bind(this));
            },
                clearPeriodMap = function clearPeriodMap() {
                if (cfg.mode === "day" || cfg.mode === "d") {
                    for (var k in this.periodMap) {
                        this.$["body"].find('[data-calendar-item-date="' + k + '"]').find(".addon-footer").empty();
                        this.$["body"].find('[data-calendar-item-date="' + k + '"]').removeClass(this.periodMap[k].theme);
                    }
                }
            };

            /**
             * Preferences of calendar UI
             * @method ax5calendar.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Element|nodelist} config.target
             * @param {String} [config.mode=day|month|year]
             * @param {Function} [config.onClick}
             * @returns {ax5calendar}
             * @example
             * ```js
             * var myCalendar = new ax5.ui.calendar();
             * myCalendar.setConfig({
             *  target: $("#target"),
             *  mode: "day"
             * });
             * ```
             */
            //== class body start
            this.init = function () {
                // after setConfig();

                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;

                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5calendar", "401", "setConfig"));
                }
                this.target = jQuery(cfg.target);

                cfg.displayDate = U.date(cfg.displayDate);
                this.target.html(getFrame.call(this));

                // 파트수집
                this.$ = {
                    "root": this.target.find('[data-calendar-els="root"]'),
                    "control": this.target.find('[data-calendar-els="control"]'),
                    "control-display": this.target.find('[data-calendar-els="control-display"]'),
                    "body": this.target.find('[data-calendar-els="body"]')
                };

                if (cfg.control) {
                    this.$["control"].find('[data-calendar-move]').on(cfg.clickEventName, function (e) {
                        move.call(this, e || window.event);
                    }.bind(this));
                }

                // collect selectableMap
                if (cfg.selection) {
                    this.setSelection(cfg.selection, false);
                }
                // collect selectableMap
                if (cfg.selectable) {
                    this.setSelectable(cfg.selectable, false);
                }
                // collect markerMap
                if (cfg.marker) {
                    this.setMarker(cfg.marker, false);
                }

                setTimeout(function () {
                    if (cfg.mode === "day" || cfg.mode === "d") {
                        printDay.call(this, cfg.displayDate);
                    } else if (cfg.mode === "month" || cfg.mode === "m") {
                        printMonth.call(this, cfg.displayDate);
                    } else if (cfg.mode === "year" || cfg.mode === "y") {
                        printYear.call(this, cfg.displayDate);
                    }
                }.bind(this));
            };

            /**
             * @method ax5calendar.changeMode
             * @param {String} mode
             * @param {String} changeDate
             * @returns {ax5calendar}
             */
            this.changeMode = function (mode, changeDate) {
                if (typeof changeDate != "undefined") cfg.displayDate = changeDate;
                if (mode) cfg.mode = mode;

                this.$["body"].removeClass("fadein").addClass("fadeout");
                setTimeout(function () {
                    if (cfg.mode == "day" || cfg.mode == "d") {
                        printDay.call(this, cfg.displayDate);
                    } else if (cfg.mode == "month" || cfg.mode == "m") {
                        printMonth.call(this, cfg.displayDate);
                    } else if (cfg.mode == "year" || cfg.mode == "y") {
                        printYear.call(this, cfg.displayDate);
                    }
                    this.$["body"].removeClass("fadeout").addClass("fadein");
                }.bind(this), cfg.animateTime);

                return this;
            };

            /**
             * @method ax5calendar.setSelection
             * @param {Array} selection
             * @returns {ax5calendar}
             * @example
             * ```
             *
             * ```
             */
            this.setSelection = function () {
                self.selectionMap = {};
                var processor = {
                    'arr': function arr(v, map, count) {
                        map = {};
                        if (!U.isArray(v)) return map;
                        self.selection = v = v.splice(0, count);
                        v.forEach(function (n) {
                            if (U.isDate(n)) n = U.date(n, { 'return': cfg.dateFormat });
                            map[n] = true;
                        });
                        return map;
                    }
                };

                return function (selection, isPrint) {
                    var result = {};
                    selectableCount = cfg.multipleSelect ? U.isNumber(cfg.multipleSelect) ? cfg.multipleSelect : 2 : 1;

                    if (cfg.selection = selection) {
                        if (U.isArray(selection)) {
                            result = processor.arr(selection, {}, selectableCount);
                        } else {
                            return this;
                        }
                    }

                    this.selectionMap = jQuery.extend({}, result);
                    // 변경내용 적용하여 출력

                    if (isPrint !== false) applySelectionMap.call(this);

                    result = null;

                    return this;
                };
            }();

            /**
             * @method ax5calendar.getSelection
             */
            this.getSelection = function () {
                return this.selection;
            };

            /**
             * @method ax5calendar.setSelectable
             */
            this.setSelectable = function () {
                self.selectableMap = {};
                var processor = {
                    'arr': function arr(v, map) {
                        map = {};
                        if (!U.isArray(v)) return map;
                        v.forEach(function (n) {
                            if (U.isDate(n)) n = U.date(n, { 'return': cfg.dateFormat });
                            map[n] = true;
                        });
                        return map;
                    },
                    'obj': function obj(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (v.range) return map;
                        for (var k in v) {
                            map[k] = v[k];
                        }
                        return map;
                    },
                    'range': function range(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (!v.range) return map;

                        v.range.forEach(function (n) {
                            if (U.isDateFormat(n.from) && U.isDateFormat(n.to)) {
                                for (var d = U.date(n.from); d <= U.date(n.to); d.setDate(d.getDate() + 1)) {
                                    map[U.date(d, { "return": cfg.dateFormat })] = true;
                                }
                            } else {
                                for (var i = n.from; i <= n.to; i++) {
                                    map[i] = true;
                                }
                            }
                        });

                        return map;
                    }
                };

                return function (selectable, isPrint) {

                    var key,
                        result = {};

                    if (cfg.selectable = selectable) {
                        if (U.isArray(selectable)) {
                            result = processor.arr(selectable);
                        } else {
                            for (key in processor) {
                                if (selectable[key]) {
                                    result = processor[key](selectable);
                                    break;
                                }
                            }
                            if (Object.keys(result).length === 0) {
                                result = processor.obj(selectable);
                            }
                        }
                    }

                    this.selectableMap = result;
                    // 변경내용 적용하여 출력
                    if (isPrint !== false) this.changeMode();

                    return this;
                };
            }();

            /**
             * @method ax5calendar.setMarker
             */
            this.setMarker = function () {
                self.markerMap = {};
                var processor = {
                    'obj': function obj(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (v.range) return map;
                        for (var k in v) {
                            map[k] = v[k];
                        }

                        v = null;
                        return map;
                    },
                    'range': function range(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (!v.range) return map;

                        v.range.forEach(function (n) {
                            if (U.isDateFormat(n.from) && U.isDateFormat(n.to)) {
                                for (var d = U.date(n.from); d <= U.date(n.to); d.setDate(d.getDate() + 1)) {
                                    map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme, label: n.label };
                                }
                            } else {
                                for (var i = n.from; i <= n.to; i++) {
                                    map[i] = { theme: n.theme, label: n.label };
                                }
                            }
                        });

                        v = null;
                        return map;
                    }
                };

                return function (marker, isApply) {

                    var key,
                        result = {};

                    if (cfg.marker = marker) {
                        for (key in processor) {
                            if (marker[key]) {
                                result = processor[key](marker);
                                break;
                            }
                        }
                        if (Object.keys(result).length === 0) {
                            result = processor.obj(marker);
                        }
                    }

                    this.markerMap = result;
                    // 변경내용 적용하여 출력
                    if (isApply !== false) applyMarkerMap.call(this);
                    return this;
                };
            }();

            /**
             * @method ax5calendar.setPeriod
             */
            this.setPeriod = function () {
                self.periodMap = {};

                var processor = {
                    'range': function range(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (!v.range) return map;

                        v.range.forEach(function (n) {
                            if (U.isDateFormat(n.from) && U.isDateFormat(n.to)) {
                                for (var d = new Date(U.date(n.from)); d <= U.date(n.to); d.setDate(d.getDate() + 1)) {
                                    if (d.getTime() == U.date(n.from).getTime()) {
                                        map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme || cfg.defaultPeriodTheme, label: n.fromLabel };
                                    } else if (d.getTime() == U.date(n.to).getTime()) {
                                        map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme || cfg.defaultPeriodTheme, label: n.toLabel };
                                    } else {
                                        map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme || cfg.defaultPeriodTheme };
                                    }
                                }
                            }
                        });

                        v = null;
                        return map;
                    }
                };

                return function (period, isApply) {

                    var key,
                        result = {};

                    // 변경내용 적용하여 출력
                    if (isApply !== false) {
                        clearPeriodMap.call(this);
                    }

                    if (cfg.period = period) {
                        result = processor.range(period);
                    }

                    this.periodMap = result;

                    //console.log(this.periodMap);

                    // 변경내용 적용하여 출력
                    if (isApply !== false) {
                        applyPeriodMap.call(this);
                    }
                    return this;
                };
            }();

            // 클래스 생성자
            this.main = function () {

                UI.calendar_instance = UI.calendar_instance || [];
                UI.calendar_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5calendar;
    }());
    CALENDAR = ax5.ui.calendar;
})();
// ax5.ui.calendar.tmpl
(function () {

    var CALENDAR = ax5.ui.calendar;

    var frameTmpl = function frameTmpl(columnKeys) {
        return '\n                <div class="ax5-ui-calendar {{theme}}" data-calendar-els="root" onselectstart="return false;">\n                    {{#control}}\n                    <div class="calendar-control" data-calendar-els="control" style="{{controlCSS}}">\n                        <a class="date-move-left" data-calendar-move="left" style="{{controlButtonCSS}}">{{{left}}}</a>\n                        <div class="date-display" data-calendar-els="control-display" style="{{controlCSS}}"></div>\n                        <a class="date-move-right" data-calendar-move="right" style="{{controlButtonCSS}}">{{{right}}}</a>\n                    </div>\n                    {{/control}}\n                    <div class="calendar-body" data-calendar-els="body"></div>\n                </div>\n                ';
    };
    var dayTmpl = function dayTmpl(columnKeys) {
        return '\n                <table data-calendar-table="day" cellpadding="0" cellspacing="0" style="width:100%;">\n                    <thead>\n                        <tr>\n                        {{#weekNames}}\n                            <td class="calendar-col-{{col}}" style="height: {{colHeadHeight}}">\n                            {{label}}\n                            </td>\n                        {{/weekNames}}\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfWeek}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfWeek}}\n                            <td class="calendar-col-{{col}}" style="{{itemStyles}}">\n                                <a class="calendar-item-day {{addClass}}" data-calendar-item-date="{{thisDate}}">\n                                    <span class="addon addon-header"></span>\n                                    {{thisDataLabel}}\n                                    <span class="addon addon-footer"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ';
    };
    var monthTmpl = function monthTmpl(columnKeys) {
        return '\n                <table data-calendar-table="month" cellpadding="0" cellspacing="0" style="width:100%;">\n                    <thead>\n                        <tr>\n                            <td class="calendar-col-0" colspan="3" style="height: {{colHeadHeight}}">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class="calendar-col-{{col}}" style="{{itemStyles}}">\n                                <a class="calendar-item-month {{addClass}}" data-calendar-item-month="{{thisMonth}}">\n                                    <span class="addon"></span>\n                                    {{thisMonthLabel}}\n                                    <span class="lunar"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ';
    };
    var yearTmpl = function yearTmpl(columnKeys) {
        return '\n                <table data-calendar-table="year" cellpadding="0" cellspacing="0" style="width:100%;">\n                    <thead>\n                        <tr>\n                            <td class="calendar-col-0" colspan="4" style="height: {{colHeadHeight}}">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class="calendar-col-{{col}}" style="{{itemStyles}}">\n                                <a class="calendar-item-year {{addClass}}" data-calendar-item-year="{{thisYear}}">\n                                    <span class="addon"></span>\n                                    {{thisYearLabel}}\n                                    <span class="lunar"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ';
    };

    CALENDAR.tmpl = {
        "frameTmpl": frameTmpl,
        "dayTmpl": dayTmpl,
        "monthTmpl": monthTmpl,
        "yearTmpl": yearTmpl,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(CALENDAR.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.picker
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var PICKER;

    UI.addClass({
        className: "picker",
        version: "0.8.0"
    }, function () {
        /**
         * @class ax5picker
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myPicker = new ax5.ui.picker();
         * ```
         */
        var ax5picker = function ax5picker() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                title: '',
                lang: {
                    "ok": "ok",
                    "cancel": "cancel"
                },
                animateTime: 100,
                calendar: {
                    control: {
                        left: ax5.def.picker.date_leftArrow || '&#x02190',
                        yearTmpl: ax5.def.picker.date_yearTmpl || '%s',
                        monthTmpl: ax5.def.picker.date_monthTmpl || '%s',
                        right: ax5.def.picker.date_rightArrow || '&#x02192',
                        yearFirst: true
                    }
                }
            };
            this.queue = [];
            this.activePicker = null;
            this.activePickerQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;

            cfg = this.config;

            var onStateChanged = function onStateChanged(item, that) {
                if (item && item.onStateChanged) {
                    item.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
                bindPickerTarget = function () {

                var pickerEvent = {
                    'focus': function focus(queIdx, e) {
                        this.open(queIdx);
                    },
                    'click': function click(queIdx, e) {
                        this.open(queIdx);
                    }
                };

                var pickerType = {
                    '@fn': function fn(queIdx, _input) {
                        var item = this.queue[queIdx],
                            inputLength = _input.length,
                            config = {
                            inputLength: inputLength || 1
                        };

                        if (inputLength > 1) {
                            config.btns = {
                                ok: { label: cfg.lang["ok"], theme: cfg.theme }
                            };
                        }

                        this.queue[queIdx] = jQuery.extend(true, config, item);

                        config = null;
                        inputLength = null;
                    },
                    'date': function date(queIdx, _input) {
                        // 1. 이벤트 바인딩
                        // 2. ui 준비

                        var item = this.queue[queIdx],
                            contentWidth = item.content ? item.content.width || 270 : 270,
                            contentMargin = item.content ? item.content.margin || 5 : 5,
                            inputLength = _input.length,
                            config = {
                            contentWidth: contentWidth * inputLength + (inputLength - 1) * contentMargin,
                            content: { width: contentWidth, margin: contentMargin },
                            inputLength: inputLength || 1
                        };

                        if (inputLength > 1 && !item.btns) {
                            config.btns = {
                                ok: { label: cfg.lang["ok"], theme: cfg.theme }
                            };
                        }

                        this.queue[queIdx] = jQuery.extend(true, config, item);

                        contentWidth = null;
                        contentMargin = null;
                        config = null;
                        inputLength = null;
                    },
                    'secure-num': function secureNum(queIdx, _input) {
                        var item = this.queue[queIdx],
                            inputLength = _input.length,
                            config = {
                            inputLength: inputLength || 1
                        };

                        this.queue[queIdx] = jQuery.extend(true, config, item);

                        config = null;
                        inputLength = null;
                    },
                    'keyboard': function keyboard(queIdx, _input) {
                        var item = this.queue[queIdx],
                            inputLength = _input.length,
                            config = {
                            inputLength: inputLength || 1
                        };

                        this.queue[queIdx] = jQuery.extend(true, config, item);

                        config = null;
                        inputLength = null;
                    },
                    'numpad': function numpad(queIdx, _input) {
                        var item = this.queue[queIdx],
                            inputLength = _input.length,
                            config = {
                            inputLength: inputLength || 1
                        };

                        this.queue[queIdx] = jQuery.extend(true, config, item);

                        config = null;
                        inputLength = null;
                    }
                };

                return function (queIdx) {
                    var item = this.queue[queIdx],
                        input;

                    if (!item.content) {
                        console.log(ax5.info.getError("ax5picker", "501", "bind"));
                        return this;
                    }

                    input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : item.$target.find('input[type]');

                    // 함수타입
                    if (U.isFunction(item.content)) {
                        pickerType["@fn"].call(this, queIdx, input);
                    } else {
                        for (var key in pickerType) {
                            if (item.content.type == key) {
                                pickerType[key].call(this, queIdx, input);
                                break;
                            }
                        }
                    }

                    input.unbind('focus.ax5picker').unbind('click.ax5picker').bind('focus.ax5picker', pickerEvent.focus.bind(this, queIdx)).bind('click.ax5picker', pickerEvent.click.bind(this, queIdx));

                    item.$target.find('.input-group-addon').unbind('click.ax5picker').bind('click.ax5picker', pickerEvent.click.bind(this, queIdx));

                    if (item.content.formatter && ax5.ui.formatter) {
                        input.ax5formatter(item.content.formatter);
                    }

                    input = null;
                    item = null;
                    queIdx = null;
                    return this;
                };
            }(),
                alignPicker = function alignPicker(append) {
                if (!this.activePicker) return this;

                var _alignPicker = function _alignPicker(item) {
                    var $window = jQuery(window),
                        $body = jQuery(document.body);
                    var pos = {},
                        positionMargin = 12,
                        dim = {},
                        pickerDim = {},
                        pickerDirection;

                    pos = item.$target.offset();
                    dim = {
                        width: item.$target.outerWidth(),
                        height: item.$target.outerHeight()
                    };
                    pickerDim = {
                        winWidth: Math.max($window.width(), $body.width()),
                        winHeight: Math.max($window.height(), $body.height()),
                        width: this.activePicker.outerWidth(),
                        height: this.activePicker.outerHeight()
                    };

                    // picker css(width, left, top) & direction 결정
                    if (!item.direction || item.direction === "" || item.direction === "auto") {
                        // set direction
                        pickerDirection = "top";
                        if (pos.top - pickerDim.height - positionMargin < 0) {
                            pickerDirection = "top";
                        } else if (pos.top + dim.height + pickerDim.height + positionMargin > pickerDim.winHeight) {
                            pickerDirection = "bottom";
                        }
                    } else {
                        pickerDirection = item.direction;
                    }

                    if (append) {
                        this.activePicker.addClass("direction-" + pickerDirection);
                    }

                    var positionCSS = function () {
                        var css = { left: 0, top: 0 };
                        switch (pickerDirection) {
                            case "top":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top + dim.height + positionMargin;
                                break;
                            case "bottom":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top - pickerDim.height - positionMargin;
                                break;
                            case "left":
                                css.left = pos.left + dim.width + positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                            case "right":
                                css.left = pos.left - pickerDim.width - positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                        }
                        return css;
                    }();

                    (function () {
                        if (pickerDirection == "top" || pickerDirection == "bottom") {
                            if (positionCSS.left < 0) {
                                positionCSS.left = positionMargin;
                                this.activePickerArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            } else if (positionCSS.left + pickerDim.width > pickerDim.winWidth) {
                                positionCSS.left = pickerDim.winWidth - pickerDim.width - positionMargin;
                                this.activePickerArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            }
                        }
                    }).call(this);

                    this.activePicker.css(positionCSS);
                };

                var item = this.queue[this.activePickerQueueIndex];

                if (append) jQuery(document.body).append(this.activePicker);
                setTimeout(function () {
                    _alignPicker.call(this, item);
                }.bind(this));
            },
                onBodyClick = function onBodyClick(e, target) {
                if (!this.activePicker) return this;

                var item = this.queue[this.activePickerQueueIndex];

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-picker-els")) {
                        return true;
                    } else if (item.$target.get(0) == target) {
                        return true;
                    }
                });
                if (!target) {
                    //console.log("i'm not picker");
                    this.close();
                    return this;
                }
                //console.log("i'm picker");
                return this;
            },
                onBtnClick = function onBtnClick(e, target) {
                // console.log('btn click');
                if (e.srcElement) e.target = e.srcElement;

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-picker-btn")) {
                        return true;
                    }
                });

                if (target) {
                    var item = this.queue[this.activePickerQueueIndex],
                        k = target.getAttribute("data-picker-btn");

                    if (item.btns && item.btns[k].onClick) {
                        var that = {
                            key: k,
                            value: item.btns[k],
                            self: this,
                            item: item
                        };
                        item.btns[k].onClick.call(that, k);
                    } else {
                        this.close();
                    }
                }
            },
                onBodyKeyup = function onBodyKeyup(e) {
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                }
            },
                getQueIdx = function getQueIdx(boundID) {
                if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-axpicker-id");
                }
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5picker", "402", "getQueIdx"));
                    return;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            };
            /// private end

            /**
             * Preferences of picker UI
             * @method ax5picker.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5picker}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
            };

            this.bind = function (item) {
                var pickerConfig = {},
                    queIdx;

                item = jQuery.extend(true, pickerConfig, cfg, item);

                if (!item.target) {
                    console.log(ax5.info.getError("ax5picker", "401", "bind"));
                    return this;
                }
                item.$target = jQuery(item.target);

                if (!item.$target.get(0)) {
                    console.log(ax5.info.getError("ax5picker", "401", "bind"));
                    return this;
                }

                if (!item.id) item.id = item.$target.data("data-axpicker-id");

                if (!item.id) {
                    item.id = 'ax5-picker-' + ax5.getGuid();
                    item.$target.data("data-axpicker-id", item.id);
                }
                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindPickerTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindPickerTarget.call(this, queIdx);
                }

                pickerConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * @method ax5picker.setContentValue
             * @param {String} boundID
             * @param {Number} inputIndex
             * @param {String} val
             * @returns {ax5picker} this
             */
            this.setContentValue = function (boundID, inputIndex, val) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                var item = this.queue[queIdx];
                var _input;

                if (item) {

                    _input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : jQuery(item.$target.find('input[type]').get(inputIndex));
                    _input.val(val);

                    onStateChanged.call(this, item, {
                        self: self,
                        state: "changeValue",
                        item: item,
                        value: val
                    });

                    if (item.inputLength == 1) {
                        this.close();
                    }
                }

                item = null;
                boundID = null;
                inputIndex = null;
                val = null;
                return this;
            };

            /**
             * @method ax5picker.open
             * @param {String} boundObjectId
             * @returns {ax5picker} this
             */
            this.open = function () {

                var pickerContent = {
                    '@fn': function fn(queIdx, callback) {
                        var item = this.queue[queIdx];
                        item.content.call(item, function (html) {
                            callback(html);
                        });
                        return true;
                    },
                    'date': function date(queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div ' + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" ' + 'class="ax-picker-content-box" ' + 'data-calendar-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        var calendarConfig = jQuery.extend({}, cfg.calendar, { displayDate: new Date() });
                        var input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : item.$target.find('input[type]');

                        // calendar bind
                        item.pickerContent.find('[data-calendar-target]').each(function () {

                            // calendarConfig extend ~
                            var idx = this.getAttribute("data-calendar-target"),
                                dValue = input.get(idx).value,
                                d = ax5.util.date(dValue);

                            calendarConfig.displayDate = d;
                            if (dValue) calendarConfig.selection = [d];
                            calendarConfig = jQuery.extend(true, calendarConfig, item.content.config || {});
                            calendarConfig.target = this;
                            calendarConfig.onClick = function () {
                                self.setContentValue(item.id, idx, this.date);
                            };

                            new ax5.ui.calendar(calendarConfig);
                        });
                    },
                    'secure-num': function secureNum(queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div ' + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" ' + 'class="ax-picker-content-box" ' + 'data-secure-num-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        // secure-num bind
                        item.pickerContent.find('[data-secure-num-target]').each(function () {
                            var idx = this.getAttribute("data-secure-num-target"),
                                po = [];

                            var numArray = function (a) {
                                var j, x, i;
                                for (i = a.length; i; i -= 1) {
                                    j = Math.floor(Math.random() * i);
                                    x = a[i - 1];
                                    a[i - 1] = a[j];
                                    a[j] = x;
                                }
                                return a;
                            }([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

                            var specialArray = [{ label: "&#x02190", fn: "back" }, { label: "C", fn: "clear" }];

                            numArray.forEach(function (n) {
                                po.push('<div style="float:left;' + item.content.config.btnWrapStyle + '">');
                                po.push('<button class="btn btn-default btn-' + item.content.config.btnTheme + '" ' + 'style="' + item.content.config.btnStyle + '" data-secure-num-value="' + n + '">' + n + '</button>');
                                po.push('</div>');
                            });
                            specialArray.forEach(function (n) {
                                po.push('<div style="float:left;' + item.content.config.btnWrapStyle + '">');
                                po.push('<button class="btn btn-default btn-' + item.content.config.specialBtnTheme + '" ' + 'style="' + item.content.config.btnStyle + '" data-secure-num-value="' + n.fn + '">' + n.label + '</button>');
                                po.push('</div>');
                            });

                            po.push('<div style="clear:both;"></div>');

                            $(this).html(po.join('')).on("click", '[data-secure-num-value]', function () {
                                var act = this.getAttribute("data-secure-num-value");
                                var _input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : jQuery(item.$target.find('input[type]').get(idx));
                                var val = _input.val();

                                if (act == "back") {
                                    _input.val(val.substring(0, val.length - 1));
                                } else if (act == "clear") {
                                    _input.val('');
                                } else {
                                    _input.val(val + act);
                                }

                                onStateChanged.call(this, item, {
                                    self: self,
                                    state: "changeValue",
                                    item: item,
                                    value: _input.val()
                                });
                            });
                        });
                    },
                    'keyboard': function keyboard(queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div ' + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" ' + 'class="ax-picker-content-box" ' + 'data-keyboard-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        var keyArray = [[{ value: "`", shiftValue: "~" }, { value: "1", shiftValue: "!" }, { value: "2", shiftValue: "@" }, { value: "3", shiftValue: "#" }, { value: "4", shiftValue: "$" }, { value: "5", shiftValue: "%" }, { value: "6", shiftValue: "^" }, { value: "7", shiftValue: "&" }, { value: "8", shiftValue: "*" }, { value: "9", shiftValue: "(" }, { value: "0", shiftValue: ")" }, { value: "-", shiftValue: "_" }, { value: "=", shiftValue: "+" }, { label: "&#x02190", fn: "back" }], [{ value: "q", shiftValue: "Q" }, { value: "w", shiftValue: "W" }, { value: "e", shiftValue: "E" }, { value: "r", shiftValue: "R" }, { value: "t", shiftValue: "T" }, { value: "y", shiftValue: "Y" }, { value: "u", shiftValue: "U" }, { value: "i", shiftValue: "I" }, { value: "o", shiftValue: "O" }, { value: "p", shiftValue: "P" }, { value: "[", shiftValue: "{" }, { value: "]", shiftValue: "}" }, { value: "\\", shiftValue: "|" }], [{ label: "Clear", fn: "clear" }, { value: "a", shiftValue: "A" }, { value: "s", shiftValue: "S" }, { value: "d", shiftValue: "D" }, { value: "f", shiftValue: "F" }, { value: "g", shiftValue: "G" }, { value: "h", shiftValue: "H" }, { value: "j", shiftValue: "J" }, { value: "k", shiftValue: "K" }, { value: "l", shiftValue: "L" }, { value: ";", shiftValue: ":" }, { value: "'", shiftValue: "\"" }], [{ label: "Shift", fn: "shift" }, { value: "z", shiftValue: "Z" }, { value: "x", shiftValue: "X" }, { value: "c", shiftValue: "C" }, { value: "v", shiftValue: "V" }, { value: "b", shiftValue: "B" }, { value: "n", shiftValue: "N" }, { value: "m", shiftValue: "M" }, { value: ",", shiftValue: "<" }, { value: ".", shiftValue: ">" }, { value: "/", shiftValue: "?" }, { label: "Close", fn: "close" }]];
                        var specialArray = [{ label: "&#x02190", fn: "back" }, { label: "C", fn: "clear" }];

                        var getKeyBoard = function getKeyBoard(isShiftKey) {
                            var po = [];
                            keyArray.forEach(function (row) {
                                po.push('<div style="display: table;margin:0 auto;">');
                                row.forEach(function (n) {

                                    var keyValue, keyLabel, btnWrapStyle, btnTheme, btnStyle;
                                    if (n.fn) {
                                        keyValue = n.fn;
                                        keyLabel = n.label;
                                        btnWrapStyle = item.content.config.specialBtnWrapStyle;
                                        btnTheme = item.content.config.specialBtnTheme;
                                        btnStyle = item.content.config.specialBtnStyle;
                                    } else {
                                        keyLabel = keyValue = isShiftKey ? n.shiftValue : n.value;
                                        btnWrapStyle = item.content.config.btnWrapStyle;
                                        btnTheme = item.content.config.btnTheme;
                                        btnStyle = item.content.config.btnStyle;
                                    }

                                    po.push('<div style="display: table-cell;' + btnWrapStyle + '">');
                                    po.push('<button class="btn btn-default btn-' + btnTheme + '" ' + 'style="' + btnStyle + '" data-keyboard-value="' + keyValue + '">' + keyLabel + '</button>');
                                    po.push('</div>');
                                });
                                po.push('</div>');
                            });
                            return po.join('');
                        };

                        // secure-num bind
                        item.pickerContent.find('[data-keyboard-target]').each(function () {
                            var idx = this.getAttribute("data-keyboard-target");
                            var $this = $(this);
                            var isShiftKey = false;
                            var toggleShift = function toggleShift() {
                                isShiftKey = !isShiftKey;
                                $this.html(getKeyBoard(isShiftKey));
                            };
                            $this.html(getKeyBoard(isShiftKey)).on("mousedown", '[data-keyboard-value]', function () {
                                var act = this.getAttribute("data-keyboard-value");
                                var _input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : jQuery(item.$target.find('input[type]').get(idx));
                                var val = _input.val();

                                switch (act) {
                                    case "back":
                                        _input.val(val.substring(0, val.length - 1));
                                        break;
                                    case "clear":
                                        _input.val('');
                                        break;
                                    case "shift":
                                        toggleShift();
                                        return false;
                                        break;
                                    case "close":
                                        self.close();
                                        return false;
                                        break;
                                    default:
                                        _input.val(val + act);
                                }

                                onStateChanged.call(this, item, {
                                    self: self,
                                    state: "changeValue",
                                    item: item,
                                    value: _input.val()
                                });
                            });
                        });
                    },
                    'numpad': function numpad(queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div ' + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" ' + 'class="ax-picker-content-box" ' + 'data-numpad-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        // secure-num bind
                        item.pickerContent.find('[data-numpad-target]').each(function () {
                            var idx = this.getAttribute("data-numpad-target"),
                                po = [];

                            var keyArray = item.content.config.keyArray || [{ value: "7" }, { value: "8" }, { value: "9" }, { label: "BS", fn: "back" }, { value: "4" }, { value: "5" }, { value: "6" }, { label: "CLS", fn: "clear" }, { value: "1" }, { value: "2" }, { value: "3" }, { value: "" }, { value: "." }, { value: "0" }, { value: "" }, { label: "OK", fn: "enter" }];

                            keyArray.forEach(function (n) {
                                var keyValue, keyLabel, btnWrapStyle, btnTheme, btnStyle;

                                if (n.fn) {
                                    keyValue = n.fn;
                                    keyLabel = n.label;
                                    btnTheme = item.content.config.specialBtnTheme;
                                    btnWrapStyle = item.content.config.specialBtnWrapStyle;
                                    btnStyle = item.content.config.specialBtnStyle;
                                } else {
                                    keyLabel = keyValue = n.value;
                                    btnTheme = keyValue ? item.content.config.btnTheme : "";
                                    btnWrapStyle = item.content.config.btnWrapStyle;
                                    btnStyle = item.content.config.btnStyle;
                                }

                                po.push('<div style="float:left;' + btnWrapStyle + '">');
                                po.push('<button class="btn btn-default btn-' + btnTheme + '" ' + 'style="' + btnStyle + '" data-numpad-value="' + keyValue + '">' + (keyLabel || "&nbsp;") + '</button>');
                                po.push('</div>');
                            });

                            po.push('<div style="clear:both;"></div>');

                            $(this).html(po.join('')).on("mousedown", '[data-numpad-value]', function () {
                                var act = this.getAttribute("data-numpad-value");
                                var _input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : jQuery(item.$target.find('input[type]').get(idx));
                                var val = _input.val();
                                var state = "";

                                switch (act) {
                                    case "back":
                                        state = "changeValue";
                                        _input.val(val.substring(0, val.length - 1));
                                        break;
                                    case "clear":
                                        state = "changeValue";
                                        _input.val('');
                                        break;
                                    case "enter":
                                        self.close(item, "enter");
                                        return false;
                                        break;
                                    case "close":
                                        self.close();
                                        return false;
                                        break;
                                    default:
                                        state = "changeValue";
                                        _input.val(val + act);
                                }

                                onStateChanged.call(this, item, {
                                    self: self,
                                    state: state,
                                    item: item,
                                    value: _input.val()
                                });
                            });
                        });
                    }
                };

                return function (boundID, tryCount) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    var item = this.queue[queIdx];

                    /**
                     다른 피커가 있는 경우와 다른 피커를 닫고 다시 오픈 명령이 내려진 경우에 대한 예외 처리 구문
                     */
                    if (this.openTimer) clearTimeout(this.openTimer);
                    if (this.activePicker) {
                        if (this.activePickerQueueIndex == queIdx) {
                            return this;
                        }

                        if (tryCount > 2) return this;
                        this.close();
                        this.openTimer = setTimeout(function () {
                            this.open(queIdx, (tryCount || 0) + 1);
                        }.bind(this), cfg.animateTime);
                        return this;
                    }

                    this.activePicker = jQuery(PICKER.tmpl.get.call(this, "pickerTmpl", item));
                    this.activePickerArrow = this.activePicker.find(".ax-picker-arrow");
                    this.activePickerQueueIndex = queIdx;
                    item.pickerContent = this.activePicker.find('[data-picker-els="content"]');

                    if (U.isFunction(item.content)) {
                        // 함수타입
                        item.pickerContent.html("Loading..");
                        pickerContent["@fn"].call(this, queIdx, function (html) {
                            item.pickerContent.html(html);
                        });
                    } else {
                        if (item.content.type in pickerContent) {
                            pickerContent[item.content.type].call(this, queIdx);
                        }
                    }

                    // bind event picker btns
                    this.activePicker.find("[data-picker-btn]").on(cfg.clickEventName, function (e) {
                        onBtnClick.call(this, e || window.event, queIdx);
                    }.bind(this));

                    alignPicker.call(this, "append");

                    jQuery(window).bind("resize.ax5picker", function () {
                        alignPicker.call(this);
                    }.bind(this));

                    // bind key event
                    jQuery(window).bind("keyup.ax5picker", function (e) {
                        e = e || window.event;
                        onBodyKeyup.call(this, e);
                        U.stopEvent(e);
                    }.bind(this));

                    jQuery(window).bind("click.ax5picker", function (e) {
                        e = e || window.event;
                        onBodyClick.call(this, e);
                        U.stopEvent(e);
                    }.bind(this));

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "open",
                        item: item
                    });

                    return this;
                };
            }();

            /**
             * @method ax5picker.close
             * @returns {ax5picker} this
             */
            this.close = function (item, state) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activePicker) return this;

                item = this.queue[this.activePickerQueueIndex];

                this.activePicker.addClass("destroy");
                jQuery(window).unbind("resize.ax5picker");
                jQuery(window).unbind("click.ax5picker");
                jQuery(window).unbind("keyup.ax5picker");

                this.closeTimer = setTimeout(function () {
                    if (this.activePicker) this.activePicker.remove();
                    this.activePicker = null;
                    this.activePickerQueueIndex = -1;

                    onStateChanged.call(this, item, {
                        self: this,
                        state: state || "close"
                    });
                }.bind(this), cfg.animateTime);

                return this;
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5picker;
    }());

    PICKER = ax5.ui.picker;
})();

/**
 * ax5.ui.picker_instance
 * @type {ax5picker}
 * @example
 * ```js
 * // picker 기본 속성을 변경해야 한다면
 * ax5.ui.picker_instance.setConfig({
 * });
 *
 * ```
 */
ax5.ui.picker_instance = new ax5.ui.picker();

jQuery.fn.ax5picker = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.picker_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.picker_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.picker_instance.setContentValue(this, arguments[1], arguments[2]);
                    break;
                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend(true, config, defaultConfig);
                ax5.ui.picker_instance.bind(config);
            });
        }
        return this;
    };
}();
// ax5.ui.picker.tmpl
(function () {
    var PICKER = ax5.ui.picker;
    var U = ax5.util;

    var pickerTmpl = function pickerTmpl() {
        return '\n<div class="ax5-ui-picker {{theme}}" id="{{id}}" data-picker-els="root">\n    {{#title}}\n        <div class="ax-picker-heading">{{title}}</div>\n    {{/title}}\n    <div class="ax-picker-body">\n        <div class="ax-picker-content" data-picker-els="content" style="width:{{contentWidth}}px;"></div>\n        {{#btns}}\n            <div class="ax-picker-buttons">\n            {{#btns}}\n                {{#@each}}\n                <button data-picker-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>\n                {{/@each}}\n            {{/btns}}\n            </div>\n        {{/btns}}\n    </div>\n    <div class="ax-picker-arrow"></div>\n</div>\n';
    };

    PICKER.tmpl = {
        "pickerTmpl": pickerTmpl,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(PICKER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.formatter
(function () {
    var UI = ax5.ui;
    var U = ax5.util;
    var FORMATTER;

    UI.addClass({
        className: "formatter",
        version: "0.6.1"
    }, function () {
        var TODAY = new Date();
        var setSelectionRange = function setSelectionRange(input, pos) {
            if (typeof pos == "undefined") {
                pos = input.value.length;
            }
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(pos, pos);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            } else if (input.selectionStart) {
                input.focus();
                input.selectionStart = pos;
                input.selectionEnd = pos;
            }
        };

        /**
         * @class ax5formatter
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var formatter = new ax5.ui.formatter();
         * ```
         */
        var ax5formatter = function ax5formatter() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                animateTime: 250
            };

            this.queue = [];
            this.openTimer = null;
            this.closeTimer = null;

            cfg = this.config;

            var formatterEvent = {
                'focus': function focus(opts, optIdx, e) {
                    if (!opts.$input.data("__originValue__")) opts.$input.data("__originValue__", opts.$input.val());
                },
                /* 키 다운 이벤트에서 입력할 수 없는 키 입력을 방어 */
                'keydown': function keydown(opts, optIdx, e) {
                    var isStop = false;
                    if (!opts.enterableKeyCodes) {} else if (e.which && opts.enterableKeyCodes[e.which]) {} else if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                        //console.log(e.which, opts.enterableKeyCodes);
                        isStop = true;
                    }
                    if (isStop) ax5.util.stopEvent(e);
                },
                /* 키 업 이벤트에서 패턴을 적용 */
                'keyup': function keyup(opts, optIdx, e) {
                    var elem = opts.$input.get(0),
                        elemFocusPosition,
                        beforeValue,
                        newValue,
                        selection,
                        selectionLength;

                    if ('selectionStart' in elem) {
                        // Standard-compliant browsers
                        elemFocusPosition = elem.selectionStart;
                    } else if (document.selection) {
                        // IE
                        //elem.focus();
                        selection = document.selection.createRange();
                        selectionLength = document.selection.createRange().text.length;
                        selection.moveStart('character', -elem.value.length);
                        elemFocusPosition = selection.text.length - selectionLength;
                    }

                    beforeValue = elem.value;
                    if (opts.pattern in FORMATTER.formatter) {
                        newValue = FORMATTER.formatter[opts.pattern].getPatternValue.call(this, opts, optIdx, e, elem.value);
                    } else {
                        newValue = beforeValue;
                    }

                    if (newValue != beforeValue) {
                        opts.$input.val(newValue).trigger("change");
                        setSelectionRange(elem, elemFocusPosition + newValue.length - beforeValue.length);
                    }
                },
                'blur': function blur(opts, optIdx, e, _force) {
                    var elem = opts.$input.get(0),
                        beforeValue,
                        newValue;

                    opts.$input.removeData("__originValue__");

                    beforeValue = elem.value;
                    if (opts.pattern in FORMATTER.formatter) {
                        newValue = FORMATTER.formatter[opts.pattern].getPatternValue.call(this, opts, optIdx, e, elem.value, 'blur');
                    } else {
                        newValue = beforeValue;
                    }

                    if (_force) {
                        opts.$input.val(newValue);
                    } else {
                        if (newValue != beforeValue) {
                            opts.$input.val(newValue).trigger("change");
                        }
                    }
                }
            },
                bindFormatterTarget = function bindFormatterTarget(opts, optIdx) {

                if (!opts.pattern) {
                    if (opts.$target.get(0).tagName == "INPUT") {
                        opts.pattern = opts.$target.attr('data-ax5formatter');
                    } else {
                        opts.pattern = opts.$target.find('input[type="text"]').attr('data-ax5formatter');
                    }
                    if (!opts.pattern) {
                        console.log(ax5.info.getError("ax5formatter", "501", "bind"));
                        console.log(opts.target);
                        return this;
                    }
                }

                var re = /[^\(^\))]+/gi,
                    matched = opts.pattern.match(re);

                opts.pattern = matched[0];
                opts.patternArgument = matched[1] || "";

                // 함수타입
                if (opts.pattern in FORMATTER.formatter) {
                    opts.enterableKeyCodes = FORMATTER.formatter[opts.pattern].getEnterableKeyCodes.call(this, opts, optIdx);
                }

                opts.$input.unbind('focus.ax5formatter').bind('focus.ax5formatter', formatterEvent.focus.bind(this, this.queue[optIdx], optIdx));

                opts.$input.unbind('keydown.ax5formatter').bind('keydown.ax5formatter', formatterEvent.keydown.bind(this, this.queue[optIdx], optIdx));

                opts.$input.unbind('keyup.ax5formatter').bind('keyup.ax5formatter', formatterEvent.keyup.bind(this, this.queue[optIdx], optIdx));

                opts.$input.unbind('blur.ax5formatter').bind('blur.ax5formatter', formatterEvent.blur.bind(this, this.queue[optIdx], optIdx));

                formatterEvent.blur.call(this, this.queue[optIdx], optIdx);

                return this;
            },
                getQueIdx = function getQueIdx(boundID) {
                if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-formatter");
                }
                /*
                 if (!U.isString(boundID)) {
                 console.log(ax5.info.getError("ax5formatter", "402", "getQueIdx"));
                 return;
                 }
                 */
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            };

            /**
             * Preferences of formatter UI
             * @method ax5formatter.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5.ui.formatter}
             * @example
             * ```
             * ```
             */
            this.init = function () {};

            this.bind = function (opts) {
                var formatterConfig = {},
                    optIdx;

                jQuery.extend(true, formatterConfig, cfg);
                if (opts) jQuery.extend(true, formatterConfig, opts);
                opts = formatterConfig;

                if (!opts.target) {
                    console.log(ax5.info.getError("ax5formatter", "401", "bind"));
                    return this;
                }
                opts.$target = jQuery(opts.target);

                if (opts.$target.get(0).tagName == "INPUT") {
                    opts.$input = opts.$target;
                } else {
                    opts.$input = opts.$target.find('input[type="text"]');
                    if (opts.$input.length > 1) {
                        opts.$input.each(function () {
                            opts.target = this;
                            self.bind(opts);
                        });
                        return this;
                    }
                }

                opts.$input = opts.$target.get(0).tagName == "INPUT" ? opts.$target : opts.$target.find('input[type="text"]');
                if (!opts.id) opts.id = opts.$input.data("ax5-formatter");

                if (!opts.id) {
                    opts.id = 'ax5-formatter-' + ax5.getGuid();
                    opts.$input.data("ax5-formatter", opts.id);
                }
                optIdx = U.search(this.queue, function () {
                    return this.id == opts.id;
                });

                if (optIdx === -1) {
                    this.queue.push(opts);
                    bindFormatterTarget.call(this, this.queue[this.queue.length - 1], this.queue.length - 1);
                } else {
                    this.queue[optIdx] = opts;
                    bindFormatterTarget.call(this, this.queue[optIdx], optIdx);
                }

                return this;
            };

            /**
             * formatter value 를 다시 적용합니다.
             * @method ax5formatter.formatting
             * @returns {ax5formatter}
             * @example
             * ```js
             * $('[data-ax5formatter="time"]').ax5formatter("formatting"); // 하나만
             * $('[data-ax5formatter]').ax5formatter("formatting"); // 모두
             * ```
             */
            this.formatting = function (boundID) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    var i = this.queue.length;
                    while (i--) {
                        formatterEvent.blur.call(this, this.queue[i], i, null, true);
                    }
                } else {
                    formatterEvent.blur.call(this, this.queue[queIdx], queIdx, null, true);
                }
                return this;
            };

            this.unbind = function () {
                // 구현해야함.
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5formatter;
    }());

    FORMATTER = ax5.ui.formatter;
})();

ax5.ui.formatter_instance = new ax5.ui.formatter();

jQuery.fn.ax5formatter = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "formatting":
                    return ax5.ui.formatter_instance.formatting(this);
                    break;

                case "unbind":
                    return ax5.ui.formatter_instance.unbind(this);
                    break;

                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.formatter_instance.bind(config);
            });
        }
        return this;
    };
}();

// ax5.ui.formatter.formatter
(function () {

    var FORMATTER = ax5.ui.formatter;
    var U = ax5.util;
    var ctrlKeys = {
        "18": "KEY_ALT",
        "8": "KEY_BACKSPACE",
        "17": "KEY_CONTROL",
        "46": "KEY_DELETE",
        "40": "KEY_DOWN",
        "35": "KEY_END",
        "187": "KEY_EQUAL",
        "27": "KEY_ESC",
        "36": "KEY_HOME",
        "45": "KEY_INSERT",
        "37": "KEY_LEFT",
        "189": "KEY_MINUS",
        "34": "KEY_PAGEDOWN",
        "33": "KEY_PAGEUP",
        // "190": "KEY_PERIOD",
        "13": "KEY_RETURN",
        "39": "KEY_RIGHT",
        "16": "KEY_SHIFT",
        // "32": "KEY_SPACE",
        "9": "KEY_TAB",
        "38": "KEY_UP",
        "91": "KEY_WINDOW"
        //"107" : "NUMPAD_ADD",
        //"194" : "NUMPAD_COMMA",
        //"110" : "NUMPAD_DECIMAL",
        //"111" : "NUMPAD_DIVIDE",
        //"12" : "NUMPAD_EQUAL",
        //"106" : "NUMPAD_MULTIPLY",
        //"109" : "NUMPAD_SUBTRACT"
    };
    var numKeys = {
        '48': 1, '49': 1, '50': 1, '51': 1, '52': 1, '53': 1, '54': 1, '55': 1, '56': 1, '57': 1,
        '96': 1, '97': 1, '98': 1, '99': 1, '100': 1, '101': 1, '102': 1, '103': 1, '104': 1, '105': 1
    };
    var pattern_money = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '188': ','
            };
            if (_opts.patternArgument == "int") {
                // 소수점 입력 안됨
            } else {
                enterableKeyCodes['190'] = "."; // 소수점 입력 허용
            }
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/[^0-9^\.^\-]/g, "");
            var regExpPattern = new RegExp('([0-9])([0-9][0-9][0-9][,.])'),
                arrNumber = val.split('.'),
                returnValue;

            arrNumber[0] += '.';

            do {
                arrNumber[0] = arrNumber[0].replace(regExpPattern, '$1,$2');
            } while (regExpPattern.test(arrNumber[0]));

            if (arrNumber.length > 1) {
                if (U.isNumber(_opts.maxRound)) {
                    returnValue = arrNumber[0] + U.left(arrNumber[1], _opts.maxRound);
                } else {
                    returnValue = arrNumber.join('');
                }
            } else {
                returnValue = arrNumber[0].split('.')[0];
            }

            return returnValue;
        }
    };

    var pattern_number = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '190': '.'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/[^0-9^\.^\-]/g, "");
            var arrNumber = val.split('.'),
                returnValue;

            if (arrNumber.length > 1) {
                if (U.isNumber(_opts.maxRound)) {
                    returnValue = arrNumber[0] + U.left(arrNumber[1], _opts.maxRound);
                } else {
                    returnValue = arrNumber.join('');
                }
            } else {
                returnValue = arrNumber[0].split('.')[0];
            }

            return returnValue;
        }
    };

    var pattern_date = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-', '191': '/'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            if (val == "") return val;
            var regExpPattern = /^([0-9]{4})\-?([0-9]{1,2})?\-?([0-9]{1,2})?.*$/;

            if (_opts.patternArgument == "time") {
                regExpPattern = /^([0-9]{4})\-?([0-9]{1,2})?\-?([0-9]{1,2})? ?([0-9]{1,2})?:?([0-9]{1,2})?:?([0-9]{1,2})?.*$/;
            }

            var matchedPattern = val.match(regExpPattern),
                returnValue = "",
                inspectValue = function inspectValue(val, format, inspect, data) {
                var _val = {
                    'Y': function Y(v) {
                        if (typeof v == "undefined") v = TODAY.getFullYear();
                        if (v == '' || v == '0000') v = TODAY.getFullYear();
                        return v.length < 4 ? U.setDigit(v, 4) : v;
                    },
                    'M': function M(v) {
                        if (typeof v == "undefined") v = TODAY.getMonth() + 1;
                        return v > 12 ? 12 : v == 0 ? '01' : U.setDigit(v, 2);
                    },
                    'D': function D(v) {
                        if (typeof v == "undefined") v = TODAY.getDate() + 1;
                        var dLen = U.daysOfMonth(data[1], data[2] - 1);
                        return v > dLen ? dLen : v == 0 ? '01' : U.setDigit(v, 2);
                    },
                    'h': function h(v) {
                        if (!v) v = 0;
                        return v > 23 ? 23 : U.setDigit(v, 2);
                    },
                    'm': function m(v) {
                        if (!v) v = 0;
                        return v > 59 ? 59 : U.setDigit(v, 2);
                    },
                    's': function s(v) {
                        if (!v) v = 0;
                        return v > 59 ? 59 : U.setDigit(v, 2);
                    }
                };
                return inspect ? _val[format](val) : val;
            };

            returnValue = val.replace(regExpPattern, function (a, b) {
                var nval = [inspectValue(arguments[1], "Y", eType)];
                if (arguments[2] || eType) nval.push('-' + inspectValue(arguments[2], "M", eType));
                if (arguments[3] || eType) nval.push('-' + inspectValue(arguments[3], "D", eType, arguments));
                if (_opts.patternArgument == "time") {
                    if (arguments[4] || eType) nval.push(' ' + inspectValue(arguments[4], "h", eType));
                    if (arguments[5] || eType) nval.push(':' + inspectValue(arguments[5], "m", eType));
                    if (arguments[6] || eType) nval.push(':' + inspectValue(arguments[6], "s", eType));
                }
                return nval.join('');
            });

            if (eType == 'blur' && !matchedPattern) {
                returnValue = function () {
                    var nval = [inspectValue(returnValue, "Y", eType)];
                    nval.push('-' + inspectValue(0, "M", eType));
                    nval.push('-' + inspectValue(0, "D", eType, arguments));
                    if (_opts.patternArgument == "time") {
                        nval.push(' ' + inspectValue(0, "h", eType));
                        nval.push(':' + inspectValue(0, "m", eType));
                        nval.push(':' + inspectValue(0, "s", eType));
                    }
                    return nval.join('');
                }();
            } else if (!matchedPattern) returnValue = returnValue.length > 4 ? U.left(returnValue, 4) : returnValue;

            return returnValue;
        }
    };

    var pattern_time = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '186': ':'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            var regExpPattern = /^([0-9]{1,2})?:?([0-9]{1,2})?:?([0-9]{1,2})?.*$/;

            var matchedPattern = val.match(regExpPattern),
                returnValue = val.replace(regExpPattern, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(':' + arguments[2]);
                if (arguments[3]) nval.push(':' + arguments[3]);
                return nval.join('');
            });

            if (!matchedPattern) returnValue = returnValue.length > 2 ? U.left(returnValue, 2) : returnValue;

            return returnValue;
        }
    };

    var pattern_bizno = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            var regExpPattern = /^([0-9]{3})\-?([0-9]{1,2})?\-?([0-9]{1,5})?.*$/,
                returnValue = val.replace(regExpPattern, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(arguments[2]);
                if (arguments[3]) nval.push(arguments[3]);
                return nval.join("-");
            });

            return returnValue;
        }
    };

    var pattern_phone = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-', '188': ','
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            var regExpPattern3 = /^([0-9]{3})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
            if (val.substr(0, 2) == "02") {
                regExpPattern3 = /^([0-9]{2})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
            }

            var returnValue = val.replace(regExpPattern3, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(arguments[2]);
                if (arguments[3]) nval.push(arguments[3]);
                if (arguments[4]) nval.push(arguments[4]);
                if (arguments[5]) nval.push(arguments[5]);
                return nval.join("-");
            });
            return returnValue;
        }
    };

    var pattern_credit = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "").substring(0, 16);

            var regExpPattern3 = /^([0-9]{4})\-?([0-9]{4})?\-?([0-9]{4})?\-?([0-9]{4})?/,
                returnValue = val.replace(regExpPattern3, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(arguments[2]);
                if (arguments[3]) nval.push(arguments[3]);
                if (arguments[4]) nval.push(arguments[4]);
                return nval.join("-");
            });
            return returnValue;
        }
    };

    var pattern_custom = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            if (_opts.getEnterableKeyCodes) {
                return _opts.getEnterableKeyCodes.call(_opts, { $input: _opts.$input });
            } else {
                return null;
            }
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            if (_opts.getPatternValue) {
                return _opts.getPatternValue.call(_opts, { event: e, $input: _opts.$input, value: val });
            }
        }
    };

    FORMATTER.formatter = {
        ctrlKeys: ctrlKeys,
        numKeys: numKeys,
        money: pattern_money,
        number: pattern_number,
        date: pattern_date,
        time: pattern_time,
        bizno: pattern_bizno,
        phone: pattern_phone,
        credit: pattern_credit,
        custom: pattern_custom
    };
})();
// ax5.ui.menu
(function () {
    var UI = ax5.ui;
    var U = ax5.util;
    var MENU;

    UI.addClass({
        className: "menu",
        version: "0.7.0"
    }, function () {
        /**
         * @class ax5.ui.menu
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var menu = new ax5.ui.menu();
         * ```
         */
        var ax5menu = function ax5menu() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: "default",
                iconWidth: 22,
                acceleratorWidth: 100,
                menuBodyPadding: 5,
                //direction: "top", // top|bottom
                offset: { left: 0, top: 0 },
                position: "fixed",
                animateTime: 250,
                items: [],
                itemClickAndClose: true,
                columnKeys: {
                    label: 'label',
                    items: 'items'
                }
            };

            this.openTimer = null;
            this.closeTimer = null;
            this.queue = [];
            this.menuBar = {};
            this.state = undefined;

            cfg = this.config;

            var appEventAttach = function appEventAttach(active) {
                if (active) {
                    jQuery(document).unbind("click.ax5menu-" + this.menuId).bind("click.ax5menu-" + this.menuId, clickItem.bind(this));
                    jQuery(window).unbind("keydown.ax5menu-" + this.menuId).bind("keydown.ax5menu-" + this.menuId, function (e) {
                        if (e.which == ax5.info.eventKeys.ESC) {
                            self.close();
                        }
                    });
                    jQuery(window).unbind("resize.ax5menu-" + this.menuId).bind("resize.ax5menu-" + this.menuId, function (e) {
                        self.close();
                    });
                } else {
                    jQuery(document).unbind("click.ax5menu-" + this.menuId);
                    jQuery(window).unbind("keydown.ax5menu-" + this.menuId);
                    jQuery(window).unbind("resize.ax5menu-" + this.menuId);
                }
            },
                onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                self.state = that.state;
                opts = null;
                that = null;
                return true;
            },
                onLoad = function onLoad(that) {
                if (this.onLoad) {
                    this.onLoad.call(that, that);
                }

                that = null;
                return true;
            },
                popup = function popup(opt, items, depth, path) {
                var data = opt,
                    activeMenu,
                    removed;

                data.theme = opt.theme || cfg.theme;
                data.cfg = {
                    icons: jQuery.extend({}, cfg.icons),
                    iconWidth: opt.iconWidth || cfg.iconWidth,
                    acceleratorWidth: opt.acceleratorWidth || cfg.acceleratorWidth
                };

                items.forEach(function (n) {
                    if (n.html || n.divide) {
                        n['@isMenu'] = false;
                        if (n.html) {
                            n['@html'] = n.html.call({
                                item: n,
                                config: cfg,
                                opt: opt
                            });
                        }
                    } else {
                        n['@isMenu'] = true;
                    }
                });

                data[cfg.columnKeys.items] = items;
                data['@depth'] = depth;
                data['@path'] = path || "root";
                data['@hasChild'] = function () {
                    return this[cfg.columnKeys.items] && this[cfg.columnKeys.items].length > 0;
                };
                activeMenu = jQuery(MENU.tmpl.get.call(this, "tmpl", data, cfg.columnKeys));
                jQuery(document.body).append(activeMenu);

                // remove queue

                removed = this.queue.splice(depth);
                removed.forEach(function (n) {
                    n.$target.remove();
                });

                this.queue.push({
                    '$target': activeMenu,
                    'data': jQuery.extend({}, data)
                });

                activeMenu.find('[data-menu-item-index]').bind("mouseover", function () {
                    var depth = this.getAttribute("data-menu-item-depth"),
                        index = this.getAttribute("data-menu-item-index"),
                        path = this.getAttribute("data-menu-item-path"),
                        $this,
                        offset,
                        scrollTop,
                        childOpt,
                        _items,
                        _activeMenu;

                    if (depth != null && typeof depth != "undefined") {
                        _items = self.queue[depth].data[cfg.columnKeys.items][index][cfg.columnKeys.items];
                        _activeMenu = self.queue[depth].$target;
                        _activeMenu.find('[data-menu-item-index]').removeClass("hover");
                        jQuery(this).addClass("hover");

                        if (_activeMenu.attr("data-selected-menu-item-index") != index) {
                            _activeMenu.attr("data-selected-menu-item-index", index);

                            if (_items && _items.length > 0) {

                                $this = jQuery(this);
                                offset = $this.offset();
                                scrollTop = cfg.position == "fixed" ? jQuery(document).scrollTop() : 0;
                                childOpt = {
                                    '@parent': {
                                        left: offset.left,
                                        top: offset.top,
                                        width: $this.outerWidth(),
                                        height: $this.outerHeight()
                                    },
                                    left: offset.left + $this.outerWidth() - cfg.menuBodyPadding,
                                    top: offset.top - cfg.menuBodyPadding - 1 - scrollTop
                                };

                                childOpt = jQuery.extend(true, opt, childOpt);
                                popup.call(self, childOpt, _items, Number(depth) + 1, path);
                            } else {
                                self.queue.splice(Number(depth) + 1).forEach(function (n) {
                                    n.$target.remove();
                                });
                            }
                        }
                    }

                    depth = null;
                    index = null;
                    path = null;
                    $this = null;
                    offset = null;
                    scrollTop = null;
                    childOpt = null;
                    _items = null;
                    _activeMenu = null;
                });

                // is Root
                if (depth == 0) {
                    if (data.direction) activeMenu.addClass("direction-" + data.direction);
                    onStateChanged.call(this, null, {
                        self: this,
                        items: items,
                        parent: function (path) {
                            if (!path) return false;
                            var item = null;
                            try {
                                item = Function("", "return this.config.items[" + path.substring(5).replace(/\./g, '].items[') + "];").call(self);
                            } catch (e) {}
                            return item;
                        }(data['@path']),
                        state: "popup"
                    });
                }

                align.call(this, activeMenu, data);
                onLoad.call(this, {
                    self: this,
                    items: items,
                    element: activeMenu.get(0)
                });

                data = null;
                activeMenu = null;
                removed = null;
                opt = null;
                items = null;
                depth = null;
                path = null;

                return this;
            },
                clickItem = function clickItem(e, target, item) {
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-menu-item-index")) {
                        return true;
                    }
                });
                if (target) {
                    item = function (path) {
                        if (!path) return false;
                        var item;
                        try {
                            item = Function("", "return this.config.items[" + path.substring(5).replace(/\./g, '].' + cfg.columnKeys.items + '[') + "];").call(self);
                        } catch (e) {
                            console.log(ax5.info.getError("ax5menu", "501", "menuItemClick"));
                        }

                        try {
                            return item;
                        } finally {
                            item = null;
                        }
                    }(target.getAttribute("data-menu-item-path"));

                    if (!item) return this;

                    if (item.check) {
                        (function (items) {
                            var setValue = {
                                'checkbox': function checkbox(value) {
                                    this.checked = !value;
                                },
                                'radio': function radio(value) {
                                    var name = this.name;
                                    items.forEach(function (n) {
                                        if (n.check && n.check.type === 'radio' && n.check.name == name) {
                                            n.check.checked = false;
                                        }
                                    });
                                    this.checked = !value;
                                }
                            };
                            if (setValue[this.type]) setValue[this.type].call(this, this.checked);
                            setValue = null;
                        }).call(item.check, cfg.items);

                        if (!cfg.itemClickAndClose) {
                            self.queue.forEach(function (n) {
                                n.$target.find('[data-menu-item-index]').each(function () {
                                    var item = n.data[cfg.columnKeys.items][this.getAttribute("data-menu-item-index")];
                                    if (item.check) {
                                        jQuery(this).find(".item-checkbox-wrap").attr("data-item-checked", item.check.checked);
                                    }
                                });
                            });
                        }
                    }

                    if (self.onClick) {
                        self.onClick.call(item, item);
                    }
                    if ((!item[cfg.columnKeys.items] || item[cfg.columnKeys.items].length == 0) && cfg.itemClickAndClose) self.close();
                } else {
                    self.close();
                }

                target = null;
                item = null;
                return this;
            },
                align = function align(activeMenu, data) {
                //console.log(data['@parent']);
                var $window = jQuery(window),
                    $document = jQuery(document),
                    wh = cfg.position == "fixed" ? $window.height() : $document.height(),
                    ww = $window.width(),
                    h = activeMenu.outerHeight(),
                    w = activeMenu.outerWidth(),
                    l = data.left,
                    t = data.top,
                    position = cfg.position || "fixed";

                if (l + w > ww) {
                    if (data['@parent']) {
                        l = data['@parent'].left - w + cfg.menuBodyPadding;
                    } else {
                        l = ww - w;
                    }
                }

                if (t + h > wh) {
                    t = wh - h;
                }

                activeMenu.css({ left: l, top: t, position: position });

                activeMenu = null;
                data = null;
                $window = null;
                $document = null;
                wh = null;
                ww = null;
                h = null;
                w = null;
                l = null;
                t = null;
                position = null;
                return this;
            };

            /// private end

            this.init = function () {
                self.menuId = ax5.getGuid();

                /**
                 * config에 선언된 이벤트 함수들을 this로 이동시켜 주어 나중에 인스턴스.on... 으로 처리 가능 하도록 변경
                 */
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                this.onLoad = cfg.onLoad;

                onStateChanged.call(this, null, {
                    self: this,
                    state: "init"
                });
            };

            /**
             * @method ax5.ui.menu.popup
             * @param {Event|Object} e - Event or Object
             * @param {Object} [opt]
             * @param {String} [opt.theme]
             * @param {Function} [opt.filter]
             * @returns {ax5.ui.menu} this
             */
            this.popup = function () {

                var getOption = {
                    'event': function event(e, opt) {
                        //var xOffset = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                        //var yOffset = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                        //console.log(e.pageY);

                        e = {
                            left: e.clientX,
                            top: cfg.position == "fixed" ? e.clientY : e.pageY,
                            width: cfg.width,
                            theme: cfg.theme
                        };

                        if (cfg.offset) {
                            if (cfg.offset.left) e.left += cfg.offset.left;
                            if (cfg.offset.top) e.top += cfg.offset.top;
                        }
                        opt = jQuery.extend(true, e, opt);

                        try {
                            return opt;
                        } finally {
                            e = null;
                            //opt = null;
                        }
                    },
                    'object': function object(e, opt) {
                        e = {
                            left: e.left,
                            top: e.top,
                            width: e.width || cfg.width,
                            theme: e.theme || cfg.theme
                        };

                        if (cfg.offset) {
                            if (cfg.offset.left) e.left += cfg.offset.left;
                            if (cfg.offset.top) e.top += cfg.offset.top;
                        }

                        opt = jQuery.extend(true, e, opt);

                        try {
                            return opt;
                        } finally {
                            e = null;
                            //opt = null;
                        }
                    }
                };
                var updateTheme = function updateTheme(theme) {
                    if (theme) cfg.theme = theme;
                };

                return function (e, opt) {

                    if (!e) return this;
                    opt = getOption[typeof e.clientX == "undefined" ? "object" : "event"].call(this, e, opt);
                    updateTheme(opt.theme);

                    var items = [].concat(cfg.items);
                    if (opt.filter) {
                        var filteringItem = function filteringItem(_items) {
                            var arr = [];
                            _items.forEach(function (n) {
                                if (n.items && n.items.length > 0) {
                                    n.items = filteringItem(n.items);
                                }
                                if (opt.filter.call(n)) {
                                    arr.push(n);
                                }
                            });
                            return arr;
                        };
                        items = filteringItem(items);
                    }
                    popup.call(this, opt, items, 0); // 0 is seq of queue
                    appEventAttach.call(this, true); // 이벤트 연결

                    e = null;
                    //opt = null;
                    return this;
                };
            }();

            /**
             * @method ax5.ui.menu.attach
             * @param {Element|jQueryObject} el
             * @returns {ax5.ui.menu} this
             */
            this.attach = function () {

                var getOption = {
                    'object': function object(e, opt) {
                        e = {
                            left: e.left,
                            top: e.top,
                            width: e.width || cfg.width,
                            theme: e.theme || cfg.theme,
                            direction: e.direction || cfg.direction
                        };
                        opt = jQuery.extend(true, opt, e);

                        try {
                            return opt;
                        } finally {
                            e = null;
                            opt = null;
                        }
                    }
                };

                var popUpChildMenu = function popUpChildMenu(target, opt, eType) {
                    var $target = jQuery(target),
                        offset = $target.offset(),
                        height = $target.outerHeight(),
                        index = Number(target.getAttribute("data-menu-item-index")),
                        scrollTop = cfg.position == "fixed" ? jQuery(document).scrollTop() : 0;

                    if (self.menuBar.openedIndex == index) {
                        if (eType == "click") self.close();
                        return false;
                    }

                    self.menuBar.target.find('[data-menu-item-index]').removeClass("hover");
                    self.menuBar.opened = true;
                    self.menuBar.openedIndex = index;

                    $target.attr("data-menu-item-opened", "true");
                    $target.addClass("hover");

                    if (cfg.offset) {
                        if (cfg.offset.left) offset.left += cfg.offset.left;
                        if (cfg.offset.top) offset.top += cfg.offset.top;
                    }

                    opt = getOption["object"].call(this, { left: offset.left, top: offset.top + height - scrollTop }, opt);

                    if (cfg.items && cfg.items[index][cfg.columnKeys.items] && cfg.items[index][cfg.columnKeys.items].length) {
                        popup.call(self, opt, cfg.items[index][cfg.columnKeys.items], 0, 'root.' + target.getAttribute("data-menu-item-index")); // 0 is seq of queue
                        appEventAttach.call(self, true); // 이벤트 연결
                    }

                    target = null;
                    opt = null;
                    $target = null;
                    offset = null;
                    height = null;
                    index = null;
                    scrollTop = null;
                };

                return function (el, opt) {
                    var data = {},
                        items = cfg.items,
                        activeMenu;

                    if (typeof opt === "undefined") opt = {};

                    data.theme = opt.theme || cfg.theme;
                    data.cfg = {
                        icons: jQuery.extend({}, cfg.icons),
                        iconWidth: opt.iconWidth || cfg.iconWidth,
                        acceleratorWidth: opt.acceleratorWidth || cfg.acceleratorWidth
                    };

                    items.forEach(function (n) {
                        if (n.html || n.divide) {
                            n['@isMenu'] = false;
                            if (n.html) {
                                n['@html'] = n.html.call({
                                    item: n,
                                    config: cfg,
                                    opt: opt
                                });
                            }
                        } else {
                            n['@isMenu'] = true;
                        }
                    });

                    data[cfg.columnKeys.items] = items;

                    activeMenu = jQuery(MENU.tmpl.get.call(this, "tmplMenubar", data, cfg.columnKeys));
                    self.menuBar = {
                        target: jQuery(el),
                        opened: false
                    };
                    self.menuBar.target.html(activeMenu);

                    // click, mouseover
                    self.menuBar.target.bind("click", function (e) {
                        if (!e) return this;
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-menu-item-index")) {
                                return true;
                            }
                        });
                        if (target) popUpChildMenu(target, opt, "click");

                        target = null;
                    });
                    self.menuBar.target.bind("mouseover", function (e) {
                        if (!self.menuBar.opened) return false;
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-menu-item-index")) {
                                return true;
                            }
                        });
                        if (target) popUpChildMenu(target, opt, "mouseover");

                        target = null;
                    });

                    el = null;
                    opt = null;
                    data = null;
                    items = null;
                    activeMenu = null;

                    return this;
                };
            }();

            /**
             * @method ax5.ui.menu.close
             * @returns {ax5.ui.menu} this
             */
            this.close = function () {

                if (self.menuBar && self.menuBar.target) {
                    self.menuBar.target.find('[data-menu-item-index]').removeClass("hover");
                    self.menuBar.opened = false;
                    self.menuBar.openedIndex = null;
                }

                appEventAttach.call(this, false); // 이벤트 제거

                this.queue.forEach(function (n) {
                    n.$target.remove();
                });
                this.queue = [];

                onStateChanged.call(this, null, {
                    self: this,
                    state: "close"
                });

                return this;
            };

            /**
             * @method ax5.ui.menu.getCheckValue
             * @returns {Object} statusCheckItem
             */
            this.getCheckValue = function () {
                var checkItems = {},
                    _collectItem = function collectItem(items) {
                    var i = items.length;
                    while (i--) {
                        if (items[i].check && items[i].check.checked) {
                            if (!checkItems[items[i].check.name]) checkItems[items[i].check.name] = items[i].check.value;else {
                                if (U.isString(checkItems[items[i].check.name])) checkItems[items[i].check.name] = [checkItems[items[i].check.name]];
                                checkItems[items[i].check.name].push(items[i].check.value);
                            }
                        }
                        if (items[i].items && items[i].items.length > 0) _collectItem(items[i].items);
                    }
                };

                _collectItem(cfg.items);

                try {
                    return checkItems;
                } finally {
                    checkItems = null;
                    _collectItem = null;
                }
            };

            // 클래스 생성자
            this.main = function () {

                UI.menu_instance = UI.menu_instance || [];
                UI.menu_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5menu;
    }());

    MENU = ax5.ui.menu;
})();
// ax5.ui.menu.tmpl
(function () {
    var MENU = ax5.ui.menu;

    var tmpl = function tmpl(columnKeys) {
        return '\n        <div class="ax5-ui-menu {{theme}}" {{#width}}style="width:{{width}}px;"{{/width}}>\n            <div class="ax-menu-body">\n                {{#' + columnKeys.items + '}}\n                    {{^@isMenu}}\n                        {{#divide}}\n                        <div class="ax-menu-item-divide" data-menu-item-index="{{@i}}"></div>\n                        {{/divide}}\n                        {{#html}}\n                        <div class="ax-menu-item-html" data-menu-item-index="{{@i}}">{{{@html}}}</div>\n                        {{/html}}\n                    {{/@isMenu}}\n                    {{#@isMenu}}\n                    <div class="ax-menu-item" data-menu-item-depth="{{@depth}}" data-menu-item-index="{{@i}}" data-menu-item-path="{{@path}}.{{@i}}">\n                        <span class="ax-menu-item-cell ax-menu-item-checkbox">\n                            {{#check}}\n                            <span class="item-checkbox-wrap useCheckBox" {{#checked}}data-item-checked="true"{{/checked}}></span>\n                            {{/check}}\n                            {{^check}}\n                            <span class="item-checkbox-wrap"></span>\n                            {{/check}}\n                        </span>\n                        {{#icon}}\n                        <span class="ax-menu-item-cell ax-menu-item-icon" style="width:{{cfg.iconWidth}}px;">{{{.}}}</span>\n                        {{/icon}}\n                        <span class="ax-menu-item-cell ax-menu-item-label">{{{' + columnKeys.label + '}}}</span>\n                        {{#accelerator}}\n                        <span class="ax-menu-item-cell ax-menu-item-accelerator" style="width:{{cfg.acceleratorWidth}}px;"><span class="item-wrap">{{.}}</span></span>\n                        {{/accelerator}}\n                        {{#@hasChild}}\n                        <span class="ax-menu-item-cell ax-menu-item-handle">{{{cfg.icons.arrow}}}</span>\n                        {{/@hasChild}}\n                    </div>\n                    {{/@isMenu}}\n\n                {{/' + columnKeys.items + '}}\n            </div>\n            <div class="ax-menu-arrow"></div>\n        </div>\n        ';
    };
    var tmplMenubar = function tmplMenubar(columnKeys) {
        return '\n        <div class="ax5-ui-menubar {{theme}}">\n            <div class="ax-menu-body">\n                {{#' + columnKeys.items + '}}\n                    {{^@isMenu}}\n                        {{#divide}}\n                        <div class="ax-menu-item-divide" data-menu-item-index="{{@i}}"></div>\n                        {{/divide}}\n                        {{#html}}\n                        <div class="ax-menu-item-html" data-menu-item-index="{{@i}}">{{{@html}}}</div>\n                        {{/html}}\n                    {{/@isMenu}}\n                    {{#@isMenu}}\n                    <div class="ax-menu-item" data-menu-item-index="{{@i}}">\n                        {{#icon}}\n                        <span class="ax-menu-item-cell ax-menu-item-icon" style="width:{{cfg.iconWidth}}px;">{{{.}}}</span>\n                        {{/icon}}\n                        <span class="ax-menu-item-cell ax-menu-item-label">{{{' + columnKeys.label + '}}}</span>\n                    </div>\n                    {{/@isMenu}}\n                {{/' + columnKeys.items + '}}\n            </div>\n        </div>\n        ';
    };

    MENU.tmpl = {
        "tmpl": tmpl,
        "tmplMenubar": tmplMenubar,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(MENU.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.select
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var SELECT;

    UI.addClass({
        className: "select",
        version: "0.4.4"
    }, function () {
        /**
         * @class ax5select
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myselect = new ax5.ui.select();
         * ```
         */
        var ax5select = function ax5select() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 100,
                lang: {
                    noSelected: '',
                    noOptions: 'no options',
                    loading: 'now loading..',
                    multipleLabel: '"{{label}}"외 {{length}}건'
                },
                columnKeys: {
                    optionValue: 'value',
                    optionText: 'text',
                    optionSelected: 'selected'
                }
            };
            this.queue = [];
            this.activeSelectOptionGroup = null;
            this.activeSelectQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;
            this.waitOptionsCallback = null;
            this.keyUpTimer = null;
            this.xvar = {};

            cfg = this.config;

            var ctrlKeys = {
                "18": "KEY_ALT",
                "8": "KEY_BACKSPACE",
                "17": "KEY_CONTROL",
                "46": "KEY_DELETE",
                "40": "KEY_DOWN",
                "35": "KEY_END",
                "187": "KEY_EQUAL",
                "27": "KEY_ESC",
                "36": "KEY_HOME",
                "45": "KEY_INSERT",
                "37": "KEY_LEFT",
                "189": "KEY_MINUS",
                "34": "KEY_PAGEDOWN",
                "33": "KEY_PAGEUP",
                // "190": "KEY_PERIOD",
                "13": "KEY_RETURN",
                "39": "KEY_RIGHT",
                "16": "KEY_SHIFT",
                // "32": "KEY_SPACE",
                "9": "KEY_TAB",
                "38": "KEY_UP",
                "91": "KEY_WINDOW"
                //"107" : "NUMPAD_ADD",
                //"194" : "NUMPAD_COMMA",
                //"110" : "NUMPAD_DECIMAL",
                //"111" : "NUMPAD_DIVIDE",
                //"12" : "NUMPAD_EQUAL",
                //"106" : "NUMPAD_MULTIPLY",
                //"109" : "NUMPAD_SUBTRACT"
            },
                onStateChanged = function onStateChanged(item, that) {
                if (item && item.onStateChanged) {
                    item.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                if (that.state == "changeValue") {
                    if (item && item.onChange) {
                        item.onChange.call(that, that);
                    } else if (this.onChange) {
                        this.onChange.call(that, that);
                    }
                }

                item = null;
                that = null;
                return true;
            },
                alignSelectDisplay = function alignSelectDisplay() {
                var i = this.queue.length,
                    w;
                while (i--) {
                    if (this.queue[i].$display) {
                        w = Math.max(this.queue[i].$select.outerWidth(), U.number(this.queue[i].minWidth));
                        this.queue[i].$display.css({
                            "min-width": w
                        });
                        if (this.queue[i].reset) {
                            this.queue[i].$display.find(".addon-icon-reset").css({
                                "line-height": this.queue[i].$display.height() + "px"
                            });
                        }
                    }
                }

                i = null;
                w = null;
                return this;
            },
                alignSelectOptionGroup = function alignSelectOptionGroup(append) {
                if (!this.activeSelectOptionGroup) return this;

                var item = this.queue[this.activeSelectQueueIndex],
                    pos = {},
                    dim = {};

                if (append) jQuery(document.body).append(this.activeSelectOptionGroup);

                pos = item.$target.offset();
                dim = {
                    width: item.$target.outerWidth(),
                    height: item.$target.outerHeight()
                };

                // picker css(width, left, top) & direction 결정
                if (!item.direction || item.direction === "" || item.direction === "auto") {
                    // set direction
                    item.direction = "top";
                }

                if (append) {
                    this.activeSelectOptionGroup.addClass("direction-" + item.direction);
                }
                this.activeSelectOptionGroup.css(function () {
                    if (item.direction == "top") {
                        return {
                            left: pos.left,
                            top: pos.top + dim.height + 1,
                            width: dim.width
                        };
                    } else if (item.direction == "bottom") {
                        return {
                            left: pos.left,
                            top: pos.top - this.activeSelectOptionGroup.outerHeight() - 1,
                            width: dim.width
                        };
                    }
                }.call(this));
            },
                onBodyClick = function onBodyClick(e, target) {
                if (!this.activeSelectOptionGroup) return this;

                var item = this.queue[this.activeSelectQueueIndex],
                    clickEl = "display";

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-option-value")) {
                        clickEl = "optionItem";
                        return true;
                    } else if (item.$target.get(0) == target) {
                        clickEl = "display";
                        return true;
                    }
                });

                if (!target) {
                    this.close();
                    return this;
                } else if (clickEl === "optionItem") {
                    this.val(item.id, {
                        index: {
                            gindex: target.getAttribute("data-option-group-index"),
                            index: target.getAttribute("data-option-index")
                        }
                    }, undefined, "internal");
                    item.$display.focus();
                    if (!item.multiple) this.close();
                } else {
                    //open and display click
                    //console.log(this.instanceId);
                }

                return this;
            },
                onBodyKeyup = function onBodyKeyup(e) {
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                } else if (e.which == ax5.info.eventKeys.RETURN) {
                    if (this.queue[this.activeSelectQueueIndex].optionFocusIndex > -1) {
                        // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                        var $option = this.activeSelectOptionGroup.find('[data-option-focus-index="' + this.queue[this.activeSelectQueueIndex].optionFocusIndex + '"]');
                        this.val(this.queue[this.activeSelectQueueIndex].id, {
                            index: {
                                gindex: $option.attr("data-option-group-index"),
                                index: $option.attr("data-option-index")
                            }
                        }, undefined, "internal");
                        if (!this.queue[this.activeSelectQueueIndex].multiple) this.close();
                    } else {
                        this.close();
                    }
                }
            },
                getLabel = function getLabel(queIdx) {
                var item = this.queue[queIdx];
                var labels = [];

                if (U.isArray(item.selected) && item.selected.length > 0) {
                    item.selected.forEach(function (n) {
                        if (n.selected) labels.push(n[item.columnKeys.optionText]);
                    });
                } else {
                    if (!item.multiple && item.options && item.options[0]) {
                        if (item.options[0].optgroup) {
                            labels[0] = item.options[0].options[0][item.columnKeys.optionText];
                        } else {
                            labels[0] = item.options[0][item.columnKeys.optionText];
                        }
                    } else {
                        labels[0] = item.lang.noSelected;
                    }
                }

                return function () {
                    if (item.multiple && labels.length > 1) {
                        var data = {
                            label: labels[0],
                            length: labels.length - 1
                        };
                        return ax5.mustache.render(item.lang.multipleLabel, data);
                    } else {
                        return labels[0];
                    }
                }();
            },
                syncLabel = function syncLabel(queIdx) {
                this.queue[queIdx].$displayLabel.html(getLabel.call(this, queIdx));
            },
                focusWord = function focusWord(queIdx, searchWord) {
                var options = [],
                    i = -1,
                    l = this.queue[queIdx].indexedOptions.length - 1,
                    n;
                if (searchWord) {
                    while (l - i++) {
                        n = this.queue[queIdx].indexedOptions[i];
                        if (('' + n.value).toLowerCase() == searchWord.toLowerCase()) {
                            options = [{ '@findex': n['@findex'], optionsSort: 0 }];
                            break;
                        } else {
                            var sort = ('' + n.value).toLowerCase().search(searchWord.toLowerCase());
                            if (sort > -1) {
                                options.push({ '@findex': n['@findex'], optionsSort: sort });
                                if (options.length > 2) break;
                            }
                            sort = null;
                        }
                    }
                    options.sort(function (a, b) {
                        return a.optionsSort - b.optionsSort;
                    });
                }
                if (options && options.length > 0) {
                    focusMove.call(this, queIdx, undefined, options[0]['@findex']);
                }

                try {
                    return options;
                } finally {
                    options = null;
                    i = null;
                    l = null;
                    n = null;
                }
            },
                focusMove = function focusMove(queIdx, direction, findex) {
                var _focusIndex, _prevFocusIndex, focusOptionEl, optionGroupScrollContainer;
                if (this.activeSelectOptionGroup && this.queue[queIdx].options && this.queue[queIdx].options.length > 0) {

                    if (typeof findex !== "undefined") {
                        _focusIndex = findex;
                    } else {
                        _prevFocusIndex = this.queue[queIdx].optionFocusIndex == -1 ? this.queue[queIdx].optionSelectedIndex || -1 : this.queue[queIdx].optionFocusIndex;
                        if (_prevFocusIndex == -1) {
                            _focusIndex = direction > 0 ? 0 : this.queue[queIdx].optionItemLength - 1;
                        } else {
                            _focusIndex = _prevFocusIndex + direction;
                            if (_focusIndex < 0) _focusIndex = 0;else if (_focusIndex > this.queue[queIdx].optionItemLength - 1) _focusIndex = this.queue[queIdx].optionItemLength - 1;
                        }
                    }

                    this.queue[queIdx].optionFocusIndex = _focusIndex;

                    this.activeSelectOptionGroup.find('[data-option-focus-index]').removeClass("hover");

                    focusOptionEl = this.activeSelectOptionGroup.find('[data-option-focus-index="' + _focusIndex + '"]').addClass("hover");

                    optionGroupScrollContainer = this.activeSelectOptionGroup.find('[data-els="content"]');

                    var focusOptionElHeight = focusOptionEl.outerHeight(),
                        optionGroupScrollContainerHeight = optionGroupScrollContainer.innerHeight(),
                        optionGroupScrollContainerScrollTop = optionGroupScrollContainer.scrollTop(),
                        focusOptionElTop = focusOptionEl.position().top + optionGroupScrollContainer.scrollTop();

                    if (optionGroupScrollContainerHeight + optionGroupScrollContainerScrollTop < focusOptionElTop + focusOptionElHeight) {
                        optionGroupScrollContainer.scrollTop(focusOptionElTop + focusOptionElHeight - optionGroupScrollContainerHeight);
                    } else if (optionGroupScrollContainerScrollTop > focusOptionElTop) {
                        optionGroupScrollContainer.scrollTop(focusOptionElTop);
                    }
                    // optionGroup scroll check
                }
            },
                bindSelectTarget = function () {
                var focusWordCall = U.debounce(function (searchWord, queIdx) {
                    focusWord.call(self, queIdx, searchWord);
                    self.queue[queIdx].$displayInput.val('');
                }, 300);

                var selectEvent = {
                    'click': function click(queIdx, e) {
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-selected-clear")) {
                                //clickEl = "clear";
                                return true;
                            }
                        });

                        if (target) {
                            this.val(queIdx, { clear: true });
                        } else {
                            if (self.activeSelectQueueIndex == queIdx) {
                                if (this.queue[queIdx].optionFocusIndex == -1) {
                                    // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                                    self.close();
                                }
                            } else {
                                self.open(queIdx);
                                U.stopEvent(e);
                            }
                        }
                    },
                    'keyUp': function keyUp(queIdx, e) {
                        if (e.which == ax5.info.eventKeys.SPACE) {
                            selectEvent.click.call(this, queIdx, e);
                        } else if (!ctrlKeys[e.which]) {
                            // 사용자 입력이 뜸해지면 찾고 검색 값 제거...
                            focusWordCall(this.queue[queIdx].$displayInput.val(), queIdx);
                        }
                    },
                    'keyDown': function keyDown(queIdx, e) {
                        if (e.which == ax5.info.eventKeys.DOWN) {
                            focusMove.call(this, queIdx, 1);
                            U.stopEvent(e);
                        } else if (e.which == ax5.info.eventKeys.UP) {
                            focusMove.call(this, queIdx, -1);
                            U.stopEvent(e);
                        }
                    },
                    'blur': function blur(queIdx, e) {},
                    'selectChange': function selectChange(queIdx, e) {
                        this.val(queIdx, this.queue[queIdx].$select.val(), true);
                    }
                };
                return function (queIdx) {
                    var item = this.queue[queIdx];
                    var data = {};
                    item.selected = [];

                    if (!item.$display) {
                        /// 템플릿에 전달할 오브젝트 선언
                        data.instanceId = this.instanceId;
                        data.id = item.id;
                        data.name = item.name;
                        data.theme = item.theme;
                        data.tabIndex = item.tabIndex;
                        data.multiple = item.multiple;
                        data.reset = item.reset;

                        data.label = getLabel.call(this, queIdx);
                        data.formSize = function () {
                            return item.size ? "input-" + item.size : "";
                        }();

                        item.$display = SELECT.tmpl.get.call(this, "tmpl", data);
                        item.$displayLabel = item.$display.find('[data-ax5select-display="label"]');

                        if (item.$target.find("select").get(0)) {
                            item.$select = item.$target.find("select");
                            // select 속성만 변경
                            item.$select.attr("tabindex", "-1").attr("class", "form-control " + data.formSize);
                            if (data.name) {
                                item.$select.attr("name", "name");
                            }
                            if (data.multiple) {
                                item.$select.attr("multiple", "multiple");
                            }
                        } else {
                            item.$select = SELECT.tmpl.get.call(this, "selectTmpl", data);
                            item.$target.append(item.$select);
                            // select append
                        }

                        item.$target.append(item.$display);
                        item.$displayInput = item.$display.find('[data-ax5select-display="input"]'); // 사용자 입력값을 받기위한 숨음 입력필드
                        item.options = syncSelectOptions.call(this, queIdx, item.options);

                        alignSelectDisplay.call(this);

                        item.$displayInput.unbind("blur.ax5select").bind("blur.ax5select", selectEvent.blur.bind(this, queIdx)).unbind('keyup.ax5select').bind('keyup.ax5select', selectEvent.keyUp.bind(this, queIdx)).unbind("keydown.ax5select").bind("keydown.ax5select", selectEvent.keyDown.bind(this, queIdx));
                    } else {
                        item.$displayLabel.html(getLabel.call(this, queIdx));
                        item.options = syncSelectOptions.call(this, queIdx, item.options);

                        alignSelectDisplay.call(this);
                    }

                    item.$display.unbind('click.ax5select').bind('click.ax5select', selectEvent.click.bind(this, queIdx)).unbind('keyup.ax5select').bind('keyup.ax5select', selectEvent.keyUp.bind(this, queIdx));

                    // select 태그에 대한 change 이벤트 감시
                    item.$select.unbind('change.ax5select').bind('change.ax5select', selectEvent.selectChange.bind(this, queIdx));

                    data = null;
                    item = null;
                    queIdx = null;
                    return this;
                };
            }(),
                syncSelectOptions = function () {
                var setSelected = function setSelected(queIdx, O) {
                    if (!O) {
                        this.queue[queIdx].selected = [];
                    } else {
                        if (this.queue[queIdx].multiple) this.queue[queIdx].selected.push(jQuery.extend({}, O));else this.queue[queIdx].selected[0] = jQuery.extend({}, O);
                    }
                };

                return function (queIdx, options) {
                    var item = this.queue[queIdx];
                    var po,
                        elementOptions,
                        newOptions,
                        focusIndex = 0;
                    setSelected.call(this, queIdx, false); // item.selected 초기화

                    if (options) {
                        item.options = options;
                        item.indexedOptions = [];

                        // select options 태그 생성
                        po = [];
                        item.options.forEach(function (O, OIndex) {
                            if (O.optgroup) {
                                // todo
                                O['@gindex'] = OIndex;
                                O.options.forEach(function (OO, OOIndex) {
                                    OO['@index'] = OOIndex;
                                    OO['@findex'] = focusIndex;
                                    po.push('<option value="' + OO[item.columnKeys.optionValue] + '" ' + (OO[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + OO[item.columnKeys.optionText] + '</option>');
                                    if (OO[item.columnKeys.optionSelected]) {
                                        setSelected.call(self, queIdx, OO);
                                    }

                                    item.indexedOptions.push({
                                        '@findex': focusIndex, value: OO[item.columnKeys.optionValue], text: OO[item.columnKeys.optionText]
                                    });
                                    focusIndex++;
                                });
                            } else {
                                O['@index'] = OIndex;
                                O['@findex'] = focusIndex;
                                po.push('<option value="' + O[item.columnKeys.optionValue] + '" ' + (O[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + O[item.columnKeys.optionText] + '</option>');
                                if (O[item.columnKeys.optionSelected]) {
                                    setSelected.call(self, queIdx, O);
                                }

                                item.indexedOptions.push({
                                    '@findex': focusIndex, value: O[item.columnKeys.optionValue], text: O[item.columnKeys.optionText]
                                });
                                focusIndex++;
                            }
                        });
                        item.optionItemLength = focusIndex;
                        item.$select.html(po.join(''));
                    } else {
                        /// select > options 태그로 스크립트 options를 만들어주는 역할
                        elementOptions = U.toArray(item.$select.get(0).options);
                        // select option 스크립트 생성
                        newOptions = [];
                        elementOptions.forEach(function (O, OIndex) {
                            var option = {};
                            //if (O.value != "") {
                            option[item.columnKeys.optionValue] = O.value;
                            option[item.columnKeys.optionText] = O.text;
                            option[item.columnKeys.optionSelected] = O.selected;
                            option['@index'] = OIndex;
                            option['@findex'] = OIndex;
                            if (O.selected) setSelected.call(self, queIdx, option);
                            newOptions.push(option);
                            //}
                            option = null;
                        });
                        item.options = newOptions;
                        item.indexedOptions = newOptions;
                    }

                    if (!item.multiple && item.selected.length == 0 && item.options && item.options[0]) {
                        if (item.options[0].optgroup) {
                            item.options[0].options[0][item.columnKeys.optionSelected] = true;
                            item.selected.push(jQuery.extend({}, item.options[0].options[0]));
                        } else {
                            item.options[0][item.columnKeys.optionSelected] = true;
                            item.selected.push(jQuery.extend({}, item.options[0]));
                        }
                    }

                    po = null;
                    elementOptions = null;
                    newOptions = null;
                    return item.options;
                };
            }(),
                getQueIdx = function getQueIdx(boundID) {
                if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-ax5select-id");
                }
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5select", "402", "getQueIdx"));
                    return;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            };
            /// private end

            /**
             * Preferences of select UI
             * @method ax5select.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5select}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onChange = cfg.onChange;

                jQuery(window).bind("resize.ax5select-display-" + this.instanceId, function () {
                    alignSelectDisplay.call(this);
                }.bind(this));
            };

            /**
             * bind select
             * @method ax5select.bind
             * @param {Object} item
             * @param {String} [item.id]
             * @param {String} [item.theme]
             * @param {Boolean} [item.multiple]
             * @param {Element} item.target
             * @param {Object[]} item.options
             * @returns {ax5select}
             */
            this.bind = function (item) {
                var selectConfig = {},
                    queIdx;

                item = jQuery.extend(true, selectConfig, cfg, item);
                if (!item.target) {
                    console.log(ax5.info.getError("ax5select", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5select-id");
                if (!item.id) {
                    item.id = 'ax5select-' + ax5.getGuid();
                    item.$target.data("data-ax5select-id", item.id);
                }
                item.name = item.$target.attr("data-ax5select");
                if (item.options) {
                    item.options = JSON.parse(JSON.stringify(item.options));
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-ax5select-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindSelectTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindSelectTarget.call(this, queIdx);
                }

                selectConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * open the optionBox of select
             * @method ax5select.open
             * @param {(String|Number|Element)} boundID
             * @param {Number} [tryCount]
             * @returns {ax5select}
             */
            this.open = function () {

                var onExpand = function onExpand(item) {
                    item.onExpand.call({
                        self: this,
                        item: item
                    }, function (O) {
                        if (this.waitOptionsCallback) {
                            var data = {};
                            var item = this.queue[this.activeSelectQueueIndex];

                            /// 현재 selected 검증후 처리
                            (function (item, O) {
                                var optionsMap = {};
                                O.options.forEach(function (_O, _OIndex) {
                                    _O["@index"] = _OIndex;
                                    optionsMap[_O[item.columnKeys.optionValue]] = _O;
                                });
                                if (U.isArray(item.selected)) {
                                    item.selected.forEach(function (_O) {
                                        if (optionsMap[_O[item.columnKeys.optionValue]]) {
                                            O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected] = true;
                                        }
                                    });
                                }
                            })(item, O);

                            item.$displayLabel.html(getLabel.call(this, this.activeSelectQueueIndex));
                            item.options = syncSelectOptions.call(this, this.activeSelectQueueIndex, O.options);

                            alignSelectDisplay.call(this);

                            /// 템플릿에 전달할 오브젝트 선언
                            data.id = item.id;
                            data.theme = item.theme;
                            data.size = "ax5select-option-group-" + item.size;
                            data.multiple = item.multiple;
                            data.lang = item.lang;
                            data.options = item.options;
                            this.activeSelectOptionGroup.find('[data-els="content"]').html(SELECT.tmpl.get.call(this, "optionsTmpl", data));
                        }
                    }.bind(this));
                };

                return function (boundID, tryCount) {
                    this.waitOptionsCallback = null;

                    /**
                     * open select from the outside
                     */
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    var item = this.queue[queIdx];
                    var data = {},
                        focusTop,
                        selectedOptionEl;

                    if (item.$display.attr("disabled")) return this;

                    if (this.openTimer) clearTimeout(this.openTimer);
                    if (this.activeSelectOptionGroup) {
                        if (this.activeSelectQueueIndex == queIdx) {
                            return this;
                        }

                        if (tryCount > 2) return this;
                        this.close();
                        this.openTimer = setTimeout(function () {
                            this.open(queIdx, (tryCount || 0) + 1);
                        }.bind(this), cfg.animateTime);

                        return this;
                    }

                    item.optionFocusIndex = -1; // optionGroup이 열리면 포커스 인덱스 초기화 -1로
                    if (item.selected && item.selected.length > 0) {
                        item.optionSelectedIndex = item.selected[0]["@findex"];
                    }

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5select-option-group-" + item.size;
                    data.multiple = item.multiple;

                    data.lang = item.lang;
                    item.$display.attr("data-select-option-group-opened", "true");
                    //console.log(data.lang);

                    if (item.onExpand) {
                        // onExpand 인 경우 UI 대기모드 추가
                        data.waitOptions = true;
                    }

                    data.options = item.options;
                    this.activeSelectOptionGroup = SELECT.tmpl.get.call(this, "optionGroupTmpl", data);
                    this.activeSelectOptionGroup.find('[data-els="content"]').html(SELECT.tmpl.get.call(this, "optionGroupTmpl", data));
                    this.activeSelectQueueIndex = queIdx;

                    alignSelectOptionGroup.call(this, "append"); // alignSelectOptionGroup 에서 body append
                    jQuery(window).bind("resize.ax5select-" + this.instanceId, function () {
                        alignSelectOptionGroup.call(this);
                    }.bind(this));

                    if (item.selected && item.selected.length > 0) {
                        selectedOptionEl = this.activeSelectOptionGroup.find('[data-option-index="' + item.selected[0]["@index"] + '"]');

                        if (selectedOptionEl.get(0)) {
                            focusTop = selectedOptionEl.position().top - this.activeSelectOptionGroup.height() / 3;
                            this.activeSelectOptionGroup.find('[data-els="content"]').stop().animate({ scrollTop: focusTop }, item.animateTime, 'swing', function () {});
                        }
                    }

                    /// 사용자 입력으로 옵션을 검색하기 위한 시나리오
                    // 옵션그룹이 활성화 되면 사용자 입력을 받기위한 input 값 초기화 및 포커스 다른 select가 닫히면서 display focus 이벤트와 충돌하는 문제가 있으므로
                    // 1밀리세컨 지연후 포커스 처리. input에 포커스가 되므로 input value로 options를 검색 할 수 있게 됩니다.
                    item.$displayInput.val('');

                    setTimeout(function () {
                        item.$displayInput.trigger("focus");

                        jQuery(window).bind("keyup.ax5select-" + this.instanceId, function (e) {
                            e = e || window.event;
                            onBodyKeyup.call(this, e);
                            U.stopEvent(e);
                        }.bind(this));

                        jQuery(window).bind("click.ax5select-" + this.instanceId, function (e) {
                            e = e || window.event;
                            onBodyClick.call(this, e);
                            U.stopEvent(e);
                        }.bind(this));
                    }.bind(this), 300);

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "open",
                        item: item
                    });

                    // waitOption timer
                    if (item.onExpand) {
                        this.waitOptionsCallback = true;
                        onExpand.call(this, item);
                    }

                    data = null;
                    focusTop = null;
                    selectedOptionEl = null;
                    return this;
                };
            }();

            /**
             * @method ax5select.update
             * @param {(Object|String)} item
             * @returns {ax5select}
             */
            this.update = function (_item) {
                this.bind(_item);
                return this;
            };

            /**
             * @method ax5select.val
             * @param {(String|Number|Element)} boundID
             * @param {(String|Object|Array)} [value]
             * @param {Boolean} [selected]
             * @returns {ax5select}
             */
            this.val = function () {

                // todo : val 함수 리팩토링 필요
                var getSelected = function getSelected(_item, o, selected) {
                    if (typeof selected === "undefined") {
                        return _item.multiple ? !o : true;
                    } else {
                        return selected;
                    }
                };
                var clearSelected = function clearSelected(queIdx) {
                    this.queue[queIdx].options.forEach(function (n) {
                        if (n.optgroup) {
                            n.options.forEach(function (nn) {
                                nn.selected = false;
                            });
                        } else {
                            n.selected = false;
                        }
                    });
                };

                var processor = {
                    'index': function index(queIdx, value, selected) {
                        // 클래스 내부에서 호출된 형태, 그런 이유로 옵션그룹에 대한 상태를 변경 하고 있다.
                        var item = this.queue[queIdx];

                        /*
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
                         */
                        if (U.isString(value.index.gindex)) {
                            item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected], selected);
                            self.activeSelectOptionGroup.find('[data-option-group-index="' + value.index.gindex + '"][data-option-index="' + value.index.index + '"]').attr("data-option-selected", item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected].toString());
                        } else {
                            item.options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.index][item.columnKeys.optionSelected], selected);
                            self.activeSelectOptionGroup.find('[data-option-index="' + value.index.index + '"]').attr("data-option-selected", item.options[value.index.index][item.columnKeys.optionSelected].toString());
                        }

                        syncSelectOptions.call(this, queIdx, item.options);
                        syncLabel.call(this, queIdx);
                        alignSelectOptionGroup.call(this);
                    },
                    'arr': function arr(queIdx, values, selected) {
                        values.forEach(function (value) {
                            if (U.isString(value) || U.isNumber(value)) {
                                processor.value.call(self, queIdx, value, selected);
                            } else {
                                for (var key in processor) {
                                    if (value[key]) {
                                        processor[key].call(self, queIdx, value, selected);
                                        break;
                                    }
                                }
                            }
                        });
                    },
                    'value': function value(queIdx, _value2, selected) {
                        var item = this.queue[queIdx];
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionValue] == _value2;
                        });
                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            console.log(ax5.info.getError("ax5select", "501", "val"));
                            return;
                        }

                        syncSelectOptions.call(this, queIdx, item.options);
                        syncLabel.call(this, queIdx);
                    },
                    'text': function text(queIdx, value, selected) {
                        var item = this.queue[queIdx];
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionText] == value;
                        });
                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            console.log(ax5.info.getError("ax5select", "501", "val"));
                            return;
                        }

                        syncSelectOptions.call(this, queIdx, item.options);
                        syncLabel.call(this, queIdx);
                    },
                    'clear': function clear(queIdx) {
                        clearSelected.call(this, queIdx);
                        syncSelectOptions.call(this, queIdx, this.queue[queIdx].options);
                        syncLabel.call(this, queIdx);

                        if (this.activeSelectOptionGroup) {
                            this.activeSelectOptionGroup.find('[data-option-index]').attr("data-option-selected", "false");
                        }
                    }
                };

                return function (boundID, value, selected, internal) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5select", "402", "val"));
                        return;
                    }

                    // setValue 이면 현재 선택값 초기화
                    if (typeof value !== "undefined" && !this.queue[queIdx].multiple) {
                        clearSelected.call(this, queIdx);
                    }

                    if (typeof value == "undefined") {
                        return this.queue[queIdx].selected;
                    } else if (U.isArray(value)) {
                        processor.arr.call(this, queIdx, value, selected);
                    } else if (U.isString(value) || U.isNumber(value)) {
                        processor.value.call(this, queIdx, value, selected);
                    } else {
                        if (value === null) {
                            processor.clear.call(this, queIdx);
                        } else {
                            for (var key in processor) {
                                if (value[key]) {
                                    processor[key].call(this, queIdx, value, selected);
                                    break;
                                }
                            }
                        }
                    }

                    if (typeof value !== "undefined") {
                        onStateChanged.call(this, this.queue[queIdx], {
                            self: this,
                            item: this.queue[queIdx],
                            state: internal ? "changeValue" : "setValue",
                            value: this.queue[queIdx].selected,
                            internal: internal
                        });
                    }

                    boundID = null;
                    return this;
                };
            }();

            /**
             * @method ax5select.close
             * @returns {ax5select}
             */
            this.close = function (item) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activeSelectOptionGroup) return this;

                item = this.queue[this.activeSelectQueueIndex];
                item.optionFocusIndex = -1;

                item.$displayInput.val('').trigger("blur");
                item.$display.removeAttr("data-select-option-group-opened").trigger("focus");

                this.activeSelectOptionGroup.addClass("destroy");

                jQuery(window).unbind("resize.ax5select-" + this.instanceId).unbind("click.ax5select-" + this.instanceId).unbind("keyup.ax5select-" + this.instanceId);

                this.closeTimer = setTimeout(function () {
                    if (this.activeSelectOptionGroup) this.activeSelectOptionGroup.remove();
                    this.activeSelectOptionGroup = null;
                    this.activeSelectQueueIndex = -1;

                    var that = {
                        self: this,
                        item: item,
                        value: item.selected,
                        state: "close"
                    };

                    onStateChanged.call(this, item, that);

                    // waitOption timer
                    if (item.onClose) {
                        item.onClose.call(that);
                    }
                }.bind(this), cfg.animateTime);
                this.waitOptionsCallback = null;
                return this;
            };

            this.enable = function (boundID) {
                var queIdx = getQueIdx.call(this, boundID);
                this.queue[queIdx].$display.removeAttr("disabled");
                this.queue[queIdx].$select.removeAttr("disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "enable"
                });

                return this;
            };

            this.disable = function (boundID) {
                var queIdx = getQueIdx.call(this, boundID);
                this.queue[queIdx].$display.attr("disabled", "disabled");
                this.queue[queIdx].$select.attr("disabled", "disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "disable"
                });

                return this;
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    this.init();
                }
            }.apply(this, arguments);
        };
        return ax5select;
    }());
    SELECT = ax5.ui.select;
})();

ax5.ui.select_instance = new ax5.ui.select();
jQuery.fn.ax5select = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.select_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.select_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.select_instance.val(this, arguments[1], arguments[2]);
                    break;
                case "getValue":
                    return ax5.ui.select_instance.val(this);
                    break;
                case "enable":
                    return ax5.ui.select_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.select_instance.disable(this);
                    break;
                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.select_instance.bind(config);
            });
        }
        return this;
    };
}();
// ax5.ui.select.tmpl
(function () {

    var SELECT = ax5.ui.select;

    var optionGroupTmpl = function optionGroupTmpl(columnKeys) {
        return '\n                    <div class="ax5select-option-group {{theme}} {{size}}" data-ax5select-option-group="{{id}}">\n                        <div class="ax-select-body">\n                            <div class="ax-select-option-group-content" data-els="content"></div>\n                        </div>\n                        <div class="ax-select-arrow"></div> \n                    </div>\n                    ';
    };
    var tmpl = function tmpl(columnKeys) {
        return '\n                    <a {{^tabIndex}}href="#ax5select-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}class="form-control {{formSize}} ax5select-display {{theme}}" \n                    data-ax5select-display="{{id}}" data-ax5select-instance="{{instanceId}}">\n                        <div class="ax5select-display-table" data-els="display-table">\n                            <div data-ax5select-display="label">{{label}}</div>\n                            <div data-ax5select-display="addon"> \n                                {{#multiple}}{{#reset}}\n                                <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>\n                                {{/reset}}{{/multiple}}\n                                {{#icons}}\n                                <span class="addon-icon-closed">{{clesed}}</span>\n                                <span class="addon-icon-opened">{{opened}}</span>\n                                {{/icons}}\n                                {{^icons}}\n                                <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n                                <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n                                {{/icons}}\n                            </div>\n                        </div>\n                        <input type="text" tabindex="-1" data-ax5select-display="input" \n                        style="position:absolute;z-index:0;left:0px;top:0px;font-size:1px;opacity: 0;width:1px;border: 0px none;color : transparent;text-indent: -9999em;" />\n                    </a>\n                    ';
    };
    var selectTmpl = function selectTmpl(columnKeys) {
        return '\n                    <select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>\n                    ';
    };
    var optionsTmpl = function optionsTmpl(columnKeys) {
        return '\n                    {{#waitOptions}}\n                        <div class="ax-select-option-item">\n                                <div class="ax-select-option-item-holder">\n                                    <span class="ax-select-option-item-cell ax-select-option-item-label">\n                                        {{{lang.loading}}}\n                                    </span>\n                                </div>\n                            </div>\n                    {{/waitOptions}}\n                    {{^waitOptions}}\n                        {{#options}}\n                            {{#optgroup}}\n                                <div class="ax-select-option-group">\n                                    <div class="ax-select-option-item-holder">\n                                        <span class="ax-select-option-group-label">\n                                            {{{.}}}\n                                        </span>\n                                    </div>\n                                    {{#options}}\n                                    <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" \n                                    data-option-value="{{' + columnKeys.optionValue + '}}" \n                                    {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                                        <div class="ax-select-option-item-holder">\n                                            {{#multiple}}\n                                            <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                                                <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                            </span>\n                                            {{/multiple}}\n                                            <span class="ax-select-option-item-cell ax-select-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                                        </div>\n                                    </div>\n                                    {{/options}}\n                                </div>                            \n                            {{/optgroup}}\n                            {{^optgroup}}\n                            <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{' + columnKeys.optionValue + '}}" {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                                <div class="ax-select-option-item-holder">\n                                    {{#multiple}}\n                                    <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                                        <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                    </span>\n                                    {{/multiple}}\n                                    <span class="ax-select-option-item-cell ax-select-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                                </div>\n                            </div>\n                            {{/optgroup}}\n                        {{/options}}\n                        {{^options}}\n                            <div class="ax-select-option-item">\n                                <div class="ax-select-option-item-holder">\n                                    <span class="ax-select-option-item-cell ax-select-option-item-label">\n                                        {{{lang.noOptions}}}\n                                    </span>\n                                </div>\n                            </div>\n                        {{/options}}\n                    {{/waitOptions}}\n                    ';
    };

    SELECT.tmpl = {
        "optionGroupTmpl": optionGroupTmpl,
        "tmpl": tmpl,
        "selectTmpl": selectTmpl,
        "optionsTmpl": optionsTmpl,

        get: function get(tmplName, data, columnKeys) {
            return jQuery(ax5.mustache.render(SELECT.tmpl[tmplName].call(this, columnKeys), data));
        }
    };
})();
/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var GRID;

    UI.addClass({
        className: "grid",
        version: "0.2.21"
    }, function () {
        /**
         * @class ax5grid
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myGrid = new ax5.ui.grid();
         * ```
         */
        var ax5grid = function ax5grid() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,

                // 틀고정 속성
                frozenColumnIndex: 0,
                frozenRowIndex: 0,
                showLineNumber: false,
                showRowSelector: false,
                multipleSelect: false,

                height: 0,
                columnMinWidth: 100,
                lineNumberColumnWidth: 30,
                rowSelectorColumnWidth: 26,
                sortable: undefined,

                header: {
                    align: false,
                    columnHeight: 26,
                    columnPadding: 3,
                    columnBorderWidth: 1
                },
                body: {
                    align: false,
                    columnHeight: 26,
                    columnPadding: 3,
                    columnBorderWidth: 1,
                    grouping: false
                },
                rightSum: false,
                footSum: false,
                page: {
                    height: 25,
                    display: true,
                    navigationItemCount: 5
                },
                scroller: {
                    size: 15,
                    barMinSize: 15,
                    trackPadding: 4
                },
                columnKeys: {
                    selected: '__selected__',
                    modified: '__modified__',
                    deleted: '__deleted__'
                }
            };
            this.xvar = {
                bodyTrHeight: 0, // 한줄의 높이
                scrollContentWidth: 0, // 스크롤 될 내용물의 너비 (스크롤 될 내용물 : panel['body-scroll'] 안에 컬럼이 있는)
                scrollContentHeight: 0 // 스크롤 된 내용물의 높이
            };
            // 그리드 데이터셋
            this.columns = []; // config.columns에서 복제된 오브젝트
            this.colGroup = []; // columns를 table태그로 출력하기 좋게 변환한 오브젝트
            this.footSumColumns = [];
            this.bodyGrouping = {};

            this.list = []; // 그리드의 데이터
            this.page = {}; // 그리드의 페이지 정보
            this.deletedList = [];
            this.sortInfo = {}; // 그리드의 헤더 정렬 정보
            this.focusedColumn = {}; // 그리드 바디의 포커스된 셀 정보
            this.selectedColumn = {}; // 그리드 바디의 선택된 셀 정보
            this.isInlineEditing = false;
            this.inlineEditing = {};

            // header
            this.headerTable = {};
            this.leftHeaderData = {};
            this.headerData = {};
            this.rightHeaderData = {};

            // body
            this.bodyRowTable = {};
            this.leftBodyRowData = {};
            this.bodyRowData = {};
            this.rightBodyRowData = {};
            this.bodyRowMap = {};

            this.bodyGroupingTable = {};
            this.leftBodyGroupingData = {};
            this.bodyGroupingData = {};
            this.rightBodyGroupingData = {};

            // footSum
            this.footSumTable = {}; // footSum의 출력레이아웃
            this.leftFootSumData = {}; // frozenColumnIndex 를 기준으로 나누어진 출력 레이아웃 왼쪽
            this.footSumData = {}; // frozenColumnIndex 를 기준으로 나누어진 출력 레이아웃 오른쪽
            this.needToPaintSum = true; // 데이터 셋이 변경되어 summary 변경 필요여부


            cfg = this.config;

            var onStateChanged = function onStateChanged(_opts, _that) {
                if (_opts && _opts.onStateChanged) {
                    _opts.onStateChanged.call(_that, _that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(_that, _that);
                }
                return true;
            },
                initGrid = function initGrid() {
                // 그리드 템플릿에 전달하고자 하는 데이터를 정리합시다.
                var data = {
                    instanceId: this.id
                };

                this.$target.html(GRID.tmpl.get("main", data));

                // 그리드 패널 프레임의 각 엘리먼트를 캐쉬합시다.
                this.$ = {
                    "container": {
                        "hidden": this.$target.find('[data-ax5grid-container="hidden"]'),
                        "root": this.$target.find('[data-ax5grid-container="root"]'),
                        "header": this.$target.find('[data-ax5grid-container="header"]'),
                        "body": this.$target.find('[data-ax5grid-container="body"]'),
                        "page": this.$target.find('[data-ax5grid-container="page"]'),
                        "scroller": this.$target.find('[data-ax5grid-container="scroller"]')
                    },
                    "panel": {
                        "aside-header": this.$target.find('[data-ax5grid-panel="aside-header"]'),
                        "left-header": this.$target.find('[data-ax5grid-panel="left-header"]'),
                        "header": this.$target.find('[data-ax5grid-panel="header"]'),
                        "header-scroll": this.$target.find('[data-ax5grid-panel-scroll="header"]'),
                        "right-header": this.$target.find('[data-ax5grid-panel="right-header"]'),
                        "top-aside-body": this.$target.find('[data-ax5grid-panel="top-aside-body"]'),
                        "top-left-body": this.$target.find('[data-ax5grid-panel="top-left-body"]'),
                        "top-body": this.$target.find('[data-ax5grid-panel="top-body"]'),
                        "top-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="top-body"]'),
                        "top-right-body": this.$target.find('[data-ax5grid-panel="top-right-body"]'),
                        "aside-body": this.$target.find('[data-ax5grid-panel="aside-body"]'),
                        "aside-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="aside-body"]'),
                        "left-body": this.$target.find('[data-ax5grid-panel="left-body"]'),
                        "left-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="left-body"]'),
                        "body": this.$target.find('[data-ax5grid-panel="body"]'),
                        "body-scroll": this.$target.find('[data-ax5grid-panel-scroll="body"]'),
                        "right-body": this.$target.find('[data-ax5grid-panel="right-body"]'),
                        "right-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="right-body"]'),
                        "bottom-aside-body": this.$target.find('[data-ax5grid-panel="bottom-aside-body"]'),
                        "bottom-left-body": this.$target.find('[data-ax5grid-panel="bottom-left-body"]'),
                        "bottom-body": this.$target.find('[data-ax5grid-panel="bottom-body"]'),
                        "bottom-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="bottom-body"]'),
                        "bottom-right-body": this.$target.find('[data-ax5grid-panel="bottom-right-body"]')
                    },
                    "livePanelKeys": [], // 현재 사용중인 패널들 (grid-body repaint에서 수집하여 처리)
                    "scroller": {
                        "vertical": this.$target.find('[data-ax5grid-scroller="vertical"]'),
                        "vertical-bar": this.$target.find('[data-ax5grid-scroller="vertical-bar"]'),
                        "horizontal": this.$target.find('[data-ax5grid-scroller="horizontal"]'),
                        "horizontal-bar": this.$target.find('[data-ax5grid-scroller="horizontal-bar"]'),
                        "corner": this.$target.find('[data-ax5grid-scroller="corner"]')
                    },
                    "page": {
                        "navigation": this.$target.find('[data-ax5grid-page="navigation"]'),
                        "status": this.$target.find('[data-ax5grid-page="status"]')
                    },
                    "form": {
                        "clipboard": this.$target.find('[data-ax5grid-form="clipboard"]')
                    },
                    "resizer": {
                        "vertical": this.$target.find('[data-ax5grid-resizer="vertical"]'),
                        "horizontal": this.$target.find('[data-ax5grid-resizer="horizontal"]')
                    }
                };

                this.$["container"]["root"].css({ height: this.config.height });

                return this;
            },
                initColumns = function initColumns(_columns) {
                this.columns = U.deepCopy(_columns);
                this.headerTable = GRID.util.makeHeaderTable.call(this, this.columns);

                this.xvar.frozenColumnIndex = cfg.frozenColumnIndex > this.columns.length ? this.columns.length : cfg.frozenColumnIndex;

                this.bodyRowTable = GRID.util.makeBodyRowTable.call(this, this.columns);
                this.bodyRowMap = GRID.util.makeBodyRowMap.call(this, this.bodyRowTable);
                // 바디에 표현될 한줄의 높이를 계산합니다.
                this.xvar.bodyTrHeight = this.bodyRowTable.rows.length * this.config.body.columnHeight;

                var colGroupMap = {};
                for (var r = 0, rl = this.headerTable.rows.length; r < rl; r++) {
                    var row = this.headerTable.rows[r];
                    for (var c = 0, cl = row.cols.length; c < cl; c++) {
                        colGroupMap[row.cols[c].colIndex] = jQuery.extend({}, row.cols[c]);
                    }
                }

                this.colGroup = [];
                for (var k in colGroupMap) {
                    this.colGroup.push(colGroupMap[k]);
                }

                return this;
            },
                onResetColumns = function onResetColumns() {
                initColumns.call(this, this.config.columns);
                resetColGroupWidth.call(this);
                if (this.config.footSum) {
                    initFootSum.call(this, this.config.footSum);
                    this.needToPaintSum = true;
                }
                if (this.config.body.grouping) initBodyGroup.call(this, this.config.body.grouping);
                alignGrid.call(this, true);
                GRID.header.repaint.call(this, true);
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);
            },
                resetColGroupWidth = function resetColGroupWidth() {
                /// !! 그리드 target의 크기가 변경되면 이 함수를 호출하려 this.colGroup의 _width 값을 재 계산 하여야 함. [tom]
                var CT_WIDTH = this.$["container"]["root"].width();
                var totalWidth = 0;
                var computedWidth;
                var autoWidthColgroupIndexs = [];
                var colGroup = this.colGroup;
                var i, l;

                for (i = 0, l = colGroup.length; i < l; i++) {
                    if (U.isNumber(colGroup[i].width)) {
                        totalWidth += colGroup[i]._width = colGroup[i].width;
                    } else if (colGroup[i].width === "*") {
                        autoWidthColgroupIndexs.push(i);
                    } else if (U.right(colGroup[i].width, 1) === "%") {
                        totalWidth += colGroup[i]._width = CT_WIDTH * U.left(colGroup[i].width, "%") / 100;
                    }
                }
                if (autoWidthColgroupIndexs.length > 0) {
                    computedWidth = (CT_WIDTH - totalWidth) / autoWidthColgroupIndexs.length;
                    for (i = 0, l = autoWidthColgroupIndexs.length; i < l; i++) {
                        colGroup[autoWidthColgroupIndexs[i]]._width = computedWidth;
                    }
                }
            },
                initFootSum = function initFootSum(_footSum) {
                if (U.isArray(_footSum)) {
                    this.footSumTable = GRID.util.makeFootSumTable.call(this, this.footSumColumns = _footSum);
                } else {
                    this.footSumColumns = [];
                    this.footSumTable = {};
                }
            },
                initBodyGroup = function initBodyGroup(_grouping) {
                var grouping = jQuery.extend({}, _grouping);
                if ("by" in grouping && "columns" in grouping) {

                    this.bodyGrouping = {
                        by: grouping.by,
                        columns: grouping.columns
                    };
                    this.bodyGroupingTable = GRID.util.makeBodyGroupingTable.call(this, this.bodyGrouping.columns);
                    this.sortInfo = function () {
                        var sortInfo = {};
                        for (var k = 0, kl = this.bodyGrouping.by.length; k < kl; k++) {
                            sortInfo[this.bodyGrouping.by[k]] = {
                                orderBy: "asc",
                                seq: k,
                                fixed: true
                            };
                            for (var c = 0, cl = this.colGroup.length; c < cl; c++) {
                                if (this.colGroup[c].key === this.bodyGrouping.by[k]) {
                                    this.colGroup[c].sort = "asc";
                                    this.colGroup[c].sortFixed = true;
                                }
                            }
                        }
                        return sortInfo;
                    }.call(this);
                } else {
                    cfg.body.grouping = false;
                }
            },
                alignGrid = function alignGrid(_isFirst) {
                // isFirst : 그리드 정렬 메소드가 처음 호출 되었는지 판단 하는 아규먼트
                var CT_WIDTH = this.$["container"]["root"].width();
                var CT_HEIGHT = this.$["container"]["root"].height();
                var CT_INNER_WIDTH = CT_WIDTH;
                var CT_INNER_HEIGHT = CT_HEIGHT;

                var asidePanelWidth = cfg.asidePanelWidth = function () {
                    var width = 0;

                    if (cfg.showLineNumber) width += cfg.lineNumberColumnWidth;
                    if (cfg.showRowSelector) width += cfg.rowSelectorColumnWidth;
                    return width;
                }();

                var frozenPanelWidth = cfg.frozenPanelWidth = function (colGroup, endIndex) {
                    var width = 0;
                    for (var i = 0, l = endIndex; i < l; i++) {
                        width += colGroup[i]._width;
                    }
                    return width;
                }(this.colGroup, cfg.frozenColumnIndex);

                var rightPanelWidth = 0; // todo : 우측 함계컬럼 넘비 계산

                var frozenRowHeight = function (bodyTrHeight) {
                    return cfg.frozenRowIndex * bodyTrHeight;
                }(this.xvar.bodyTrHeight);

                var footSumHeight = function (bodyTrHeight) {
                    return this.footSumColumns.length * bodyTrHeight;
                }.call(this, this.xvar.bodyTrHeight);

                var headerHeight = this.headerTable.rows.length * cfg.header.columnHeight;
                var pageHeight = cfg.page.display ? cfg.page.height : 0;

                // 데이터의 길이가 body보다 높을때. 수직 스크롤러 활성화
                var verticalScrollerWidth, horizontalScrollerHeight;

                (function () {
                    verticalScrollerWidth = CT_HEIGHT - headerHeight - pageHeight - footSumHeight < this.list.length * this.xvar.bodyTrHeight ? this.config.scroller.size : 0;
                    // 남은 너비가 colGroup의 너비보다 넓을때. 수평 스크롤 활성화.
                    horizontalScrollerHeight = function () {
                        var totalColGroupWidth = 0;
                        // aside 빼고 너비
                        // 수직 스크롤이 있으면 또 빼고 비교
                        var bodyWidth = CT_WIDTH - asidePanelWidth - verticalScrollerWidth;
                        for (var i = 0, l = this.colGroup.length; i < l; i++) {
                            totalColGroupWidth += this.colGroup[i]._width;
                        }
                        return totalColGroupWidth > bodyWidth ? this.config.scroller.size : 0;
                    }.call(this);

                    if (horizontalScrollerHeight > 0) {
                        verticalScrollerWidth = CT_HEIGHT - headerHeight - pageHeight - footSumHeight - horizontalScrollerHeight < this.list.length * this.xvar.bodyTrHeight ? this.config.scroller.size : 0;
                    }
                }).call(this);

                // 수평 너비 결정
                CT_INNER_WIDTH = CT_WIDTH - verticalScrollerWidth;
                // 수직 스크롤러의 높이 결정.
                CT_INNER_HEIGHT = CT_HEIGHT - pageHeight - horizontalScrollerHeight;

                var bodyHeight = CT_INNER_HEIGHT - headerHeight;

                var panelDisplayProcess = function panelDisplayProcess(panel, vPosition, hPosition, containerType) {
                    var css = {};
                    var isHide = false;

                    switch (hPosition) {
                        case "aside":
                            if (asidePanelWidth === 0) {
                                isHide = true;
                            } else {
                                css["left"] = 0;
                                css["width"] = asidePanelWidth;
                            }
                            break;
                        case "left":
                            if (cfg.frozenColumnIndex === 0) {
                                isHide = true;
                            } else {
                                css["left"] = asidePanelWidth;
                                css["width"] = frozenPanelWidth;
                            }
                            break;
                        case "right":
                            if (!cfg.rightSum) {
                                isHide = true;
                            } else {}
                            break;
                        default:
                            if (containerType !== "page") {
                                if (cfg.frozenColumnIndex === 0) {
                                    css["left"] = asidePanelWidth;
                                } else {
                                    css["left"] = frozenPanelWidth + asidePanelWidth;
                                }
                                css["width"] = CT_INNER_WIDTH - asidePanelWidth - frozenPanelWidth - rightPanelWidth;
                            }
                            break;
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    if (containerType === "body") {
                        switch (vPosition) {
                            case "top":
                                if (cfg.frozenRowIndex == 0) {
                                    isHide = true;
                                } else {
                                    css["top"] = 0;
                                    css["height"] = frozenRowHeight;
                                }
                                break;
                            case "bottom":
                                if (!cfg.footSum) {
                                    isHide = true;
                                } else {
                                    css["top"] = bodyHeight - footSumHeight;
                                    css["height"] = footSumHeight; // footSum height
                                }
                                break;
                            default:

                                css["top"] = frozenRowHeight;
                                css["height"] = bodyHeight - frozenRowHeight - footSumHeight;

                                break;
                        }
                    } else if (containerType === "header") {
                        css["height"] = headerHeight;
                    } else if (containerType === "page") {
                        if (pageHeight == 0) {
                            isHide = true;
                        } else {
                            css["height"] = pageHeight;
                        }
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    panel.css(css);
                    return this;
                };
                var scrollerDisplayProcess = function scrollerDisplayProcess(panel, scrollerWidth, scrollerHeight, containerType) {
                    var css = {};
                    var isHide = false;

                    switch (containerType) {
                        case "vertical":
                            if (scrollerWidth > 0) {
                                css["width"] = scrollerWidth;
                                css["height"] = CT_INNER_HEIGHT;
                                css["bottom"] = scrollerHeight + pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "horizontal":
                            if (scrollerHeight > 0) {
                                css["width"] = CT_INNER_WIDTH;
                                css["height"] = scrollerHeight;
                                css["right"] = scrollerWidth;
                                css["bottom"] = pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "corner":
                            if (scrollerWidth > 0 && scrollerHeight > 0) {
                                css["width"] = scrollerWidth;
                                css["height"] = scrollerHeight;
                                css["bottom"] = pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    panel.show().css(css);
                };

                this.$["container"]["header"].css({ height: headerHeight });
                this.$["container"]["body"].css({ height: bodyHeight });

                // 각 패널들의 크기 표시여부를 결정합니다
                panelDisplayProcess.call(this, this.$["panel"]["aside-header"], "", "aside", "header");
                panelDisplayProcess.call(this, this.$["panel"]["left-header"], "", "left", "header");
                panelDisplayProcess.call(this, this.$["panel"]["header"], "", "", "header");
                panelDisplayProcess.call(this, this.$["panel"]["right-header"], "", "right", "header");

                panelDisplayProcess.call(this, this.$["panel"]["top-aside-body"], "top", "aside", "body");
                panelDisplayProcess.call(this, this.$["panel"]["top-left-body"], "top", "left", "body");
                panelDisplayProcess.call(this, this.$["panel"]["top-body"], "top", "", "body");
                panelDisplayProcess.call(this, this.$["panel"]["top-right-body"], "top", "right", "body");

                panelDisplayProcess.call(this, this.$["panel"]["aside-body"], "", "aside", "body");
                panelDisplayProcess.call(this, this.$["panel"]["left-body"], "", "left", "body");
                panelDisplayProcess.call(this, this.$["panel"]["body"], "", "", "body");
                panelDisplayProcess.call(this, this.$["panel"]["right-body"], "", "right", "body");

                panelDisplayProcess.call(this, this.$["panel"]["bottom-aside-body"], "bottom", "aside", "body");
                panelDisplayProcess.call(this, this.$["panel"]["bottom-left-body"], "bottom", "left", "body");
                panelDisplayProcess.call(this, this.$["panel"]["bottom-body"], "bottom", "", "body");
                panelDisplayProcess.call(this, this.$["panel"]["bottom-right-body"], "bottom", "right", "body");

                scrollerDisplayProcess.call(this, this.$["scroller"]["vertical"], verticalScrollerWidth, horizontalScrollerHeight, "vertical");
                scrollerDisplayProcess.call(this, this.$["scroller"]["horizontal"], verticalScrollerWidth, horizontalScrollerHeight, "horizontal");
                scrollerDisplayProcess.call(this, this.$["scroller"]["corner"], verticalScrollerWidth, horizontalScrollerHeight, "corner");

                panelDisplayProcess.call(this, this.$["container"]["page"], "", "", "page");
            },
                sortColumns = function sortColumns(_sortInfo) {
                GRID.header.repaint.call(this);

                if (this.config.body.grouping) {
                    this.list = GRID.data.initData.call(this, GRID.data.sort.call(this, _sortInfo, GRID.data.clearGroupingData.call(this, this.list)));
                } else {
                    this.list = GRID.data.sort.call(this, _sortInfo, GRID.data.clearGroupingData.call(this, this.list));
                }
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);
            };

            /// private end

            /**
             * Preferences of grid UI
             * @method ax5grid.setConfig
             * @param {Object} _config - 클래스 속성값
             * @param {Element} _config.target
             * @param {Number} [_config.frozenColumnIndex=0]
             * @param {Number} [_config.frozenRowIndex=0]
             * @param {Boolean} [_config.showLineNumber=false]
             * @param {Boolean} [_config.showRowSelector=false]
             * @param {Boolean} [_config.multipleSelect=false]
             * @param {Number} [_config.columnMinWidth=100]
             * @param {Number} [_config.lineNumberColumnWidth=30]
             * @param {Number} [_config.rowSelectorColumnWidth=25]
             * @param {Boolean} [_config.sortable=false]
             * @param {Boolean} [_config.multiSort=false]
             * @param {Boolean} [_config.remoteSort=false]
             * @param {Object} [_config.header]
             * @param {String} [_config.header.align]
             * @param {Number} [_config.header.columnHeight=25]
             * @param {Number} [_config.header.columnPadding=3]
             * @param {Number} [_config.header.columnBorderWidth=1]
             * @param {Object} [_config.body]
             * @param {String} [_config.body.align]
             * @param {Number} [_config.body.columnHeight=25]
             * @param {Number} [_config.body.columnPadding=3]
             * @param {Number} [_config.body.columnBorderWidth=1]
             * @param {Object} [_config.body.grouping]
             * @param {Array} [_config.body.grouping.by] - list grouping keys
             * @param {Array} [_config.body.grouping.columns] - list grouping columns
             * @param {Object} [_config.page]
             * @param {Number} [_config.page.height=25]
             * @param {Boolean} [_config.page.display=true]
             * @param {Number} [_config.page.navigationItemCount=5]
             * @param {Object} [_config.scroller]
             * @param {Number} [_config.scroller.size=15]
             * @param {Number} [_config.scroller.barMinSize=15]
             * @param {Number} [_config.scroller.trackPadding=4]
             * @param {Object} [_config.columnKeys]
             * @param {String} [_config.columnKeys.selected="_SELECTED"]
             * @param {Object[]} _config.columns
             * @param {String} _config.columns[].key
             * @param {String} _config.columns[].label
             * @param {Number} _config.columns[].width
             * @param {(String|Function)} _config.columns[].styleClass
             * @param {Boolean} _config.columns[].enableFilter
             * @param {Boolean} _config.columns[].sortable
             * @param {String} _config.columns[].align
             * @param {(String|Function)} _config.columns[].formatter
             * @param {Object} _config.columns[].editor
             * @param {String} _config.columns[].editor.type - text,number,money,date
             * @param {Object} _config.columns[].editor.config
             * @param {Array} _config.columns[].editor.updateWith
             * @returns {ax5grid}
             * @example
             * ```
             * ```
             */
            this.init = function (_config) {
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;

                cfg = jQuery.extend(true, {}, cfg, _config);
                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5grid", "401", "init"));
                    return this;
                }

                this.$target = jQuery(cfg.target);

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        cfg = jQuery.extend(true, cfg, data);
                    }
                }).call(this, U.parseJson(this.$target.attr("data-ax5grid-config"), true));

                var grid = this.config = cfg;

                if (!this.config.height) {
                    this.config.height = this.$target.height();
                }

                if (!this.id) this.id = this.$target.data("data-ax5grid-id");
                if (!this.id) {
                    this.id = 'ax5grid-' + ax5.getGuid();
                    this.$target.data("data-ax5grid-id", grid.id);
                }

                ///========
                // 그리드를 그리기 위한 가장 기초적인 작업 뼈대와 틀을 준비합니다. 이 메소드는 초기화 시 한번만 호출 되게 됩니다.
                initGrid.call(this);

                // columns데이터를 분석하여 미리 처리해야하는 데이터를 정리합니다.
                initColumns.call(this, grid.columns);
                resetColGroupWidth.call(this);

                // footSum 데이터를 분석하여 미리 처리해야 하는 데이터를 정리
                if (grid.footSum) initFootSum.call(this, grid.footSum);

                // bodyGrouping 데이터를 분석하여 미리 처리해야 하는 데이터를 정리
                if (grid.body.grouping) initBodyGroup.call(this, grid.body.grouping);

                // 그리드의 각 요소의 크기를 맞춤니다.
                alignGrid.call(this, true);

                // columns의 데이터로 header데이터를 만들고
                GRID.header.init.call(this);
                // header를 출력합니다.
                GRID.header.repaint.call(this);

                // columns의 데이터로 body데이터를 만들고
                GRID.body.init.call(this);
                // body를 출력합니다.
                GRID.body.repaint.call(this);

                // scroller
                GRID.scroller.init.call(this);
                GRID.scroller.resize.call(this);

                jQuery(window).bind("resize.ax5grid-" + this.instanceId, function () {
                    alignGrid.call(this);
                    GRID.scroller.resize.call(this);
                }.bind(this));

                jQuery(document.body).on("click.ax5grid-" + this.instanceId, function (e) {
                    var isPickerClick = false;
                    var target = U.findParentNode(e.target, function (_target) {
                        if (isPickerClick = _target.getAttribute("data-ax5grid-inline-edit-picker")) {
                            return true;
                        }
                        return _target.getAttribute("data-ax5grid-container");
                    });

                    if (target) {
                        self.focused = true;
                    } else {
                        self.focused = false;
                        GRID.body.blur.call(self);
                    }
                });

                var ctrlKeys = {
                    "33": "KEY_PAGEUP",
                    "34": "KEY_PAGEDOWN",
                    "35": "KEY_END",
                    "36": "KEY_HOME",
                    "37": "KEY_LEFT",
                    "38": "KEY_UP",
                    "39": "KEY_RIGHT",
                    "40": "KEY_DOWN"
                };
                jQuery(window).on("keydown.ax5grid-" + this.instanceId, function (e) {
                    if (self.focused) {

                        if (self.isInlineEditing) {
                            if (e.which == ax5.info.eventKeys.ESC) {
                                self.keyDown("ESC", e.originalEvent);
                            } else if (e.which == ax5.info.eventKeys.RETURN) {
                                self.keyDown("RETURN", e.originalEvent);
                            } else if (e.which == ax5.info.eventKeys.TAB) {
                                self.keyDown("TAB", e.originalEvent);
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.UP) {
                                self.keyDown("RETURN", { shiftKey: true });
                            } else if (e.which == ax5.info.eventKeys.DOWN) {
                                self.keyDown("RETURN", {});
                            }
                        } else {

                            if (e.metaKey || e.ctrlKey) {
                                if (e.which == 67) {
                                    // c
                                    self.copySelect();
                                }
                            } else {
                                if (ctrlKeys[e.which]) {
                                    self.keyDown(ctrlKeys[e.which], e.originalEvent);
                                    U.stopEvent(e);
                                } else if (e.which == ax5.info.eventKeys.ESC) {
                                    if (self.focused) {
                                        GRID.body.blur.call(self);
                                    }
                                } else if (e.which == ax5.info.eventKeys.RETURN) {
                                    self.keyDown("RETURN", e.originalEvent);
                                } else if (e.which == ax5.info.eventKeys.TAB) {
                                    self.keyDown("RETURN", e.originalEvent);
                                } else if (e.which != ax5.info.eventKeys.SPACE && Object.keys(self.focusedColumn).length) {
                                    self.keyDown("INLINE_EDIT", e.originalEvent);
                                }
                            }
                        }
                    }
                });
                return this;
            };

            /**
             * align grid size
             * @method ax5grid.align
             * @returns {ax5grid}
             */
            this.align = function () {
                alignGrid.call(this);
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.keyDown
             * @param {String} _keyName
             * @param {Event|Object} _data
             * @return {ax5grid}
             */
            this.keyDown = function () {
                var processor = {
                    "KEY_UP": function KEY_UP() {
                        GRID.body.moveFocus.call(this, "UP");
                    },
                    "KEY_DOWN": function KEY_DOWN() {
                        GRID.body.moveFocus.call(this, "DOWN");
                    },
                    "KEY_LEFT": function KEY_LEFT() {
                        GRID.body.moveFocus.call(this, "LEFT");
                    },
                    "KEY_RIGHT": function KEY_RIGHT() {
                        GRID.body.moveFocus.call(this, "RIGHT");
                    },
                    "KEY_HOME": function KEY_HOME() {
                        GRID.body.moveFocus.call(this, "HOME");
                    },
                    "KEY_END": function KEY_END() {
                        GRID.body.moveFocus.call(this, "END");
                    },
                    "INLINE_EDIT": function INLINE_EDIT(_e) {
                        GRID.body.inlineEdit.active.call(this, this.focusedColumn, _e);
                        if (!/[0-9a-zA-Z]/.test(_e.key)) {
                            U.stopEvent(_e);
                        }
                    },
                    "ESC": function ESC(_e) {
                        GRID.body.inlineEdit.keydown.call(this, "ESC");
                    },
                    "RETURN": function RETURN(_e) {
                        var activeEditLength = 0;
                        for (var columnKey in this.inlineEditing) {
                            activeEditLength++;

                            GRID.body.inlineEdit.keydown.call(this, "RETURN", columnKey);
                            // next focus
                            if (activeEditLength == 1) {
                                if (GRID.body.moveFocus.call(this, _e.shiftKey ? "UP" : "DOWN")) {
                                    GRID.body.inlineEdit.keydown.call(this, "RETURN");
                                }
                            }
                        }
                        if (activeEditLength == 0) {
                            GRID.body.inlineEdit.keydown.call(this, "RETURN");
                        }
                    },
                    "TAB": function TAB(_e) {
                        var activeEditLength = 0;
                        for (var columnKey in this.inlineEditing) {
                            activeEditLength++;

                            GRID.body.inlineEdit.keydown.call(this, "RETURN", columnKey);
                            // next focus
                            if (activeEditLength == 1) {
                                if (GRID.body.moveFocus.call(this, _e.shiftKey ? "LEFT" : "RIGHT")) {
                                    GRID.body.inlineEdit.keydown.call(this, "RETURN");
                                }
                            }
                        }
                    }
                };
                return function (_act, _data) {
                    if (_act in processor) processor[_act].call(this, _data);
                    return this;
                };
            }();

            /**
             * @method ax5grid.copySelect
             * @returns {Boolean} copysuccess
             */
            this.copySelect = function () {
                var copysuccess;
                var $clipBoard = this.$["form"]["clipboard"];
                var copyTextArray = [];
                var copyText = "";

                var _rowIndex, _colIndex, _dindex;
                var _di = 0;
                for (var c in this.selectedColumn) {
                    var _column = this.selectedColumn[c];

                    if (_column) {
                        if (typeof _dindex === "undefined") {
                            _dindex = _column.dindex;
                            _rowIndex = _column.rowIndex;
                            _colIndex = _column.rowIndex;
                        }

                        if (_dindex != _column.dindex || _rowIndex != _column.rowIndex) {
                            _di++;
                        }

                        if (!copyTextArray[_di]) {
                            copyTextArray[_di] = [];
                        }
                        var originalColumn = this.bodyRowMap[_column.rowIndex + "_" + _column.colIndex];
                        if (originalColumn) {
                            if (this.list[_column.dindex].__isGrouping) {
                                copyTextArray[_di].push(this.list[_column.dindex][_column.colIndex]);
                            } else {
                                copyTextArray[_di].push(this.list[_column.dindex][originalColumn.key]);
                            }
                        } else {
                            copyTextArray[_di].push("");
                        }

                        _dindex = _column.dindex;
                        _rowIndex = _column.rowIndex;
                    }
                }

                copyTextArray.forEach(function (r) {
                    copyText += r.join('\t') + "\n";
                });

                $clipBoard.get(0).innerText = copyText;
                $clipBoard.select();

                try {
                    copysuccess = document.execCommand("copy");
                } catch (e) {
                    copysuccess = false;
                }
                return copysuccess;
            };

            /**
             * @method ax5grid.setData
             * @param {Array} _data
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.setData({
             *  list: [],
             *  page: {
             *      currentPage: 0,
             *      pageSize: 50,
             *      totalElements: 500,
             *      totalPages: 100
             *  }
             * });
             *
             * // onlyList
             * ax5Grid.setData([]);
             * ```
             */
            this.setData = function (_data) {
                GRID.data.set.call(this, _data);
                alignGrid.call(this);
                GRID.body.repaint.call(this);
                GRID.scroller.resize.call(this);
                GRID.page.navigationUpdate.call(this);
                GRID.body.scrollTo.call(this, { top: 0 });
                return this;
            };

            /**
             * @method ax5grid.getList
             * @param {String} _type
             * @returns {Array}
             * @example
             * ```js
             * ax5Grid.getList();
             * ax5Grid.getList("modified");
             * ax5Grid.getList("deleted");
             * ```
             */
            this.getList = function (_type) {
                return GRID.data.getList.call(this, _type);
            };

            /**
             * @method ax5grid.setHeight
             * @param {Number} _height
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.setHeight(height);
             * ```
             */
            this.setHeight = function (_height) {
                //console.log(this.$target);

                if (_height == "100%") {
                    _height = this.$target.offsetParent().innerHeight();
                }
                this.$target.css({ height: _height });
                this.$["container"]["root"].css({ height: _height });
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.addRow
             * @param {Object} _row
             * @param {Number|String} [_dindex=last]
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.addRow($.extend({}, {...}), "first");
             * ```
             */
            this.addRow = function (_row, _dindex) {
                GRID.data.add.call(this, _row, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.body.moveFocus.call(this, this.config.body.grouping ? "START" : "END");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.removeRow
             * @param {Number|String} [_dindex=last]
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.removeRow();
             * ax5Grid.removeRow("first");
             * ax5Grid.removeRow("last");
             * ax5Grid.removeRow(1);
             * ```
             */
            this.removeRow = function (_dindex) {
                GRID.data.remove.call(this, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.body.moveFocus.call(this, this.config.body.grouping ? "START" : "END");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.updateRow
             * @param {Object} _row
             * @param {Number} _dindex
             * @returns {ax5grid}
             */
            this.updateRow = function (_row, _dindex) {
                GRID.data.update.call(this, _row, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.body.moveFocus.call(this, this.config.body.grouping ? "START" : _dindex);
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.deleteRow
             * @param {Number|String} _dindex
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.deleteRow("first");
             * ax5Grid.deleteRow("last");
             * ax5Grid.deleteRow(1);
             * ax5Grid.deleteRow("selected");
             * ```
             */
            this.deleteRow = function (_dindex) {
                GRID.data.deleteRow.call(this, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                // 삭제시엔 포커스 ?
                // GRID.body.moveFocus.call(this, (this.config.body.grouping) ? "START" : "END");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.addColumn
             * @param {Object} _column
             * @param {Number|String} [_cindex=last]
             * @returns {ax5grid}
             */
            this.addColumn = function () {
                var processor = {
                    "first": function first(_column) {
                        this.config.columns = [].concat(_column).concat(this.config.columns);
                    },
                    "last": function last(_column) {
                        this.config.columns = this.config.columns.concat([].concat(_column));
                    }
                };

                return function (_column, _cindex) {
                    if (typeof _column === "undefined") throw '_column must not be null';
                    if (typeof _cindex === "undefined") _cindex = "last";
                    if (_cindex in processor) {
                        processor[_cindex].call(this, _column);
                    } else {
                        if (!U.isNumber(_cindex)) {
                            throw 'invalid argument _cindex';
                        }
                        this.config.columns.splice(_cindex, [].concat(_column));
                    }
                    onResetColumns.call(this); // 컬럼이 변경되었을 때.
                    return this;
                };
            }();

            /**
             * @method ax5grid.removeCloumn
             * @param {Number|String} [_cindex=last]
             * @returns {ax5grid}
             */
            this.removeColumn = function () {
                var processor = {
                    "first": function first(_cindex) {
                        this.config.columns.splice(_cindex, 1);
                    },
                    "last": function last() {
                        this.config.columns.splice(this.config.columns.length - 1, 1);
                    }
                };
                return function (_cindex) {
                    if (typeof _cindex === "undefined") _cindex = "last";
                    if (_cindex in processor) {
                        processor[_cindex].call(this, _cindex);
                    } else {
                        if (!U.isNumber(_cindex)) {
                            throw 'invalid argument _cindex';
                        }
                        //
                        this.config.columns.splice(_cindex, 1);
                    }
                    onResetColumns.call(this); // 컬럼이 변경되었을 때.
                    return this;
                };
            }();

            /**
             * @method ax5grid.updateColumn
             * @param {Object} _column
             * @param {Number} _cindex
             * @returns {ax5grid}
             */
            this.updateColumn = function (_column, _cindex) {
                if (!U.isNumber(_cindex)) {
                    throw 'invalid argument _cindex';
                }
                //
                this.config.columns.splice(_cindex, 1, _column);
                onResetColumns.call(this); // 컬럼이 변경되었을 때.
                return this;
            };

            /**
             * @method ax5grid.setColumnWidth
             * @param _width
             * @param _cindex
             */
            this.setColumnWidth = function (_width, _cindex) {
                this.colGroup[this.xvar.columnResizerIndex]._width = _width;
                this.needToPaintSum = true;

                // 컬럼너비 변경사항 적용.
                GRID.header.repaint.call(this);
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);

                alignGrid.call(this);
                return this;
            };

            /**
             * @method ax5grid.getColumnSort
             * @returns {Object} sortInfo
             */
            this.getColumnSort = function () {

                return {};
            };

            /**
             * @method ax5grid.setColumnSort
             * @param {Object} _sortInfo
             * @param {Object} _sortInfo.key
             * @param {Number} _sortInfo.key.seq - seq of sortOrder
             * @param {String} _sortInfo.key.orderBy - "desc"|"asc"
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5grid.setColumnSort({a:{seq:0, orderBy:"desc"}, b:{seq:1, orderBy:"asc"}});
             * ```
             */
            this.setColumnSort = function (_sortInfo) {
                if (typeof _sortInfo !== "undefined") {
                    this.sortInfo = _sortInfo;
                    GRID.header.applySortStatus.call(this, _sortInfo);
                }

                sortColumns.call(this, _sortInfo || this.sortInfo);
                return this;
            };

            /**
             * @method ax5grid.select
             * @param {Number|Object} _selectObject
             * @param {Number} _selectObject.index - index of row
             * @param {Number} _selectObject.rowIndex - rowIndex of columns
             * @param {Number} _selectObject.conIndex - colIndex of columns
             * @returns {ax5grid}
             */
            this.select = function (_selectObject) {
                if (U.isNumber(_selectObject)) {
                    var dindex = _selectObject;

                    if (!this.config.multipleSelect) {
                        GRID.body.updateRowState.call(this, ["selectedClear"]);
                        GRID.data.clearSelect.call(this);
                    }

                    GRID.data.select.call(this, dindex);
                    GRID.body.updateRowState.call(this, ["selected"], dindex);
                }

                return this;
            };

            // 클래스 생성자
            this.main = function () {
                UI.grid_instance = UI.grid_instance || [];
                UI.grid_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5grid;
    }());

    GRID = ax5.ui.grid;
})();

// todo : filter
// todo : body menu
// todo : column reorder


// ax5.ui.grid.body
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var columnSelect = {
        focusClear: function focusClear() {
            var self = this;
            for (var c in self.focusedColumn) {
                var _column = self.focusedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').removeAttr('data-ax5grid-column-focused');
                }
            }
            self.focusedColumn = {};
        },
        clear: function clear() {
            var self = this;
            for (var c in self.selectedColumn) {
                var _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').removeAttr('data-ax5grid-column-selected');
                }
            }
            self.selectedColumn = {};
        },
        init: function init(column) {
            var self = this;
            if (this.isInlineEditing) {
                for (var editKey in this.inlineEditing) {
                    if (editKey == column.dindex + "_" + column.colIndex + "_" + column.rowIndex) {
                        return this;
                    }
                }
            }

            // focus
            columnSelect.focusClear.call(self);
            self.focusedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = {
                panelName: column.panelName,
                dindex: column.dindex,
                rowIndex: column.rowIndex,
                colIndex: column.colIndex,
                colspan: column.colspan
            };

            // select
            columnSelect.clear.call(self);
            self.xvar.selectedRange = {
                start: [column.dindex, column.rowIndex, column.colIndex, column.colspan - 1],
                end: null
            };
            self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = function (data) {
                if (data) {
                    return false;
                } else {
                    return {
                        panelName: column.panelName,
                        dindex: column.dindex,
                        rowIndex: column.rowIndex,
                        colIndex: column.colIndex,
                        colspan: column.colspan
                    };
                }
            }(self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex]);

            this.$.panel[column.panelName].find('[data-ax5grid-tr-data-index="' + column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + column.rowIndex + '"][data-ax5grid-column-colindex="' + column.colIndex + '"]').attr('data-ax5grid-column-focused', "true").attr('data-ax5grid-column-selected', "true");

            if (this.isInlineEditing) {
                GRID.body.inlineEdit.deActive.call(this, "RETURN");
            }
        },
        update: function update(column) {
            var self = this;
            var dindex, colIndex, rowIndex, trl;

            self.xvar.selectedRange["end"] = [column.dindex, column.rowIndex, column.colIndex, column.colspan - 1];
            columnSelect.clear.call(self);

            var range = {
                r: {
                    s: Math.min(self.xvar.selectedRange["start"][0], self.xvar.selectedRange["end"][0]),
                    e: Math.max(self.xvar.selectedRange["start"][0], self.xvar.selectedRange["end"][0])
                },
                c: {
                    s: Math.min(self.xvar.selectedRange["start"][2], self.xvar.selectedRange["end"][2]),
                    e: Math.max(self.xvar.selectedRange["start"][2] + self.xvar.selectedRange["start"][3], self.xvar.selectedRange["end"][2] + self.xvar.selectedRange["end"][3])
                }
            };

            dindex = range.r.s;
            for (; dindex <= range.r.e; dindex++) {

                trl = this.bodyRowTable.rows.length;
                rowIndex = 0;
                for (; rowIndex < trl; rowIndex++) {
                    colIndex = range.c.s;
                    for (; colIndex <= range.c.e; colIndex++) {
                        var _panels = [],
                            panelName = "";

                        if (self.xvar.frozenRowIndex > dindex) _panels.push("top");
                        if (self.xvar.frozenColumnIndex > colIndex) _panels.push("left");
                        _panels.push("body");
                        if (_panels[0] !== "top") _panels.push("scroll");
                        panelName = _panels.join("-");

                        self.selectedColumn[dindex + "_" + colIndex + "_" + rowIndex] = {
                            panelName: panelName,
                            dindex: dindex,
                            rowIndex: rowIndex,
                            colIndex: colIndex,
                            colspan: column.colspan
                        };

                        _panels = null;
                        panelName = null;
                    }
                }
            }
            dindex = null;
            colIndex = null;
            rowIndex = null;

            for (var c in self.selectedColumn) {
                var _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').attr('data-ax5grid-column-selected', 'true');
                }
            }
        }
    };

    var columnSelector = {
        "on": function on(cell) {
            var self = this;

            if (this.inlineEditing[cell.dindex + "_" + cell.colIndex + "_" + cell.rowIndex]) {
                return;
            }

            columnSelect.init.call(self, cell);

            this.$["container"]["body"].on("mousemove.ax5grid-" + this.instanceId, '[data-ax5grid-column-attr="default"]', function (e) {
                if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                    columnSelect.update.call(self, {
                        panelName: this.getAttribute("data-ax5grid-panel-name"),
                        dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                        rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                        colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                        colspan: Number(this.getAttribute("colspan"))
                    });
                    U.stopEvent(e);
                }
            }).on("mouseup.ax5grid-" + this.instanceId, function () {
                columnSelector.off.call(self);
            }).on("mouseleave.ax5grid-" + this.instanceId, function () {
                columnSelector.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {

            this.$["container"]["body"].off("mousemove.ax5grid-" + this.instanceId).off("mouseup.ax5grid-" + this.instanceId).off("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var updateRowState = function updateRowState(_states, _dindex, _data) {
        var self = this;
        var cfg = this.config;

        var processor = {
            "selected": function selected(_dindex) {
                var i = this.$.livePanelKeys.length;
                while (i--) {
                    this.$.panel[this.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').attr("data-ax5grid-selected", this.list[_dindex][cfg.columnKeys.selected]);
                }
            },
            "selectedClear": function selectedClear() {
                var si = this.selectedDataIndexs.length;
                while (si--) {
                    var dindex = this.selectedDataIndexs[si];
                    var i = this.$.livePanelKeys.length;
                    while (i--) {
                        this.$.panel[this.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + dindex + '"]').attr("data-ax5grid-selected", false);
                        this.list[dindex][cfg.columnKeys.selected] = false;
                    }
                }
            },
            "cellChecked": function cellChecked(_dindex, _data) {
                var key = _data.key;
                var rowIndex = _data.rowIndex;
                var colIndex = _data.colIndex;

                var panelName = function () {
                    var _panels = [];
                    if (this.xvar.frozenRowIndex > _dindex) _panels.push("top");
                    if (this.xvar.frozenColumnIndex > colIndex) _panels.push("left");
                    _panels.push("body");
                    if (_panels[0] !== "top") _panels.push("scroll");
                    return _panels.join("-");
                }.call(this);

                this.$.panel[panelName].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').find('[data-ax5grid-column-rowIndex="' + rowIndex + '"][data-ax5grid-column-colIndex="' + colIndex + '"]').find('[data-ax5grid-editor="checkbox"]').attr("data-ax5grid-checked", '' + _data.checked);
            }
        };
        _states.forEach(function (_state) {
            if (!processor[_state]) throw 'invaild state name';
            processor[_state].call(self, _dindex, _data);
        });
    };

    var init = function init() {
        var self = this;

        this.$["container"]["body"].on("click", '[data-ax5grid-column-attr]', function (e) {
            var panelName, attr, row, col, dindex, rowIndex, colIndex;
            var targetClick = {
                "default": function _default(_column) {
                    var column = self.bodyRowMap[_column.rowIndex + "_" + _column.colIndex];
                    var that = {
                        self: self,
                        page: self.page,
                        list: self.list,
                        item: self.list[_column.dindex],
                        dindex: _column.dindex,
                        rowIndex: _column.rowIndex,
                        colIndex: _column.colIndex,
                        column: column,
                        value: self.list[_column.dindex][column.key]
                    };

                    if (column.editor && column.editor.type == "checkbox") {
                        // todo : GRID.inlineEditor에서 처리 할수 있도록 구문 변경 필요.
                        var value = GRID.data.getValue.call(self, _column.dindex, column.key);

                        var checked, newValue;
                        if (column.editor.config && column.editor.config.trueValue) {
                            if (checked = !(value == column.editor.config.trueValue)) {
                                newValue = column.editor.config.trueValue;
                            } else {
                                newValue = column.editor.config.falseValue;
                            }
                        } else {
                            newValue = checked = value == false || value == "false" || value < "1" ? "true" : "false";
                        }

                        GRID.data.setValue.call(self, _column.dindex, column.key, newValue);

                        updateRowState.call(self, ["cellChecked"], _column.dindex, {
                            key: column.key, rowIndex: _column.rowIndex, colIndex: _column.colIndex,
                            editorConfig: column.editor.config, checked: checked
                        });
                    } else {
                        if (self.config.body.onClick) {
                            self.config.body.onClick.call(that);
                        }
                    }
                },
                "rowSelector": function rowSelector(_column) {
                    GRID.data.select.call(self, _column.dindex);
                    updateRowState.call(self, ["selected"], _column.dindex);
                },
                "lineNumber": function lineNumber(_column) {}
            };

            panelName = this.getAttribute("data-ax5grid-panel-name");
            attr = this.getAttribute("data-ax5grid-column-attr");
            row = Number(this.getAttribute("data-ax5grid-column-row"));
            col = Number(this.getAttribute("data-ax5grid-column-col"));
            rowIndex = Number(this.getAttribute("data-ax5grid-column-rowIndex"));
            colIndex = Number(this.getAttribute("data-ax5grid-column-colIndex"));
            dindex = Number(this.getAttribute("data-ax5grid-data-index"));

            if (attr in targetClick) {
                targetClick[attr]({
                    panelName: panelName,
                    attr: attr,
                    row: row,
                    col: col,
                    dindex: dindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex
                });
            }
        });
        this.$["container"]["body"].on("dblclick", '[data-ax5grid-column-attr]', function (e) {
            var panelName, attr, row, col, dindex, rowIndex, colIndex;
            var targetClick = {
                "default": function _default(_column) {

                    if (this.isInlineEditing) {
                        for (var columnKey in this.inlineEditing) {
                            if (columnKey == _column.dindex + "_" + _column.colIndex + "_" + _column.rowIndex) {
                                return this;
                            }
                        }
                    }

                    var column = self.bodyRowMap[_column.rowIndex + "_" + _column.colIndex];
                    var value = "";
                    if (column) {
                        if (!self.list[dindex].__isGrouping) {
                            value = GRID.data.getValue.call(self, dindex, column.key);
                        }
                    }
                    GRID.body.inlineEdit.active.call(self, self.focusedColumn, e, value);
                },
                "rowSelector": function rowSelector(_column) {},
                "lineNumber": function lineNumber(_column) {}
            };

            panelName = this.getAttribute("data-ax5grid-panel-name");
            attr = this.getAttribute("data-ax5grid-column-attr");
            row = Number(this.getAttribute("data-ax5grid-column-row"));
            col = Number(this.getAttribute("data-ax5grid-column-col"));
            rowIndex = Number(this.getAttribute("data-ax5grid-column-rowIndex"));
            colIndex = Number(this.getAttribute("data-ax5grid-column-colIndex"));
            dindex = Number(this.getAttribute("data-ax5grid-data-index"));

            if (attr in targetClick) {
                targetClick[attr]({
                    panelName: panelName,
                    attr: attr,
                    row: row,
                    col: col,
                    dindex: dindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex
                });
            }
        });
        this.$["container"]["body"].on("mouseover", "tr", function () {
            return;
            var dindex = this.getAttribute("data-ax5grid-tr-data-index");
            var i = self.$.livePanelKeys.length;
            while (i--) {
                if (typeof self.xvar.dataHoveredIndex !== "undefined") self.$.panel[self.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + self.xvar.dataHoveredIndex + '"]').removeClass("hover");
                self.$.panel[self.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + dindex + '"]').addClass("hover");
            }
            self.xvar.dataHoveredIndex = dindex;
        });
        this.$["container"]["body"].on("mousedown", '[data-ax5grid-column-attr="default"]', function (e) {
            if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                columnSelector.on.call(self, {
                    panelName: this.getAttribute("data-ax5grid-panel-name"),
                    dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                    rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                    colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                    colspan: Number(this.getAttribute("colspan"))
                });
            }
        }).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });

        resetFrozenColumn.call(this);
    };

    var resetFrozenColumn = function resetFrozenColumn() {
        var cfg = this.config;
        var dividedBodyRowObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.xvar.frozenColumnIndex);
        this.asideBodyRowData = function (dataTable) {
            var data = { rows: [] };
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = { cols: [] };
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        colIndex: null
                    },
                        _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.lineNumberColumnWidth,
                            _width: cfg.lineNumberColumnWidth,
                            columnAttr: "lineNumber",
                            label: "&nbsp;", key: "__d-index__"
                        });
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.rowSelectorColumnWidth,
                            _width: cfg.rowSelectorColumnWidth,
                            columnAttr: "rowSelector",
                            label: "", key: "__d-checkbox__"
                        });
                        data.rows[i].cols.push(_col);
                    }
                }
            }

            return data;
        }.call(this, this.bodyRowTable);
        this.leftBodyRowData = dividedBodyRowObj.leftData;
        this.bodyRowData = dividedBodyRowObj.rightData;

        if (cfg.body.grouping) {
            var dividedBodyGroupingObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyGroupingTable, this.xvar.frozenColumnIndex);
            this.asideBodyGroupingData = function (dataTable) {
                var data = { rows: [] };
                for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                    data.rows[i] = { cols: [] };
                    if (i === 0) {
                        var col = {
                            label: "",
                            colspan: 1,
                            rowspan: dataTable.rows.length,
                            colIndex: null
                        },
                            _col = {};

                        if (cfg.showLineNumber) {
                            _col = jQuery.extend({}, col, {
                                width: cfg.lineNumberColumnWidth,
                                _width: cfg.lineNumberColumnWidth,
                                columnAttr: "lineNumber",
                                label: "&nbsp;", key: "__d-index__"
                            });
                            data.rows[i].cols.push(_col);
                        }
                        if (cfg.showRowSelector) {
                            _col = jQuery.extend({}, col, {
                                width: cfg.rowSelectorColumnWidth,
                                _width: cfg.rowSelectorColumnWidth,
                                columnAttr: "rowSelector",
                                label: "", key: "__d-checkbox__"
                            });
                            data.rows[i].cols.push(_col);
                        }
                    }
                }

                return data;
            }.call(this, this.bodyGroupingTable);
            this.leftBodyGroupingData = dividedBodyGroupingObj.leftData;
            this.bodyGroupingData = dividedBodyGroupingObj.rightData;
        }

        this.leftFootSumData = {};
        this.footSumData = {};
        if (this.config.footSum) {
            var dividedFootSumObj = GRID.util.divideTableByFrozenColumnIndex(this.footSumTable, this.xvar.frozenColumnIndex);
            this.leftFootSumData = dividedFootSumObj.leftData;
            this.footSumData = dividedFootSumObj.rightData;
        }
    };

    var getFieldValue = function getFieldValue(_list, _item, _index, _col, _value) {
        var _key = _col.key;
        if (_key === "__d-index__") {
            return _index + 1;
        } else if (_key === "__d-checkbox__") {
            return '<div class="checkBox"></div>';
        } else {
            if (_col.editor && function (_editor) {
                if (_editor.type in GRID.inlineEditor) {
                    return GRID.inlineEditor[_editor.type].editMode == "inline";
                }
                return false;
            }(_col.editor)) {

                _value = _value || GRID.data.getValue.call(this, _index, _key);

                if (U.isFunction(_col.editor.disabled)) {
                    if (_col.editor.disabled.call({
                        list: _list,
                        dindex: _index,
                        item: _list[_index],
                        key: _key,
                        value: _value
                    })) {
                        return _value;
                    }
                }

                // print editor
                return GRID.inlineEditor[_col.editor.type].getHtml(this, _col.editor, _value);
            }
            if (_col.formatter) {
                var that = {
                    key: _key,
                    value: _value || GRID.data.getValue.call(this, _index, _key),
                    dindex: _index,
                    item: _item,
                    list: _list
                };
                if (U.isFunction(_col.formatter)) {
                    return _col.formatter.call(that);
                } else {
                    return GRID.formatter[_col.formatter].call(that);
                }
            } else {
                var returnValue = "&nbsp;";
                if (typeof _value !== "undefined") {
                    returnValue = _value;
                } else {
                    _value = GRID.data.getValue.call(this, _index, _key);
                    if (typeof _value !== "undefined") returnValue = _value;
                }
                return returnValue;
            }
        }
    };

    var getGroupingValue = function getGroupingValue(_item, _index, _col) {
        var value,
            that,
            _key = _col.key,
            _label = _col.label;

        if (typeof _key === "undefined") {
            that = {
                key: _key,
                list: _item.__groupingList,
                groupBy: _item.__groupingBy
            };
            if (U.isFunction(_label)) {
                value = _label.call(that);
            } else {
                value = _label;
            }
            _item[_col.colIndex] = value;
            return value;
        } else if (_key === "__d-index__") {
            return _index + 1;
        } else if (_key === "__d-checkbox__") {
            return '&nbsp;';
        } else {
            if (_col.collector) {
                that = {
                    key: _key,
                    list: _item.__groupingList
                };
                if (U.isFunction(_col.collector)) {
                    value = _col.collector.call(that);
                } else {
                    value = GRID.collector[_col.collector].call(that);
                }
                _item[_col.colIndex] = value;

                if (_col.formatter) {
                    that.value = value;
                    if (U.isFunction(_col.formatter)) {
                        return _col.collector.call(that);
                    } else {
                        return GRID.formatter[_col.formatter].call(that);
                    }
                } else {
                    return value;
                }
            } else {
                return "&nbsp;";
            }
        }
    };

    var getSumFieldValue = function getSumFieldValue(_list, _col) {
        var _key = _col.key,
            _label = _col.label;
        //, _collector, _formatter
        if (typeof _key === "undefined") {
            return _label;
        } else if (_key === "__d-index__" || _key === "__d-checkbox__") {
            return '&nbsp;';
        } else {
            if (_col.collector) {
                var that = {
                    key: _key,
                    list: _list
                };
                var value;
                if (U.isFunction(_col.collector)) {
                    value = _col.collector.call(that);
                } else {
                    value = GRID.collector[_col.collector].call(that);
                }

                if (_col.formatter) {
                    that.value = value;
                    if (U.isFunction(_col.formatter)) {
                        return _col.collector.call(that);
                    } else {
                        return GRID.formatter[_col.formatter].call(that);
                    }
                } else {
                    return value;
                }
            } else {
                return "&nbsp;";
            }
        }
    };

    var repaint = function repaint(_reset) {
        var cfg = this.config;
        var list = this.list;
        if (_reset) {
            resetFrozenColumn.call(this);
            this.xvar.paintStartRowIndex = undefined;
        }
        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex;
        if (this.xvar.dataRowCount === list.length && this.xvar.paintStartRowIndex === paintStartRowIndex) return this; // 스크롤 포지션 변경 여부에 따라 프로세스 진행여부 결정
        var isFirstPaint = typeof this.xvar.paintStartRowIndex === "undefined";
        var asideBodyRowData = this.asideBodyRowData;
        var leftBodyRowData = this.leftBodyRowData;
        var bodyRowData = this.bodyRowData;
        var leftFootSumData = this.leftFootSumData;
        var footSumData = this.footSumData;
        var asideBodyGroupingData = this.asideBodyGroupingData;
        var leftBodyGroupingData = this.leftBodyGroupingData;
        var bodyGroupingData = this.bodyGroupingData;
        var bodyAlign = cfg.body.align;
        var paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1;
        this.xvar.scrollContentHeight = this.xvar.bodyTrHeight * (this.list.length - this.xvar.frozenRowIndex);
        this.$.livePanelKeys = [];

        // body-scroll 의 포지션에 의존적이므로..
        var repaintBody = function repaintBody(_elTargetKey, _colGroup, _bodyRow, _groupRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];

            if (!isFirstPaint && !_scrollConfig) {
                this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
                return false;
            }

            var SS = [];
            var cgi, cgl;
            var di, dl;
            var tri, trl;
            var ci, cl;
            var col, cellHeight, colAlign;
            var isScrolled = function () {
                // 스크롤값이 변경되거나 처음 호출되었습니까?
                if (typeof _scrollConfig === "undefined" || typeof _scrollConfig['paintStartRowIndex'] === "undefined") {
                    _scrollConfig = {
                        paintStartRowIndex: 0,
                        paintRowCount: _list.length
                    };
                    return false;
                } else {
                    return true;
                }
            }();

            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (di = _scrollConfig.paintStartRowIndex, dl = function () {
                var len;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            }(); di < dl; di++) {

                var isGroupingRow = false;
                var rowTable;

                if (_groupRow && "__isGrouping" in _list[di]) {
                    rowTable = _groupRow;
                    isGroupingRow = true;
                } else {
                    rowTable = _bodyRow;
                }

                for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {

                    SS.push('<tr class="tr-' + di % 4 + '"', isGroupingRow ? ' data-ax5grid-grouping-tr="true"' : '', ' data-ax5grid-tr-data-index="' + di + '"', ' data-ax5grid-selected="' + (_list[di][cfg.columnKeys.selected] || "false") + '">');
                    for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                        col = rowTable.rows[tri].cols[ci];
                        cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                        colAlign = col.align || bodyAlign;

                        SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', function (_focusedColumn, _selectedColumn) {
                            var attrs = "";
                            if (_focusedColumn) {
                                attrs += 'data-ax5grid-column-focused="true" ';
                            }
                            if (_selectedColumn) {
                                attrs += 'data-ax5grid-column-selected="true" ';
                            }
                            return attrs;
                        }(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                            var tdCSS_class = "";
                            if (_col.styleClass) {
                                if (U.isFunction(_col.styleClass)) {
                                    tdCSS_class += _col.styleClass.call({
                                        column: _col,
                                        key: _col.key,
                                        item: _list[di],
                                        index: di
                                    }) + " ";
                                } else {
                                    tdCSS_class += _col.styleClass + " ";
                                }
                            }
                            if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                            if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                            return tdCSS_class;
                        }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                        SS.push(function (_cellHeight) {
                            var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                            if (!col.multiLine) {
                                _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                            }

                            return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                        }(cellHeight), isGroupingRow ? getGroupingValue.call(this, _list[di], di, col) : getFieldValue.call(this, _list, _list[di], di, col), '</span>');

                        SS.push('</td>');
                    }
                    SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-attr="' + "default" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                    SS.push('</tr>');
                }
            }
            SS.push('</table>');

            if (isScrolled) {
                _elTarget.css({ paddingTop: (_scrollConfig.paintStartRowIndex - this.xvar.frozenRowIndex) * _scrollConfig.bodyTrHeight });
            }
            _elTarget.html(SS.join(''));
            this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
            return true;
        };
        var repaintSum = function repaintSum(_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];

            if (!isFirstPaint && !_scrollConfig) {
                this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
                return false;
            }

            var SS = [];
            var cgi, cgl;
            var tri, trl;
            var ci, cl;
            var col, cellHeight, colAlign;

            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('<tr class="tr-sum">');
                for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    col = _bodyRow.rows[tri].cols[ci];
                    cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                    colAlign = col.align || bodyAlign;

                    SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + tri + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ', function (_focusedColumn, _selectedColumn) {
                        var attrs = "";
                        if (_focusedColumn) {
                            attrs += 'data-ax5grid-column-focused="true" ';
                        }
                        if (_selectedColumn) {
                            attrs += 'data-ax5grid-column-selected="true" ';
                        }
                        return attrs;
                    }(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                        var tdCSS_class = "";
                        if (_col.styleClass) {
                            if (U.isFunction(_col.styleClass)) {
                                tdCSS_class += _col.styleClass.call({
                                    column: _col,
                                    key: _col.key,
                                    isFootSum: true
                                }) + " ";
                            } else {
                                tdCSS_class += _col.styleClass + " ";
                            }
                        }
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                        return tdCSS_class;
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function (_cellHeight) {
                        var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                    }(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-column-attr="' + "sum" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.html(SS.join(''));
            this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
            return true;
        };
        var scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            bodyTrHeight: this.xvar.bodyTrHeight
        };

        // aside
        if (cfg.asidePanelWidth > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-aside-body", this.asideColGroup, asideBodyRowData, asideBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
            }

            repaintBody.call(this, "aside-body-scroll", this.asideColGroup, asideBodyRowData, asideBodyGroupingData, list, scrollConfig);

            if (cfg.footSum) {
                // 바닥 요약 (footSum에 대한 aside 사용안함)
                //repaintSum.call(this, "bottom-aside-body", this.asideColGroup, asideBodyRowData, null, list);
            }
        }

        // left
        if (this.xvar.frozenColumnIndex > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, leftBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
            }

            repaintBody.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, leftBodyGroupingData, list, scrollConfig);

            if (cfg.footSum && this.needToPaintSum) {
                // 바닥 요약
                repaintSum.call(this, "bottom-left-body", this.leftHeaderColGroup, leftFootSumData, list);
            }
        }

        // body
        if (this.xvar.frozenRowIndex > 0) {
            // 상단 행고정
            repaintBody.call(this, "top-body-scroll", this.headerColGroup, bodyRowData, bodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
        }

        repaintBody.call(this, "body-scroll", this.headerColGroup, bodyRowData, bodyGroupingData, list, scrollConfig);

        if (cfg.footSum && this.needToPaintSum) {
            // 바닥 요약
            repaintSum.call(this, "bottom-body-scroll", this.headerColGroup, footSumData, list, scrollConfig);
        }

        //todo : repaintBody 에서 footSum 데이터 예외처리

        // right
        if (cfg.rightSum) {
            // todo : right 표현 정리
        }

        this.xvar.paintStartRowIndex = paintStartRowIndex;
        this.xvar.paintRowCount = paintRowCount;
        this.xvar.dataRowCount = list.length;
        this.needToPaintSum = false;
        GRID.page.statusUpdate.call(this);
    };

    var repaintCell = function repaintCell(_panelName, _dindex, _rowIndex, _colIndex, _newValue) {
        var self = this;
        var cfg = this.config;
        var list = this.list;

        var updateCell = this.$["panel"][_panelName].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').find('[data-ax5grid-column-rowindex="' + _rowIndex + '"][data-ax5grid-column-colindex="' + _colIndex + '"]').find('[data-ax5grid-cellholder]');
        var colGroup = this.colGroup;
        var col = colGroup[_colIndex];
        updateCell.html(getFieldValue.call(this, list, list[_dindex], _dindex, col));

        if (col.editor && col.editor.updateWith) {
            col.editor.updateWith.forEach(function (updateColumnKey) {
                colGroup.forEach(function (col) {
                    if (col.key == updateColumnKey) {
                        var rowIndex = col.rowIndex;
                        var colIndex = col.colIndex;
                        var panelName = GRID.util.findPanelByColumnIndex.call(self, _dindex, colIndex, rowIndex).panelName;
                        var updateWithCell = self.$["panel"][panelName].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').find('[data-ax5grid-column-rowindex="' + rowIndex + '"][data-ax5grid-column-colindex="' + colIndex + '"]').find('[data-ax5grid-cellholder]');
                        updateWithCell.html(getFieldValue.call(self, list, list[_dindex], _dindex, col));
                    }
                });
            });
        }

        /// ~~~~~~

        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex;
        var leftFootSumData = this.leftFootSumData;
        var footSumData = this.footSumData;
        var asideBodyGroupingData = this.asideBodyGroupingData;
        var leftBodyGroupingData = this.leftBodyGroupingData;
        var bodyGroupingData = this.bodyGroupingData;
        var bodyAlign = cfg.body.align;
        var paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1;
        var scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            bodyTrHeight: this.xvar.bodyTrHeight
        };

        var repaintSum = function repaintSum(_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];

            var SS = [];
            var cgi, cgl;
            var tri, trl;
            var ci, cl;
            var col, cellHeight, colAlign;

            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('<tr class="tr-sum">');
                for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    col = _bodyRow.rows[tri].cols[ci];
                    cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                    colAlign = col.align || bodyAlign;

                    SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + tri + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ', function (_focusedColumn, _selectedColumn) {
                        var attrs = "";
                        if (_focusedColumn) {
                            attrs += 'data-ax5grid-column-focused="true" ';
                        }
                        if (_selectedColumn) {
                            attrs += 'data-ax5grid-column-selected="true" ';
                        }
                        return attrs;
                    }(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                        var tdCSS_class = "";
                        if (_col.styleClass) {
                            if (U.isFunction(_col.styleClass)) {
                                tdCSS_class += _col.styleClass.call({
                                    column: _col,
                                    key: _col.key,
                                    isFootSum: true
                                }) + " ";
                            } else {
                                tdCSS_class += _col.styleClass + " ";
                            }
                        }
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                        return tdCSS_class;
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function (_cellHeight) {
                        var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                    }(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-column-attr="' + "sum" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.html(SS.join(''));
            return true;
        };
        var replaceTr = function replaceTr(_elTargetKey, _colGroup, _groupRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];
            var SS = [];
            var cgi, cgl;
            var di, dl;
            var tri, trl;
            var ci, cl;
            var col, cellHeight, colAlign;
            for (di = _scrollConfig.paintStartRowIndex, dl = function () {
                var len;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            }(); di < dl; di++) {
                if (_groupRow && "__isGrouping" in _list[di]) {
                    var rowTable = _groupRow;
                    SS = [];
                    for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                        for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                            col = rowTable.rows[tri].cols[ci];
                            cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                            colAlign = col.align || bodyAlign;

                            SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', function (_focusedColumn, _selectedColumn) {
                                var attrs = "";
                                if (_focusedColumn) {
                                    attrs += 'data-ax5grid-column-focused="true" ';
                                }
                                if (_selectedColumn) {
                                    attrs += 'data-ax5grid-column-selected="true" ';
                                }
                                return attrs;
                            }(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                                var tdCSS_class = "";
                                if (_col.styleClass) {
                                    if (U.isFunction(_col.styleClass)) {
                                        tdCSS_class += _col.styleClass.call({
                                            column: _col,
                                            key: _col.key,
                                            item: _list[di],
                                            index: di
                                        }) + " ";
                                    } else {
                                        tdCSS_class += _col.styleClass + " ";
                                    }
                                }
                                if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                                if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                                return tdCSS_class;
                            }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                            SS.push(function (_cellHeight) {
                                var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                                if (!col.multiLine) {
                                    _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                                }

                                return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                            }(cellHeight), getGroupingValue.call(this, _list[di], di, col), '</span>');

                            SS.push('</td>');
                        }
                        SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-attr="' + "default" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                    }
                    _elTarget.find('tr[data-ax5grid-tr-data-index="' + di + '"]').html(SS.join(''));
                }
            }
        };

        // body.grouping tr 다시 그리기..
        if (cfg.body.grouping) {
            // left
            if (this.xvar.frozenColumnIndex > 0) {
                if (this.xvar.frozenRowIndex > 0) {
                    // 상단 행고정
                    replaceTr.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
                }
                replaceTr.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyGroupingData, list, scrollConfig);
            }

            // body
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                replaceTr.call(this, "top-body-scroll", this.headerColGroup, bodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
            }

            replaceTr.call(this, "body-scroll", this.headerColGroup, bodyGroupingData, list, scrollConfig);
        }

        if (this.xvar.frozenColumnIndex > 0) {
            if (cfg.footSum && this.needToPaintSum) {
                // 바닥 요약
                repaintSum.call(this, "bottom-left-body", this.leftHeaderColGroup, leftFootSumData, list);
            }
        }

        if (cfg.footSum && this.needToPaintSum) {
            // 바닥 요약
            repaintSum.call(this, "bottom-body-scroll", this.headerColGroup, footSumData, list, scrollConfig);
        }
    };

    var scrollTo = function scrollTo(css, noRepaint) {
        var cfg = this.config;

        if (cfg.asidePanelWidth > 0 && "top" in css) {
            this.$.panel["aside-body-scroll"].css({ top: css.top });
        }
        if (this.xvar.frozenColumnIndex > 0 && "top" in css) {
            this.$.panel["left-body-scroll"].css({ top: css.top });
        }
        if (this.xvar.frozenRowIndex > 0 && "left" in css) {
            this.$.panel["top-body-scroll"].css({ left: css.left });
        }

        this.$.panel["body-scroll"].css(css);

        if (cfg.footSum && "left" in css) {
            this.$.panel["bottom-body-scroll"].css({ left: css.left });
        }

        if (!noRepaint && "top" in css) {
            repaint.call(this);
        }
    };

    var blur = function blur() {
        columnSelect.focusClear.call(this);
        columnSelect.clear.call(this);
        if (this.isInlineEditing) {
            inlineEdit.deActive.call(this);
        }
    };

    var moveFocus = function moveFocus(_position) {
        var focus = {
            "UD": function UD(_dy) {
                var moveResult = true;
                var focusedColumn;
                var originalColumn;
                var while_i;

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }

                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];
                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dy > 0) {
                    if (focusedColumn.rowIndex + (originalColumn.rowspan - 1) + _dy > this.bodyRowTable.rows.length - 1) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.rowIndex = 0;
                        if (focusedColumn.dindex > this.list.length - 1) {
                            focusedColumn.dindex = this.list.length - 1;
                            moveResult = false;
                        }
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                } else {
                    if (focusedColumn.rowIndex + _dy < 0) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.rowIndex = this.bodyRowTable.rows.length - 1;
                        if (focusedColumn.dindex < 0) {
                            focusedColumn.dindex = 0;
                            moveResult = false;
                        }
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                }

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == (_dy > 0 ? 0 : 1)) {
                        focusedColumn.colIndex--;
                    } else {
                        focusedColumn.rowIndex--;
                    }

                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        moveResult = false;
                        break;
                    }
                    while_i++;
                }

                var nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);
                focusedColumn.panelName = nPanelInfo.panelName;

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex <= this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        } else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");

                return moveResult;
            },
            "LR": function LR(_dx) {
                var moveResult = true;
                var focusedColumn;
                var originalColumn;
                var while_i = 0;
                var isScrollPanel = false;
                var containerPanelName = "";

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }
                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dx < 0) {
                    focusedColumn.colIndex = focusedColumn.colIndex + _dx;
                    if (focusedColumn.colIndex < 0) {
                        focusedColumn.colIndex = 0;
                        moveResult = false;
                    }
                } else {
                    focusedColumn.colIndex = focusedColumn.colIndex + (originalColumn.colspan - 1) + _dx;
                    if (focusedColumn.colIndex > this.colGroup.length - 1) {
                        focusedColumn.colIndex = this.colGroup.length - 1;
                        moveResult = false;
                    }
                }

                if (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    focusedColumn.rowIndex = 0;
                }
                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    focusedColumn.colIndex--;
                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        moveResult = false;
                        break;
                    }
                    while_i++;
                }

                var nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);

                focusedColumn.panelName = nPanelInfo.panelName;
                containerPanelName = nPanelInfo.containerPanelName;
                isScrollPanel = nPanelInfo.isScrollPanel;

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;

                var $column = this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");

                if ($column && isScrollPanel) {
                    // 스크롤 패널 이라면~
                    var newLeft = function () {
                        if ($column.position().left + $column.outerWidth() > Math.abs(this.$.panel[focusedColumn.panelName].position().left) + this.$.panel[containerPanelName].width()) {
                            return $column.position().left + $column.outerWidth() - this.$.panel[containerPanelName].width();
                        } else if (Math.abs(this.$.panel[focusedColumn.panelName].position().left) > $column.position().left) {
                            return $column.position().left;
                        } else {
                            return;
                        }
                    }.call(this);

                    //console.log(newLeft);

                    if (typeof newLeft !== "undefined") {
                        GRID.header.scrollTo.call(this, { left: -newLeft });
                        scrollTo.call(this, { left: -newLeft });
                        GRID.scroller.resize.call(this);
                    }
                }

                return moveResult;
            },
            "INDEX": function INDEX(_dindex) {
                var moveResult = true;
                var focusedColumn;
                var originalColumn;
                var while_i;

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }
                if (!focusedColumn) {
                    focusedColumn = {
                        rowIndex: 0,
                        colIndex: 0
                    };
                }
                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dindex == "end") {
                    _dindex = this.list.length - 1;
                }

                focusedColumn.dindex = _dindex;
                focusedColumn.rowIndex = 0;

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == (_dy > 0 ? 0 : 1)) {
                        focusedColumn.colIndex--;
                    } else {
                        focusedColumn.rowIndex--;
                    }

                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        break;
                    }
                    while_i++;
                }

                var nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);
                focusedColumn.panelName = nPanelInfo.panelName;

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex < this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        } else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");

                return moveResult;
            }
        };

        var processor = {
            "UP": function UP() {
                return focus["UD"].call(this, -1);
            },
            "DOWN": function DOWN() {
                return focus["UD"].call(this, 1);
            },
            "LEFT": function LEFT() {
                return focus["LR"].call(this, -1);
            },
            "RIGHT": function RIGHT() {
                return focus["LR"].call(this, 1);
            },
            "HOME": function HOME() {
                return focus["INDEX"].call(this, 0);
            },
            "END": function END() {
                return focus["INDEX"].call(this, "end");
            },
            "position": function position(_position) {
                return focus["INDEX"].call(this, _position);
            }
        };

        if (_position in processor) {
            return processor[_position].call(this);
        } else {
            return processor["position"].call(this, _position);
        }
    };

    var inlineEdit = {
        active: function active(_focusedColumn, _e, _initValue) {
            var self = this;
            var dindex, colIndex, rowIndex, panelName, colspan;
            var col, editor;

            // this.inlineEditing = {};
            for (var key in _focusedColumn) {
                panelName = _focusedColumn[key].panelName;
                dindex = _focusedColumn[key].dindex;
                colIndex = _focusedColumn[key].colIndex;
                rowIndex = _focusedColumn[key].rowIndex;
                colspan = _focusedColumn[key].colspan;

                // 인라인 에디팅을 멈춰야 하는 경우 조건
                col = this.colGroup[colIndex];
                if (!(editor = col.editor)) return this;

                // editor disabled 체크
                if (U.isFunction(editor.disabled)) {
                    if (editor.disabled.call({
                        list: this.list,
                        dindex: dindex,
                        item: this.list[dindex],
                        key: col.key,
                        value: _initValue
                    })) {
                        return this;
                    }
                }

                // 조건에 맞지 않는 에디팅 타입이면 반응 없음.
                if (!function (_editor, _type) {
                    if (_editor.type in GRID.inlineEditor) {
                        return GRID.inlineEditor[_editor.type].editMode == "popup";
                    }
                }(editor)) {
                    // 체크 박스 타입이면 값 변경 시도
                    if (editor.type == "checkbox") {
                        var checked, newValue;
                        if (editor.config && editor.config.trueValue) {
                            if (checked = !(_initValue == editor.config.trueValue)) {
                                newValue = editor.config.trueValue;
                            } else {
                                newValue = editor.config.falseValue;
                            }
                        } else {
                            newValue = checked = _initValue == false || _initValue == "false" || _initValue < "1" ? "true" : "false";
                        }

                        GRID.data.setValue.call(self, dindex, col.key, newValue);

                        updateRowState.call(self, ["cellChecked"], dindex, {
                            key: col.key, rowIndex: rowIndex, colIndex: colIndex,
                            editorConfig: col.editor.config, checked: checked
                        });
                    }
                    return this;
                }

                if (this.list[dindex].__isGrouping) {
                    return false;
                }
                if (key in this.inlineEditing) {
                    return false;
                }
                this.inlineEditing[key] = {
                    panelName: panelName,
                    columnKey: key,
                    column: _focusedColumn[key],
                    useReturnToSave: GRID.inlineEditor[editor.type].useReturnToSave
                };
                this.isInlineEditing = true;
            }
            if (this.isInlineEditing) {

                var initValue = function (__value, __editor) {
                    if (__editor.type == "money") {
                        return U.number(__value, { "money": true });
                    } else {
                        return __value || "";
                    }
                }.call(this, _initValue, editor);

                this.inlineEditing[key].$inlineEditorCell = this.$["panel"][panelName].find('[data-ax5grid-tr-data-index="' + dindex + '"]').find('[data-ax5grid-column-rowindex="' + rowIndex + '"][data-ax5grid-column-colindex="' + colIndex + '"]').find('[data-ax5grid-cellholder]');

                this.inlineEditing[key].$inlineEditor = GRID.inlineEditor[editor.type].init(this, key, editor, this.inlineEditing[key].$inlineEditorCell, initValue);

                return true;
            }
        },
        deActive: function deActive(_msg, _key, _value) {
            // console.log(this.inlineEditing.column.dindex, this.inlineEditing.$inlineEditor.val());
            if (!this.inlineEditing[_key]) return this;

            var panelName = this.inlineEditing[_key].panelName;
            var dindex = this.inlineEditing[_key].column.dindex;
            var rowIndex = this.inlineEditing[_key].column.rowIndex;
            var colIndex = this.inlineEditing[_key].column.colIndex;

            var column = this.bodyRowMap[this.inlineEditing[_key].column.rowIndex + "_" + this.inlineEditing[_key].column.colIndex];
            var editorValue = function ($inlineEditor) {
                if (typeof _value === "undefined") {
                    if ($inlineEditor.get(0).tagName == "SELECT" || $inlineEditor.get(0).tagName == "INPUT" || $inlineEditor.get(0).tagName == "TEXTAREA") {
                        return $inlineEditor.val();
                    } else {
                        _msg = "CANCEL";
                        return false;
                    }
                } else {
                    return _value;
                }
            }(this.inlineEditing[_key].$inlineEditor);

            var newValue = function (__value, __editor) {
                if (__editor.type == "money") {
                    return U.number(__value);
                } else {
                    return __value;
                }
            }.call(this, editorValue, column.editor);

            var action = {
                "CANCEL": function CANCEL(_dindex, _column, _newValue) {
                    action["__clear"].call(this);
                },
                "RETURN": function RETURN(_dindex, _column, _newValue) {
                    if (GRID.data.setValue.call(this, _dindex, _column.key, _newValue)) {
                        action["__clear"].call(this);
                        GRID.body.repaintCell.call(this, panelName, dindex, rowIndex, colIndex, _newValue);
                    } else {
                        action["__clear"].call(this);
                    }
                },
                "__clear": function __clear() {
                    this.isInlineEditing = false;
                    var bindedAx5ui = this.inlineEditing[_key].$inlineEditor.data("binded-ax5ui");
                    if (bindedAx5ui == "ax5picker") {
                        this.inlineEditing[_key].$inlineEditor.ax5picker("close");
                    } else if (bindedAx5ui == "ax5select") {
                        this.inlineEditing[_key].$inlineEditor.ax5select("close");
                    }

                    this.inlineEditing[_key].$inlineEditor.remove();
                    this.inlineEditing[_key].$inlineEditor = null;
                    this.inlineEditing[_key].$inlineEditorCell = null;
                    this.inlineEditing[_key] = undefined;
                    delete this.inlineEditing[_key]; // delete 지원안하는 브라우저 테스트..
                }
            };

            if (_msg in action) {
                action[_msg || "RETURN"].call(this, dindex, column, newValue);
            } else {
                action["__clear"].call(this);
            }
        },
        keydown: function keydown(key, columnKey) {
            var processor = {
                "ESC": function ESC() {
                    for (var columnKey in this.inlineEditing) {
                        inlineEdit.deActive.call(this, "CANCEL", columnKey);
                    }
                },
                "RETURN": function RETURN() {
                    if (this.isInlineEditing) {
                        if (this.inlineEditing[columnKey] && this.inlineEditing[columnKey].useReturnToSave) {
                            // todo : 네이밍 검증 할 필요있음.
                            inlineEdit.deActive.call(this, "RETURN", columnKey);
                        }
                    } else {
                        for (var k in this.focusedColumn) {
                            var _column = this.focusedColumn[k];
                            var column = this.bodyRowMap[_column.rowIndex + "_" + _column.colIndex];
                            var dindex = _column.dindex;
                            var value = "";
                            if (column) {
                                if (!this.list[dindex].__isGrouping) {
                                    value = GRID.data.getValue.call(this, dindex, column.key);
                                }
                            }
                            GRID.body.inlineEdit.active.call(this, this.focusedColumn, null, value);
                        }
                    }
                }
            };

            if (key in processor) {
                processor[key].call(this, key);
            }
        }
    };

    GRID.body = {
        init: init,
        repaint: repaint,
        repaintCell: repaintCell,
        updateRowState: updateRowState,
        scrollTo: scrollTo,
        blur: blur,
        moveFocus: moveFocus,
        inlineEdit: inlineEdit
    };
})();

// ax5.ui.grid.collector
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var sum = function sum() {
        var value = 0;
        var i = this.list.length;
        while (i--) {
            if (!("__groupingList" in this.list[i])) {
                value += U.number(this.list[i][this.key]);
            }
        }
        return value;
    };
    var avg = function avg() {
        var value = 0;
        var i = this.list.length,
            listLength = 0;
        while (i--) {
            if (!("__groupingList" in this.list[i])) {
                value += U.number(this.list[i][this.key]);
                listLength++;
            }
        }
        return U.number(value / (listLength || 1), { "round": 2 });
    };

    GRID.collector = {
        sum: sum,
        avg: avg
    };
})();
// ax5.ui.grid.layout
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function init() {};

    var clearGroupingData = function clearGroupingData(_list) {
        var i = 0,
            l = _list.length;
        var returnList = [];
        for (; i < l; i++) {
            if (_list[i] && !_list[i]["__isGrouping"]) {
                if (_list[i][this.config.columnKeys.selected]) {
                    this.selectedDataIndexs.push(i);
                }
                returnList.push(jQuery.extend({}, _list[i]));
            }
        }
        return returnList;
    };

    var initData = function initData(_list) {
        this.selectedDataIndexs = [];
        var i = 0,
            l = _list.length;
        var returnList = [];
        var appendIndex = 0;

        if (this.config.body.grouping) {
            var groupingKeys = U.map(this.bodyGrouping.by, function () {
                return {
                    key: this,
                    compareString: "",
                    grouping: false,
                    list: []
                };
            });
            var gi = 0,
                gl = groupingKeys.length,
                compareString,
                appendRow = [],
                ari;
            for (; i < l + 1; i++) {
                gi = 0;
                if (_list[i] && _list[i][this.config.columnKeys.deleted]) {
                    this.deletedList.push(_list[i]);
                } else {
                    compareString = "";
                    appendRow = [];
                    for (; gi < gl; gi++) {
                        if (_list[i]) {
                            compareString += "$|$" + _list[i][groupingKeys[gi].key];
                        }
                        if (appendIndex > 0 && compareString != groupingKeys[gi].compareString) {
                            var appendRowItem = { keys: [], labels: [], list: groupingKeys[gi].list };
                            for (var ki = 0; ki < gi + 1; ki++) {
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
                        returnList.push({ __isGrouping: true, __groupingList: appendRow[ari].list, __groupingBy: { keys: appendRow[ari].keys, labels: appendRow[ari].labels } });
                    }

                    if (_list[i]) {
                        if (_list[i][this.config.columnKeys.selected]) {
                            this.selectedDataIndexs.push(i);
                        }
                        returnList.push(_list[i]);
                        appendIndex++;
                    }
                }
            }
        } else {
            for (; i < l; i++) {
                if (_list[i] && _list[i][this.config.columnKeys.deleted]) {
                    this.deletedList.push(_list[i]);
                } else if (_list[i]) {
                    if (_list[i][this.config.columnKeys.selected]) {
                        this.selectedDataIndexs.push(i);
                    }
                    returnList.push(_list[i]);
                }
            }
        }

        return returnList;
    };

    var set = function set(data) {
        var self = this;

        if (U.isArray(data)) {
            this.page = null;
            this.list = initData.call(this, Object.keys(this.sortInfo).length ? sort.call(this, this.sortInfo, data) : data);
            this.deletedList = [];
        } else if ("page" in data) {
            this.page = jQuery.extend({}, data.page);
            this.list = initData.call(this, Object.keys(this.sortInfo).length ? sort.call(this, this.sortInfo, data.list) : data.list);
            this.deletedList = [];
        }

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);

        if (this.config.body.grouping) {}
        return this;
    };

    var get = function get(_type) {
        return {
            list: this.list,
            page: this.page
        };
    };

    var getList = function getList(_type) {
        var returnList = [];
        var i = 0,
            l = this.list.length;
        switch (_type) {
            case "modified":
                for (; i < l; i++) {
                    if (this.list[i] && !this.list[i]["__isGrouping"] && this.list[i][this.config.columnKeys.modified]) {
                        returnList.push(jQuery.extend({}, this.list[i]));
                    }
                }
                break;
            case "selected":
                for (; i < l; i++) {
                    if (this.list[i] && !this.list[i]["__isGrouping"] && this.list[i][this.config.columnKeys.selected]) {
                        returnList.push(jQuery.extend({}, this.list[i]));
                    }
                }
                break;
            case "deleted":
                //_list = GRID.data.clearGroupingData(this.list);
                returnList = [].concat(this.deletedList);
                break;
            default:
                returnList = GRID.data.clearGroupingData.call(this, this.list);
        }
        return returnList;
    };

    var add = function add(_row, _dindex) {
        var list = this.config.body.grouping ? clearGroupingData.call(this, this.list) : this.list;
        var processor = {
            "first": function first() {
                list = [].concat(_row).concat(list);
            },
            "last": function last() {
                list = list.concat([].concat(_row));
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";
        if (_dindex in processor) {
            _row[this.config.columnKeys.modified] = true;
            processor[_dindex].call(this, _row);
        } else {
            if (!U.isNumber(_dindex)) {
                throw 'invalid argument _dindex';
            }
            //
            list = list.splice(_dindex, [].concat(_row));
        }

        if (this.config.body.grouping) {
            list = initData.call(this, sort.call(this, this.sortInfo, list));
        } else if (Object.keys(this.sortInfo).length) {
            list = sort.call(this, this.sortInfo, list);
        }

        this.list = list;

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    /**
     * list에서 완전 제거 하는 경우 사용.
     * ax5grid.data.remove
     */
    var remove = function remove(_dindex) {
        var list = this.config.body.grouping ? clearGroupingData.call(this, this.list) : this.list;
        var processor = {
            "first": function first() {
                list.splice(_dindex, 1);
            },
            "last": function last() {
                var lastIndex = list.length - 1;
                list.splice(lastIndex, 1);
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
            list.splice(_dindex, 1);
        }

        if (this.config.body.grouping) {
            list = initData.call(this, sort.call(this, this.sortInfo, list));
        } else if (Object.keys(this.sortInfo).length) {
            list = sort.call(this, this.sortInfo, list);
        }

        this.list = list;

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    /**
     * list에서 deleted 처리 repaint
     * ax5grid.data.deleteRow
     */
    var deleteRow = function deleteRow(_dindex) {
        var list = this.config.body.grouping ? clearGroupingData.call(this, this.list) : this.list;

        var processor = {
            "first": function first() {
                list[0][this.config.columnKeys.deleted] = true;
            },
            "last": function last() {
                list[list.length - 1][this.config.columnKeys.deleted] = true;
            },
            "selected": function selected() {
                var i = list.length;
                while (i--) {
                    if (list[i][this.config.columnKeys.selected]) {
                        list[i][this.config.columnKeys.deleted] = true;
                    }
                }
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";
        if (_dindex in processor) {
            processor[_dindex].call(this, _dindex);
        } else {
            if (!U.isNumber(_dindex)) {
                throw 'invalid argument _dindex';
            }
            list[_dindex][this.config.columnKeys.deleted] = true;
        }

        if (this.config.body.grouping) {
            list = initData.call(this, sort.call(this, this.sortInfo, list));
        } else if (Object.keys(this.sortInfo).length) {
            list = initData.call(this, sort.call(this, this.sortInfo, list));
        } else {
            list = initData.call(this, list);
        }

        this.list = list;

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var update = function update(_row, _dindex) {
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

    var setValue = function setValue(_dindex, _key, _value) {
        this.needToPaintSum = true;
        if (/[\.\[\]]/.test(_key)) {
            try {
                this.list[_dindex][this.config.columnKeys.modified] = true;
                Function("val", "this" + GRID.util.getRealPathForDataItem(_key) + " = val;").call(this.list[_dindex], _value);
            } catch (e) {}
        } else {
            this.list[_dindex][this.config.columnKeys.modified] = true;
            this.list[_dindex][_key] = _value;
        }
        return true;
    };

    var getValue = function getValue(_dindex, _key, _value) {
        if (/[\.\[\]]/.test(_key)) {
            try {
                _value = Function("", "return this" + GRID.util.getRealPathForDataItem(_key) + ";").call(this.list[_dindex]);
            } catch (e) {}
        } else {
            _value = this.list[_dindex][_key];
        }
        return _value;
    };

    var clearSelect = function clearSelect() {
        this.selectedDataIndexs = [];
    };

    var select = function select(_dindex, _selected) {
        var cfg = this.config;

        if (this.list[_dindex].__isGrouping) return false;

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

    var sort = function sort(_sortInfo, _list) {
        var self = this;
        var list = _list || this.list;
        var sortInfoArray = [];

        for (var k in _sortInfo) {
            sortInfoArray[_sortInfo[k].seq] = { key: k, order: _sortInfo[k].orderBy };
        }
        sortInfoArray = U.filter(sortInfoArray, function () {
            return typeof this !== "undefined";
        });

        var i = 0,
            l = sortInfoArray.length,
            _a_val,
            _b_val;
        list.sort(function (_a, _b) {
            for (i = 0; i < l; i++) {
                _a_val = _a[sortInfoArray[i].key];
                _b_val = _b[sortInfoArray[i].key];
                if ((typeof _a_val === 'undefined' ? 'undefined' : _typeof(_a_val)) !== (typeof _b_val === 'undefined' ? 'undefined' : _typeof(_b_val))) {
                    _a_val = '' + _a_val;
                    _b_val = '' + _b_val;
                }
                if (_a_val < _b_val) {
                    return sortInfoArray[i].order === "asc" ? -1 : 1;
                } else if (_a_val > _b_val) {
                    return sortInfoArray[i].order === "asc" ? 1 : -1;
                }
            }
        });

        if (_list) {
            return list;
        } else {
            this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
            this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
            GRID.page.navigationUpdate.call(this);
            return this;
        }
    };

    GRID.data = {
        init: init,
        set: set,
        get: get,
        getList: getList,
        setValue: setValue,
        getValue: getValue,
        clearSelect: clearSelect,
        select: select,
        add: add,
        remove: remove,
        deleteRow: deleteRow,
        update: update,
        sort: sort,
        initData: initData,
        clearGroupingData: clearGroupingData
    };
})();
// ax5.ui.grid.formatter
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var money = function money() {
        return U.number(this.value, { "money": true });
    };

    GRID.formatter = {
        money: money
    };
})();
// ax5.ui.grid.header
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var columnResizerEvent = {
        "on": function on(_columnResizer, _colIndex) {
            var self = this;
            var $columnResizer = $(_columnResizer);
            var columnResizerPositionLeft = $columnResizer.offset().left;
            var gridTargetOffsetLeft = self.$["container"]["root"].offset().left;
            self.xvar.columnResizerIndex = _colIndex;
            var resizeRange = {
                min: -self.colGroup[_colIndex]._width + 2,
                max: self.colGroup[_colIndex + 1] ? self.colGroup[_colIndex + 1]._width : self.$["container"]["root"].width() - 2
            };
            //console.log(resizeRange);

            jQuery(document.body).bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                var mouseObj = GRID.util.getMousePosition(e);
                self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;

                if (resizeRange.min > self.xvar.__da) {
                    self.xvar.__da = resizeRange.min;
                } else if (resizeRange.max < self.xvar.__da) {
                    self.xvar.__da = resizeRange.max;
                }

                if (!self.xvar.columnResizerLived) {
                    self.$["resizer"]["horizontal"].addClass("live");
                }
                self.xvar.columnResizerLived = true;
                self.$["resizer"]["horizontal"].css({
                    left: columnResizerPositionLeft + self.xvar.__da - gridTargetOffsetLeft
                });
            }).bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                columnResizerEvent.off.call(self);
                U.stopEvent(e);
            }).bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                columnResizerEvent.off.call(self);
                U.stopEvent(e);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {
            this.$["resizer"]["horizontal"].removeClass("live");
            this.xvar.columnResizerLived = false;
            this.setColumnWidth(this.colGroup[this.xvar.columnResizerIndex]._width + this.xvar.__da, this.xvar.columnResizerIndex);

            jQuery(document.body).unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId).unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId).unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var init = function init() {
        // 헤더 초기화
        var self = this;

        this.$["container"]["header"].on("click", '[data-ax5grid-column-attr]', function (e) {
            var key = this.getAttribute("data-ax5grid-column-key");
            var colIndex = this.getAttribute("data-ax5grid-column-colindex");
            var rowIndex = this.getAttribute("data-ax5grid-column-rowindex");
            var col = self.colGroup[colIndex];
            if (key && col) {
                if ((col.sortable === true || self.config.sortable === true) && col.sortable !== false) {
                    if (!col.sortFixed) toggleSort.call(self, col.key);
                }
            }
            GRID.body.blur.call(self);
        });
        this.$["container"]["header"].on("mousedown", '[data-ax5grid-column-resizer]', function (e) {
            var colIndex = this.getAttribute("data-ax5grid-column-resizer");
            self.xvar.mousePosition = GRID.util.getMousePosition(e);
            columnResizerEvent.on.call(self, this, Number(colIndex));
            U.stopEvent(e);
        }).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });

        resetFrozenColumn.call(this);
    };

    var resetFrozenColumn = function resetFrozenColumn() {
        var cfg = this.config;
        var dividedHeaderObj = GRID.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        this.asideHeaderData = function (dataTable) {
            var colGroup = [];
            var data = { rows: [] };
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = { cols: [] };
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        key: "__dindex__",
                        colIndex: null
                    },
                        _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, {
                            label: "&nbsp;",
                            width: cfg.lineNumberColumnWidth,
                            _width: cfg.lineNumberColumnWidth
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, {
                            label: "",
                            width: cfg.rowSelectorColumnWidth,
                            _width: cfg.rowSelectorColumnWidth
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }
                }
            }

            this.asideColGroup = colGroup;
            return data;
        }.call(this, this.headerTable);
        this.leftHeaderData = dividedHeaderObj.leftData;
        this.headerData = dividedHeaderObj.rightData;
    };

    var repaint = function repaint(_reset) {
        var cfg = this.config;
        var colGroup = this.colGroup;
        if (_reset) {
            resetFrozenColumn.call(this);
            this.xvar.paintStartRowIndex = undefined;
        }
        var asideHeaderData = this.asideHeaderData;
        var leftHeaderData = this.leftHeaderData;
        var headerData = this.headerData;
        var headerAlign = cfg.header.align;

        // this.asideColGroup : asideHeaderData에서 처리 함.
        this.leftHeaderColGroup = colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function repaintHeader(_elTarget, _colGroup, _bodyRow) {
            var tableWidth = 0;
            var SS = [];
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
                tableWidth += _colGroup[cgi]._width;
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                var trCSS_class = "";
                SS.push('<tr class="' + trCSS_class + '">');
                for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    var col = _bodyRow.rows[tri].cols[ci];
                    var cellHeight = cfg.header.columnHeight * col.rowspan - cfg.header.columnBorderWidth;
                    var colAlign = headerAlign || col.align;
                    SS.push('<td ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', function () {
                        return typeof col.key !== "undefined" ? 'data-ax5grid-column-key="' + col.key + '" ' : '';
                    }(), 'data-ax5grid-column-colindex="' + col.colIndex + '" ', 'data-ax5grid-column-rowindex="' + col.rowIndex + '" ', 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                        var tdCSS_class = "";
                        if (_col.styleClass) {
                            if (U.isFunction(_col.styleClass)) {
                                tdCSS_class += _col.styleClass.call({
                                    column: _col,
                                    key: _col.key
                                }) + " ";
                            } else {
                                tdCSS_class += _col.styleClass + " ";
                            }
                        }
                        if (cfg.header.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                        return tdCSS_class;
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function () {
                        var lineHeight = cfg.header.columnHeight - cfg.header.columnPadding * 2 - cfg.header.columnBorderWidth;
                        return '<span data-ax5grid-cellHolder="" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + ' style="height: ' + (cfg.header.columnHeight - cfg.header.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                    }(), function () {
                        var _SS = "";

                        if (!U.isNothing(col.key) && !U.isNothing(col.colIndex) && (cfg.sortable === true || col.sortable === true) && col.sortable !== false) {
                            _SS += '<span data-ax5grid-column-sort="' + col.colIndex + '" data-ax5grid-column-sort-order="' + (colGroup[col.colIndex].sort || "") + '" />';
                        }
                        return _SS;
                    }(), col.label || "&nbsp;", '</span>');

                    if (!U.isNothing(col.colIndex)) {
                        if (cfg.enableFilter) {
                            SS.push('<span data-ax5grid-column-filter="' + col.colIndex + '" data-ax5grid-column-filter-value=""  />');
                        }
                    }

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'style="height: ' + cfg.header.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }
            SS.push('</table>');
            _elTarget.html(SS.join(''));

            /// append column-resizer
            (function () {
                var resizerHeight = cfg.header.columnHeight * _bodyRow.rows.length - cfg.header.columnBorderWidth;
                var resizerLeft = 0;
                var AS = [];
                for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                    var col = _colGroup[cgi];
                    if (!U.isNothing(col.colIndex)) {
                        //_colGroup[cgi]._width
                        resizerLeft += col._width;
                        AS.push('<div data-ax5grid-column-resizer="' + col.colIndex + '" style="height:' + resizerHeight + 'px;left: ' + (resizerLeft - 4) + 'px;"  />');
                    }
                }
                _elTarget.append(AS);
            }).call(this);

            return tableWidth;
        };

        if (cfg.asidePanelWidth > 0) {
            repaintHeader(this.$.panel["aside-header"], this.asideColGroup, asideHeaderData);
        }

        if (cfg.frozenColumnIndex > 0) {
            repaintHeader(this.$.panel["left-header"], this.leftHeaderColGroup, leftHeaderData);
        }
        this.xvar.scrollContentWidth = repaintHeader(this.$.panel["header-scroll"], this.headerColGroup, headerData);

        if (cfg.rightSum) {}
    };

    var scrollTo = function scrollTo(css) {
        this.$.panel["header-scroll"].css(css);
        return this;
    };

    var toggleSort = function toggleSort(_key) {
        var sortOrder = "";
        var sortInfo = {};
        var seq = 0;

        for (var k in this.sortInfo) {
            if (this.sortInfo[k].fixed) {
                sortInfo[k] = this.sortInfo[k];
                seq++;
            }
        }

        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            if (this.colGroup[i].key == _key) {
                if (sortOrder == "") {
                    if (typeof this.colGroup[i].sort === "undefined") {
                        sortOrder = "desc";
                    } else if (this.colGroup[i].sort === "desc") {
                        sortOrder = "asc";
                    } else {
                        sortOrder = undefined;
                    }
                }
                this.colGroup[i].sort = sortOrder;
            } else if (!this.config.multiSort) {
                this.colGroup[i].sort = undefined;
            }

            if (typeof this.colGroup[i].sort !== "undefined") {
                if (!sortInfo[this.colGroup[i].key]) {
                    sortInfo[this.colGroup[i].key] = {
                        seq: seq++,
                        orderBy: this.colGroup[i].sort
                    };
                }
            }
        }

        this.setColumnSort(sortInfo);
        return this;
    };

    var applySortStatus = function applySortStatus(_sortInfo) {
        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            for (var _key in _sortInfo) {
                if (this.colGroup[i].key == _key) {
                    this.colGroup[i].sort = _sortInfo[_key].orderBy;
                }
            }
        }
        return this;
    };

    GRID.header = {
        init: init,
        repaint: repaint,
        scrollTo: scrollTo,
        toggleSort: toggleSort,
        applySortStatus: applySortStatus
    };
})();
// ax5.ui.grid.inlineEditor
(function () {

    var GRID = ax5.ui.grid;

    var edit_text = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="text" value="' + _value + '" >';
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.focus().select();
        }
    };

    var edit_money = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="money" value="' + _value + '" >';
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter({
                pattern: "money"
            });
            _$el.focus().select();
        }
    };

    var edit_number = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="number" value="' + _value + '" >';
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter({
                pattern: "number"
            });
            _$el.focus().select();
        }
    };

    var edit_date = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="calendar" value="' + _value + '" >';
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            var self = _root;
            _$el.data("binded-ax5ui", "ax5picker");
            _$el.ax5picker({
                direction: "auto",
                content: {
                    type: 'date',
                    formatter: {
                        pattern: 'date'
                    }
                },
                onStateChanged: function onStateChanged() {
                    if (this.state == "open") {
                        this.self.activePicker.attr("data-ax5grid-inline-edit-picker", "date");
                    } else if (this.state == "close") {
                        GRID.body.inlineEdit.deActive.call(self, "RETURN", _columnKey);
                    }
                }
            });
            _$el.focus().select();
        }
    };

    var edit_select = {
        useReturnToSave: false,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            var po = [];
            po.push('<div data-ax5select="ax5grid-editor" data-ax5select-config="{}">');
            po.push('</div>');

            return po.join('');
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            var eConfig = {
                columnKeys: {
                    optionValue: "value",
                    optionText: "text",
                    optionSelected: "selected"
                }
            };
            jQuery.extend(true, eConfig, _editor.config);

            eConfig.options.forEach(function (n) {
                if (n[eConfig.columnKeys.optionValue] == _value) n[eConfig.columnKeys.optionSelected] = true;
            });

            var self = _root;
            _$el.data("binded-ax5ui", "ax5select");
            _$el.ax5select({
                columnKeys: eConfig.columnKeys,
                options: eConfig.options,
                onStateChanged: function onStateChanged() {
                    if (this.state == "open") {
                        this.self.activeSelectOptionGroup.attr("data-ax5grid-inline-edit-picker", "select");
                    } else if (this.state == "changeValue") {
                        GRID.body.inlineEdit.deActive.call(self, "RETURN", _columnKey, this.value[0][eConfig.columnKeys.optionValue]);
                    } else if (this.state == "close") {
                        GRID.body.inlineEdit.deActive.call(self, "ESC", _columnKey);
                    }
                }
            });
            _$el.ax5select("open");
            _$el.ax5select("setValue", _value);
            _$el.find("a").focus();
        }
    };

    var edit_checkbox = {
        editMode: "inline",
        getHtml: function getHtml(_root, _editor, _value) {

            var lineHeight = _root.config.body.columnHeight - _root.config.body.columnPadding * 2 - _root.config.body.columnBorderWidth;
            var checked;
            if (_editor.config && _editor.config.trueValue) {
                checked = _value == _editor.config.trueValue ? "true" : "false";
            } else {
                checked = _value == false || _value == "false" || _value < "1" ? "false" : "true";
            }

            var eConfig = {
                marginTop: 2,
                height: lineHeight - 4
            };
            jQuery.extend(true, eConfig, _editor.config);
            eConfig.marginTop = (lineHeight - eConfig.height) / 2;

            return '<div data-ax5grid-editor="checkbox" data-ax5grid-checked="' + checked + '" style="height:' + eConfig.height + 'px;width:' + eConfig.height + 'px;margin-top:' + eConfig.marginTop + 'px;"></div>';
        }
    };

    GRID.inlineEditor = {
        "text": edit_text,
        "money": edit_money,
        "number": edit_number,
        "date": edit_date,
        "select": edit_select,
        "checkbox": edit_checkbox
    };
})();
// ax5.ui.grid.page
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var onclickPageMove = function onclickPageMove(_act) {
        var callback = function callback(_pageNo) {
            if (this.page.currentPage != _pageNo) {
                this.page.selectPage = _pageNo;
                if (this.config.page.onChange) {
                    this.config.page.onChange.call({
                        self: this,
                        page: this.page,
                        data: this.data
                    });
                }
            }
        };
        var processor = {
            "first": function first() {
                callback.call(this, 0);
            },
            "prev": function prev() {
                var pageNo = this.page.currentPage - 1;
                if (pageNo < 0) pageNo = 0;
                callback.call(this, pageNo);
            },
            "next": function next() {
                var pageNo = this.page.currentPage + 1;
                if (pageNo > this.page.totalPages - 1) pageNo = this.page.totalPages - 1;
                callback.call(this, pageNo);
            },
            "last": function last() {
                callback.call(this, this.page.totalPages - 1);
            }
        };

        if (_act in processor) {
            processor[_act].call(this);
        } else {
            callback.call(this, _act - 1);
        }
    };

    var navigationUpdate = function navigationUpdate() {
        var self = this;
        if (this.page) {
            var page = {
                hasPage: false,
                currentPage: this.page.currentPage,
                pageSize: this.page.pageSize,
                totalElements: this.page.totalElements,
                totalPages: this.page.totalPages,
                firstIcon: this.config.page.firstIcon,
                prevIcon: this.config.page.prevIcon || "«",
                nextIcon: this.config.page.nextIcon || "»",
                lastIcon: this.config.page.lastIcon
            };
            var navigationItemCount = this.config.page.navigationItemCount;

            page["@paging"] = function () {
                var returns = [];

                var startI = page.currentPage - Math.floor(navigationItemCount / 2);
                if (startI < 0) startI = 0;
                var endI = page.currentPage + navigationItemCount;
                if (endI > page.totalPages) endI = page.totalPages;

                if (endI - startI > navigationItemCount) {
                    endI = startI + navigationItemCount;
                }

                if (endI - startI < navigationItemCount) {
                    startI = endI - navigationItemCount;
                }
                if (startI < 0) startI = 0;

                for (var p = startI, l = endI; p < l; p++) {
                    returns.push({ 'pageNo': p + 1, 'selected': page.currentPage == p });
                }
                return returns;
            }();

            if (page["@paging"].length > 0) {
                page.hasPage = true;
            }

            this.$["page"]["navigation"].html(GRID.tmpl.get("page_navigation", page));
            this.$["page"]["navigation"].find("[data-ax5grid-page-move]").on("click", function () {
                var act = this.getAttribute("data-ax5grid-page-move");
                onclickPageMove.call(self, act);
            });
        } else {
            this.$["page"]["navigation"].empty();
        }
    };

    var statusUpdate = function statusUpdate() {
        var fromRowIndex = this.xvar.paintStartRowIndex;
        var toRowIndex = this.xvar.paintStartRowIndex + this.xvar.paintRowCount - 1;
        //var totalElements = (this.page && this.page.totalElements) ? this.page.totalElements : this.xvar.dataRowCount;
        var totalElements = this.xvar.dataRowCount;
        if (toRowIndex > totalElements) {
            toRowIndex = totalElements;
        }

        this.$["page"]["status"].html(GRID.tmpl.get("page_status", {
            fromRowIndex: U.number(fromRowIndex + 1, { "money": true }),
            toRowIndex: U.number(toRowIndex, { "money": true }),
            totalElements: U.number(totalElements, { "money": true })
        }));
    };

    GRID.page = {
        navigationUpdate: navigationUpdate,
        statusUpdate: statusUpdate
    };
})();
// ax5.ui.grid.scroller
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var convertScrollPosition = {
        "vertical": function vertical(css, _var) {
            var _content_height = _var._content_height - _var._panel_height;
            var _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight;
            var top = _content_height * css.top / _scroller_height;
            if (top < 0) top = 0;else if (_content_height < top) {
                top = _content_height;
            }
            return {
                top: -top
            };
        },
        "horizontal": function horizontal(css, _var) {
            var _content_width = _var._content_width - _var._panel_width;
            var _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth;
            var left = _content_width * css.left / _scroller_width;
            if (left < 0) left = 0;else if (_content_width < left) {
                left = _content_width;
            }
            return {
                left: -left
            };
        }
    };
    var convertScrollBarPosition = {
        "vertical": function vertical(_top, _var) {

            var type = "vertical";
            var _content_height = _var._content_height - _var._panel_height;
            var _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight;
            var top = _scroller_height * _top / _content_height;

            if (-top > _scroller_height) {
                top = -_scroller_height;

                var scrollPositon = convertScrollPosition[type].call(this, { top: -top }, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.body.scrollTo.call(this, scrollPositon);
            }

            return -top;
        },
        "horizontal": function horizontal(_left, _var) {
            var type = "horizontal";
            var _content_width = _var._content_width - _var._panel_width;
            var _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth;
            var left = _scroller_width * _left / _content_width;

            if (-left > _scroller_width) {
                left = -_scroller_width;
                var scrollPositon = convertScrollPosition[type].call(this, { left: -left }, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.header.scrollTo.call(this, scrollPositon);
                GRID.body.scrollTo.call(this, scrollPositon);
            }

            return -left;
        }
    };
    var scrollBarMover = {
        "click": function click(track, bar, type, e) {

            var self = this,
                trackOffset = track.offset(),
                barBox = {
                width: bar.outerWidth(), height: bar.outerHeight()
            },
                trackBox = {
                width: track.innerWidth(), height: track.innerHeight()
            },
                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].outerHeight(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].outerWidth(),
                getScrollerPosition = {
                "vertical": function vertical(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    // track을 벗어 나지 안도록 범위 체크
                    var newTop = mouseObj.clientY - trackOffset.top;
                    if (newTop < 0) {
                        newTop = 0;
                    } else if (newTop + barBox.height > trackBox.height) {
                        newTop = trackBox.height - barBox.height;
                    }
                    return { top: newTop };
                },
                "horizontal": function horizontal(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    // track을 벗어 나지 안도록 범위 체크
                    var newLeft = mouseObj.clientX - trackOffset.left;
                    if (newLeft < 0) {
                        newLeft = 0;
                    } else if (newLeft + barBox.width > trackBox.width) {
                        newLeft = trackBox.width - barBox.width;
                    }
                    return { left: newLeft };
                }
            };

            var css = getScrollerPosition[type](e);
            bar.css(css);

            var scrollPositon = convertScrollPosition[type].call(self, css, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            });
            if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);
            GRID.body.scrollTo.call(self, scrollPositon);
        },
        "on": function on(track, bar, type) {
            var self = this,
                barOffset = bar.position(),
                barBox = {
                width: bar.outerWidth(), height: bar.outerHeight()
            },
                trackBox = {
                width: track.innerWidth(), height: track.innerHeight()
            },
                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].outerHeight(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].outerWidth(),
                getScrollerPosition = {
                "vertical": function vertical(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    self.xvar.__da = mouseObj.clientY - self.xvar.mousePosition.clientY;
                    // track을 벗어 나지 안도록 범위 체크
                    var newTop = barOffset.top + self.xvar.__da;
                    if (newTop < 0) {
                        newTop = 0;
                    } else if (newTop + barBox.height > trackBox.height) {
                        newTop = trackBox.height - barBox.height;
                    }
                    return { top: newTop };
                },
                "horizontal": function horizontal(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                    // track을 벗어 나지 안도록 범위 체크
                    var newLeft = barOffset.left + self.xvar.__da;
                    if (newLeft < 0) {
                        newLeft = 0;
                    } else if (newLeft + barBox.width > trackBox.width) {
                        newLeft = trackBox.width - barBox.width;
                    }
                    return { left: newLeft };
                }
            };

            self.xvar.__da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)

            jQuery(document.body).bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                var css = getScrollerPosition[type](e);
                bar.css(css);

                var scrollPositon = convertScrollPosition[type].call(self, css, {
                    _content_width: _content_width,
                    _content_height: _content_height,
                    _panel_width: _panel_width,
                    _panel_height: _panel_height,
                    _horizontal_scroller_width: _horizontal_scroller_width,
                    _vertical_scroller_height: _vertical_scroller_height,
                    verticalScrollBarHeight: verticalScrollBarHeight,
                    horizontalScrollBarWidth: horizontalScrollBarWidth
                });

                if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);
                GRID.body.scrollTo.call(self, scrollPositon);
            }).bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                scrollBarMover.off.call(self);
            }).bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                scrollBarMover.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {
            jQuery(document.body).unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId).unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId).unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };
    var scrollContentMover = {
        "wheel": function wheel(delta) {
            var self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.$["panel"]["body"].height(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth;

            var newLeft, newTop;
            var _top_is_end = false;
            var _left_is_end = false;

            newLeft = _body_scroll_position.left - delta.x;
            newTop = _body_scroll_position.top - delta.y;

            // newTop이 범위를 넘었는지 체크
            if (newTop >= 0) {
                newTop = 0;
                _top_is_end = true;
            } else if (newTop <= _panel_height - _content_height) {
                newTop = _panel_height - _content_height;
                if (newTop >= 0) newTop = 0;
                _top_is_end = true;
            } else {
                if (delta.y == 0) _top_is_end = true;
            }

            // newLeft이 범위를 넘었는지 체크
            if (newLeft >= 0) {
                newLeft = 0;
                _left_is_end = true;
            } else if (newLeft <= _panel_width - _content_width) {
                newLeft = _panel_width - _content_width;
                if (newLeft >= 0) newLeft = 0;
                _left_is_end = true;
            } else {
                if (delta.x == 0) _left_is_end = true;
            }

            //self.$["panel"]["body-scroll"].css({left: newLeft, top: newTop});
            GRID.header.scrollTo.call(this, { left: newLeft });
            GRID.body.scrollTo.call(this, { left: newLeft, top: newTop });
            resize.call(this);

            return !_top_is_end || !_left_is_end;
        },
        "on": function on() {
            var self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.$["panel"]["body"].height(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                getContentPosition = function getContentPosition(e) {
                var mouseObj = GRID.util.getMousePosition(e);
                var newLeft, newTop;

                self.xvar.__x_da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                self.xvar.__y_da = mouseObj.clientY - self.xvar.mousePosition.clientY;

                newLeft = _body_scroll_position.left + self.xvar.__x_da;
                newTop = _body_scroll_position.top + self.xvar.__y_da;

                // newTop이 범위를 넘었는지 체크
                if (newTop >= 0) {
                    newTop = 0;
                } else if (newTop <= _panel_height - _content_height) {
                    newTop = _panel_height - _content_height;
                    if (newTop >= 0) newTop = 0;
                }

                // newLeft이 범위를 넘었는지 체크
                if (newLeft >= 0) {
                    newLeft = 0;
                } else if (newLeft <= _panel_width - _content_width) {
                    newLeft = _panel_width - _content_width;
                    if (newLeft >= 0) newLeft = 0;
                }

                return {
                    left: newLeft, top: newTop
                };
            };

            this.xvar.__x_da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)
            this.xvar.__y_da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)

            jQuery(document.body).bind("touchmove" + ".ax5grid-" + this.instanceId, function (e) {
                var css = getContentPosition(e);
                GRID.header.scrollTo.call(self, { left: css.left });
                GRID.body.scrollTo.call(self, css, "noRepaint");
                resize.call(self);
                U.stopEvent(e);
            }).bind("touchend" + ".ax5grid-" + this.instanceId, function (e) {
                var css = getContentPosition(e);
                GRID.header.scrollTo.call(self, { left: css.left });
                GRID.body.scrollTo.call(self, css);
                resize.call(self);
                U.stopEvent(e);
                scrollContentMover.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {

            jQuery(document.body).unbind("touchmove" + ".ax5grid-" + this.instanceId).unbind("touchend" + ".ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var init = function init() {
        var self = this;
        //this.config.scroller.size
        var margin = this.config.scroller.trackPadding;

        this.$["scroller"]["vertical-bar"].css({ width: this.config.scroller.size - (margin + 1), left: margin / 2 });
        this.$["scroller"]["horizontal-bar"].css({ height: this.config.scroller.size - (margin + 1), top: margin / 2 });

        this.$["scroller"]["vertical-bar"].bind(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollBarMover.on.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical");
        }.bind(this)).bind("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
        this.$["scroller"]["vertical"].bind("click", function (e) {
            if (e.target && e.target.getAttribute("data-ax5grid-scroller") == "vertical") {
                scrollBarMover.click.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical", e);
            }
        }.bind(this));

        this.$["scroller"]["horizontal-bar"].bind(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollBarMover.on.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal");
        }.bind(this)).bind("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
        this.$["scroller"]["horizontal"].bind("click", function (e) {
            if (e.target && e.target.getAttribute("data-ax5grid-scroller") == "horizontal") {
                scrollBarMover.click.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal", e);
            }
        }.bind(this));

        this.$["container"]["body"].bind('mousewheel DOMMouseScroll', function (e) {
            var E = e.originalEvent;
            var delta = { x: 0, y: 0 };
            if (E.detail) {
                delta.y = E.detail * 10;
            } else {
                if (typeof E.deltaY === "undefined") {
                    delta.y = -E.wheelDelta;
                    delta.x = 0;
                } else {
                    delta.y = E.deltaY;
                    delta.x = E.deltaX;
                }
            }

            if (scrollContentMover.wheel.call(this, delta)) {
                U.stopEvent(e);
            }
        }.bind(this));

        if (document.addEventListener && ax5.info.supportTouch) {
            this.$["container"]["body"].on("touchstart", '[data-ax5grid-panel]', function (e) {
                self.xvar.mousePosition = GRID.util.getMousePosition(e);
                scrollContentMover.on.call(self);
            });
        }
    };

    var resize = function resize() {
        var _vertical_scroller_height = this.$["scroller"]["vertical"].height(),
            _horizontal_scroller_width = this.$["scroller"]["horizontal"].width(),
            _panel_height = this.$["panel"]["body"].height(),
            _panel_width = this.$["panel"]["body"].width(),
            _content_height = this.xvar.scrollContentHeight,
            _content_width = this.xvar.scrollContentWidth,
            verticalScrollBarHeight = _panel_height * _vertical_scroller_height / _content_height,
            horizontalScrollBarWidth = _panel_width * _horizontal_scroller_width / _content_width;

        if (verticalScrollBarHeight < this.config.scroller.barMinSize) verticalScrollBarHeight = this.config.scroller.barMinSize;
        if (horizontalScrollBarWidth < this.config.scroller.barMinSize) horizontalScrollBarWidth = this.config.scroller.barMinSize;

        this.$["scroller"]["vertical-bar"].css({
            top: convertScrollBarPosition.vertical.call(this, this.$.panel["body-scroll"].position().top, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            height: verticalScrollBarHeight
        });

        //console.log(horizontalScrollBarWidth);

        this.$["scroller"]["horizontal-bar"].css({
            left: convertScrollBarPosition.horizontal.call(this, this.$.panel["body-scroll"].position().left, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            width: horizontalScrollBarWidth
        });

        _vertical_scroller_height = null;
        _horizontal_scroller_width = null;
        _panel_height = null;
        _panel_width = null;
        _content_height = null;
        _content_width = null;
        verticalScrollBarHeight = null;
        horizontalScrollBarWidth = null;
    };

    GRID.scroller = {
        init: init,
        resize: resize
    };
})();
// ax5.ui.grid.tmpl
(function () {

    var GRID = ax5.ui.grid;
    var main = function main() {
        return '<div data-ax5grid-container="root" data-ax5grid-instance="{{instanceId}}">\n            <div data-ax5grid-container="hidden">\n                <textarea data-ax5grid-form="clipboard"></textarea>\n            </div>\n            <div data-ax5grid-container="header">\n                <div data-ax5grid-panel="aside-header"></div>\n                <div data-ax5grid-panel="left-header"></div>\n                <div data-ax5grid-panel="header">\n                    <div data-ax5grid-panel-scroll="header"></div>\n                </div>\n                <div data-ax5grid-panel="right-header"></div>\n            </div>\n            <div data-ax5grid-container="body">\n                <div data-ax5grid-panel="top-aside-body"></div>\n                <div data-ax5grid-panel="top-left-body"></div>\n                <div data-ax5grid-panel="top-body">\n                    <div data-ax5grid-panel-scroll="top-body"></div>\n                </div>\n                <div data-ax5grid-panel="top-right-body"></div>\n                <div data-ax5grid-panel="aside-body">\n                    <div data-ax5grid-panel-scroll="aside-body"></div>\n                </div>\n                <div data-ax5grid-panel="left-body">\n                    <div data-ax5grid-panel-scroll="left-body"></div>\n                </div>\n                <div data-ax5grid-panel="body">\n                    <div data-ax5grid-panel-scroll="body"></div>\n                </div>\n                <div data-ax5grid-panel="right-body">\n                  <div data-ax5grid-panel-scroll="right-body"></div>\n                </div>\n                <div data-ax5grid-panel="bottom-aside-body"></div>\n                <div data-ax5grid-panel="bottom-left-body"></div>\n                <div data-ax5grid-panel="bottom-body">\n                    <div data-ax5grid-panel-scroll="bottom-body"></div>\n                </div>\n                <div data-ax5grid-panel="bottom-right-body"></div>\n            </div>\n            <div data-ax5grid-container="page">\n                <div data-ax5grid-page="holder">\n                    <div data-ax5grid-page="navigation"></div>\n                    <div data-ax5grid-page="status"></div>\n                </div>\n            </div>\n            <div data-ax5grid-container="scroller">\n                <div data-ax5grid-scroller="vertical">\n                    <div data-ax5grid-scroller="vertical-bar"></div>    \n                </div>\n                <div data-ax5grid-scroller="horizontal">\n                    <div data-ax5grid-scroller="horizontal-bar"></div>\n                </div>\n                <div data-ax5grid-scroller="corner"></div>\n            </div>\n            <div data-ax5grid-resizer="vertical"></div>\n            <div data-ax5grid-resizer="horizontal"></div>\n        </div>';
    };

    var page_navigation = function page_navigation() {
        return '<div data-ax5grid-page-navigation="holder">\n            {{#hasPage}}\n            <div data-ax5grid-page-navigation="cell">    \n                {{#firstIcon}}<button data-ax5grid-page-move="first">{{{firstIcon}}}</button>{{/firstIcon}}\n                <button data-ax5grid-page-move="prev">{{{prevIcon}}}</button>\n            </div>\n            <div data-ax5grid-page-navigation="cell-paging">\n                {{#@paging}}\n                <button data-ax5grid-page-move="{{pageNo}}" data-ax5grid-page-selected="{{selected}}">{{pageNo}}</button>\n                {{/@paging}}\n            </div>\n            <div data-ax5grid-page-navigation="cell">\n                <button data-ax5grid-page-move="next">{{{nextIcon}}}</button>\n                {{#lastIcon}}<button data-ax5grid-page-move="last">{{{lastIcon}}}</button>{{/lastIcon}}\n            </div>\n            {{/hasPage}}\n        </div>';
    };

    var page_status = function page_status() {
        return '<span>{{fromRowIndex}} - {{toRowIndex}} of {{totalElements}}</span>';
    };

    GRID.tmpl = {
        "main": main,
        "page_navigation": page_navigation,
        "page_status": page_status,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(GRID.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.grid.util
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    /**
     * @method ax5grid.util.divideTableByFrozenColumnIndex
     * @param _table
     * @param _frozenColumnIndex
     * @returns {{leftHeaderData: {rows: Array}, headerData: {rows: Array}}}
     */

    var divideTableByFrozenColumnIndex = function divideTableByFrozenColumnIndex(_table, _frozenColumnIndex) {
        var tempTable_l = { rows: [] };
        var tempTable_r = { rows: [] };
        for (var r = 0, rl = _table.rows.length; r < rl; r++) {
            var row = _table.rows[r];

            tempTable_l.rows[r] = { cols: [] };
            tempTable_r.rows[r] = { cols: [] };

            for (var c = 0, cl = row.cols.length; c < cl; c++) {
                var col = jQuery.extend({}, row.cols[c]);
                var colStartIndex = col.colIndex,
                    colEndIndex = col.colIndex + col.colspan;

                if (colStartIndex < _frozenColumnIndex) {
                    if (colEndIndex <= _frozenColumnIndex) {
                        // 좌측편에 변형없이 추가
                        tempTable_l.rows[r].cols.push(col);
                    } else {
                        var leftCol = jQuery.extend({}, col);
                        var rightCol = jQuery.extend({}, leftCol);
                        leftCol.colspan = _frozenColumnIndex - leftCol.colIndex;
                        rightCol.colIndex = _frozenColumnIndex;
                        rightCol.colspan = col.colspan - leftCol.colspan;

                        tempTable_l.rows[r].cols.push(leftCol);
                        tempTable_r.rows[r].cols.push(rightCol);
                    }
                } else {
                    // 오른편
                    tempTable_r.rows[r].cols.push(col);
                }
            }
        }

        return {
            leftData: tempTable_l,
            rightData: tempTable_r
        };
    };

    var getMousePosition = function getMousePosition(e) {
        var mouseObj,
            originalEvent = e.originalEvent ? e.originalEvent : e;
        mouseObj = 'changedTouches' in originalEvent ? originalEvent.changedTouches[0] : originalEvent;
        // clientX, Y 쓰면 스크롤에서 문제 발생
        return {
            clientX: mouseObj.pageX,
            clientY: mouseObj.pageY
        };
    };

    var ENM = {
        "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
        "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
        "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
    };

    var makeHeaderTable = function makeHeaderTable(_columns) {
        var columns = U.deepCopy(_columns);
        var cfg = this.config;
        var table = {
            rows: []
        };
        var colIndex = 0;
        var maekRows = function maekRows(_columns, depth, parentField) {
            var row = { cols: [] };
            var i = 0,
                l = _columns.length;

            for (; i < l; i++) {
                var field = _columns[i];
                var colspan = 1;

                if (!field.hidden) {
                    field.colspan = 1;
                    field.rowspan = 1;

                    field.rowIndex = depth;
                    field.colIndex = function () {
                        if (!parentField) {
                            return colIndex++;
                        } else {
                            colIndex = parentField.colIndex + i + 1;
                            return parentField.colIndex + i;
                        }
                    }();

                    row.cols.push(field);

                    if ('columns' in field) {
                        colspan = maekRows(field.columns, depth + 1, field);
                    } else {
                        field.width = 'width' in field ? field.width : cfg.columnMinWidth;
                    }
                    field.colspan = colspan;
                } else {}
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = { cols: [] };
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return row.cols.length - 1 + colspan;
            } else {
                return colspan;
            }
        };
        maekRows(columns, 0);

        // set rowspan
        for (var r = 0, rl = table.rows.length; r < rl; r++) {
            for (var c = 0, cl = table.rows[r].cols.length; c < cl; c++) {
                if (!('columns' in table.rows[r].cols[c])) {
                    table.rows[r].cols[c].rowspan = rl - r;
                }
            }
        }

        return table;
    };

    var makeBodyRowTable = function makeBodyRowTable(_columns) {
        var columns = U.deepCopy(_columns);
        var table = {
            rows: []
        };
        var colIndex = 0;
        var maekRows = function maekRows(_columns, depth, parentField) {
            var row = { cols: [] };
            var i = 0,
                l = _columns.length;

            var selfMakeRow = function selfMakeRow(__columns) {
                var i = 0,
                    l = __columns.length;
                for (; i < l; i++) {
                    var field = __columns[i];
                    var colspan = 1;

                    if (!field.hidden) {

                        if ('key' in field) {
                            field.colspan = 1;
                            field.rowspan = 1;

                            field.rowIndex = depth;
                            field.colIndex = function () {
                                if (!parentField) {
                                    return colIndex++;
                                } else {
                                    colIndex = parentField.colIndex + i + 1;
                                    return parentField.colIndex + i;
                                }
                            }();

                            row.cols.push(field);
                            if ('columns' in field) {
                                colspan = maekRows(field.columns, depth + 1, field);
                            }
                            field.colspan = colspan;
                        } else {
                            if ('columns' in field) {
                                selfMakeRow(field.columns, depth);
                            }
                        }
                    } else {}
                }
            };

            for (; i < l; i++) {
                var field = _columns[i];
                var colspan = 1;

                if (!field.hidden) {

                    if ('key' in field) {
                        field.colspan = 1;
                        field.rowspan = 1;

                        field.rowIndex = depth;
                        field.colIndex = function () {
                            if (!parentField) {
                                return colIndex++;
                            } else {
                                colIndex = parentField.colIndex + i + 1;
                                return parentField.colIndex + i;
                            }
                        }();

                        row.cols.push(field);
                        if ('columns' in field) {
                            colspan = maekRows(field.columns, depth + 1, field);
                        }
                        field.colspan = colspan;
                    } else {
                        if ('columns' in field) {
                            selfMakeRow(field.columns, depth);
                        }
                    }
                } else {}
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = { cols: [] };
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return row.cols.length - 1 + colspan;
            } else {
                return colspan;
            }
        };
        maekRows(columns, 0);

        (function (table) {
            // set rowspan
            for (var r = 0, rl = table.rows.length; r < rl; r++) {
                var row = table.rows[r];
                for (var c = 0, cl = row.cols.length; c < cl; c++) {
                    var col = row.cols[c];
                    if (!('columns' in col)) {
                        col.rowspan = rl - r;
                    }
                }
            }
        })(table);

        return table;
    };

    var makeBodyRowMap = function makeBodyRowMap(_table) {
        var map = {};
        _table.rows.forEach(function (row) {
            row.cols.forEach(function (col) {
                map[col.rowIndex + "_" + col.colIndex] = jQuery.extend({}, col);
            });
        });
        return map;
    };

    var makeFootSumTable = function makeFootSumTable(_footSumColumns) {
        var table = {
            rows: []
        };

        for (var r = 0, rl = _footSumColumns.length; r < rl; r++) {
            var footSumRow = _footSumColumns[r];
            table.rows[r] = { cols: [] };
            var addC = 0;
            for (var c = 0, cl = footSumRow.length; c < cl; c++) {
                if (addC > this.columns.length) break;
                var colspan = footSumRow[c].colspan || 1;
                if (footSumRow[c].label || footSumRow[c].key) {
                    table.rows[r].cols.push({
                        colspan: colspan,
                        rowspan: 1,
                        colIndex: addC,
                        columnAttr: "sum",
                        align: footSumRow[c].align,
                        label: footSumRow[c].label,
                        key: footSumRow[c].key,
                        collector: footSumRow[c].collector,
                        formatter: footSumRow[c].formatter
                    });
                } else {
                    table.rows[r].cols.push({
                        colIndex: addC,
                        colspan: colspan,
                        rowspan: 1,
                        label: "&nbsp;"
                    });
                }
                addC += colspan;
            }
            addC -= 1;
            if (addC < this.columns.length + 1) {
                for (var c = addC; c < this.columns.length + 1; c++) {
                    table.rows[r].cols.push({
                        colIndex: c + 1,
                        colspan: 1,
                        rowspan: 1,
                        label: "&nbsp;"
                    });
                }
            }
        }
        return table;
    };

    var makeBodyGroupingTable = function makeBodyGroupingTable(_bodyGroupingColumns) {
        var table = {
            rows: []
        };

        var r = 0;
        table.rows[r] = { cols: [] };
        var addC = 0;
        for (var c = 0, cl = _bodyGroupingColumns.length; c < cl; c++) {
            if (addC > this.columns.length) break;
            var colspan = _bodyGroupingColumns[c].colspan || 1;
            if (_bodyGroupingColumns[c].label || _bodyGroupingColumns[c].key) {
                table.rows[r].cols.push({
                    colspan: colspan,
                    rowspan: 1,
                    rowIndex: 0,
                    colIndex: addC,
                    columnAttr: "default",
                    align: _bodyGroupingColumns[c].align,
                    label: _bodyGroupingColumns[c].label,
                    key: _bodyGroupingColumns[c].key,
                    collector: _bodyGroupingColumns[c].collector,
                    formatter: _bodyGroupingColumns[c].formatter
                });
            } else {
                table.rows[r].cols.push({
                    rowIndex: 0,
                    colIndex: addC,
                    colspan: colspan,
                    rowspan: 1,
                    label: "&nbsp;"
                });
            }
            addC += colspan;
        }
        addC -= 1;
        if (addC < this.columns.length + 1) {
            for (var c = addC; c < this.columns.length + 1; c++) {
                table.rows[r].cols.push({
                    rowIndex: 0,
                    colIndex: c + 1,
                    colspan: 1,
                    rowspan: 1,
                    label: "&nbsp;"
                });
            }
        }

        return table;
    };

    var findPanelByColumnIndex = function findPanelByColumnIndex(_dindex, _colIndex, _rowIndex) {
        var _containerPanelName;
        var _isScrollPanel = false;
        var _panels = [];

        if (this.xvar.frozenRowIndex > _dindex) _panels.push("top");
        if (this.xvar.frozenColumnIndex > _colIndex) _panels.push("left");
        _panels.push("body");

        if (this.xvar.frozenColumnIndex <= _colIndex || this.xvar.frozenRowIndex <= _dindex) {
            _containerPanelName = _panels.join("-");
            _panels.push("scroll");
            _isScrollPanel = true;
        }

        return {
            panelName: _panels.join("-"),
            containerPanelName: _containerPanelName,
            isScrollPanel: _isScrollPanel
        };
    };

    var getRealPathForDataItem = function getRealPathForDataItem(_dataPath) {
        var path = [];
        var _path = [].concat(_dataPath.split(/[\.\[\]]/g));
        _path.forEach(function (n) {
            if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
        });
        _path = null;
        return path.join("");
    };

    GRID.util = {
        divideTableByFrozenColumnIndex: divideTableByFrozenColumnIndex,
        getMousePosition: getMousePosition,
        ENM: ENM,
        makeHeaderTable: makeHeaderTable,
        makeBodyRowTable: makeBodyRowTable,
        makeBodyRowMap: makeBodyRowMap,
        makeFootSumTable: makeFootSumTable,
        makeBodyGroupingTable: makeBodyGroupingTable,
        findPanelByColumnIndex: findPanelByColumnIndex,
        getRealPathForDataItem: getRealPathForDataItem
    };
})();
// ax5.ui.mediaViewer
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var MEDIAVIEWER;

    UI.addClass({
        className: "mediaViewer",
        version: "0.4.3"
    }, function () {
        /**
         * @class ax5mediaViewer
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myViewer = new ax5.ui.mediaViewer();
         * ```
         */
        var ax5mediaViewer = function ax5mediaViewer() {
            var self = this,
                cfg,
                ENM = {
                "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
                "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
                "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
            },
                getMousePosition = function getMousePosition(e) {
                var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                return {
                    clientX: mouseObj.clientX,
                    clientY: mouseObj.clientY,
                    time: new Date().getTime()
                };
            };

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                animateTime: 250,

                columnKeys: {
                    src: 'src',
                    poster: 'poster',
                    html: 'html'
                },
                loading: {
                    icon: '',
                    text: 'Now Loading'
                },
                viewer: {
                    prevHandle: false,
                    nextHandle: false,
                    ratio: 16 / 9
                },
                media: {
                    prevHandle: '<',
                    nextHandle: '>',
                    width: 36, height: 36,
                    list: []
                }
            };
            this.queue = [];
            this.openTimer = null;
            this.closeTimer = null;
            this.selectedIndex = 0;
            this.mousePosition = {};

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
                getFrame = function getFrame() {
                var data = jQuery.extend(true, { id: this.id }, cfg);

                try {
                    return MEDIAVIEWER.tmpl.get.call(this, "frame", data, cfg.columnKeys);
                } finally {
                    data = null;
                }
            },
                onClick = function onClick(e, target) {
                var result,
                    elementType = "",
                    processor = {
                    'thumbnail': function thumbnail(target) {
                        this.select(target.getAttribute("data-media-thumbnail"));
                    },
                    'prev': function prev(target) {
                        if (this.selectedIndex > 0) {
                            this.select(this.selectedIndex - 1);
                        } else {
                            this.select(cfg.media.list.length - 1);
                        }
                    },
                    'next': function next(target) {
                        if (this.selectedIndex < cfg.media.list.length - 1) {
                            this.select(this.selectedIndex + 1);
                        } else {
                            this.select(0);
                        }
                    },
                    'viewer': function viewer(target) {
                        if (self.onClick) {
                            self.onClick.call({
                                media: cfg.media.list[this.selectedIndex]
                            });
                        }
                    }
                };

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-media-thumbnail")) {
                        elementType = "thumbnail";
                        return true;
                    } else if (target.getAttribute("data-media-viewer-els") == "media-list-prev-handle") {
                        elementType = "prev";
                        return true;
                    } else if (target.getAttribute("data-media-viewer-els") == "media-list-next-handle") {
                        elementType = "next";
                        return true;
                    } else if (target.getAttribute("data-media-viewer-els") == "viewer") {
                        elementType = "viewer";
                        return true;
                    } else if (self.target.get(0) == target) {
                        return true;
                    }
                });

                if (target) {
                    for (var key in processor) {
                        if (key == elementType) {
                            result = processor[key].call(this, target);
                            break;
                        }
                    }
                    return this;
                }
                return this;
            },
                getSelectedIndex = function getSelectedIndex() {
                if (cfg.media && cfg.media.list && cfg.media.list.length > 0) {
                    var i = cfg.media.list.length,
                        selecteIndex = 0;
                    while (i--) {
                        if (cfg.media.list[i].selected) {
                            selecteIndex = i;
                            break;
                        }
                    }

                    if (selecteIndex == 0) {
                        cfg.media.list[0].selected = true;
                    }
                    try {
                        return selecteIndex;
                    } finally {
                        i = null;
                        selecteIndex = null;
                    }
                } else {
                    return;
                }
            },
                alignMediaList = function alignMediaList() {
                var thumbnail = this.$["list"].find('[data-media-thumbnail=' + this.selectedIndex + ']'),
                    pos = thumbnail.position(),
                    thumbnailWidth = thumbnail.outerWidth(),
                    containerWidth = this.$["list"].outerWidth(),
                    parentLeft = this.$["list-table"].position().left,
                    parentWidth = this.$["list-table"].outerWidth(),
                    newLeft = 0;

                if (pos.left + thumbnailWidth + parentLeft > containerWidth) {
                    newLeft = containerWidth - (pos.left + thumbnailWidth);
                    if (parentLeft != newLeft) this.$["list-table"].css({ left: parentLeft = newLeft });
                } else if (pos.left + parentLeft < 0) {
                    newLeft = pos.left;
                    if (newLeft > 0) newLeft = 0;
                    if (parentLeft != newLeft) this.$["list-table"].css({ left: parentLeft = newLeft });
                }

                if (parentLeft != newLeft) {
                    if (parentLeft + parentWidth < containerWidth) {
                        newLeft = containerWidth - parentWidth;
                        if (newLeft > 0) newLeft = 0;
                        this.$["list-table"].css({ left: newLeft });
                    }
                }

                thumbnail = null;
                pos = null;
                thumbnailWidth = null;
                containerWidth = null;
                parentLeft = null;
                newLeft = null;
            },
                swipeMedia = {
                "on": function on(mousePosition) {
                    // console.log(mousePosition);
                    var getSwipePosition = function getSwipePosition(e) {
                        var mouseObj = e;
                        if ('changedTouches' in e.originalEvent) {
                            mouseObj = e.originalEvent.changedTouches[0];
                        }

                        mousePosition.__dx = mouseObj.clientX - mousePosition.clientX;
                        mousePosition.__dy = mouseObj.clientY - mousePosition.clientY;
                        mousePosition.__time = new Date().getTime();

                        if (Math.abs(mousePosition.__dx) > Math.abs(mousePosition.__dy)) {
                            return { left: mousePosition.__dx };
                        } else {
                            return { top: mousePosition.__dy };
                        }
                    };
                    var viewerWidth = this.$["viewer"].width();

                    jQuery(document.body).bind(ENM["mousemove"] + ".ax5media-viewer-" + this.instanceId, function (e) {
                        var position = getSwipePosition(e);

                        if ('left' in position) {
                            self.$["viewer-holder"].css(position);
                            if (Math.abs(self.mousePosition.__dx) > viewerWidth / 3) {
                                //console.log(self.mousePosition);
                                // trigger nextMedia

                                var nextIndex = 0;

                                if (self.mousePosition.__dx > 0) {
                                    if (self.selectedIndex > 0) {
                                        nextIndex = self.selectedIndex - 1;
                                    } else {
                                        nextIndex = cfg.media.list.length - 1;
                                    }
                                } else {
                                    if (self.selectedIndex < cfg.media.list.length - 1) {
                                        nextIndex = self.selectedIndex + 1;
                                    }
                                }

                                self.select(nextIndex);
                                swipeMedia.off.call(self);
                            }

                            U.stopEvent(e);
                        }
                    }).bind(ENM["mouseup"] + ".ax5media-viewer-" + this.instanceId, function (e) {
                        swipeMedia.off.call(self);
                    }).bind("mouseleave.ax5media-viewer-" + this.instanceId, function (e) {
                        swipeMedia.off.call(self);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
                },
                "off": function off() {
                    self.$["viewer-holder"].css({ left: 0 });
                    jQuery(document.body).unbind(ENM["mousemove"] + ".ax5media-viewer-" + this.instanceId).unbind(ENM["mouseup"] + ".ax5media-viewer-" + this.instanceId).unbind("mouseleave.ax5media-viewer-" + this.instanceId);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
                }
            };
            /// private end

            /**
             * Preferences of mediaViewer UI
             * @method ax5mediaViewer.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5mediaViewer}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                this.id = 'ax5-media-viewer-' + ax5.getGuid();
                if (cfg.target && cfg.media && cfg.media.list && cfg.media.list.length > 0) {
                    this.attach(cfg.target);
                }
            };

            /**
             * @method ax5mediaViewer.attach
             * @param target
             * @param options
             * @returns {ax5mediaViewer}
             */
            this.attach = function (target, options) {
                if (!target) {
                    console.log(ax5.info.getError("ax5mediaViewer", "401", "setConfig"));
                }
                if (typeof options != "undefined") {
                    this.setConfig(options, false);
                }
                this.target = jQuery(target);
                this.target.html(getFrame.call(this));

                // 파트수집
                this.$ = {
                    "root": this.target.find('[data-ax5-ui-media-viewer]'),
                    "viewer-holder": this.target.find('[data-media-viewer-els="viewer-holder"]'),
                    "viewer": this.target.find('[data-media-viewer-els="viewer"]'),
                    "viewer-loading": this.target.find('[data-media-viewer-els="viewer-loading"]'),
                    "list-holder": this.target.find('[data-media-viewer-els="media-list-holder"]'),
                    "list-prev-handle": this.target.find('[data-media-viewer-els="media-list-prev-handle"]'),
                    "list": this.target.find('[data-media-viewer-els="media-list"]'),
                    "list-table": this.target.find('[data-media-viewer-els="media-list-table"]'),
                    "list-next-handle": this.target.find('[data-media-viewer-els="media-list-next-handle"]')
                };

                this.align();

                jQuery(window).unbind("resize.ax5media-viewer-" + this.id).bind("resize.ax5media-viewer-" + this.id, function () {
                    this.align();
                    alignMediaList.call(this);
                }.bind(this));

                this.target.unbind("click").bind("click", function (e) {
                    e = e || window.event;
                    onClick.call(this, e);
                    U.stopEvent(e);
                }.bind(this));

                this.$.viewer.unbind(ENM["mousedown"]).bind(ENM["mousedown"], function (e) {
                    this.mousePosition = getMousePosition(e);
                    swipeMedia.on.call(this, this.mousePosition);
                }.bind(this)).unbind("dragstart").bind("dragstart", function (e) {
                    U.stopEvent(e);
                    return false;
                });

                this.select(getSelectedIndex.call(this));
                return this;
            };

            /**
             * @method ax5mediaViewer.align
             * @returns {ax5mediaViewer}
             */
            this.align = function () {
                // viewer width, height
                this.$["viewer-holder"].css({ height: this.$["viewer"].width() / cfg.viewer.ratio });
                this.$["viewer"].css({ height: this.$["viewer"].width() / cfg.viewer.ratio });

                if (this.$["viewer"].data("media-type") == "image") {
                    var $img = this.$["viewer"].find("img");
                    $img.css({
                        width: this.$["viewer"].height() * this.$["viewer"].data("img-ratio"), height: this.$["viewer"].height()
                    });
                    setTimeout(function (_img) {
                        _img.css({ left: (this.$["viewer"].width() - _img.width()) / 2 });
                    }.bind(this, $img), 1);
                } else if (this.$["viewer"].data("media-type") == "video") {
                    this.$["viewer"].find("iframe").css({ width: this.$["viewer"].height() * this.$["viewer"].data("img-ratio"), height: this.$["viewer"].height() });
                }
                this.$["viewer-loading"].css({ height: this.$["viewer"].height() });

                var mediaThumbnailWidth = U.right(cfg.media.width, 1) == '%' ? U.number(cfg.media.width) / 100 * this.$["viewer"].width() : U.number(cfg.media.width),
                    mediaThumbnailHeight = U.right(cfg.media.height, 1) == '%' ? U.number(cfg.media.height) / 100 * this.$["viewer"].width() : U.number(cfg.media.height);

                mediaThumbnailWidth = Math.floor(mediaThumbnailWidth);
                mediaThumbnailHeight = Math.floor(mediaThumbnailHeight);

                this.$["list-prev-handle"].css({ width: mediaThumbnailWidth * 1.5 });
                this.$["list-next-handle"].css({ width: mediaThumbnailWidth * 1.5 });
                this.$["list"].css({ height: mediaThumbnailHeight });
                this.$["list-table"].find('[data-media-thumbnail]').css({ width: mediaThumbnailWidth, height: mediaThumbnailHeight });
                this.$["list-table"].find('[data-media-thumbnail-video]').css({ width: mediaThumbnailWidth, height: mediaThumbnailHeight });

                return this;
            };

            /**
             * @method ax5mediaViewer.select
             * @param index
             * @returns {ax5mediaViewer}
             */
            this.select = function () {
                var mediaView = {
                    image: function image(obj, callback) {
                        self.$["viewer-loading"].show();
                        var dim = [this.$["viewer"].width(), this.$["viewer"].height()];
                        var img = new Image();
                        img.src = obj.image[cfg.columnKeys.src];
                        img.onload = function () {
                            self.$["viewer-loading"].fadeOut();
                            var h = dim[1];
                            var w = h * img.width / img.height;
                            callback(img, Math.floor(w), h);
                        };
                        return img;
                    },
                    video: function video(obj, callback) {
                        self.$["viewer-loading"].show();
                        var dim = [this.$["viewer"].width(), this.$["viewer"].height()];
                        var html = jQuery(obj.video[cfg.columnKeys.html]);
                        callback(html, dim[0], dim[1]);
                        self.$["viewer-loading"].fadeOut();
                    }
                };
                var onLoad = {
                    image: function image(img, w, h) {
                        img.width = w;
                        img.height = h;

                        var $img = $(img);
                        this.$["viewer"].html($img);
                        $img.css({ left: (this.$["viewer"].width() - w) / 2 });

                        this.$["viewer"].data("media-type", "image");
                        this.$["viewer"].data("img-ratio", w / h);
                    },
                    video: function video(html, w, h) {
                        html.css({ width: w, height: h });
                        this.$["viewer"].html(html);
                        this.$["viewer"].data("media-type", "video");
                        this.$["viewer"].data("img-ratio", w / h);
                    }
                };
                var select = function select(index) {
                    this.$["list"].find('[data-media-thumbnail]').removeClass("selected");
                    this.$["list"].find('[data-media-thumbnail=' + index + ']').addClass("selected");
                    alignMediaList.call(this);
                };

                return function (index) {
                    if (typeof index === "undefined") return this;
                    this.selectedIndex = Number(index);
                    var media = cfg.media.list[index];
                    select.call(this, index);

                    for (var key in mediaView) {
                        if (media[key]) {
                            mediaView[key].call(this, media, onLoad[key].bind(this));
                            break;
                        }
                    }
                    return this;
                };
            }();

            /**
             * @method ax5mediaViewer.setMediaList
             * @param list
             * @returns {ax5mediaViewer}
             */
            this.setMediaList = function (list) {
                cfg.media.list = [].concat(list);
                this.attach(cfg.target);
                return this;
            };

            // 클래스 생성자
            this.main = function () {

                UI.mediaViewer_instance = UI.mediaViewer_instance || [];
                UI.mediaViewer_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    this.init();
                }
            }.apply(this, arguments);
        };
        return ax5mediaViewer;
    }());

    MEDIAVIEWER = ax5.ui.mediaViewer;
})();
// ax5.ui.mediaViewer.tmpl
(function () {
    var MEDIAVIEWER = ax5.ui.mediaViewer;

    var frame = function frame(columnKeys) {
        return '\n            <div data-ax5-ui-media-viewer="{{id}}" class="{{theme}}">\n                <div data-media-viewer-els="viewer-holder">\n                <div data-media-viewer-els="viewer"></div>\n                </div>\n                <div data-media-viewer-els="viewer-loading">\n                <div class="ax5-ui-media-viewer-loading-holder">\n                <div class="ax5-ui-media-viewer-loading-cell">\n                {{{loading.icon}}}\n            {{{loading.text}}}\n            </div>\n            </div>\n            </div>\n            {{#media}}\n            <div data-media-viewer-els="media-list-holder">\n                <div data-media-viewer-els="media-list-prev-handle">{{{prevHandle}}}</div>\n            <div data-media-viewer-els="media-list">\n                <div data-media-viewer-els="media-list-table">\n                {{#list}}\n            <div data-media-viewer-els="media-list-table-td">\n                {{#image}}\n            <div data-media-thumbnail="{{@i}}">\n                <img src="{{' + columnKeys.poster + '}}" data-media-thumbnail-image="{{@i}}" />\n                </div>\n                {{/image}}\n            {{#video}}\n            <div data-media-thumbnail="{{@i}}">{{#' + columnKeys.poster + '}}<img src="{{.}}" data-media-thumbnail-video="{{@i}}" />>{{/' + columnKeys.poster + '}}{{^' + columnKeys.poster + '}}<a data-media-thumbnail-video="{{@i}}">{{{media.' + columnKeys.poster + '}}}</a>{{/' + columnKeys.poster + '}}</div>\n            {{/video}}\n            </div>\n                {{/list}}\n            </div>\n                </div>\n                <div data-media-viewer-els="media-list-next-handle">{{{nextHandle}}}</div>\n                </div>\n                {{/media}}\n            </div>\n        ';
    };

    MEDIAVIEWER.tmpl = {
        "frame": frame,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(MEDIAVIEWER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.uploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "uploader",
        version: "0.0.5"
    }, function () {
        /**
         * @class ax5uploader
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myuploader = new ax5.ui.uploader();
         * ```
         */
        var ax5uploader = function ax5uploader() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                file_types: "*/*"
            };
            this.queue = [];
            this.target = null;
            this.selectedFile = null;
            this.uploadedFile = null;

            cfg = this.config;

            this.init = function () {

                this.target = $(cfg.target);
                this.target.html(this.__get_layout());

                this.els = {
                    "container": this.target.find('[data-ui-els="container"]'),
                    "preview": this.target.find('[data-ui-els="preview"]'),
                    "preview-img": this.target.find('[data-ui-els="preview-img"]'),
                    "input-file": this.target.find('[data-ui-els="input-file"]'),
                    "progress": this.target.find('[data-ui-els="progress"]'),
                    "progress-bar": this.target.find('[data-ui-els="progress-bar"]')
                };

                this.els["preview"].bind("click", function () {
                    this.__request_select_file();
                }.bind(this));

                this.els["input-file"].bind("change", function (e) {
                    this.__on_select_file(e || window.event);
                }.bind(this));

                (function () {

                    var dragZone = this.els["container"],
                        preview_img = this.els["preview-img"],
                        _this = this,
                        timer;

                    dragZone.get(0).addEventListener('dragover', function (e) {
                        e.stopPropagation();
                        e.preventDefault();

                        preview_img.hide();
                        if (timer) clearTimeout(timer);

                        dragZone.addClass("dragover");
                    }, false);
                    dragZone.get(0).addEventListener('dragleave', function (e) {
                        e.stopPropagation();
                        e.preventDefault();

                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function () {
                            preview_img.show();
                        }, 100);

                        dragZone.removeClass("dragover");
                    }, false);

                    dragZone.get(0).addEventListener('drop', function (e) {
                        e.stopPropagation();
                        e.preventDefault();

                        dragZone.removeClass("dragover");
                        _this.__on_select_file(e || window.event);
                    }, false);
                }).call(this);

                setTimeout(function () {
                    this.__set_size_layout();
                }.bind(this), 1);
            };

            this.__get_layout = function () {
                var po = [],
                    inputFileMultiple = "",
                    // inputFileMultiple = 'multiple="multiple"',  support multifile
                inputFileAccept = cfg.file_types;

                po.push('<div class="ax5-ui-single-uploader ' + cfg.theme + '" data-ui-els="container">');
                po.push('<div class="upload-preview" data-ui-els="preview">');

                po.push('<img class="upload-preview-img" data-ui-els="preview-img" src="" style="display:none;width:100%;height:100%;" />');
                po.push('<span class="empty-msg">' + cfg.empty_msg + '<span>');
                po.push('</div>');
                po.push('<div class="ax5-ui-progress ' + (cfg.progress_theme || "") + '" data-ui-els="progress" style="display: none;"><div class="progress-bar" data-ui-els="progress-bar"></div></div>');
                po.push('<input type="file" ' + inputFileMultiple + ' accept="' + inputFileAccept + '" capture="camera" data-ui-els="input-file" />');

                po.push('</div>');

                return po.join('');
            };

            this.__set_size_layout = this.align = function () {
                var progress_margin = 20,
                    progress_height = this.els["progress"].height(),
                    ct_width = this.els["container"].width(),
                    ct_height = this.els["container"].height();

                if (ct_width != 0 && ct_height != 0) {
                    this.els["progress"].css({
                        left: progress_margin,
                        top: ct_height / 2 - progress_height / 2,
                        width: ct_width - progress_margin * 2
                    });
                }
                //this.els["preview-img"].css({width: ct_width, height: ct_height});
            };

            this.__request_select_file = function () {
                if (cfg.before_select_file) {
                    if (!cfg.before_select_file.call()) {
                        return false; // 중지
                    }
                }

                if (window.imagePicker) {
                    window.imagePicker.getPictures(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            console.log('Image URI: ' + results[i]);
                        }
                        _this.__on_select_file(results);
                    }, function (error) {
                        console.log('Error: ' + error);
                    });
                } else {
                    this.els["input-file"].trigger("click");
                }
            };

            this.__on_select_file = function (evt) {
                var file,
                    target_id = this.target.id,
                    preview = this.els["preview-img"].get(0);

                if ('dataTransfer' in evt) {
                    file = evt.dataTransfer.files[0];
                } else if ('target' in evt) {
                    file = evt.target.files[0];
                } else if (evt) {
                    file = evt[0];
                }

                if (!file) return false;
                // todo : size over check

                this.selected_file = file;
                // 선택된 이미지 프리뷰 기능
                (function (root) {
                    root.els["preview-img"].css({ display: "block" });

                    function setcss_preview(img, box_width, box_height) {
                        var css = {};

                        var image = new Image();
                        image.src = img.src;
                        image.onload = function () {
                            // access image size here
                            //console.log(this.width, this.height);
                            if (this.width > this.height) {
                                // 가로형
                                if (this.height > box_height) {
                                    css = {
                                        width: this.width * (box_height / this.height), height: box_height
                                    };
                                    css.left = (box_width - css.width) / 2;
                                } else {
                                    css = {
                                        width: this.width, height: this.height
                                    };
                                    css.top = (box_height - css.height) / 2;
                                }
                            } else {
                                // 세로형
                                if (this.width > box_width) {
                                    css = {
                                        height: this.height * (box_width / this.width), width: box_width
                                    };
                                    css.top = (box_height - css.height) / 2;
                                } else {
                                    css = {
                                        width: this.width, height: this.height
                                    };
                                    css.left = (box_width - css.width) / 2;
                                }
                            }
                            console.log(css);
                            root.els["preview-img"].css(css);
                        };
                    }

                    if (window.imagePicker) {
                        preview.src = file;
                        setcss_preview(preview, root.els["container"].width(), root.els["container"].height());
                    } else {
                        var reader = new FileReader(target_id);
                        reader.onloadend = function () {
                            try {
                                preview.src = reader.result;
                                setcss_preview(preview, root.els["container"].width(), root.els["container"].height());
                            } catch (ex) {
                                console.log(ex);
                            }
                        };
                        if (file) {
                            reader.readAsDataURL(file);
                        }
                    }
                })(this);

                if (cfg.on_event) {
                    var that = {
                        action: "fileselect",
                        file: file
                    };
                    cfg.on_event.call(that, that);
                }

                /// 파일 선택하면 업로드
                // if(file) this.upload(file);
            };

            this.upload = function () {
                var _this = this;
                if (!this.selected_file) {
                    if (cfg.on_event) {
                        var that = {
                            action: "error",
                            error: ax5.info.get_error("single-uploader", "460", "upload")
                        };
                        cfg.on_event.call(that, that);
                    }
                    return this;
                }

                var formData = new FormData(),
                    progress_bar = this.els["progress-bar"];

                this.els["progress"].css({ display: "block" });
                progress_bar.css({ width: '0%' });

                if (window.imagePicker) {
                    formData.append(cfg.upload_http.filename_param_key, this.selected_file);
                    // 다른 처리 방법 적용 필요
                } else {
                    formData.append(cfg.upload_http.filename_param_key, this.selected_file);
                }

                for (var k in cfg.upload_http.data) {
                    formData.append(k, cfg.upload_http.data[k]);
                }

                this.xhr = new XMLHttpRequest();
                this.xhr.open(cfg.upload_http.method, cfg.upload_http.url, true);
                this.xhr.onload = function (e) {
                    var res = e.target.response;
                    try {
                        if (typeof res == "string") res = U.parseJson(res);
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                    if (res.error) {
                        console.log(res.error);
                        return false;
                    }
                    _this.upload_complete(res);
                };
                this.xhr.upload.onprogress = function (e) {
                    progress_bar.css({ width: U.number(e.loaded / e.total * 100, { round: 2 }) + '%' });
                    if (e.lengthComputable) {
                        if (e.loaded >= e.total) {
                            //_this.upload_complete();
                            setTimeout(function () {
                                _this.els["progress"].css({ display: "none" });
                            }, 300);
                        }
                    }
                };
                this.xhr.send(formData); // multipart/form-data
            };

            this.upload_complete = function (res) {
                this.selected_file = null;
                this.uploaded_file = res;
                this.els["container"].addClass("uploaded");

                if (cfg.on_event) {
                    var that = {
                        action: "uploaded",
                        file: res
                    };
                    cfg.on_event.call(that, that);
                }
            };

            this.set_uploaded_file = function (file) {
                this.uploaded_file = file;
                if (this.uploaded_file) {
                    this.els["container"].addClass("uploaded");
                } else {
                    this.els["container"].removeClass("uploaded");
                }
            };

            this.set_preview_img = function (src) {
                if (src) {
                    this.els["preview-img"].attr({ "src": src }).show();
                } else {
                    this.els["preview-img"].attr({ "src": null }).hide();
                }
            };

            // 클래스 생성자
            this.main = function () {

                UI.uploader_instance = UI.uploader_instance || [];
                UI.uploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    //this.init();
                }
            }.apply(this, arguments);
        };
        return ax5uploader;
    }());
})();

// ax5.ui.combobox
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var COMBOBOX;

    UI.addClass({
        className: "combobox",
        version: "0.3.9"
    }, function () {
        /**
         * @class ax5combobox
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var mycombobox = new ax5.ui.combobox();
         * ```
         */
        var ax5combobox = function ax5combobox() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                removeIcon: 'X',
                lang: {
                    noSelected: '',
                    noOptions: 'no options',
                    loading: 'now loading..'
                },
                columnKeys: {
                    optionValue: 'value',
                    optionText: 'text',
                    optionSelected: 'selected'
                }
            };

            this.queue = [];
            this.activecomboboxOptionGroup = null;
            this.activecomboboxQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;
            this.waitOptionsCallback = null;
            this.keyUpTimer = null;

            cfg = this.config;

            var ctrlKeys = {
                "18": "KEY_ALT",
                "8": "KEY_BACKSPACE",
                "17": "KEY_CONTROL",
                "46": "KEY_DELETE",
                "40": "KEY_DOWN",
                "35": "KEY_END",
                "187": "KEY_EQUAL",
                "27": "KEY_ESC",
                "36": "KEY_HOME",
                "45": "KEY_INSERT",
                "37": "KEY_LEFT",
                "189": "KEY_MINUS",
                "34": "KEY_PAGEDOWN",
                "33": "KEY_PAGEUP",
                // "190": "KEY_PERIOD",
                "13": "KEY_RETURN",
                "39": "KEY_RIGHT",
                "16": "KEY_SHIFT",
                // "32": "KEY_SPACE",
                "9": "KEY_TAB",
                "38": "KEY_UP",
                "91": "KEY_WINDOW"
                //"107" : "NUMPAD_ADD",
                //"194" : "NUMPAD_COMMA",
                //"110" : "NUMPAD_DECIMAL",
                //"111" : "NUMPAD_DIVIDE",
                //"12" : "NUMPAD_EQUAL",
                //"106" : "NUMPAD_MULTIPLY",
                //"109" : "NUMPAD_SUBTRACT"
            },
                onStateChanged = function onStateChanged(item, that) {
                if (item && item.onStateChanged) {
                    item.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                if (that.state == "changeValue") {
                    if (item && item.onChange) {
                        item.onChange.call(that, that);
                    } else if (this.onChange) {
                        this.onChange.call(that, that);
                    }
                }

                item = null;
                that = null;
                return true;
            },
                alignComboboxDisplay = function alignComboboxDisplay() {
                var i = this.queue.length,
                    w;

                while (i--) {
                    var item = this.queue[i];
                    if (item.$display) {
                        w = Math.max(item.$select.outerWidth(), U.number(item.minWidth));
                        item.$display.css({
                            "min-width": w
                        });
                        if (item.reset) {
                            item.$display.find(".addon-icon-reset").css({
                                "line-height": this.queue[i].$display.height() + "px"
                            });
                        }

                        // 높이조절 처리
                        if (item.multiple) {
                            var displayTableHeightAdjust = function () {
                                return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                            }.call(this);
                            item.$target.height('');
                            item.$display.height('');

                            var displayTableHeight = item.$displayTable.outerHeight();
                            if (Math.abs(displayTableHeight - item.$target.height()) > displayTableHeightAdjust) {
                                item.$target.css({ height: displayTableHeight + displayTableHeightAdjust });
                                item.$display.css({ height: displayTableHeight + displayTableHeightAdjust });
                            }
                        }
                    }
                }

                i = null;
                w = null;
                return this;
            },
                alignComboboxOptionGroup = function alignComboboxOptionGroup(append) {
                if (!this.activecomboboxOptionGroup) return this;

                var item = this.queue[this.activecomboboxQueueIndex],
                    pos = {},
                    dim = {};

                if (append) jQuery(document.body).append(this.activecomboboxOptionGroup);

                pos = item.$target.offset();
                dim = {
                    width: item.$target.outerWidth(),
                    height: item.$target.outerHeight()
                };

                // picker css(width, left, top) & direction 결정
                if (!item.direction || item.direction === "" || item.direction === "auto") {
                    // set direction
                    item.direction = "top";
                }

                if (append) {
                    this.activecomboboxOptionGroup.addClass("direction-" + item.direction);
                }
                this.activecomboboxOptionGroup.css(function () {
                    if (item.direction == "top") {
                        return {
                            left: pos.left,
                            top: pos.top + dim.height + 1,
                            width: dim.width
                        };
                    } else if (item.direction == "bottom") {
                        return {
                            left: pos.left,
                            top: pos.top - this.activecomboboxOptionGroup.outerHeight() - 1,
                            width: dim.width
                        };
                    }
                }.call(this));
            },
                onBodyClick = function onBodyClick(e, target) {
                if (!this.activecomboboxOptionGroup) return this;

                var item = this.queue[this.activecomboboxQueueIndex],
                    clickEl = "display";

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-option-value")) {
                        clickEl = "optionItem";
                        return true;
                    } else if (item.$target.get(0) == target) {
                        clickEl = "display";
                        return true;
                    }
                });

                if (!target) {
                    this.close();
                    return this;
                } else if (clickEl === "optionItem") {
                    setOptionSelect.call(this, item.id, {
                        index: {
                            gindex: target.getAttribute("data-option-group-index"),
                            index: target.getAttribute("data-option-index")
                        }
                    }, undefined, true);
                    U.selectRange(item.$displayLabel, "end"); // 포커스 end || selectAll
                    if (!item.multiple) {
                        this.close();
                    }
                } else {
                    //open and display click
                    //console.log(this.instanceId);
                }

                return this;
            },
                onBodyKeyup = function onBodyKeyup(e) {
                // 옵션 선택 후 키업
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    blurLabel.call(this, this.activecomboboxQueueIndex);
                    this.close();
                } else if (e.which == ax5.info.eventKeys.RETURN) {
                    var values = [];
                    var item = this.queue[this.activecomboboxQueueIndex];
                    var childNodes = item.$displayLabel.get(0).childNodes;
                    for (var i = 0, l = childNodes.length; i < l; i++) {
                        var node = childNodes[i];
                        // nodeType:1 - span, nodeType:3 - text
                        if (node.nodeType in COMBOBOX.util.nodeTypeProcessor) {
                            var value = COMBOBOX.util.nodeTypeProcessor[node.nodeType].call(this, this.activecomboboxQueueIndex, node);
                            if (typeof value !== "undefined") values.push(value);
                        }
                    }

                    setOptionSelect.call(this, item.id, values, true, true); // set Value
                    focusLabel.call(this, this.activecomboboxQueueIndex);
                    if (!item.multiple) this.close();
                }
            },
                getLabel = function getLabel(queIdx) {
                var item = this.queue[queIdx];

                // 템플릿에 전달 해야할 데이터 선언
                var data = {};
                data.id = item.id;
                data.theme = item.theme;
                data.size = "ax5combobox-option-group-" + item.size;
                data.multiple = item.multiple;
                data.lang = item.lang;
                data.options = item.options;
                data.selected = item.selected;
                data.hasSelected = data.selected && data.selected.length > 0;
                data.removeIcon = item.removeIcon;

                try {
                    //return ax5.mustache.render(COMBOBOX.tmpl["label"].call(this, item.columnKeys), data) + "&nbsp;";
                    return COMBOBOX.tmpl.get.call(this, "label", data, item.columnKeys);
                } finally {
                    data = null;
                }
            },
                syncLabel = function syncLabel(queIdx) {
                var item = this.queue[queIdx],
                    displayTableHeight;
                item.$displayLabel.html(getLabel.call(this, queIdx));
                item.$target.height('');
                item.$display.height('');

                // label 사이즈 체크
                // console.log(item.$target.height(), item.$displayTable.outerHeight());
                if (item.$target.height() < (displayTableHeight = item.$displayTable.outerHeight())) {
                    var displayTableHeightAdjust = function () {
                        return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                    }();
                    item.$target.css({ height: displayTableHeight + displayTableHeightAdjust });
                    item.$display.css({ height: displayTableHeight + displayTableHeightAdjust });
                }
            },
                focusLabel = function focusLabel(queIdx) {
                this.queue[queIdx].$displayLabel.trigger("focus");
                U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
            },
                blurLabel = function blurLabel(queIdx) {
                this.queue[queIdx].$displayLabel.trigger("blur");
            },
                onSearch = function onSearch(queIdx, searchWord) {
                this.queue[queIdx].waitOptions = true;
                /*
                this.activecomboboxOptionGroup.find('[data-els="content"]').html(
                    jQuery(ax5.mustache.render(COMBOBOX.tmpl.options.call(this, this.queue[queIdx].columnKeys), this.queue[queIdx]))
                );
                 */
                this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "option", this.queue[queIdx], this.queue[queIdx].columnKeys)));

                this.queue[queIdx].onSearch.call({
                    self: this,
                    item: this.queue[queIdx],
                    searchWord: searchWord
                }, function (O) {

                    var data = {};
                    var item = this.queue[this.activecomboboxQueueIndex];
                    if (!item) return false;

                    /// 현재 selected 검증후 처리
                    (function (item, O) {
                        var optionsMap = {};
                        O.options.forEach(function (_O, _OIndex) {
                            _O["@index"] = _OIndex;
                            optionsMap[_O[item.columnKeys.optionValue]] = _O;
                        });
                        if (U.isArray(item.selected)) {
                            item.selected.forEach(function (_O) {
                                if (optionsMap[_O[item.columnKeys.optionValue]]) {
                                    O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected] = true;
                                }
                            });
                        }
                    })(item, O);

                    item.options = syncComboboxOptions.call(this, this.activecomboboxQueueIndex, O.options);

                    alignComboboxDisplay.call(this);

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5combobox-option-group-" + item.size;
                    data.multiple = item.multiple;
                    data.lang = item.lang;
                    data.options = item.options;
                    /*
                    this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(
                        ax5.mustache.render(COMBOBOX.tmpl.options.call(this, item.columnKeys), data))
                    );
                    */
                    this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "options", data, item.columnKeys)));
                }.bind(this));
            },
                focusWord = function focusWord(queIdx, searchWord) {
                //console.log(searchWord);

                if (this.activecomboboxQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.
                var options = [],
                    i = -1,
                    l = this.queue[queIdx].indexedOptions.length - 1,
                    n;

                if (searchWord != "") {
                    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                    searchWord = searchWord.replace(regExp, "");
                    if (this.queue[queIdx].onSearch) {
                        onSearch.call(this, queIdx, searchWord);

                        try {
                            return options;
                        } finally {
                            options = null;
                            i = null;
                            l = null;
                            n = null;
                        }
                        // if there is a "onSearch", to end this process
                    }

                    while (l - i++) {
                        n = this.queue[queIdx].indexedOptions[i];

                        if (('' + n.text).toLowerCase() == searchWord.toLowerCase()) {
                            options = [{ '@findex': n['@findex'], optionsSort: 0 }];
                            break;
                        } else {
                            var sort = ('' + n.text).toLowerCase().search(searchWord.toLowerCase());
                            if (sort > -1) {
                                options.push({ '@findex': n['@findex'], optionsSort: sort });
                                if (options.length > 2) break;
                            }
                            sort = null;
                        }
                    }
                    options.sort(function (a, b) {
                        return a.optionsSort - b.optionsSort;
                    });
                }

                if (options && options.length > 0) {
                    focusMove.call(this, queIdx, undefined, options[0]['@findex']);
                } else {
                    focusClear.call(this, queIdx);
                }

                try {
                    return options;
                } finally {
                    options = null;
                    i = null;
                    l = null;
                    n = null;
                }
            },
                focusClear = function focusClear(queIdx) {
                if (this.activecomboboxOptionGroup) {
                    this.activecomboboxOptionGroup.find('[data-option-focus-index]').removeClass("hover").removeAttr("data-option-selected");
                }

                this.queue[queIdx].optionFocusIndex = -1;
            },
                focusMove = function focusMove(queIdx, direction, findex) {
                var _focusIndex, _prevFocusIndex, focusOptionEl, optionGroupScrollContainer;
                var item = this.queue[queIdx];

                if (this.activecomboboxOptionGroup && item.options && item.options.length > 0) {

                    if (typeof findex !== "undefined") {
                        _focusIndex = findex;
                    } else {
                        _prevFocusIndex = item.optionFocusIndex == -1 ? item.optionSelectedIndex || -1 : item.optionFocusIndex;
                        if (_prevFocusIndex == -1) {
                            _focusIndex = 0;
                            //_focusIndex = (direction > 0) ? 0 : item.optionItemLength - 1; // 맨 끝으로 보낼것인가 말 것인가.
                        } else {
                            _focusIndex = _prevFocusIndex + direction;
                            if (_focusIndex < 0) _focusIndex = 0;else if (_focusIndex > item.optionItemLength - 1) _focusIndex = item.optionItemLength - 1;
                        }
                    }

                    item.optionFocusIndex = _focusIndex;

                    // 포커스 인덱스가 hide아이템을 만나면 hide 아이템이 안나올 때까지 루프를 순회 합니다.
                    // todo : editable 로 추가된 options가 제거 되지 않으므로. 인덱스 검색을 좀 더 보강 해야함.
                    if (item.options[_focusIndex] && item.options[_focusIndex].hide) {
                        // 옵션이 없는 값이 선택된 경우
                        if (typeof direction === "undefined") {
                            return this;
                        } else {
                            var isStrop = false;
                            while (item.options[_focusIndex].hide) {
                                _focusIndex = _focusIndex + direction;
                                if (_focusIndex < 0) {
                                    _focusIndex = 0;
                                    break;
                                } else if (_focusIndex > item.optionItemLength - 1) {
                                    _focusIndex = item.optionItemLength - 1;
                                    break;
                                }
                            }
                        }
                    }

                    if (typeof _focusIndex !== "undefined") {
                        this.activecomboboxOptionGroup.find('[data-option-focus-index]').removeClass("hover");

                        focusOptionEl = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + _focusIndex + '"]').addClass("hover");

                        optionGroupScrollContainer = this.activecomboboxOptionGroup.find('[data-els="content"]');

                        if (focusOptionEl.get(0)) {
                            var focusOptionElHeight = focusOptionEl.outerHeight(),
                                optionGroupScrollContainerHeight = optionGroupScrollContainer.innerHeight(),
                                optionGroupScrollContainerScrollTop = optionGroupScrollContainer.scrollTop(),
                                focusOptionElTop = focusOptionEl.position().top + optionGroupScrollContainer.scrollTop();

                            if (optionGroupScrollContainerHeight + optionGroupScrollContainerScrollTop < focusOptionElTop + focusOptionElHeight) {
                                optionGroupScrollContainer.scrollTop(focusOptionElTop + focusOptionElHeight - optionGroupScrollContainerHeight);
                            } else if (optionGroupScrollContainerScrollTop > focusOptionElTop) {
                                optionGroupScrollContainer.scrollTop(focusOptionElTop);
                            }
                            // optionGroup scroll check

                            if (typeof direction !== "undefined") {
                                // 방향이 있으면 커서 업/다운 아니면 사용자 키보드 입력
                                // 방향이 있으면 라벨 값을 수정

                                var childNodes = item.$displayLabel.get(0).childNodes;
                                var lastNode = childNodes[childNodes.length - 1];
                                if (lastNode && lastNode.nodeType == '3') {
                                    lastNode.nodeValue = item.indexedOptions[_focusIndex].text;
                                    U.selectRange(item.$displayLabel, "end");
                                } else if (lastNode && lastNode.nodeType == '1') {
                                    jQuery(lastNode).after(item.indexedOptions[_focusIndex].text);
                                    U.selectRange(item.$displayLabel, "end");
                                }
                            }
                        }
                    }
                }
            },
                syncComboboxOptions = function () {
                var setSelected = function setSelected(queIdx, O) {
                    if (!O) {
                        this.queue[queIdx].selected = [];
                    } else {
                        this.queue[queIdx].selected.push(jQuery.extend({}, O));
                        /*
                         콤보박스는 selected가 없을 때 options의 첫번째 아이템이 selected가 되지 않는다.
                         if (this.queue[queIdx].multiple) this.queue[queIdx].selected.push(jQuery.extend({}, O));
                         else this.queue[queIdx].selected[0] = jQuery.extend({}, O);
                         */
                    }
                };

                return function (queIdx, options) {
                    var item = this.queue[queIdx];
                    var po,
                        elementOptions,
                        newOptions,
                        focusIndex = 0;
                    setSelected.call(this, queIdx, false); // item.selected 초기화

                    if (options) {
                        item.options = options;
                        item.indexedOptions = [];

                        // combobox options 태그 생성
                        po = [];
                        po.push('<option value=""></option>');

                        item.options.forEach(function (O, OIndex) {
                            /// @gindex : index of optionGroup
                            /// @index : index of options (if you use optionGroup then the index is not unique)
                            if (O.optgroup) {
                                O['@gindex'] = OIndex;
                                O.options.forEach(function (OO, OOIndex) {
                                    OO['@index'] = OOIndex;
                                    OO['@findex'] = focusIndex;
                                    po.push('<option value="' + OO[item.columnKeys.optionValue] + '" ' + (OO[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + OO[item.columnKeys.optionText] + '</option>');
                                    if (OO[item.columnKeys.optionSelected]) {
                                        setSelected.call(self, queIdx, OO);
                                    }

                                    item.indexedOptions.push({
                                        '@gindex': OIndex,
                                        '@index': OOIndex,
                                        '@findex': focusIndex,
                                        value: OO[item.columnKeys.optionValue],
                                        text: OO[item.columnKeys.optionText]
                                    });
                                    focusIndex++;
                                });
                            } else {
                                O['@index'] = OIndex;
                                O['@findex'] = focusIndex;
                                po.push('<option value="' + O[item.columnKeys.optionValue] + '" ' + (O[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + O[item.columnKeys.optionText] + '</option>');
                                if (O[item.columnKeys.optionSelected]) {
                                    setSelected.call(self, queIdx, O);
                                }

                                item.indexedOptions.push({
                                    '@index': OIndex,
                                    '@findex': focusIndex,
                                    value: O[item.columnKeys.optionValue],
                                    text: O[item.columnKeys.optionText]
                                });
                                focusIndex++;
                            }
                        });
                        item.optionItemLength = focusIndex;
                        item.$select.html(po.join(''));
                    } else {
                        /// select > options 태그로 스크립트 options를 만들어주는 역할
                        if (item.$select.get(0).options && item.$select.get(0).options.length) item.$select.get(0).options[0].selected = false;
                        elementOptions = U.toArray(item.$select.get(0).options);

                        // select option 스크립트 생성
                        newOptions = [];
                        elementOptions.forEach(function (O, OIndex) {
                            var option = {};
                            option[item.columnKeys.optionValue] = O.value;
                            option[item.columnKeys.optionText] = O.text;
                            option[item.columnKeys.optionSelected] = O.selected;
                            option['@index'] = OIndex;
                            option['@findex'] = focusIndex;
                            if (O.selected) setSelected.call(self, queIdx, option);
                            newOptions.push(option);
                            focusIndex++;

                            option = null;
                        });
                        item.options = newOptions;
                        item.indexedOptions = newOptions;

                        item.$select.prepend('<option value=""></option>');
                        item.$select.get(0).options[0].selected = true;
                    }

                    po = null;
                    elementOptions = null;
                    newOptions = null;
                    return item.options;
                };
            }(),
                getQueIdx = function getQueIdx(boundID) {
                if (boundID instanceof jQuery) {
                    boundID = boundID.data("data-ax5combobox-id");
                } else if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-ax5combobox-id");
                }
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5combobox", "402", "getQueIdx"));
                    return;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            },
                getSelected = function getSelected(_item, o, selected) {
                if (typeof selected === "undefined") {
                    return _item.multiple ? !o : true;
                } else {
                    return selected;
                }
            },
                clearSelected = function clearSelected(queIdx) {
                this.queue[queIdx].options.forEach(function (n) {
                    if (n.optgroup) {
                        n.options.forEach(function (nn) {
                            nn.selected = false;
                        });
                    } else {
                        n.selected = false;
                    }
                });
            },
                setOptionSelect = function () {
                var processor = {
                    'index': function index(queIdx, value, selected, setValueType) {
                        // 클래스 내부에서 호출된 형태, 그런 이유로 옵션그룹에 대한 상태를 변경 하고 있다.
                        var item = this.queue[queIdx];

                        if (U.isString(value.index.gindex)) {
                            if (typeof item.options[value.index.gindex] !== "undefined") {

                                item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected], selected);

                                if (self.activecomboboxOptionGroup) {
                                    self.activecomboboxOptionGroup.find('[data-option-group-index="' + value.index.gindex + '"][data-option-index="' + value.index.index + '"]').attr("data-option-Selected", item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected].toString());
                                }
                            }
                        } else {
                            if (typeof item.options[value.index.index] !== "undefined") {

                                item.options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.index][item.columnKeys.optionSelected], selected);

                                if (self.activecomboboxOptionGroup) {
                                    self.activecomboboxOptionGroup.find('[data-option-index="' + value.index.index + '"]').attr("data-option-Selected", item.options[value.index.index][item.columnKeys.optionSelected].toString());
                                }
                            }
                        }

                        if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                            syncComboboxOptions.call(this, queIdx, item.options);
                            syncLabel.call(this, queIdx);
                            alignComboboxOptionGroup.call(this);
                        }
                    },
                    'arr': function arr(queIdx, values, selected, setValueType) {
                        values.forEach(function (value) {
                            if (U.isString(value) || U.isNumber(value)) {
                                processor.text.call(self, queIdx, value, selected, "justSetValue");
                            } else {
                                for (var key in processor) {
                                    if (value[key]) {
                                        processor[key].call(self, queIdx, value, selected, "justSetValue");
                                        break;
                                    }
                                }
                            }
                        });

                        syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                        syncLabel.call(this, queIdx);
                        alignComboboxOptionGroup.call(this);
                    },
                    'value': function value(queIdx, _value3, selected, setValueType) {
                        var item = this.queue[queIdx];
                        var addOptions;
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionValue] == _value3[item.columnKeys.optionValue];
                        });

                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            // 새로운 값 추가
                            optionIndex = item.options.length;
                            addOptions = {
                                "@index": optionIndex,
                                hide: true,
                                addedOption: true
                            };
                            addOptions[item.columnKeys.optionValue] = _value3;
                            addOptions[item.columnKeys.optionText] = _value3;
                            item.options.push(addOptions);
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        }
                        if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                            syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                            syncLabel.call(this, queIdx);
                            alignComboboxOptionGroup.call(this);
                        }
                    },
                    'text': function text(queIdx, value, selected, setValueType) {
                        var item = this.queue[queIdx];
                        var addOptions;
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionText] == value;
                        });

                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            // 새로운 값 추가
                            optionIndex = item.options.length;
                            addOptions = {
                                "@index": optionIndex,
                                hide: true,
                                addedOption: true
                            };
                            addOptions[item.columnKeys.optionValue] = value;
                            addOptions[item.columnKeys.optionText] = value;
                            item.options.push(addOptions);
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        }
                        if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                            syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                            syncLabel.call(this, queIdx);
                            alignComboboxOptionGroup.call(this);
                        }
                    },
                    'clear': function clear(queIdx) {
                        clearSelected.call(this, queIdx);
                        syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                        //focusLabel.call(this, queIdx);
                        focusClear.call(this, queIdx);

                        if (this.activecomboboxOptionGroup) {
                            this.activecomboboxOptionGroup.find('[data-option-index]').attr("data-option-Selected", "false");
                        }
                        this.queue[queIdx].optionSelectedIndex = -1;
                    }
                };
                return function (boundID, value, selected, _option) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5combobox", "402", "val"));
                        return;
                    }

                    if (typeof value == "undefined") {
                        throw "error not found value";
                    } else if (U.isArray(value)) {
                        processor.clear.call(this, queIdx);
                        processor.arr.call(this, queIdx, this.queue[queIdx].multiple || value.length == 0 ? value : [value[value.length - 1]], selected);
                    } else if (U.isString(value) || U.isNumber(value)) {
                        if (typeof value !== "undefined" && value !== null && !this.queue[queIdx].multiple) {
                            clearSelected.call(this, queIdx);
                        }
                        processor.text.call(this, queIdx, value, selected, "justSetValue");
                        syncLabel.call(this, queIdx);
                    } else {
                        if (value === null) {
                            processor.clear.call(this, queIdx);
                            syncLabel.call(this, queIdx);
                        } else {
                            if (!this.queue[queIdx].multiple) {
                                clearSelected.call(this, queIdx);
                            }
                            for (var key in processor) {
                                if (value[key]) {
                                    processor[key].call(this, queIdx, value, selected, "justSetValue");
                                    break;
                                }
                            }

                            syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                            syncLabel.call(this, queIdx);
                            alignComboboxOptionGroup.call(this);
                        }
                    }

                    if (typeof value !== "undefined") {
                        if (_option && !_option.noStateChange) {
                            onStateChanged.call(this, this.queue[queIdx], {
                                self: this,
                                item: this.queue[queIdx],
                                state: "changeValue",
                                value: this.queue[queIdx].selected
                            });
                        }
                    }

                    boundID = null;
                    return this;
                };
            }();

            /// private end

            /**
             * Preferences of combobox UI
             * @method ax5combobox.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5combobox}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onChange = cfg.onChange;
                jQuery(window).bind("resize.ax5combobox-display-" + this.instanceId, function () {
                    alignComboboxDisplay.call(this);
                }.bind(this));
            };

            /**
             * bind combobox
             * @method ax5combobox.bind
             * @param {Object} item
             * @param {String} [item.id]
             * @param {String} [item.theme]
             * @param {Boolean} [item.multiple]
             * @param {Element} item.target
             * @param {Object[]} item.options
             * @returns {ax5combobox}
             */
            this.bind = function (item) {
                var bindComboboxTarget = function () {
                    var debouncedFocusWord = U.debounce(function (queIdx) {
                        if (this.activecomboboxQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.

                        var values = [];
                        var searchWord = "";
                        var item = this.queue[queIdx];
                        var childNodes = item.$displayLabel.get(0).childNodes;

                        for (var i = 0, l = childNodes.length; i < l; i++) {
                            var node = childNodes[i];

                            if (node.nodeType in COMBOBOX.util.nodeTypeProcessor) {
                                var value = COMBOBOX.util.nodeTypeProcessor[node.nodeType].call(this, this.activecomboboxQueueIndex, node, true);
                                if (typeof value === "undefined") {
                                    //
                                } else if (U.isString(value)) {
                                    searchWord = value;
                                    if (node.nodeType == '1' && node.getAttribute("data-ax5combobox-selected-text")) {
                                        // 노드 타입인데 문자열이 리턴 되었다면 선택을 취소해야함.
                                        searchWord = false; // 검색을 수행하지 않고 값을 변경하자.
                                    } else {
                                        values.push(value);
                                    }
                                } else {
                                    values.push(value);
                                }
                            }
                        }

                        if (childNodes.length == 0) {
                            setOptionSelect.call(this, item.id, null, undefined, "internal"); // clear value
                        } else if (searchWord === false) {
                            setOptionSelect.call(this, item.id, null, undefined, "internal"); // clear value
                            setOptionSelect.call(this, item.id, values, undefined, "internal"); // set Value
                            U.selectRange(item.$displayLabel, "end"); // label focus end
                        } else if (searchWord != "") {
                            focusWord.call(self, queIdx, searchWord);
                        }
                    }, 150);

                    var blurLabel = function blurLabel(queIdx) {
                        var values = [];
                        var item = this.queue[queIdx];
                        var editingText;
                        var childNodes = item.$displayLabel.get(0).childNodes;

                        for (var i = 0, l = childNodes.length; i < l; i++) {
                            var node = childNodes[i];
                            if (node.nodeType == 1) {
                                if (node.nodeType in COMBOBOX.util.nodeTypeProcessor) {

                                    var value = COMBOBOX.util.nodeTypeProcessor[node.nodeType].call(this, queIdx, node, false);
                                    if (typeof value === "undefined") {
                                        //
                                    } else if (U.isString(value)) {
                                        //editingText = value;
                                        //values.push(value);
                                    } else {
                                        values.push(value);
                                    }
                                }
                            }
                        }

                        setOptionSelect.call(this, item.id, values, undefined, false); // set Value
                        //if(item.selected.length != values.length){}
                    };

                    var comboboxEvent = {
                        'click': function click(queIdx, e) {
                            var clickEl;
                            var target = U.findParentNode(e.target, function (target) {
                                if (target.getAttribute("data-ax5combobox-remove")) {
                                    clickEl = "optionItemRemove";
                                    return true;
                                } else if (target.getAttribute("data-selected-clear")) {
                                    clickEl = "clear";
                                    return true;
                                }
                            });

                            if (target) {
                                if (clickEl === "optionItemRemove") {
                                    var selectedIndex = target.getAttribute("data-ax5combobox-remove-index");
                                    var option = this.queue[queIdx].selected[selectedIndex];
                                    setOptionSelect.call(this, queIdx, { index: { gindex: option['@gindex'], index: option['@index'] } }, false, true);
                                    focusLabel.call(this, queIdx);
                                    U.stopEvent(e);
                                    return this;
                                } else if (clickEl === "clear") {
                                    setOptionSelect.call(this, queIdx, { clear: true });
                                }
                            } else {
                                if (self.activecomboboxQueueIndex == queIdx) {
                                    if (this.queue[queIdx].optionFocusIndex == -1) {
                                        // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                                        self.close();
                                    }
                                } else {
                                    self.open(queIdx);

                                    if (this.queue[queIdx].$displayLabel.text().replace(/^\W*|\W*$/g, '') == "") {
                                        this.queue[queIdx].$displayLabel.html(getLabel.call(this, queIdx));
                                        focusLabel.call(this, queIdx);
                                    }
                                }
                            }
                        },
                        'keyUp': function keyUp(queIdx, e) {
                            /// 약속된 키 이벤트가 발생하면 stopEvent를 통해 keyUp 이벤트가 발생되지 않도록 막아주는 센스
                            if (e.which == ax5.info.eventKeys.ESC && self.activecomboboxQueueIndex === -1) {
                                // ESC키를 누르고 옵션그룹이 열려있지 않은 경우
                                U.stopEvent(e);
                                return this;
                            }
                            if (self.activecomboboxQueueIndex != queIdx) {
                                // 닫힌 상태 인경우
                                self.open(queIdx);
                                U.stopEvent(e);
                            }

                            var disableCtrlKeys = {
                                "40": "KEY_DOWN",
                                "38": "KEY_UP"
                            };
                            if (!disableCtrlKeys[e.which]) {
                                debouncedFocusWord.call(this, queIdx);
                            }
                        },
                        'keyDown': function keyDown(queIdx, e) {
                            if (e.which == ax5.info.eventKeys.ESC) {
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.RETURN) {
                                // display label에서 줄넘김막기위한 구문
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.DOWN) {
                                focusMove.call(this, queIdx, 1);
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.UP) {
                                focusMove.call(this, queIdx, -1);
                                U.stopEvent(e);
                            }
                        },
                        'focus': function focus(queIdx, e) {
                            //console.log(e);
                        },
                        'blur': function blur(queIdx, e) {
                            blurLabel.call(this, queIdx);
                            U.stopEvent(e);
                        },
                        'selectChange': function selectChange(queIdx, e) {
                            setOptionSelect.call(this, queIdx, { value: this.queue[queIdx].$select.val() }, true);
                        }
                    };

                    return function (queIdx) {
                        var item = this.queue[queIdx];
                        var data = {};
                        // 현재 선택된 값을 담아두는 저장소, syncComboboxOptions를 통해 options와 selected값을 동기화 처리 한다.
                        item.selected = [];

                        if (!item.$display) {
                            /// 템플릿에 전달할 오브젝트 선언
                            data.instanceId = this.instanceId;
                            data.id = item.id;
                            data.name = item.name;
                            data.theme = item.theme;
                            data.tabIndex = item.tabIndex;
                            data.multiple = item.multiple;
                            data.reset = item.reset;

                            data.label = getLabel.call(this, queIdx);
                            data.formSize = function () {
                                return item.size ? "input-" + item.size : "";
                            }();

                            //item.$display = jQuery(ax5.mustache.render(COMBOBOX.tmpl["comboboxDisplay"].call(this, queIdx), data));
                            item.$display = jQuery(COMBOBOX.tmpl.get.call(this, "comboboxDisplay", data, item.columnKeys));
                            item.$displayTable = item.$display.find('[data-els="display-table"]');
                            item.$displayLabel = item.$display.find('[data-ax5combobox-display="label"]');

                            if (item.$target.find("select").get(0)) {
                                item.$select = item.$target.find("select");
                                item.$select.attr("tabindex", "-1").attr("class", "form-control " + data.formSize);
                                if (data.name) {
                                    item.$select.attr("name", "name");
                                }
                                if (data.multiple) {
                                    item.$select.attr("multiple", "multiple");
                                }
                            } else {
                                //item.$select = jQuery(ax5.mustache.render(COMBOBOX.tmpl["formSelect"].call(this, queIdx), data));
                                item.$select = jQuery(COMBOBOX.tmpl.get.call(this, "formSelect", data, item.columnKeys));
                                item.$target.append(item.$select);
                            }

                            item.$target.append(item.$display);
                            // 라벨에 사용자 입력 필드가 있으므로 displayInput은 필요 없음.
                            // select.options로 item.options를 만들어내거나 item.options로 select.options를 만들어냄
                            item.options = syncComboboxOptions.call(this, queIdx, item.options);

                            alignComboboxDisplay.call(this);
                        } else {
                            item.$displayLabel.html(getLabel.call(this, queIdx));
                            item.options = syncComboboxOptions.call(this, queIdx, item.options);

                            alignComboboxDisplay.call(this);
                        }

                        item.$display.unbind('click.ax5combobox').bind('click.ax5combobox', comboboxEvent.click.bind(this, queIdx));

                        // combobox 태그에 대한 이벤트 감시


                        item.$displayLabel.unbind("focus.ax5combobox").bind("focus.ax5combobox", comboboxEvent.focus.bind(this, queIdx)).unbind("blur.ax5combobox").bind("blur.ax5combobox", comboboxEvent.blur.bind(this, queIdx)).unbind('keyup.ax5combobox').bind('keyup.ax5combobox', comboboxEvent.keyUp.bind(this, queIdx)).unbind("keydown.ax5combobox").bind("keydown.ax5combobox", comboboxEvent.keyDown.bind(this, queIdx));

                        // select 태그에 대한 change 이벤트 감시

                        item.$select.unbind('change.ax5combobox').bind('change.ax5combobox', comboboxEvent.selectChange.bind(this, queIdx));

                        data = null;
                        item = null;
                        queIdx = null;
                        return this;
                    };
                }();
                var comboboxConfig = {},
                    queIdx;

                item = jQuery.extend(true, comboboxConfig, cfg, item);
                if (!item.target) {
                    console.log(ax5.info.getError("ax5combobox", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5combobox-id");
                if (!item.id) {
                    item.id = 'ax5combobox-' + ax5.getGuid();
                    item.$target.data("data-ax5combobox-id", item.id);
                }
                item.name = item.$target.attr("data-ax5combobox");
                if (item.options) {
                    item.options = JSON.parse(JSON.stringify(item.options));
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-ax5combobox-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindComboboxTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindComboboxTarget.call(this, queIdx);
                }

                comboboxConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * open the optionBox of combobox
             * @method ax5combobox.open
             * @param {(String|Number|Element)} boundID
             * @param {Number} [tryCount]
             * @returns {ax5combobox}
             */
            this.open = function () {
                var onExpand = function onExpand(item) {
                    item.onExpand.call({
                        self: this,
                        item: item
                    }, function (O) {
                        if (this.waitOptionsCallback) {
                            var data = {};
                            var item = this.queue[this.activecomboboxQueueIndex];

                            /// 현재 selected 검증후 처리
                            (function (item, O) {
                                var optionsMap = {};
                                O.options.forEach(function (_O, _OIndex) {
                                    _O["@index"] = _OIndex;
                                    optionsMap[_O[item.columnKeys.optionValue]] = _O;
                                });
                                if (U.isArray(item.selected)) {
                                    item.selected.forEach(function (_O) {
                                        if (optionsMap[_O[item.columnKeys.optionValue]]) {
                                            O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected] = true;
                                        }
                                    });
                                }
                            })(item, O);

                            item.$display.find('[data-ax5combobox-display="label"]').html(getLabel.call(this, this.activecomboboxQueueIndex));
                            item.options = syncComboboxOptions.call(this, this.activecomboboxQueueIndex, O.options);

                            alignComboboxDisplay.call(this);

                            /// 템플릿에 전달할 오브젝트 선언
                            data.id = item.id;
                            data.theme = item.theme;
                            data.size = "ax5combobox-option-group-" + item.size;
                            data.multiple = item.multiple;
                            data.lang = item.lang;
                            data.options = item.options;
                            /*
                            this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(
                                ax5.mustache.render(COMBOBOX.tmpl["options"].call(this, item.columnKeys), data)
                            ));
                            */
                            this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "options", data, item.columnKeys)));
                        }
                    }.bind(this));
                };
                return function (boundID, tryCount) {
                    this.waitOptionsCallback = null;

                    /**
                     * open combobox from the outside
                     */
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    var item = this.queue[queIdx];
                    var data = {},
                        focusTop,
                        selectedOptionEl;

                    if (item.$display.attr("disabled")) return this;

                    if (this.openTimer) clearTimeout(this.openTimer);
                    if (this.activecomboboxOptionGroup) {
                        if (this.activecomboboxQueueIndex == queIdx) {
                            return this;
                        }

                        if (tryCount > 2) return this;
                        this.close();
                        this.openTimer = setTimeout(function () {
                            this.open(queIdx, (tryCount || 0) + 1);
                        }.bind(this), cfg.animateTime);

                        return this;
                    }

                    item.optionFocusIndex = -1; // optionGroup이 열리면 포커스 인덱스 초기화 -1로
                    if (item.selected && item.selected.length > 0) {
                        item.optionSelectedIndex = item.selected[0]["@findex"];
                    }

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5combobox-option-group-" + item.size;
                    data.multiple = item.multiple;

                    data.lang = item.lang;
                    item.$display.attr("data-combobox-option-group-opened", "true");

                    if (item.onExpand) {
                        // onExpand 인 경우 UI 대기모드 추가
                        data.waitOptions = true;
                    }
                    data.options = U.filter(item.options, function () {
                        return !this.hide;
                    });

                    //this.activecomboboxOptionGroup = jQuery(ax5.mustache.render(COMBOBOX.tmpl["optionGroup"].call(this, item.columnKeys), data));
                    this.activecomboboxOptionGroup = jQuery(COMBOBOX.tmpl.get.call(this, "optionGroup", data, item.columnKeys));
                    //this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(ax5.mustache.render(COMBOBOX.tmpl["options"].call(this, item.columnKeys), data)));
                    this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "options", data, item.columnKeys)));
                    this.activecomboboxQueueIndex = queIdx;

                    alignComboboxOptionGroup.call(this, "append"); // alignComboboxOptionGroup 에서 body append
                    jQuery(window).bind("resize.ax5combobox-" + this.instanceId, function () {
                        alignComboboxOptionGroup.call(this);
                    }.bind(this));

                    if (item.selected && item.selected.length > 0) {
                        selectedOptionEl = this.activecomboboxOptionGroup.find('[data-option-index="' + item.selected[0]["@index"] + '"]');
                        if (selectedOptionEl.get(0)) {
                            focusTop = selectedOptionEl.position().top - this.activecomboboxOptionGroup.height() / 3;
                            this.activecomboboxOptionGroup.find('[data-els="content"]').stop().animate({ scrollTop: focusTop }, item.animateTime, 'swing', function () {});
                        }
                    }

                    jQuery(window).bind("keyup.ax5combobox-" + this.instanceId, function (e) {
                        e = e || window.event;
                        onBodyKeyup.call(this, e);
                        U.stopEvent(e);
                    }.bind(this));

                    jQuery(window).bind("click.ax5combobox-" + this.instanceId, function (e) {
                        e = e || window.event;
                        onBodyClick.call(this, e);
                        U.stopEvent(e);
                    }.bind(this));

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "open",
                        item: item
                    });

                    // waitOption timer
                    if (item.onExpand) {
                        this.waitOptionsCallback = true;
                        onExpand.call(this, item);
                    }

                    data = null;
                    focusTop = null;
                    selectedOptionEl = null;
                    return this;
                };
            }();

            /**
             * @method ax5combobox.update
             * @param {(Object|String)} item
             * @returns {ax5combobox}
             */
            this.update = function (_item) {
                this.bind(_item);
                return this;
            };

            /**
             * @method ax5combobox.setValue
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _value
             * @param {Boolean} [_selected]
             * @return {ax5combobox}
             * @example
             * ```js
             * myCombo.setValue($('[data-ax5combobox="combo1"]'), "1");
             * myCombo.setValue($('[data-ax5combobox="combo1"]'), ["1", "2"]);
             * ```
             */
            this.setValue = function (_boundID, _value, _selected) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }

                clearSelected.call(this, queIdx);
                if (U.isArray(_value)) {
                    var _values = U.map(_value, function () {
                        return { value: this };
                    });
                    setOptionSelect.call(this, queIdx, _values, _selected || true, { noStateChange: true });
                } else if (U.isString(_value) || U.isNumber(_value)) {
                    setOptionSelect.call(this, queIdx, { value: _value }, _selected || true, { noStateChange: true });
                }
                //blurLabel.call(this, queIdx);

                return this;
            };

            /**
             * @method ax5combobox.setText
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _text
             * @param {Boolean} [_selected]
             * @returns {ax5combobox}
             * @example
             * ```js
             * myCombo.setText($('[data-ax5combobox="combo1"]'), "string");
             * myCombo.setText($('[data-ax5combobox="combo1"]'), ["substring", "search"]);
             * ```
             */
            this.setText = function (_boundID, _text, _selected) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }
                clearSelected.call(this, queIdx);
                setOptionSelect.call(this, queIdx, _text, true, { noStateChange: true });
                //blurLabel.call(this, queIdx);

                return this;
            };

            /**
             * @method ax5combobox.getSelectedOption
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {Array}
             */
            this.getSelectedOption = function (_boundID) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }
                return U.deepCopy(this.queue[queIdx].selected);
            };

            /**
             * @method ax5combobox.close
             * @returns {ax5combobox}
             */
            this.close = function (item) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activecomboboxOptionGroup) return this;

                item = this.queue[this.activecomboboxQueueIndex];
                item.optionFocusIndex = -1;
                item.$display.removeAttr("data-combobox-option-group-opened").trigger("focus");

                this.activecomboboxOptionGroup.addClass("destroy");

                jQuery(window).unbind("resize.ax5combobox-" + this.instanceId).unbind("click.ax5combobox-" + this.instanceId).unbind("keyup.ax5combobox-" + this.instanceId);

                this.closeTimer = setTimeout(function () {
                    if (this.activecomboboxOptionGroup) this.activecomboboxOptionGroup.remove();
                    this.activecomboboxOptionGroup = null;
                    this.activecomboboxQueueIndex = -1;

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "close"
                    });
                }.bind(this), cfg.animateTime);
                this.waitOptionsCallback = null;
                return this;
            };

            /**
             * @method ax5combobox.blur
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5combobox}
             */
            this.blur = function (_boundID) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }

                blurLabel.call(this, queIdx);
                return this;
            };

            /**
             * @method ax5combobox.enable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5combobox}
             */
            this.enable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);
                this.queue[queIdx].$display.removeAttr("disabled");
                this.queue[queIdx].$input.removeAttr("disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "enable"
                });

                return this;
            };

            /**
             * @method ax5combobox.disable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5combobox}
             */
            this.disable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);
                this.queue[queIdx].$display.attr("disabled", "disabled");
                this.queue[queIdx].$input.attr("disabled", "disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "disable"
                });

                return this;
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    this.init();
                }
            }.apply(this, arguments);
        };
        return ax5combobox;
    }());

    COMBOBOX = ax5.ui.combobox;
})();

/**
 * ax5combobox jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5combobox
 * @param {String} methodName
 * @param [arguments]
 * @param [arguments]
 * @example
 * ```html
 * <div data-ax5combobox="ax1" data-ax5combobox-config='{
 *  multiple: true,
 *  editable: true,
 *  size: "",
 *  theme:""
 *  }'></div>
 * <script>
 * jQuery('[data-ax5combobox="ax1"]').ax5combobox();
 * $('[data-ax5combobox="ax1"]').ax5combobox("getSelectedOption");
 * $('[data-ax5combobox="ax1"]').ax5combobox("setValue", ["string", "number"]);
 * $('[data-ax5combobox="ax1"]').ax5combobox("enable");
 * $('[data-ax5combobox="ax1"]').ax5combobox("disable");
 * </script>
 * ```
 */

ax5.ui.combobox_instance = new ax5.ui.combobox();
jQuery.fn.ax5combobox = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.combobox_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.combobox_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.combobox_instance.setValue(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "setText":
                    return ax5.ui.combobox_instance.setText(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "getSelectedOption":
                    return ax5.ui.combobox_instance.getSelectedOption(this);
                    break;
                case "enable":
                    return ax5.ui.combobox_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.combobox_instance.disable(this);
                    break;
                case "blur":
                    return ax5.ui.combobox_instance.blur(this);
                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.combobox_instance.bind(config);
            });
        }
        return this;
    };
}();

// ax5.ui.combobox.tmpl
(function () {

    var COMBOBOX = ax5.ui.combobox;
    var U = ax5.util;

    var optionGroup = function optionGroup(columnKeys) {
        return '\n            <div class="ax5combobox-option-group {{theme}} {{size}}" data-ax5combobox-option-group="{{id}}">\n                <div class="ax-combobox-body">\n                    <div class="ax-combobox-option-group-content" data-els="content"></div>\n                </div>\n                <div class="ax-combobox-arrow"></div> \n            </div>\n        ';
    };

    var comboboxDisplay = function comboboxDisplay(columnKeys) {
        return '\n            <div class="form-control {{formSize}} ax5combobox-display {{theme}}" \n            data-ax5combobox-display="{{id}}" data-ax5combobox-instance="{{instanceId}}">\n                <div class="ax5combobox-display-table" data-els="display-table">\n                    <div data-ax5combobox-display="label-holder"> \n                    <a {{^tabIndex}}href="#ax5combobox-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}\n                    data-ax5combobox-display="label"\n                    contentEditable="true"\n                    spellcheck="false">{{{label}}}</a>\n                    </div>\n                    <div data-ax5combobox-display="addon"> \n                        {{#multiple}}{{#reset}}\n                        <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>\n                        {{/reset}}{{/multiple}}\n                        {{#icons}}\n                        <span class="addon-icon-closed">{{clesed}}</span>\n                        <span class="addon-icon-opened">{{opened}}</span>\n                        {{/icons}}\n                        {{^icons}}\n                        <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n                        <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n                        {{/icons}}\n                    </div>\n                </div>\n            </a>\n        ';
    };

    var formSelect = function formSelect(columnKeys) {
        return '\n            <select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>\n        ';
    };

    var options = function options(columnKeys) {
        return '\n            {{#waitOptions}}\n                <div class="ax-combobox-option-item">\n                        <div class="ax-combobox-option-item-holder">\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">\n                                {{{lang.loading}}}\n                            </span>\n                        </div>\n                    </div>\n            {{/waitOptions}}\n            {{^waitOptions}}\n                {{#options}}\n                    {{#optgroup}}\n                        <div class="ax-combobox-option-group">\n                            <div class="ax-combobox-option-item-holder">\n                                <span class="ax-combobox-option-group-label">\n                                    {{{.}}}\n                                </span>\n                            </div>\n                            {{#options}}\n                            {{^hide}}\n                            <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" \n                            data-option-value="{{' + columnKeys.optionValue + '}}" \n                            {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                                <div class="ax-combobox-option-item-holder">\n                                    {{#multiple}}\n                                    <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">\n                                        <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                    </span>\n                                    {{/multiple}}\n                                    <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                                </div>\n                            </div>\n                            {{/hide}}\n                            {{/options}}\n                        </div>                            \n                    {{/optgroup}}\n                    {{^optgroup}}\n                    {{^hide}}\n                    <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{' + columnKeys.optionValue + '}}" {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                        <div class="ax-combobox-option-item-holder">\n                            {{#multiple}}\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">\n                                <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                            </span>\n                            {{/multiple}}\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                        </div>\n                    </div>\n                    {{/hide}}\n                    {{/optgroup}}\n                {{/options}}\n                {{^options}}\n                    <div class="ax-combobox-option-item">\n                        <div class="ax-combobox-option-item-holder">\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">\n                                {{{lang.noOptions}}}\n                            </span>\n                        </div>\n                    </div>\n                {{/options}}\n            {{/waitOptions}}\n        ';
    };

    var label = function label(columnKeys) {
        return '\n            {{#selected}}<div tabindex="-1" data-ax5combobox-selected-label="{{@i}}" data-ax5combobox-selected-text="{{text}}">\n                <div data-ax5combobox-remove="true" data-ax5combobox-remove-index="{{@i}}">{{{removeIcon}}}</div>\n                <span>{{text}}</span>\n                </div>\n            {{/selected}}\n        ';
    };

    COMBOBOX.tmpl = {
        "comboboxDisplay": comboboxDisplay,
        "formSelect": formSelect,
        "optionGroup": optionGroup,
        "options": options,
        "label": label,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(COMBOBOX.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.combobox.util
(function () {

    var COMBOBOX = ax5.ui.combobox;
    var U = ax5.util;

    var nodeTypeProcessor = {
        '1': function _(queIdx, node, editable) {
            var cfg = this.config;
            var textNode = node;

            if ($(node).find("span").get(0)) {
                textNode = $(node).find("span").get(0);
            }

            var text = (textNode.textContent || textNode.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            var selectedIndex, option;
            if (item.selected && item.selected.length > 0 && node.getAttribute("data-ax5combobox-selected-text") == text) {
                selectedIndex = node.getAttribute("data-ax5combobox-selected-label");
                option = item.selected[selectedIndex];
                return {
                    index: {
                        gindex: option["@gindex"],
                        index: option["@index"],
                        value: option[cfg.columnKeys.optionValue]
                    }
                };
            } else if (!node.getAttribute("data-ax5combobox-selected-text")) {
                if (text != "") {
                    if (editable) {
                        return text;
                    } else {
                        var $option;
                        if (item.optionFocusIndex > -1) $option = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                        if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                            return {
                                index: {
                                    gindex: $option.attr("data-option-group-index"),
                                    index: $option.attr("data-option-index")
                                }
                            };
                        } else {
                            return item.editable ? text : undefined;
                        }
                    }
                } else {
                    return undefined;
                }
            } else {
                return text;
            }
        },
        '3': function _(queIdx, node, editable) {
            var cfg = this.config;
            var text = (node.textContent || node.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            if (text != "") {
                if (editable) {
                    return text;
                } else {
                    var $option;
                    if (item.optionFocusIndex > -1) $option = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                    if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                        return {
                            index: {
                                gindex: $option.attr("data-option-group-index"),
                                index: $option.attr("data-option-index")
                            }
                        };
                    } else {
                        return item.editable ? text : undefined;
                    }
                }
            } else {
                return undefined;
            }
        }
    };

    COMBOBOX.util = {
        nodeTypeProcessor: nodeTypeProcessor
    };
})();
// ax5.ui.layout
(function () {
    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "layout",
        version: "0.3.0"
    }, function () {
        /**
         * @class ax5layout
         * @alias ax5.ui.layout
         * @author tom@axisj.com
         * @example
         * ```
         * var myLayout = new ax5.ui.layout();
         * ```
         */
        var ax5layout = function ax5layout() {
            var self = this,
                cfg,
                ENM = {
                "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
                "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
                "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
            },
                getMousePosition = function getMousePosition(e) {
                var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;
                return {
                    clientX: mouseObj.clientX,
                    clientY: mouseObj.clientY
                };
            };

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                splitter: {
                    size: 4
                },
                autoResize: true
            };
            this.queue = [];

            this.openTimer = null;
            this.closeTimer = null;
            this.resizer = null;

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
                alignLayoutAll = function alignLayoutAll() {
                var i = this.queue.length;
                while (i--) {
                    if (typeof this.queue[i].parentQueIdx === "undefined" && this.queue[i].autoResize) {
                        alignLayout.call(this, i, null, "windowResize");
                    }
                }
            },
                getDockPanelOuterSize = {
                "width": function width(item, panel) {
                    return panel ? panel.__width + (panel.split ? item.splitter.size : 0) : 0;
                },
                "height": function height(item, panel) {
                    return panel ? panel.__height + (panel.split ? item.splitter.size : 0) : 0;
                }
            },
                alignLayout = function () {
                var beforeSetCSS = {
                    "split": {
                        "horizontal": function horizontal(item, panel, panelIndex) {
                            if (panel.splitter) {
                                panel.__height = item.splitter.size;
                            } else {
                                if (panelIndex == item.splitPanel.length - 1) {
                                    if (item.splitPanel.asteriskLength == 0) {
                                        panel.height = "*";
                                        panel.__height = undefined;
                                        item.splitPanel.asteriskLength++;
                                    } else {
                                        if (panel.height == "*") {
                                            item.splitPanel.asteriskLength++;
                                        }
                                    }
                                } else {
                                    if (panel.height == "*") {
                                        item.splitPanel.asteriskLength++;
                                    }
                                }
                            }
                        },
                        "vertical": function vertical(item, panel, panelIndex) {
                            if (panel.splitter) {
                                panel.__width = item.splitter.size;
                            } else {
                                if (panelIndex == item.splitPanel.length - 1) {
                                    if (item.splitPanel.asteriskLength == 0) {
                                        panel.width = "*";
                                        panel.__width = undefined;
                                        item.splitPanel.asteriskLength++;
                                    } else {
                                        if (panel.width == "*") {
                                            item.splitPanel.asteriskLength++;
                                        }
                                    }
                                } else {
                                    if (panel.width == "*") {
                                        item.splitPanel.asteriskLength++;
                                    }
                                }
                            }
                        }
                    }
                };
                var setCSS = {
                    "top": function top(item, panel) {
                        panel.$target.css({ height: panel.__height || 0 });
                        if (panel.split) {
                            panel.$splitter.css({ height: item.splitter.size, top: panel.__height || 0 });
                        }
                    },
                    "bottom": function bottom(item, panel) {
                        panel.$target.css({ height: panel.__height || 0 });
                        if (panel.split) {
                            panel.$splitter.css({ height: item.splitter.size, bottom: panel.__height || 0 });
                        }
                    },
                    "left": function left(item, panel) {
                        var css = {
                            width: panel.__width || 0,
                            height: item.targetDimension.height
                        };

                        if (item.dockPanel.top) {
                            css.height -= item.dockPanel.top.__height;
                            css.top = item.dockPanel.top.__height;
                            if (item.dockPanel.top.split) {
                                css.height -= item.splitter.size;
                                css.top += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.bottom) {
                            css.height -= item.dockPanel.bottom.__height;
                            if (item.dockPanel.bottom.split) {
                                css.height -= item.splitter.size;
                            }
                        }

                        panel.$target.css(css);

                        if (panel.split) {
                            panel.$splitter.css({ width: item.splitter.size, height: css.height, top: css.top, left: css.width });
                        }
                    },
                    "right": function right(item, panel) {
                        var css = {
                            width: panel.__width || 0,
                            height: item.targetDimension.height
                        };

                        if (item.dockPanel.top) {
                            css.height -= item.dockPanel.top.__height;
                            css.top = item.dockPanel.top.__height;
                            if (item.dockPanel.top.split) {
                                css.height -= item.splitter.size;
                                css.top += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.bottom) {
                            css.height -= item.dockPanel.bottom.__height;
                            if (item.dockPanel.bottom.split) {
                                css.height -= item.splitter.size;
                            }
                        }

                        panel.$target.css(css);

                        if (panel.split) {
                            panel.$splitter.css({ width: item.splitter.size, height: css.height, top: css.top, right: css.width });
                        }
                    },
                    "center": function center(item, panel) {
                        var css = {
                            width: item.targetDimension.width,
                            height: item.targetDimension.height
                        };

                        if (item.dockPanel.top) {
                            css.height -= item.dockPanel.top.__height || 0;
                            css.top = item.dockPanel.top.__height || 0;
                            if (item.dockPanel.top.split) {
                                css.height -= item.splitter.size;
                                css.top += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.bottom) {
                            css.height -= item.dockPanel.bottom.__height || 0;
                            if (item.dockPanel.bottom.split) {
                                css.height -= item.splitter.size;
                            }
                        }
                        if (item.dockPanel.left) {
                            css.width -= item.dockPanel.left.__width || 0;
                            css.left = item.dockPanel.left.__width || 0;
                            if (item.dockPanel.left.split) {
                                css.width -= item.splitter.size;
                                css.left += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.right) {
                            css.width -= item.dockPanel.right.__width || 0;
                            if (item.dockPanel.right.split) {
                                css.width -= item.splitter.size;
                            }
                        }

                        var minWidth = panel.minWidth || 0;
                        var minHeight = panel.minHeight || 0;

                        // 레이아웃의 최소 너비 높이를 주어 레이아웃 덕패널이 겹치는 일이 없게 합니다
                        if (css.width < minWidth) {
                            css.width = minWidth;
                            item.$target.css({ minWidth: minWidth + getDockPanelOuterSize["width"](item.dockPanel.left, item.splitter.size) + getDockPanelOuterSize["width"](item.dockPanel.right, item.splitter.size) });
                        }
                        if (css.height < minHeight) {
                            css.height = minHeight;
                            item.$target.css({ minHeight: minHeight + getDockPanelOuterSize["height"](item.dockPanel.top, item.splitter.size) + getDockPanelOuterSize["height"](item.dockPanel.bottom, item.splitter.size) });
                        }

                        panel.$target.css(css);
                    },
                    "split": {
                        "horizontal": function horizontal(item, panel, panelIndex, withoutAsteriskSize, windowResize) {
                            var css = {};
                            var prevPosition = panelIndex ? Number(item.splitPanel[panelIndex - 1].offsetEnd) : 0;
                            if (panel.splitter) {
                                css.height = item.splitter.size;
                            } else {
                                if (panel.height == "*" && (typeof panel.__height === "undefined" || windowResize)) {
                                    // 남은 전체 공간을 사용
                                    css.height = panel.__height = (item.targetDimension.height - withoutAsteriskSize) / item.splitPanel.asteriskLength;
                                } else {
                                    css.height = panel.__height || 0;
                                }
                            }
                            css.top = prevPosition;
                            panel.offsetStart = prevPosition;
                            panel.offsetEnd = Number(prevPosition) + Number(css.height);
                            panel.$target.css(css);
                        },
                        "vertical": function vertical(item, panel, panelIndex, withoutAsteriskSize, windowResize) {
                            var css = {};
                            var prevPosition = panelIndex ? Number(item.splitPanel[panelIndex - 1].offsetEnd) : 0;

                            if (panel.splitter) {
                                css.width = item.splitter.size;
                            } else {
                                if (panel.width == "*" && (typeof panel.__width === "undefined" || windowResize)) {
                                    // 남은 전체 공간을 사용
                                    css.width = panel.__width = (item.targetDimension.width - withoutAsteriskSize) / item.splitPanel.asteriskLength;
                                } else {
                                    css.width = panel.__width || 0;
                                }
                            }
                            css.left = prevPosition;
                            panel.offsetStart = prevPosition;
                            panel.offsetEnd = Number(prevPosition) + Number(css.width);

                            panel.$target.css(css);
                        }
                    }
                };
                var layoutProcessor = {
                    "dock-panel": function dockPanel(item) {
                        for (var panel in item.dockPanel) {
                            if (item.dockPanel[panel].$target && item.dockPanel[panel].$target.get(0)) {
                                if (panel in setCSS) {
                                    setCSS[panel].call(this, item, item.dockPanel[panel]);
                                }
                            }
                        }
                    },
                    "split-panel": function splitPanel(item, windowResize) {
                        //console.log(item.splitPanel);
                        var withoutAsteriskSize;
                        item.splitPanel.asteriskLength = 0;
                        item.splitPanel.forEach(function (panel, panelIndex) {
                            beforeSetCSS["split"][item.oriental].call(this, item, panel, panelIndex);
                        });

                        if (item.oriental == "horizontal") {
                            withoutAsteriskSize = U.sum(item.splitPanel, function (n) {
                                if (n.height != "*") return U.number(n.__height);
                            });
                        } else {
                            withoutAsteriskSize = U.sum(item.splitPanel, function (n) {
                                if (n.width != "*") return U.number(n.__width);
                            });
                        }

                        item.splitPanel.forEach(function (panel, panelIndex) {
                            setCSS["split"][item.oriental].call(this, item, panel, panelIndex, withoutAsteriskSize, windowResize);
                        });
                    }
                };
                var childResize = function childResize(item) {
                    var i = item.childQueIdxs.length;
                    while (i--) {
                        alignLayout.call(this, item.childQueIdxs[i]);
                    }
                };

                return function (queIdx, callback, windowResize) {
                    var item = this.queue[queIdx];

                    // 레이아웃 타겟의 CSS속성을 미리 저장해 둡니다. 왜? 패널별로 크기 계산 할 때 쓰려고
                    item.targetDimension = {
                        height: item.$target.innerHeight(),
                        width: item.$target.innerWidth()
                    };

                    if (item.layout in layoutProcessor) {
                        layoutProcessor[item.layout].call(this, item, windowResize);
                    }

                    if (item.childQueIdxs) childResize.call(this, item, windowResize);
                    if (item.onResize) {
                        setTimeout(function () {
                            this.onResize.call(this, this);
                        }.bind(item), 1);
                    }
                    if (callback) {
                        callback.call(item, item);
                    }
                };
            }(),
                resizeSplitter = {
                "on": function on(queIdx, panel, $splitter) {
                    var item = this.queue[queIdx];
                    var splitterOffset = $splitter.position();
                    var splitterBox = {
                        width: $splitter.width(), height: $splitter.height()
                    };
                    var getResizerPosition = {
                        "left": function left(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientX - panel.mousePosition.clientX;
                            var minWidth = panel.minWidth || 0;
                            var maxWidth = panel.maxWidth || item.targetDimension.width - getDockPanelOuterSize["width"](item, item.dockPanel.left) - getDockPanelOuterSize["width"](item, item.dockPanel.right);

                            if (panel.__width + panel.__da < minWidth) {
                                panel.__da = -panel.__width + minWidth;
                            } else if (maxWidth < panel.__width + panel.__da) {
                                panel.__da = maxWidth - panel.__width;
                            }
                            return { left: panel.$splitter.position().left + panel.__da };
                        },
                        "right": function right(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientX - panel.mousePosition.clientX;
                            var minWidth = panel.minWidth || 0;
                            var maxWidth = panel.maxWidth || item.targetDimension.width - getDockPanelOuterSize["width"](item, item.dockPanel.left) - getDockPanelOuterSize["width"](item, item.dockPanel.right);

                            if (panel.__width - panel.__da < minWidth) {
                                panel.__da = panel.__width - minWidth;
                            } else if (maxWidth < panel.__width - panel.__da) {
                                panel.__da = -maxWidth + panel.__width;
                            }
                            return { left: panel.$splitter.position().left + panel.__da };
                        },
                        "top": function top(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientY - panel.mousePosition.clientY;
                            var minHeight = panel.minHeight || 0;
                            var maxHeight = panel.maxHeight || item.targetDimension.height - getDockPanelOuterSize["height"](item, item.dockPanel.top) - getDockPanelOuterSize["height"](item, item.dockPanel.bottom);

                            if (panel.__height + panel.__da < minHeight) {
                                panel.__da = -panel.__height + minHeight;
                            } else if (maxHeight < panel.__height + panel.__da) {
                                panel.__da = maxHeight - panel.__height;
                            }
                            return { top: panel.$splitter.position().top + panel.__da };
                        },
                        "bottom": function bottom(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientY - panel.mousePosition.clientY;
                            var minHeight = panel.minHeight || 0;
                            var maxHeight = panel.maxHeight || item.targetDimension.height - getDockPanelOuterSize["height"](item, item.dockPanel.top) - getDockPanelOuterSize["height"](item, item.dockPanel.bottom);

                            if (panel.__height - panel.__da < minHeight) {
                                panel.__da = panel.__height - minHeight;
                            } else if (maxHeight < panel.__height - panel.__da) {
                                panel.__da = -maxHeight + panel.__height;
                            }
                            return { top: panel.$splitter.position().top + panel.__da };
                        },
                        "split": function split(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            if (item.oriental == "horizontal") {
                                panel.__da = mouseObj.clientY - panel.mousePosition.clientY;

                                var prevPanel = item.splitPanel[panel.panelIndex - 1];
                                var nextPanel = item.splitPanel[panel.panelIndex + 1];

                                var prePanelMinHeight = prevPanel.minHeight || 0;
                                var nextPanelMinHeight = nextPanel.minHeight || 0;

                                if (panel.offsetStart + panel.__da < prevPanel.offsetStart + prePanelMinHeight) {
                                    panel.__da = prevPanel.offsetStart - panel.offsetStart + prePanelMinHeight;
                                } else if (panel.offsetStart + panel.__da > nextPanel.offsetEnd - nextPanelMinHeight) {
                                    panel.__da = nextPanel.offsetEnd - panel.offsetEnd - nextPanelMinHeight;
                                }

                                return { top: panel.$target.position().top + panel.__da };
                            } else {
                                /// todo : min & max 범위 정하기
                                panel.__da = mouseObj.clientX - panel.mousePosition.clientX;

                                var prevPanel = item.splitPanel[panel.panelIndex - 1];
                                var nextPanel = item.splitPanel[panel.panelIndex + 1];
                                var prePanelMinWidth = prevPanel.minWidth || 0;
                                var nextPanelMinWidth = nextPanel.minWidth || 0;

                                if (panel.offsetStart + panel.__da < prevPanel.offsetStart + prePanelMinWidth) {
                                    panel.__da = prevPanel.offsetStart - panel.offsetStart + prePanelMinWidth;
                                } else if (panel.offsetStart + panel.__da > nextPanel.offsetEnd - nextPanelMinWidth) {
                                    panel.__da = nextPanel.offsetEnd - panel.offsetEnd - nextPanelMinWidth;
                                }
                                return { left: Number(panel.$target.position().left) + Number(panel.__da) };
                            }
                        }
                    };
                    panel.__da = 0; // 패널의 변화량

                    jQuery(document.body).bind(ENM["mousemove"] + ".ax5layout-" + this.instanceId, function (e) {
                        if (!self.resizer) {

                            self.resizer = jQuery('<div class="ax5layout-resizer panel-' + panel.resizerType + '" ondragstart="return false;"></div>');
                            self.resizer.css({
                                left: splitterOffset.left,
                                top: splitterOffset.top,
                                width: splitterBox.width,
                                height: splitterBox.height
                            });
                            item.$target.append(self.resizer);
                        }
                        self.resizer.css(getResizerPosition[panel.resizerType](e));
                    }).bind(ENM["mouseup"] + ".ax5layout-" + this.instanceId, function (e) {
                        resizeSplitter.off.call(self, queIdx, panel, $splitter);
                    }).bind("mouseleave.ax5layout-" + this.instanceId, function (e) {
                        resizeSplitter.off.call(self, queIdx, panel, $splitter);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
                },
                "off": function off(queIdx, panel, $splitter) {
                    var item = this.queue[queIdx];
                    var setPanelSize = {
                        "dock-panel": {
                            "left": function left(queIdx, panel) {
                                panel.__width += panel.__da;
                            },
                            "right": function right() {
                                panel.__width -= panel.__da;
                            },
                            "top": function top() {
                                panel.__height += panel.__da;
                            },
                            "bottom": function bottom() {
                                panel.__height -= panel.__da;
                            }
                        },
                        "split-panel": {
                            "split": function split() {
                                if (item.oriental == "horizontal") {
                                    // 앞과 뒤의 높이 조절
                                    item.splitPanel[panel.panelIndex - 1].__height += panel.__da;
                                    item.splitPanel[panel.panelIndex + 1].__height -= panel.__da;
                                } else {
                                    // 앞과 뒤의 높이 조절

                                    item.splitPanel[panel.panelIndex - 1].__width += panel.__da;
                                    item.splitPanel[panel.panelIndex + 1].__width -= panel.__da;
                                }
                            }
                        },
                        "tab-panel": {}
                    };

                    if (self.resizer) {
                        self.resizer.remove();
                        self.resizer = null;
                        setPanelSize[this.queue[queIdx].layout][panel.resizerType].call(this, queIdx, panel);
                        alignLayout.call(this, queIdx);
                    }

                    jQuery(document.body).unbind(ENM["mousemove"] + ".ax5layout-" + this.instanceId).unbind(ENM["mouseup"] + ".ax5layout-" + this.instanceId).unbind("mouseleave.ax5layout-" + this.instanceId);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
                }
            },
                tabControl = {
                "open": function open(queIdx, layout, panelIndex) {
                    if (layout.activePanelIndex != panelIndex) {
                        layout.tabPanel[panelIndex].active = true;
                        layout.tabPanel[layout.activePanelIndex].active = false;
                        layout.$target.find('[data-tab-panel-label="' + panelIndex + '"]').attr("data-tab-active", "true");
                        layout.$target.find('[data-tab-panel-label="' + layout.activePanelIndex + '"]').removeAttr("data-tab-active");
                        layout.tabPanel[panelIndex].$target.attr("data-tab-active", "true");
                        layout.tabPanel[layout.activePanelIndex].$target.removeAttr("data-tab-active");
                        layout.activePanelIndex = panelIndex;

                        if (layout.onOpenTab) {
                            var that = {
                                '$target': layout.$target,
                                name: layout.name,
                                id: layout.id,
                                layout: layout.layout,
                                activePanelIndex: layout.activePanelIndex,
                                activePanel: layout.tabPanel[layout.activePanelIndex],
                                tabPanel: layout.tabPanel
                            };
                            layout.onOpenTab.call(that);
                        }
                    }
                }
            },
                getTabLabesTmpl = function getTabLabesTmpl() {
                return '\n<div data-tab-panel-label-holder="{{id}}">\n    <div data-tab-panel-label-border="{{id}}"></div>\n    <div data-tab-panel-label-table="{{id}}">\n        <div data-tab-panel-aside="left"></div>\n    {{#tabPanel}}\n        <div data-tab-panel-label="{{panelIndex}}" data-tab-active="{{active}}">\n            <div data-tab-label="{{panelIndex}}">{{{label}}}</div>\n        </div>\n    {{/tabPanel}}\n        <div data-tab-panel-aside="right"></div>\n    </div>\n</div>\n';
            },
                bindLayoutTarget = function () {
                var getPixel = function getPixel(size, parentSize) {
                    if (size == "*") {
                        return;
                    } else if (U.right(size, 1) == "%") {
                        return parentSize * U.number(size) / 100;
                    } else {
                        return Number(size);
                    }
                };
                var applyLayout = {
                    "dock-panel": function dockPanel(queIdx) {
                        var item = this.queue[queIdx];
                        item.dockPanel = {};
                        item.$target.find('>[data-dock-panel]').each(function () {

                            var panelInfo = {};
                            (function (data) {
                                if (U.isObject(data) && !data.error) {
                                    panelInfo = jQuery.extend(true, panelInfo, data);
                                }
                            })(U.parseJson(this.getAttribute("data-dock-panel"), true));

                            if ('dock' in panelInfo) {
                                panelInfo.$target = jQuery(this);
                                panelInfo.$target.addClass("dock-panel-" + panelInfo.dock);

                                if (panelInfo.split = panelInfo.split && panelInfo.split.toString() == "true") {
                                    panelInfo.$splitter = jQuery('<div data-splitter="" class="dock-panel-' + panelInfo.dock + '"></div>');
                                    panelInfo.$splitter.bind(ENM["mousedown"], function (e) {
                                        panelInfo.mousePosition = getMousePosition(e);
                                        resizeSplitter.on.call(self, queIdx, panelInfo, panelInfo.$splitter);
                                    }).bind("dragstart", function (e) {
                                        U.stopEvent(e);
                                        return false;
                                    });
                                    item.$target.append(panelInfo.$splitter);
                                }

                                if (panelInfo.dock == "top" || panelInfo.dock == "bottom") {
                                    panelInfo.__height = getPixel(panelInfo.height, item.targetDimension.height);
                                } else {
                                    panelInfo.__width = getPixel(panelInfo.width, item.targetDimension.width);
                                }
                                panelInfo.resizerType = panelInfo.dock;
                                item.dockPanel[panelInfo.dock] = panelInfo;
                            }
                        });
                    },
                    "split-panel": function splitPanel(queIdx) {
                        var item = this.queue[queIdx];
                        item.splitPanel = [];
                        item.$target.find('>[data-split-panel], >[data-splitter]').each(function (ELIndex) {
                            var panelInfo = {};
                            (function (data) {
                                if (U.isObject(data) && !data.error) {
                                    panelInfo = jQuery.extend(true, panelInfo, data);
                                }
                            })(U.parseJson(this.getAttribute("data-split-panel") || this.getAttribute("data-splitter"), true));

                            panelInfo.$target = jQuery(this);
                            panelInfo.$target.addClass("split-panel-" + item.oriental);
                            panelInfo.panelIndex = ELIndex;

                            if (this.getAttribute("data-splitter")) {
                                panelInfo.splitter = true;
                                panelInfo.$target.bind(ENM["mousedown"], function (e) {
                                    if (panelInfo.panelIndex > 0 && panelInfo.panelIndex < item.splitPanel.length - 1) {
                                        panelInfo.mousePosition = getMousePosition(e);
                                        resizeSplitter.on.call(self, queIdx, panelInfo, panelInfo.$target);
                                    }
                                }).bind("dragstart", function (e) {
                                    U.stopEvent(e);
                                    return false;
                                });
                                panelInfo.resizerType = "split";
                            } else {
                                if (item.oriental == "horizontal") {
                                    panelInfo.__height = getPixel(panelInfo.height, item.targetDimension.height);
                                } else {
                                    item.oriental = "vertical";
                                    panelInfo.__width = getPixel(panelInfo.width, item.targetDimension.width);
                                }
                            }

                            item.splitPanel.push(panelInfo);
                        });
                    },
                    "tab-panel": function tabPanel(queIdx) {
                        var item = this.queue[queIdx];

                        var hasActivePanel = false;
                        var activePanelIndex = -1;
                        item.tabPanel = [];
                        item.$target.find('>[data-tab-panel]').each(function (ELIndex) {
                            var panelInfo = {};
                            (function (data) {
                                if (U.isObject(data) && !data.error) {
                                    panelInfo = jQuery.extend(true, panelInfo, data);
                                }
                            })(U.parseJson(this.getAttribute("data-tab-panel"), true));

                            if (hasActivePanel) {
                                panelInfo.active = false;
                            }

                            panelInfo.$target = jQuery(this);

                            if (panelInfo.active && panelInfo.active != "false") {
                                hasActivePanel = true;
                                item.activePanelIndex = ELIndex;
                                panelInfo.$target.attr("data-tab-active", "true");
                            }

                            panelInfo.panelIndex = ELIndex;
                            item.tabPanel.push(panelInfo);
                        });

                        if (!hasActivePanel) {
                            item.tabPanel[0].active = true;
                            item.tabPanel[0].$target.attr("data-tab-active", "true");
                            item.activePanelIndex = 0;
                        }

                        // make tabLabel
                        item.$target.append(jQuery(ax5.mustache.render(getTabLabesTmpl.call(this, queIdx), item)));
                        item.$target.on("click", '[data-tab-panel-label]', function (e) {
                            var index = this.getAttribute("data-tab-panel-label");
                            tabControl.open.call(self, queIdx, item, index);
                        });
                    }
                };

                return function (queIdx) {
                    var item = this.queue[queIdx];
                    var data = {};

                    // 레이아웃 타겟의 CSS속성을 미리 저장해 둡니다. 왜? 패널별로 크기 계산 할 때 쓰려고
                    item.targetDimension = {
                        height: item.$target.innerHeight(),
                        width: item.$target.innerWidth()
                    };

                    // 부모 컨테이너가 ax5layout인지 판단 필요.
                    if (item.$target.parents("[data-ax5layout]").get(0)) {
                        hooksResizeLayout.call(this, item.$target.parents("[data-ax5layout]").get(0), queIdx);
                    }

                    if (item.layout in applyLayout) {
                        applyLayout[item.layout].call(this, queIdx);
                    }
                    alignLayout.call(this, queIdx);
                };
            }(),
                getQueIdx = function getQueIdx(boundID) {
                if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-ax5layout-id");
                }
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5layout", "402", "getQueIdx"));
                    return;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            },
                hooksResizeLayout = function hooksResizeLayout(boundID, childQueIdx) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (!this.queue[queIdx].childQueIdxs) this.queue[queIdx].childQueIdxs = [];
                this.queue[queIdx].childQueIdxs.push(childQueIdx);
                this.queue[childQueIdx].parentQueIdx = queIdx;
            };
            /// private end
            /**
             * Preferences of layout UI
             * @method ax5layout.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Number} [config.animateTime=250]
             * @param {Object} [config.splitter]
             * @param {Number} [config.splitter.size=4]
             * @param {Boolean} [config.autoResize=true]
             * @returns {ax5layout}
             * @example
             * ```js
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                jQuery(window).bind("resize.ax5layout-" + this.instanceId, function () {
                    alignLayoutAll.call(this);
                }.bind(this));
            };

            /**
             * @method ax5layout.bind
             * @param {Object} item
             * @param {String} [item.layout]
             * @param {String} [item.theme]
             * @param {Element} item.target
             * @param {Object[]} item.options
             * @param {Object} [item.splitter]
             * @param {Number} [item.splitter.size=4]
             * @param {Boolean} [item.autoResize=true]
             * @returns {ax5layout}
             */
            this.bind = function (item) {
                var UIConfig = {},
                    queIdx;

                item = jQuery.extend(true, UIConfig, cfg, item);
                if (!item.target) {
                    console.log(ax5.info.getError("ax5layout", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5layout-id");
                if (!item.id) {
                    item.id = 'ax5layout-' + ax5.getGuid();
                    item.$target.data("data-ax5layout-id", item.id);
                }
                item.name = item.$target.attr("data-ax5layout");
                if (item.options) {
                    item.options = JSON.parse(JSON.stringify(item.options));
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindLayoutTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindLayoutTarget.call(this, queIdx);
                }

                UIConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * @method ax5layout.align
             * @param boundID
             * @param {Function} [callback]
             * @param {String} [windowResize]
             * @returns {ax5layout}
             */
            this.align = function (boundID, windowResize) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5layout", "402", "align"));
                    return;
                }

                alignLayout.call(this, queIdx, null, windowResize);
                return this;
            };

            /**
             * @method ax5layout.onResize
             * @param boundID
             * @param fn
             * @returns {ax5layout}
             */
            this.onResize = function (boundID, fn) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5layout", "402", "onResize"));
                    return;
                }
                this.queue[queIdx].onResize = fn;
                return this;
            };

            /**
             * @method ax5layout.resize
             * @param boundID
             * @param {Object} resizeOption
             * @param {Function} [callback]
             * @returns {ax5layout}
             */
            this.resize = function () {

                var resizeLayoutPanel = {
                    "dock-panel": function dockPanel(item, resizeOption) {
                        ["top", "bottom", "left", "right"].forEach(function (dock) {
                            if (resizeOption[dock] && item.dockPanel[dock]) {
                                if (dock == "top" || dock == "bottom") {
                                    item.dockPanel[dock].__height = U.isObject(resizeOption[dock]) ? resizeOption[dock].height : resizeOption[dock];
                                } else if (dock == "left" || dock == "right") {
                                    item.dockPanel[dock].__width = U.isObject(resizeOption[dock]) ? resizeOption[dock].width : resizeOption[dock];
                                }
                            }
                        });
                    },
                    "split-panel": function splitPanel() {},
                    "tab-panel": function tabPanel() {}
                };

                return function (boundID, resizeOption, callback) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5layout", "402", "resize"));
                        return;
                    }

                    resizeLayoutPanel[this.queue[queIdx].layout].call(this, this.queue[queIdx], resizeOption);
                    alignLayout.call(this, queIdx, callback);
                    return this;
                };
            }();

            this.reset = function () {

                var resetLayoutPanel = {
                    "dock-panel": function dockPanel(item) {
                        ["top", "bottom", "left", "right"].forEach(function (dock) {
                            if (item.dockPanel[dock]) {
                                if (dock == "top" || dock == "bottom") {
                                    item.dockPanel[dock].__height = item.dockPanel[dock].height;
                                } else if (dock == "left" || dock == "right") {
                                    item.dockPanel[dock].__width = item.dockPanel[dock].width;
                                }
                            }
                        });
                    },
                    "split-panel": function splitPanel() {},
                    "tab-panel": function tabPanel() {}
                };

                return function (boundID, callback) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5layout", "402", "reset"));
                        return;
                    }

                    resetLayoutPanel[this.queue[queIdx].layout].call(this, this.queue[queIdx]);
                    alignLayout.call(this, queIdx, callback);
                    return this;
                };
            }();

            this.hide = function () {};

            /**
             * @method ax5layout.tabOpen
             * @param boundID
             * @param tabIndex
             * @returns {ax5.ui.ax5layout}
             */
            this.tabOpen = function () {
                return function (boundID, tabIndex) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5layout", "402", "tabOpen"));
                        return;
                    }

                    tabControl.open.call(this, queIdx, this.queue[queIdx], tabIndex);
                    return this;
                };
            }();

            /// 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    this.init();
                }
            }.apply(this, arguments);
        };
        return ax5layout;
    }());
})();

ax5.ui.layout_instance = new ax5.ui.layout();

/**
 * ax5layout jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5layout
 * @param {String} methodName
 * @example
 * ```js
 * jQuery('[data-ax5layout="ax1"]').ax5layout();
 * ```
 */

jQuery.fn.ax5layout = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "align":
                    return ax5.ui.layout_instance.align(this, arguments[1], arguments[2]);
                    break;
                case "resize":
                    return ax5.ui.layout_instance.resize(this, arguments[1], arguments[2]);
                    break;
                case "reset":
                    return ax5.ui.layout_instance.reset(this, arguments[1]);
                    break;
                case "hide":
                    return ax5.ui.layout_instance.hide(this, arguments[1]);
                    break;
                case "onResize":
                    return ax5.ui.layout_instance.onResize(this, arguments[1]);
                    break;
                case "tabOpen":
                    return ax5.ui.layout_instance.tabOpen(this, arguments[1]);
                    break;
                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.layout_instance.bind(config);
            });
        }
        return this;
    };
}();
// ax5.ui.binder
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "binder",
        version: "0.2.0"
    }, function () {

        /**
         * @class ax5binder
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myBinder = new ax5.ui.binder();
         * ```
         */
        var ax5binder = function ax5binder() {

            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {};
            cfg = this.config;

            this.model = {};
            this.tmpl = {};
            this.view_target = null;
            this.change_trigger = {};
            this.click_trigger = {};
            this.update_trigger = {};
            this.onerror = null;

            var _toString = Object.prototype.toString,
                get_type = function get_type(O) {
                var typeName;
                if (O != null && O == O.window) {
                    typeName = "window";
                } else if (!!(O && O.nodeType == 1)) {
                    typeName = "element";
                } else if (!!(O && O.nodeType == 11)) {
                    typeName = "fragment";
                } else if (typeof O === "undefined") {
                    typeName = "undefined";
                } else if (_toString.call(O) == "[object Object]") {
                    typeName = "object";
                } else if (_toString.call(O) == "[object Array]") {
                    typeName = "array";
                } else if (_toString.call(O) == "[object String]") {
                    typeName = "string";
                } else if (_toString.call(O) == "[object Number]") {
                    typeName = "number";
                } else if (_toString.call(O) == "[object NodeList]") {
                    typeName = "nodelist";
                } else if (typeof O === "function") {
                    typeName = "function";
                }
                return typeName;
            },
                get_mix_path = function get_mix_path(dataPath, index, item_path) {
                return dataPath + "[" + index + "]" + (item_path == "." ? "" : "." + item_path);
            },
                get_real_path = function get_real_path(_dataPath) {
                var path = [];
                var _path = [].concat(_dataPath.split(/[\.\[\]]/g));
                _path.forEach(function (n) {
                    if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                });
                _path = null;
                return path.join("");
                /*
                var path = [];
                var _path = [].concat(dataPath.split(/[\.\[\]]/g));
                 _path.forEach(function (n) {
                    if (n !== "") path.push(n);
                });
                _path = null;
                return "'" + path.join("']['") + "'";
                */
            };

            /**
             * 바인딩할 자바스크립트 오브젝트로 제이쿼리로 검색된 HTML dom 엘리먼트 에 바인딩합니다. 바인딩된 모델을 반환합니다.
             * @method ax5binder.setModel
             * @param {Object} model
             * @param {jQueryObject} [view_target]
             * @returns {ax5binder}
             * @example
             * ```js
             * var myModel = new ax5.ui.binder();
             * myModel.setModel({}, $("#..."));
             * ```
             */
            this.setModel = function (model, view_target) {
                this.model = model;
                if (!this.view_target && view_target) {
                    this.view_target = view_target;
                    this._binding();
                } else {
                    this._binding("update");
                }
                return this;
            };

            /**
             * data_path에 값을 변경한다. value의 타입은 (String, Number, Array, Object)를 지원.
             * @method ax5binder.set
             * @param {String} dataPath
             * @param {Object} value
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.set("name", "Seowoo");
             * myModel.set("obj.path", {a:1});
             * ```
             */
            this.set = function (dataPath, value) {
                var _this = this,
                    obj_type,
                    i,
                    this_type;

                Function("val", "this" + get_real_path(dataPath) + " = val;").call(this.model, value);
                obj_type = get_type(value);

                if (obj_type == "object") {
                    for (var k in value) {
                        this.set(dataPath + "." + k, value[k]);
                    }
                } else if (obj_type == "array") {
                    this.view_target.find('[data-ax-path="' + dataPath + '"]').each(function () {
                        this_type = (this.type || "").toLowerCase();
                        if (this_type == "checkbox" || this_type == "radio") _this.set_els_value(this, this.tagName.toLowerCase(), this_type, value, dataPath, "change");
                    });
                    i = value.length;
                    while (i--) {
                        this.set(dataPath + "[" + i + "]", value[i]);
                    }
                } else {
                    // apply data value to els
                    this.view_target.find('[data-ax-path="' + dataPath + '"]').each(function () {
                        _this.set_els_value(this, this.tagName.toLowerCase(), (this.type || "").toLowerCase(), value, dataPath, "change");
                    });
                }
                return this;
            };

            /**
             * data_path에 값을 반환한다. data_path 가 없으면 전체 Object를 반환한다.
             * @method ax5binder.get
             * @param dataPath
             * @returns {*}
             */
            this.get = function (dataPath) {
                if (typeof dataPath == "undefined") {
                    return this.model;
                } else {
                    return Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                }
            };

            /**
             * data_path에 값이 변경되는 이벤트 발생하면 callback을 실행합니다.
             * @method ax5binder.onChange
             * @param dataPath
             * @param callback
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.onChange("name", function () {
             *       console.log(this);
             *       // el: domElement - 변경이 발생한 엘리먼트, 엘리먼트로 부터 다양한 속성을 추출할 수 있다.
             *       // jquery : jQueryObject
             *       // tagname: "input"
             *       // value: "changed value"
             *       console.log(this.el.id);
             *   });
             *   myModel.onChange("*", function (n) {
             *       console.log(n);
             *       // console.log(this); 와 동일
             *   });
             * ```
             */
            this.onChange = function (dataPath, callback) {
                this.change_trigger[dataPath || "*"] = callback;
                return this;
            };

            /**
             * data-ax-repeat="list" 속성이 부여된 엘리먼트 하위에 태그중에 data-ax-repeat-click 속성을 가진 아이템에 대해 클릭 이벤트 발생하면 callback을 실행합니다.
             * @method ax5binder.onClick
             * @param dataPath
             * @param callback
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.onclick("list", function () {
             *       console.log(this);
             *       // el: domElement
             *       // jquery: jQueryObject
             *       // item: Object - repeat item
             *       // item_index: "0" - index of item
             *       // item_path: "list[0]" - repeat data_path
             *       // repeat_path: "list"
             *       // tagname: "button"
             *       // value: "add"
             *   });
             * ```
             */
            this.onClick = function (dataPath, callback) {
                this.click_trigger[dataPath] = callback;
                return this;
            };

            /**
             * data-ax-repeat="list" 하위아이템을 추가합니다.
             * @method ax5binder.add
             * @param dataPath
             * @param item
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.add("list", {a:1});
             * ```
             */
            this.add = function (dataPath, item) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var tmpl = this.tmpl[dataPath];
                item['@i'] = list.length;
                item['@r'] = list.length;
                item.__ADDED__ = true;
                Function("val", "this" + get_real_path(dataPath) + ".push(val);").call(this.model, item);

                // 다중 템플릿 처리
                for (var t in tmpl) {
                    var fragdom = $(ax5.mustache.render(tmpl[t].content, item));
                    fragdom.attr("data-ax-repeat-path", dataPath);
                    fragdom.attr("data-ax-repeat-i", item['@i']);
                    this.bind_event_tmpl(fragdom, dataPath);
                    tmpl[t].container.append(fragdom);
                }

                this.change("*");

                var callback = this.update_trigger[dataPath];
                if (callback) {
                    var that = {
                        repeat_path: dataPath,
                        tmpl: tmpl,
                        list: list
                    };
                    callback.call(that, that);
                }

                return this;
            };

            /**
             * data-ax-repeat="list" 하위 아이템을 제거합니다. 단! 이 때 ADDED 값을 가진 아이템은 제거하고 그렇지 않은 아이템은 DELETED 값을 아이템에 추가합니다.
             * @method ax5binder.remove
             * @param dataPath
             * @param index
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.remove("list", 0);
             * ```
             */
            this.remove = function (dataPath, index) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var tmpl = this.tmpl[dataPath];
                if (typeof index == "undefined") index = list.length - 1;
                var remove_item = list[index];
                if (remove_item.__ADDED__) {
                    list.splice(index, 1);
                } else {
                    list[index].__DELETED__ = true;
                }

                for (var t in tmpl) {
                    tmpl[t].container.empty();
                    this.print_tmpl(dataPath, tmpl[t]);
                }

                this.change("*");

                var callback = this.update_trigger[dataPath];
                if (callback) {
                    var that = {
                        repeat_path: dataPath,
                        tmpl: tmpl,
                        list: list
                    };
                    callback.call(that, that);
                }

                return this;
            };

            /**
             * data-ax-repeat="list" 하위 아이템을 교체합니다.
             * @method ax5binder.update
             * @param dataPath
             * @param index
             * @param item
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.update("list", 0, {a:1});
             * ```
             */
            this.update = function (dataPath, index, item) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var tmpl = this.tmpl[dataPath];
                if (typeof index != "undefined" && item) list.splice(index, 1, item);

                for (var t in tmpl) {
                    tmpl[t].container.empty();
                    this.print_tmpl(dataPath, tmpl[t]);
                }

                this.change("*");

                var callback = this.update_trigger[dataPath];
                if (callback) {
                    var that = {
                        repeat_path: dataPath,
                        tmpl: tmpl,
                        list: list
                    };
                    callback.call(that, that);
                }

                return this;
            };

            /**
             * @method ax5binder.childAdd
             * @param dataPath
             * @param index
             * @param child_path
             * @param child_item
             */
            this.childAdd = function (dataPath, index, child_path, child_item) {
                var _list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var list = Function("", "return this" + get_real_path(dataPath) + "[" + index + "]." + child_path + ";").call(this.model);
                child_item.__ADDED__ = true;
                list.push(child_item);
                this.update(dataPath, index, _list[index]);
            };

            /**
             * ax5binder.childRemove
             * @param dataPath
             * @param index
             * @param child_path
             * @param child_index
             */
            this.childRemove = function (dataPath, index, child_path, child_index) {
                var _list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var list = Function("", "return this" + get_real_path(dataPath) + "[" + index + "]." + child_path + ";").call(this.model);
                var remove_item = list[child_index];
                if (remove_item.__ADDED__) {
                    list.splice(child_index, 1);
                } else {
                    list[child_index].__DELETED__ = true;
                }
                this.update(dataPath, index, _list[index]);
            };

            /**
             * @method ax5binder.childUpdate
             * @param dataPath
             * @param index
             * @param child_path
             * @param child_index
             * @param child_item
             */
            this.childUpdate = function (dataPath, index, child_path, child_index, child_item) {
                var _list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var list = Function("", "return this" + get_real_path(dataPath) + "[" + index + "]." + child_path + ";").call(this.model);
                list[child_index] = child_item;
                this.update(dataPath, index, _list[index]);
            };

            /**
             * @method ax5binder.childSet
             * @param dataPath
             * @param index
             * @param child_path
             * @param value
             * @returns {ax5binder}
             */
            this.childSet = function (dataPath, index, child_path, value) {
                var _this = this,
                    i;
                Function("val", "this" + get_real_path(dataPath) + "[" + index + "]." + child_path + " = val;").call(this.model, value);

                // apply data value to els
                this.view_target.find('[data-ax-repeat="' + dataPath + '"]').find('[data-ax-repeat-i="' + index + '"]').find('[data-ax-item-path="' + child_path + '"]').each(function () {
                    _this.set_els_value(this, this.tagName.toLowerCase(), (this.type || "").toLowerCase(), value, dataPath + "[" + index + "]." + child_path);
                });
                return this;
            };

            /**
             * @method ax5binder.onUpdate
             * @param dataPath
             * @param callback
             * @returns {ax5binder}
             * @example
             * ```js
             *  this.model.onupdate("moderator", function () {
             *      $('#moderator-add').val('');
             *      $moderator.find('[data-role-user-btn]')
             *          .unbind("click")
             *          .bind("click", role_user_btn_onclick);
             *  });
             * ```
             */
            this.onUpdate = function (dataPath, callback) {
                this.update_trigger[dataPath] = callback;
                return this;
            };

            this._binding = function (isupdate) {
                var _this = this;

                // apply data value to els
                this.view_target.find('[data-ax-path]').each(function () {
                    var dom = $(this),
                        dataPath = dom.attr("data-ax-path"),
                        this_type = (this.type || "").toLowerCase();

                    var val;
                    try {
                        val = Function("", "return this" + get_real_path(dataPath) + ";").call(_this.model);
                    } catch (e) {
                        /**
                         * onerror를 선언 한 경우에만 에러 출력
                         * */
                        if (_this.onerror) _this.onerror("not found target [model." + get_real_path(dataPath) + "]");
                    }

                    _this.set_els_value(this, this.tagName.toLowerCase(), this_type, val || "", dataPath);
                });

                if (typeof isupdate == "undefined") {
                    // collect tmpl
                    this.view_target.find('[data-ax-repeat]').each(function () {
                        var dom = $(this),
                            dataPath = dom.attr("data-ax-repeat"),
                            repeat_idx = dom.attr("data-ax-repeat-idx");

                        if (typeof _this.tmpl[dataPath] == "undefined") _this.tmpl[dataPath] = {};
                        if (typeof repeat_idx != "undefined") {
                            _this.tmpl[dataPath][repeat_idx] = {
                                container: dom, content: dom.find("script").html()
                            };
                        } else {
                            _this.tmpl[dataPath]["0"] = {
                                container: dom, content: dom.find("script").html()
                            };
                        }
                        //dom.empty().show();
                        dom.empty();
                    });
                } else {
                    this.view_target.find('[data-ax-repeat]').each(function () {
                        var dom = $(this);
                        dom.empty().show();
                    });
                }

                // binding event to els
                this.view_target.find('[data-ax-path]').unbind("change.axbinder").bind("change.axbinder", function (e) {

                    var i,
                        hasItem = false,
                        checked,
                        new_value = [],
                        dom = $(e.target),
                        dataPath = dom.attr("data-ax-path"),
                        origin_value = Function("", "return this" + get_real_path(dataPath) + ";").call(_this.model),
                        this_type = (this.type || "").toLowerCase(),
                        value_type = get_type(origin_value),
                        setAllow = true;

                    if (value_type == "object" || value_type == "array") {
                        setAllow = false;
                    }

                    if (this_type == "checkbox") {
                        // 동일한 체크박스가 여러개 인지 판단합니다.
                        if (_this.view_target.find('[data-ax-path="' + dataPath + '"]').length > 1) {

                            if (get_type(origin_value) != "array") {
                                if (typeof origin_value === "undefined" || origin_value == "") origin_value = [];else origin_value = [].concat(origin_value);
                            }
                            i = origin_value.length, hasItem = false, checked = this.checked;
                            while (i--) {
                                if (origin_value[i] == this.value) {
                                    hasItem = true;
                                }
                            }

                            if (checked) {
                                if (!hasItem) origin_value.push(this.value);
                            } else {
                                i = origin_value.length;
                                while (i--) {
                                    if (origin_value[i] == this.value) {
                                        //hasItemIndex = i;
                                    } else {
                                        new_value.push(origin_value[i]);
                                    }
                                }
                                origin_value = new_value;
                            }
                        } else {
                            origin_value = this.checked ? this.value : "";
                        }

                        Function("val", "this" + get_real_path(dataPath) + " = val;").call(_this.model, origin_value);
                        _this.change(dataPath, {
                            el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: origin_value
                        });
                    } else {
                        if (setAllow) {
                            Function("val", "this" + get_real_path(dataPath) + " = val;").call(_this.model, this.value);
                            _this.change(dataPath, {
                                el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: this.value
                            });
                        }
                    }

                    dom.data("changedTime", new Date().getTime());
                });
                /*
                 this.view_target.find('[data-ax-path]').unbind("blur.axbinder").bind("blur.axbinder", function (e) {
                 var dom = $(e.target);
                 if (typeof dom.data("changedTime") == "undefined" || dom.data("changedTime") < (new Date()).getTime() - 10) dom.trigger("change");
                 });
                 */

                //_this.tmpl
                var callback;
                for (var tk in _this.tmpl) {
                    for (var ix in _this.tmpl[tk]) {
                        // console.log(_this.tmpl[tk][ix].content);
                        this.print_tmpl(tk, _this.tmpl[tk][ix], "isInit");
                    }

                    if (callback = this.update_trigger[tk]) {
                        var that = {
                            repeat_path: tk,
                            tmpl: _this.tmpl[tk],
                            list: Function("", "return this." + tk + ";").call(this.model)
                        };
                        callback.call(that, that);
                    }
                }
            };

            this.set_els_value = function (el, tagname, type, value, dataPath, callChange) {
                if (typeof value === "undefined") value = [];else value = [].concat(value);
                var options, i;

                if (tagname == "input") {
                    if (type == "checkbox" || type == "radio") {
                        i = value.length;
                        var checked = false;
                        try {
                            if (i > 0) {
                                while (i--) {
                                    if (typeof value[i] !== "undefined" && el.value === value[i].toString()) {
                                        checked = true;
                                    }
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        el.checked = checked;
                    } else {
                        el.value = value.join('');
                    }
                } else if (tagname == "select") {
                    options = el.options, i = options.length;
                    var vi,
                        option_matched = false;

                    while (i--) {
                        vi = value.length;
                        while (vi--) {
                            if (typeof value[vi] !== "undefined" && options[i].value === value[vi].toString()) {
                                options[i].selected = true;
                                option_matched = true;
                                break;
                            }
                        }
                        if (option_matched) break;
                    }
                    if (!option_matched) {
                        if (options[0]) {
                            options[0].selected = true;
                            Function("val", "this" + get_real_path(dataPath) + " = val;").call(this.model, options[0].value);
                        } else {
                            Function("val", "this" + get_real_path(dataPath) + " = val;").call(this.model, "");
                        }
                    }

                    if (window.AXSelect) {
                        // AXISJ 사용가능
                        $(typeof value !== "undefined" && el).bindSelectSetValue(value[value.length - 1]);
                    }
                } else if (tagname == "textarea") {
                    el.value = value.join('') || "";
                } else {
                    if (el.innerText) {
                        el.innerText = value.join("");
                    } else {
                        el.innerHTML = value.join("");
                    }
                }

                if (callChange) {
                    this.change(dataPath, { el: el, tagname: tagname, value: value });
                }
                return this;
            };

            this.change = function (dataPath, that) {
                var callback = this.change_trigger[dataPath];
                if (callback) {
                    callback.call(that, that);
                }
                if (dataPath != "*" && this.change_trigger["*"]) {
                    this.change_trigger["*"].call(that, that);
                }
            };

            this.click = function (dataPath, that) {
                var callback = this.click_trigger[dataPath];
                if (callback) {
                    callback.call(that, that);
                }
            };

            this.sync_model = function () {};

            this.print_tmpl = function (dataPath, tmpl, isInit) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                if (list && get_type(list) == "array") {
                    for (var i = 0, l = list.length; i < l; i++) {
                        var item = list[i];
                        if (jQuery.isPlainObject(item)) {
                            item['@i'] = i;
                            item['@r'] = i;
                            if (i === 0) item['@first'] = true;
                        } else {
                            item = {
                                "@i": i,
                                "@value": item
                            };
                            if (i === 0) item['@first'] = true;
                            console.log(item);
                        }

                        if (!item.__DELETED__) {
                            var fragdom = $(ax5.mustache.render(tmpl.content, item));
                            fragdom.attr("data-ax-repeat-path", dataPath);
                            fragdom.attr("data-ax-repeat-i", item['@i']);
                            this.bind_event_tmpl(fragdom, dataPath);
                            tmpl.container.append(fragdom);
                        }
                    }
                }
            };

            this.bind_event_tmpl = function (target, dataPath) {
                var _this = this,
                    index = target.attr("data-ax-repeat-i");
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);

                target.find('[data-ax-repeat-click]').unbind("click.axbinder").bind("click.axbinder", function (e) {
                    var target = ax5.util.findParentNode(e.target, function (el) {
                        return el.getAttribute("data-ax-repeat-click");
                    });
                    if (target) {
                        var dom = $(target),
                            value = dom.attr("data-ax-repeat-click"),
                            repeat_path = dom.attr("data-ax-repeat-path");

                        var that = {
                            el: target,
                            jquery: dom,
                            tagname: target.tagName.toLowerCase(),
                            value: value,
                            repeat_path: dataPath,
                            item: list[index],
                            item_index: index,
                            item_path: dataPath + "[" + index + "]"
                        };
                        _this.click(dataPath, that);
                    }
                });

                // apply data value to els
                target.find('[data-ax-item-path]').each(function () {
                    var dom = $(this),
                        item_path = dom.attr("data-ax-item-path"),
                        mix_path = get_mix_path(dataPath, index, item_path),
                        val,
                        this_type = (this.type || "").toLowerCase();

                    try {
                        val = Function("", "return this." + mix_path + ";").call(_this.model);
                    } catch (e) {
                        /**
                         * onerror를 선언 한 경우에만 에러 출력
                         * */
                        if (_this.onerror) _this.onerror("not found target [model." + mix_path + "]");
                    }
                    //if (typeof val !== "undefined") _this.set_els_value(this, this.tagName.toLowerCase(), this_type, val, mix_path);
                    _this.set_els_value(this, this.tagName.toLowerCase(), this_type, val || "", mix_path);
                });

                // binding event to els
                target.find('[data-ax-item-path]').unbind("change.axbinder").bind("change.axbinder", function (e) {
                    var i,
                        hasItem = false,
                        checked,
                        new_value = [],
                        this_type = (this.type || "").toLowerCase(),
                        dom = $(e.target),
                        item_path = dom.attr("data-ax-item-path"),
                        mix_path = get_mix_path(dataPath, index, item_path),
                        origin_value = Function("", "return this." + mix_path + ";").call(_this.model),
                        value_type = get_type(origin_value),
                        setAllow = true;

                    if (value_type == "object" || value_type == "array") {
                        setAllow = false;
                    }

                    if (this_type == "checkbox") {
                        if (target.find('[data-ax-item-path="' + item_path + '"]').length > 1) {
                            if (get_type(origin_value) != "array") {
                                if (typeof origin_value === "undefined" || origin_value == "") origin_value = [];else origin_value = [].concat(origin_value);
                            }
                            i = origin_value.length, hasItem = false, checked = this.checked;
                            while (i--) {
                                if (origin_value[i] == this.value) {
                                    hasItem = true;
                                }
                            }

                            if (checked) {
                                if (!hasItem) origin_value.push(this.value);
                            } else {
                                i = origin_value.length;
                                while (i--) {
                                    if (origin_value[i] == this.value) {
                                        //hasItemIndex = i;
                                    } else {
                                        new_value.push(origin_value[i]);
                                    }
                                }
                                origin_value = new_value;
                            }
                        } else {
                            origin_value = this.checked ? this.value : "";
                        }

                        Function("val", "this." + mix_path + " = val;").call(_this.model, origin_value);
                        _this.change(mix_path, {
                            el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: origin_value
                        });
                    } else {
                        if (setAllow) {
                            Function("val", "this." + mix_path + " = val;").call(_this.model, this.value);
                            _this.change(mix_path, {
                                el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: this.value
                            });
                        }
                    }

                    dom.data("changedTime", new Date().getTime());
                });
                target.find('[data-ax-item-path]').unbind("blur.axbinder").bind("blur.axbinder", function (e) {
                    var dom = $(e.target);
                    if (typeof dom.data("changedTime") == "undefined" || dom.data("changedTime") < new Date().getTime() - 10) dom.trigger("change");
                });
            };

            /**
             * @method ax5binder.focus
             * @param dataPath
             * @returns {ax5binder}
             */
            this.focus = function (dataPath) {
                this.view_target.find('[data-ax-path="' + dataPath + '"]').focus();
                //this.view_target.find('[data-ax-item-path="' + get_real_path(dataPath) + '"]').focus();
                return this;
            };

            /**
             * @method ax5binder.validate
             * @returns {*}
             * @example
             * ```html
             * <input type="text" data-ax-path="q" data-ax-validate="required" title="이름" maxlength="8" value=""/>
             * ```
             * ```js
             * var rs = myModel.validate(), _s;
             * console.log(rs); // 결과를 체크 해보세요
             * if(rs.error) {
             *      _s = rs.error[0].jquery.attr("title");
             *      alert("" + _s + "(은)는 필수 입력사항입니다." + _s + "(을)를 입력하세요");
             *      rs.error[0].el.focus();
             *      return;
             *  }
             * ```
             */
            this.validate = function () {
                var _this = this;
                var errors = [];
                this.view_target.find('[data-ax-path]').each(function () {
                    var dom = $(this),
                        dataPath = dom.attr("data-ax-path"),
                        is_validate = dom.attr("data-ax-validate");
                    if (is_validate) {
                        var val = Function("", "return this" + get_real_path(dataPath) + ";").call(_this.model);
                        if (typeof val === "undefined") val = "";
                        var _val = val.toString();

                        var is_error = false;
                        if (is_validate == "required" && _val.trim() == "") {
                            is_error = true;
                        } else if (!/\D.?/g.test(is_validate) && _val.trim().length < is_validate.number()) {
                            is_error = true;
                        }

                        if (is_error) {
                            errors.push({
                                type: is_validate,
                                dataPath: dataPath,
                                el: this,
                                jquery: dom,
                                value: val
                            });
                        }
                    }
                });
                this.view_target.find('[data-ax-repeat-path]').each(function () {

                    var dom = $(this),
                        dataPath = dom.attr("data-ax-repeat-path"),
                        repeat_idx = dom.attr("data-ax-repeat-i");

                    dom.find('[data-ax-validate]').each(function () {
                        var dom = $(this),
                            is_validate = dom.attr("data-ax-validate"),
                            item_path = dom.attr("data-ax-item-path");
                        var val = Function("", "return this" + get_real_path(dataPath) + "[" + repeat_idx + "]." + item_path + ";").call(_this.model);
                        if (typeof val === "undefined") val = "";
                        var _val = val.toString();

                        if (is_validate) {
                            var is_error = false;
                            if (is_validate == "required" && _val.trim() == "") {
                                is_error = true;
                            } else if (!/\D.?/g.test(is_validate) && _val.trim().length < is_validate.number()) {
                                is_error = true;
                            }

                            if (is_error) {
                                errors.push({
                                    type: is_validate,
                                    dataPath: dataPath,
                                    el: this,
                                    jquery: dom,
                                    value: val
                                });
                            }
                        }
                    });
                });

                if (errors.length > 0) {
                    return {
                        error: errors
                    };
                } else {
                    return {};
                }
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5binder;
    }());
})();
// ax5.ui.multiUploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "multiUploader",
        version: "0.0.1"
    }, function () {
        /**
         * @class ax5multiUploader
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myuploader = new ax5.ui.multiUploader();
         * ```
         */
        var ax5multiUploader = function ax5multiUploader() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                file_types: "*/*"
            };
            this.queue = [];
            this.target = null;
            this.selectedFile = null;
            this.uploadedFile = null;

            cfg = this.config;

            this.init = function () {};

            // 클래스 생성자
            this.main = function () {

                UI.multiUploader_instance = UI.multiUploader_instance || [];
                UI.multiUploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    //this.init();
                }
            }.apply(this, arguments);
        };
        return ax5multiUploader;
    }());
})();

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.autocomplete
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var AUTOCOMPLETE;

    UI.addClass({
        className: "autocomplete",
        version: "0.0.5"
    }, function () {
        /**
         * @class ax5autocomplete
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         *
         * ```
         */
        var ax5autocomplete = function ax5autocomplete() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                removeIcon: 'X',
                lang: {
                    noSelected: '',
                    noOptions: 'no options',
                    loading: 'Now Processing'
                },
                columnKeys: {
                    optionValue: 'value',
                    optionText: 'text',
                    optionSelected: 'selected'
                }
            };

            this.queue = [];
            this.activeautocompleteOptionGroup = null;
            this.activeautocompleteQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;
            this.waitOptionsCallback = null;
            this.keyUpTimer = null;

            cfg = this.config;

            var ctrlKeys = {
                "18": "KEY_ALT",
                //"8": "KEY_BACKSPACE",
                "17": "KEY_CONTROL",
                "46": "KEY_DELETE",
                "40": "KEY_DOWN",
                "35": "KEY_END",
                "187": "KEY_EQUAL",
                //"27": "KEY_ESC",
                "36": "KEY_HOME",
                "45": "KEY_INSERT",
                "37": "KEY_LEFT",
                "189": "KEY_MINUS",
                "34": "KEY_PAGEDOWN",
                "33": "KEY_PAGEUP",
                // "190": "KEY_PERIOD",
                //"13": "KEY_RETURN",
                "39": "KEY_RIGHT",
                "16": "KEY_SHIFT",
                // "32": "KEY_SPACE",
                "9": "KEY_TAB",
                "38": "KEY_UP",
                "91": "KEY_WINDOW"
                //"107" : "NUMPAD_ADD",
                //"194" : "NUMPAD_COMMA",
                //"110" : "NUMPAD_DECIMAL",
                //"111" : "NUMPAD_DIVIDE",
                //"12" : "NUMPAD_EQUAL",
                //"106" : "NUMPAD_MULTIPLY",
                //"109" : "NUMPAD_SUBTRACT"
            },
                onStateChanged = function onStateChanged(item, that) {
                if (item && item.onStateChanged) {
                    item.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                if (that.state == "changeValue") {
                    if (item && item.onChange) {
                        item.onChange.call(that, that);
                    } else if (this.onChange) {
                        this.onChange.call(that, that);
                    }
                }

                item = null;
                that = null;
                return true;
            },
                alignAutocompleteDisplay = function alignAutocompleteDisplay() {
                var i = this.queue.length,
                    w;

                while (i--) {
                    var item = this.queue[i];
                    if (item.$display) {
                        w = Math.max(item.$select.outerWidth(), U.number(item.minWidth));
                        item.$display.css({
                            "min-width": w
                        });
                        if (item.reset) {
                            item.$display.find(".addon-icon-reset").css({
                                "line-height": this.queue[i].$display.height() + "px"
                            });
                        }

                        // 높이조절 처리
                        if (item.multiple) {
                            var displayTableHeightAdjust = function () {
                                return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                            }.call(this);
                            item.$target.height('');
                            item.$display.height('');

                            var displayTableHeight = item.$displayTable.outerHeight();
                            if (Math.abs(displayTableHeight - item.$target.height()) > displayTableHeightAdjust) {
                                item.$target.css({ height: displayTableHeight + displayTableHeightAdjust });
                                item.$display.css({ height: displayTableHeight + displayTableHeightAdjust });
                            }
                        }
                    }
                }

                i = null;
                w = null;
                return this;
            },
                alignAutocompleteOptionGroup = function alignAutocompleteOptionGroup(append) {
                if (!this.activeautocompleteOptionGroup) return this;

                var item = this.queue[this.activeautocompleteQueueIndex],
                    pos = {},
                    dim = {};

                if (append) jQuery(document.body).append(this.activeautocompleteOptionGroup);

                pos = item.$target.offset();
                dim = {
                    width: item.$target.outerWidth(),
                    height: item.$target.outerHeight()
                };

                // picker css(width, left, top) & direction 결정
                if (!item.direction || item.direction === "" || item.direction === "auto") {
                    // set direction
                    item.direction = "top";
                }

                if (append) {
                    this.activeautocompleteOptionGroup.addClass("direction-" + item.direction);
                }
                this.activeautocompleteOptionGroup.css(function () {
                    if (item.direction == "top") {
                        return {
                            left: pos.left,
                            top: pos.top + dim.height + 1,
                            width: dim.width
                        };
                    } else if (item.direction == "bottom") {
                        return {
                            left: pos.left,
                            top: pos.top - this.activeautocompleteOptionGroup.outerHeight() - 1,
                            width: dim.width
                        };
                    }
                }.call(this));
            },
                onBodyClick = function onBodyClick(e, target) {
                if (!this.activeautocompleteOptionGroup) return this;

                var item = this.queue[this.activeautocompleteQueueIndex],
                    clickEl = "display";

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-option-value")) {
                        clickEl = "optionItem";
                        return true;
                    } else if (item.$target.get(0) == target) {
                        clickEl = "display";
                        return true;
                    }
                });

                if (!target) {
                    this.close();
                    return this;
                } else if (clickEl === "optionItem") {
                    setSelected.call(this, item.id, {
                        optionIndex: {
                            index: target.getAttribute("data-option-index")
                        }
                    }, undefined, "optionItemClick");

                    U.selectRange(item.$displayLabel, "end"); // 포커스 end || selectAll
                    if (!item.multiple) {
                        this.close();
                    }
                } else {
                    //open and display click
                    //console.log(this.instanceId);
                }

                return this;
            },
                onBodyKeyup = function onBodyKeyup(e) {
                // 옵션 선택 후 키업
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    blurLabel.call(this, this.activeautocompleteQueueIndex);
                    this.close();
                } else if (e.which == ax5.info.eventKeys.RETURN) {
                    var values = [];
                    var item = this.queue[this.activeautocompleteQueueIndex];
                    var childNodes = item.$displayLabel.get(0).childNodes;
                    for (var i = 0, l = childNodes.length; i < l; i++) {
                        var node = childNodes[i];
                        // nodeType:1 - span, nodeType:3 - text
                        if (node.nodeType in AUTOCOMPLETE.util.nodeTypeProcessor) {
                            var value = AUTOCOMPLETE.util.nodeTypeProcessor[node.nodeType].call(this, this.activeautocompleteQueueIndex, node);
                            if (typeof value !== "undefined") values.push(value);
                        }
                    }

                    setSelected.call(this, item.id, values, true); // set Value
                    focusLabel.call(this, this.activeautocompleteQueueIndex);
                    if (!item.multiple) this.close();
                }
            },
                getLabel = function getLabel(queIdx) {
                var item = this.queue[queIdx];

                // 템플릿에 전달 해야할 데이터 선언
                var data = {};
                data.id = item.id;
                data.theme = item.theme;
                data.size = "ax5autocomplete-option-group-" + item.size;
                data.multiple = item.multiple;
                data.lang = item.lang;
                data.options = item.options;
                data.selected = item.selected;
                data.hasSelected = data.selected && data.selected.length > 0;
                data.removeIcon = item.removeIcon;
                return AUTOCOMPLETE.tmpl.get.call(this, "label", data, item.columnKeys) + "&nbsp;";
            },
                syncLabel = function syncLabel(queIdx) {
                var item = this.queue[queIdx],
                    displayTableHeight;

                if (!item.multiple && item.selected && item.selected.length > 0) {
                    item.selected = [].concat(item.selected[item.selected.length - 1]);
                }

                item.selected.forEach(function (n, nindex) {
                    n["@index"] = nindex;
                });

                item.$select.html(AUTOCOMPLETE.tmpl.get.call(this, "formSelectOptions", {
                    selected: item.selected
                }, item.columnKeys));

                item.$displayLabel.html(getLabel.call(this, queIdx));
                item.$target.height('');
                item.$display.height('');

                // label 사이즈 체크
                if (item.$target.height() < (displayTableHeight = item.$displayTable.outerHeight())) {
                    var displayTableHeightAdjust = function () {
                        return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                    }();
                    item.$target.css({ height: displayTableHeight + displayTableHeightAdjust });
                    item.$display.css({ height: displayTableHeight + displayTableHeightAdjust });
                }
            },
                focusLabel = function focusLabel(queIdx) {
                this.queue[queIdx].$displayLabel.trigger("focus");
                U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
            },
                blurLabel = function blurLabel(queIdx) {
                this.queue[queIdx].$displayLabel.trigger("blur");
            },
                onSearch = function onSearch(queIdx, searchWord) {
                if (this.activeautocompleteQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.
                var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                searchWord = searchWord.replace(regExp, "");

                this.queue[queIdx].waitOptions = true;
                this.queue[queIdx].onSearch.call({
                    self: this,
                    item: this.queue[queIdx],
                    searchWord: searchWord
                }, function (O) {

                    var data = {};
                    var item = this.queue[this.activeautocompleteQueueIndex];
                    if (!item) return false;

                    /// 현재 selected 검증후 처리
                    (function (item, O) {
                        var optionsMap = {};
                        O.options.forEach(function (_O, _OIndex) {
                            _O["@index"] = _OIndex;
                            _O["@findex"] = _OIndex;
                            optionsMap[_O[item.columnKeys.optionValue]] = _O;
                        });
                        if (U.isArray(item.selected)) {
                            item.selected.forEach(function (_O) {
                                if (optionsMap[_O[item.columnKeys.optionValue]]) {
                                    O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected] = true;
                                }
                            });
                        }
                    })(item, O);

                    item.options = O.options;

                    alignAutocompleteDisplay.call(this);

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5autocomplete-option-group-" + item.size;
                    data.multiple = item.multiple;
                    data.lang = item.lang;
                    data.options = item.options;
                    this.activeautocompleteOptionGroup.find('[data-els="content"]').html(jQuery(AUTOCOMPLETE.tmpl.get.call(this, "options", data, item.columnKeys)));

                    focusWord.call(this, this.activeautocompleteQueueIndex, searchWord);
                }.bind(this));
            },
                focusWord = function focusWord(queIdx, searchWord) {
                if (this.activeautocompleteQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.
                var collect_options = [],
                    i = -1,
                    l = this.queue[queIdx].options.length - 1,
                    n;
                if (searchWord != "") {
                    while (l - i++) {
                        n = this.queue[queIdx].options[i];

                        if (('' + n.text).toLowerCase() == searchWord.toLowerCase()) {
                            collect_options = [{ '@findex': n['@findex'], optionsSort: 0 }];
                            break;
                        } else {
                            var sort = ('' + n.text).toLowerCase().search(searchWord.toLowerCase());
                            if (sort > -1) {
                                collect_options.push({ '@findex': n['@findex'], optionsSort: sort });
                                if (collect_options.length > 2) break;
                            }
                            sort = null;
                        }
                    }
                    collect_options.sort(function (a, b) {
                        return a.optionsSort - b.optionsSort;
                    });
                }

                if (collect_options && collect_options.length > 0) {
                    focusMove.call(this, queIdx, undefined, collect_options[0]['@findex']);
                } else {
                    focusClear.call(this, queIdx);
                }
            },
                focusClear = function focusClear(queIdx) {
                if (this.activeautocompleteOptionGroup) {
                    this.activeautocompleteOptionGroup.find('[data-option-focus-index]').removeClass("hover").removeAttr("data-option-selected");
                }

                this.queue[queIdx].optionFocusIndex = -1;
            },
                focusMove = function focusMove(queIdx, direction, findex) {
                var _focusIndex, _prevFocusIndex, focusOptionEl, optionGroupScrollContainer;
                var item = this.queue[queIdx];

                if (this.activeautocompleteOptionGroup && item.options && item.options.length > 0) {

                    if (typeof findex !== "undefined") {
                        _focusIndex = findex;
                    } else {
                        _prevFocusIndex = item.optionFocusIndex == -1 ? item.optionSelectedIndex || -1 : item.optionFocusIndex;
                        if (_prevFocusIndex == -1) {
                            _focusIndex = 0;
                            //_focusIndex = (direction > 0) ? 0 : item.optionItemLength - 1; // 맨 끝으로 보낼것인가 말 것인가.
                        } else {
                            _focusIndex = _prevFocusIndex + direction;
                            if (_focusIndex < 0) _focusIndex = 0;else if (_focusIndex > item.optionItemLength - 1) _focusIndex = item.optionItemLength - 1;
                        }
                    }

                    item.optionFocusIndex = _focusIndex;

                    // 포커스 인덱스가 hide아이템을 만나면 hide 아이템이 안나올 때까지 루프를 순회 합니다.
                    if (item.options[_focusIndex] && item.options[_focusIndex].hide) {
                        // 옵션이 없는 값이 선택된 경우
                        if (typeof direction === "undefined") {
                            return this;
                        } else {
                            var isStrop = false;
                            while (item.options[_focusIndex].hide) {
                                _focusIndex = _focusIndex + direction;
                                if (_focusIndex < 0) {
                                    _focusIndex = 0;
                                    break;
                                } else if (_focusIndex > item.optionItemLength - 1) {
                                    _focusIndex = item.optionItemLength - 1;
                                    break;
                                }
                            }
                        }
                    }

                    if (typeof _focusIndex !== "undefined") {
                        this.activeautocompleteOptionGroup.find('[data-option-focus-index]').removeClass("hover");

                        focusOptionEl = this.activeautocompleteOptionGroup.find('[data-option-focus-index="' + _focusIndex + '"]').addClass("hover");

                        optionGroupScrollContainer = this.activeautocompleteOptionGroup.find('[data-els="content"]');

                        if (focusOptionEl.get(0)) {
                            var focusOptionElHeight = focusOptionEl.outerHeight(),
                                optionGroupScrollContainerHeight = optionGroupScrollContainer.innerHeight(),
                                optionGroupScrollContainerScrollTop = optionGroupScrollContainer.scrollTop(),
                                focusOptionElTop = focusOptionEl.position().top + optionGroupScrollContainer.scrollTop();

                            if (optionGroupScrollContainerHeight + optionGroupScrollContainerScrollTop < focusOptionElTop + focusOptionElHeight) {
                                optionGroupScrollContainer.scrollTop(focusOptionElTop + focusOptionElHeight - optionGroupScrollContainerHeight);
                            } else if (optionGroupScrollContainerScrollTop > focusOptionElTop) {
                                optionGroupScrollContainer.scrollTop(focusOptionElTop);
                            }
                            // optionGroup scroll check

                            if (typeof direction !== "undefined") {
                                /*
                                // 방향이 있으면 커서 업/다운 아니면 사용자 키보드 입력
                                // 방향이 있으면 라벨 값을 수정
                                var childNodes = item.$displayLabel.get(0).childNodes;
                                var lastNode = childNodes[childNodes.length - 1];
                                if (lastNode && lastNode.nodeType == '3') {
                                    //lastNode.nodeValue = item.options[_focusIndex].text;
                                    U.selectRange(item.$displayLabel, "end");
                                } else if (lastNode && lastNode.nodeType == '1') {
                                    //jQuery(lastNode).after(item.options[_focusIndex].text);
                                    U.selectRange(item.$displayLabel, "end");
                                }
                                */
                                U.selectRange(item.$displayLabel, "end");
                            }
                        }
                    }
                }
            },
                getQueIdx = function getQueIdx(boundID) {
                if (boundID instanceof jQuery) {
                    boundID = boundID.data("data-ax5autocomplete-id");
                } else if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-ax5autocomplete-id");
                }
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "getQueIdx"));
                    return;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            },
                getSelected = function getSelected(_item, o, selected) {
                if (typeof selected === "undefined") {
                    return _item.multiple ? !o : true;
                } else {
                    return selected;
                }
            },
                clearSelected = function clearSelected(queIdx) {
                this.queue[queIdx].options.forEach(function (n) {
                    if (n.optgroup) {
                        n.options.forEach(function (nn) {
                            nn.selected = false;
                        });
                    } else {
                        n.selected = false;
                    }
                });
            },
                setSelected = function () {
                var processor = {
                    'selectedIndex': function selectedIndex(queIdx, value, selected, setValueType) {},
                    'removeSelectedIndex': function removeSelectedIndex(queIdx, value, selected, setValueType) {
                        var item = this.queue[queIdx],
                            addOptions = {};
                        var newSelectedArray = [],
                            optionIndex = 0;
                        for (var i = 0; i < item.selected.length; i++) {
                            if (item.selected[i]['@index'] != value.removeSelectedIndex.index) {
                                addOptions = { '@index': optionIndex, '@findex': optionIndex };
                                addOptions[item.columnKeys.optionValue] = item.selected[i][item.columnKeys.optionValue];
                                addOptions[item.columnKeys.optionText] = item.selected[i][item.columnKeys.optionText];
                                newSelectedArray.push(addOptions);
                                optionIndex++;
                            }
                        }
                        item.selected = newSelectedArray;
                    },
                    'optionIndex': function optionIndex(queIdx, value, selected, setValueType) {
                        var item = this.queue[queIdx],
                            addOptions = {};
                        var optionIndex = item.selected.length;
                        var pushOk = true;

                        addOptions = {
                            '@index': optionIndex, '@findex': optionIndex
                        };
                        addOptions[item.columnKeys.optionValue] = item.options[value.optionIndex.index][item.columnKeys.optionValue];
                        addOptions[item.columnKeys.optionText] = item.options[value.optionIndex.index][item.columnKeys.optionText];

                        for (var i = 0; i < item.selected.length; i++) {
                            if (item.selected[i][item.columnKeys.optionValue] == addOptions[item.columnKeys.optionValue]) {
                                pushOk = false;
                            }
                        }
                        if (pushOk) item.selected.push(addOptions);
                    },
                    'arr': function arr(queIdx, values, selected, setValueType) {
                        values.forEach(function (value) {
                            if (U.isString(value) || U.isNumber(value)) {
                                processor.text.call(self, queIdx, value, selected, "justSetValue");
                            } else {
                                for (var key in processor) {
                                    if (value[key]) {
                                        processor[key].call(self, queIdx, value, selected, "justSetValue");
                                        break;
                                    }
                                }
                            }
                        });
                    },
                    'value': function value(queIdx, _value4, selected, setValueType) {
                        var item = this.queue[queIdx];
                        var addOptions;
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionValue] == _value4.value[item.columnKeys.optionValue];
                        });

                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);

                            if (item.options[optionIndex][item.columnKeys.optionSelected]) {
                                var appendOk = true;
                                for (var i = 0; i < item.selected.length; i++) {
                                    if (item.selected[i][cfg.columnKeys.optionValue] == item.options[optionIndex][cfg.columnKeys.optionValue]) {
                                        appendOk = false;
                                        break;
                                    }
                                }
                                if (appendOk) {
                                    addOptions = {};
                                    addOptions[item.columnKeys.optionValue] = item.options[optionIndex][item.columnKeys.optionValue];
                                    addOptions[item.columnKeys.optionText] = item.options[optionIndex][item.columnKeys.optionText];
                                    item.selected.push(addOptions);
                                }
                            } else {
                                var newSelectedArray = [];
                                for (var i = 0; i < item.selected.length; i++) {
                                    if (item.selected[i][cfg.columnKeys.optionValue] == item.options[optionIndex][cfg.columnKeys.optionValue]) {} else {
                                        addOptions = {};
                                        addOptions[item.columnKeys.optionValue] = item.selected[i][item.columnKeys.optionValue];
                                        addOptions[item.columnKeys.optionText] = item.selected[i][item.columnKeys.optionText];
                                        newSelectedArray.push(addOptions);
                                    }
                                }
                                item.selected = newSelectedArray;
                            }
                        } else {
                            // 새로운 값 추가
                            var appendOk = true;
                            for (var i = 0; i < item.selected.length; i++) {
                                if (item.selected[i][cfg.columnKeys.optionValue] == _value4.value[cfg.columnKeys.optionValue]) {
                                    appendOk = false;
                                    break;
                                }
                            }

                            if (appendOk) {
                                addOptions = {};
                                addOptions[item.columnKeys.optionValue] = _value4.value[cfg.columnKeys.optionValue];
                                addOptions[item.columnKeys.optionText] = _value4.value[cfg.columnKeys.optionText];
                                item.selected.push(addOptions);
                            }
                        }
                    },
                    'text': function text(queIdx, value, selected, setValueType) {
                        var item = this.queue[queIdx];
                        var addOptions;
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionText] == value;
                        });

                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);

                            if (item.options[optionIndex][item.columnKeys.optionSelected]) {
                                var appendOk = true;
                                for (var i = 0; i < item.selected.length; i++) {
                                    if (item.selected[i][cfg.columnKeys.optionText] == item.options[optionIndex][cfg.columnKeys.optionText]) {
                                        appendOk = false;
                                        break;
                                    }
                                }
                                if (appendOk) {
                                    addOptions = {};
                                    addOptions[item.columnKeys.optionValue] = item.options[optionIndex][item.columnKeys.optionValue];
                                    addOptions[item.columnKeys.optionText] = item.options[optionIndex][item.columnKeys.optionText];
                                    item.selected.push(addOptions);
                                }
                            } else {
                                var newSelectedArray = [];
                                for (var i = 0; i < item.selected.length; i++) {
                                    if (item.selected[i][cfg.columnKeys.optionText] == item.options[optionIndex][cfg.columnKeys.optionText]) {} else {
                                        addOptions = {};
                                        addOptions[item.columnKeys.optionValue] = item.selected[i][item.columnKeys.optionValue];
                                        addOptions[item.columnKeys.optionText] = item.selected[i][item.columnKeys.optionText];
                                        newSelectedArray.push(addOptions);
                                    }
                                }
                                item.selected = newSelectedArray;
                            }
                        } else {
                            // 새로운 값 추가
                            var appendOk = true;
                            for (var i = 0; i < item.selected.length; i++) {
                                if (item.selected[i][cfg.columnKeys.optionText] == value) {
                                    appendOk = false;
                                    break;
                                }
                            }

                            if (appendOk) {
                                addOptions = {};
                                addOptions[item.columnKeys.optionValue] = value;
                                addOptions[item.columnKeys.optionText] = value;
                                item.selected.push(addOptions);
                            }
                        }
                    },
                    'clear': function clear(queIdx) {
                        clearSelected.call(this, queIdx);
                        focusClear.call(this, queIdx);

                        if (this.activeautocompleteOptionGroup) {
                            this.activeautocompleteOptionGroup.find('[data-option-index]').attr("data-option-Selected", "false");
                        }
                        this.queue[queIdx].optionSelectedIndex = -1;
                    }
                };
                return function (boundID, value, selected, _option) {

                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                        return;
                    }

                    if (typeof value == "undefined") {
                        throw "error not found value";
                    } else if (U.isArray(value)) {
                        processor.clear.call(this, queIdx);
                        processor.arr.call(this, queIdx, this.queue[queIdx].multiple || value.length == 0 ? value : [value[value.length - 1]], selected);
                    } else if (U.isString(value) || U.isNumber(value)) {
                        if (typeof value !== "undefined" && value !== null && !this.queue[queIdx].multiple) {
                            clearSelected.call(this, queIdx);
                        }
                        processor.text.call(this, queIdx, value, selected);
                    } else {
                        if (value === null) {
                            processor.clear.call(this, queIdx);
                        } else {
                            if (!this.queue[queIdx].multiple) {
                                clearSelected.call(this, queIdx);
                            }
                            for (var key in processor) {
                                if (value[key]) {
                                    processor[key].call(this, queIdx, value, selected);
                                    break;
                                }
                            }
                        }
                    }

                    syncLabel.call(this, queIdx);
                    alignAutocompleteOptionGroup.call(this);

                    if (typeof value !== "undefined") {
                        if (_option && !_option.noStateChange) {
                            onStateChanged.call(this, this.queue[queIdx], {
                                self: this,
                                item: this.queue[queIdx],
                                state: "changeValue",
                                value: this.queue[queIdx].selected
                            });
                        }
                    }

                    boundID = null;
                    return this;
                };
            }();

            /// private end

            /**
             * Preferences of autocomplete UI
             * @method ax5autocomplete.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5autocomplete}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onChange = cfg.onChange;
                jQuery(window).bind("resize.ax5autocomplete-display-" + this.instanceId, function () {
                    alignAutocompleteDisplay.call(this);
                }.bind(this));
            };

            /**
             * bind autocomplete
             * @method ax5autocomplete.bind
             * @param {Object} item
             * @param {String} [item.id]
             * @param {String} [item.theme]
             * @param {Boolean} [item.multiple]
             * @param {Element} item.target
             * @returns {ax5autocomplete}
             */
            this.bind = function (item) {
                var bindAutocompleteTarget = function () {
                    var debouncedFocusWord = U.debounce(function (queIdx) {
                        if (this.activeautocompleteQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.

                        var values = [];
                        var searchWord = "";
                        var resetSelected = false;
                        var item = this.queue[queIdx];
                        var childNodes = item.$displayLabel.get(0).childNodes;

                        for (var i = 0, l = childNodes.length; i < l; i++) {
                            var node = childNodes[i];

                            if (node.nodeType in AUTOCOMPLETE.util.nodeTypeProcessor) {
                                var value = AUTOCOMPLETE.util.nodeTypeProcessor[node.nodeType].call(this, this.activeautocompleteQueueIndex, node, true);
                                if (typeof value === "undefined") {
                                    //
                                } else if (U.isString(value)) {
                                    searchWord = value;
                                } else {
                                    if (value.removeSelectedIndex) {
                                        resetSelected = true;
                                    }
                                    values.push(value);
                                }
                            }
                        }

                        if (childNodes.length == 0) {
                            setSelected.call(this, item.id, null, undefined, "internal"); // clear value
                        } else if (searchWord != "") {
                            onSearch.call(self, queIdx, searchWord);
                        } else if (resetSelected) {
                            setSelected.call(this, item.id, values, undefined, "internal"); // set Value
                            U.selectRange(item.$displayLabel, "end"); // label focus end
                            self.close();
                        }
                    }, 150);

                    var blurLabel = function blurLabel(queIdx) {
                        var values = [];
                        var item = this.queue[queIdx];
                        var editingText;
                        var childNodes = item.$displayLabel.get(0).childNodes;

                        for (var i = 0, l = childNodes.length; i < l; i++) {
                            var node = childNodes[i];
                            if (node.nodeType in AUTOCOMPLETE.util.nodeTypeProcessor) {
                                var value = AUTOCOMPLETE.util.nodeTypeProcessor[node.nodeType].call(this, queIdx, node, true);
                                if (typeof value === "undefined") {
                                    //
                                } else if (U.isString(value)) {
                                    //editingText = value;
                                    //values.push(value);
                                } else {
                                    values.push(value);
                                }
                            }
                        }

                        setSelected.call(this, item.id, values, undefined, "blurLabel"); // set Value
                    };

                    var autocompleteEvent = {
                        'click': function click(queIdx, e) {
                            var clickEl;
                            var target = U.findParentNode(e.target, function (target) {
                                if (target.getAttribute("data-ax5autocomplete-remove")) {
                                    clickEl = "optionItemRemove";
                                    return true;
                                } else if (target.getAttribute("data-selected-clear")) {
                                    clickEl = "clear";
                                    return true;
                                }
                            });

                            if (target) {
                                if (clickEl === "optionItemRemove") {
                                    var removeIndex = target.getAttribute("data-ax5autocomplete-remove-index");
                                    this.queue[queIdx].selected.splice(removeIndex, 1);
                                    syncLabel.call(this, queIdx);
                                    focusLabel.call(this, queIdx);
                                    U.stopEvent(e);
                                    return this;
                                } else if (clickEl === "clear") {
                                    setSelected.call(this, queIdx, { clear: true });
                                }
                            } else {
                                if (self.activeautocompleteQueueIndex == queIdx) {
                                    if (this.queue[queIdx].optionFocusIndex == -1) {
                                        // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                                        self.close();
                                    }
                                } else {
                                    if (this.queue[queIdx].$displayLabel.text().replace(/^\W*|\W*$/g, '') == "") {
                                        this.queue[queIdx].$displayLabel.html(getLabel.call(this, queIdx));
                                        focusLabel.call(this, queIdx);
                                    }
                                }
                            }
                        },
                        'keyUp': function keyUp(queIdx, e) {
                            /// 약속된 키 이벤트가 발생하면 stopEvent를 통해 keyUp 이벤트가 발생되지 않도록 막아주는 센스
                            if (e.which == ax5.info.eventKeys.ESC && self.activeautocompleteQueueIndex === -1) {
                                // ESC키를 누르고 옵션그룹이 열려있지 않은 경우
                                U.stopEvent(e);
                                return this;
                            }
                            if (self.activeautocompleteQueueIndex != queIdx) {
                                // 닫힌 상태 인경우
                                self.open(queIdx);
                                U.stopEvent(e);
                            }
                            if (ctrlKeys[e.which]) {
                                U.stopEvent(e);
                            } else {
                                debouncedFocusWord.call(this, queIdx);
                            }
                        },
                        'keyDown': function keyDown(queIdx, e) {
                            if (e.which == ax5.info.eventKeys.ESC) {
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.RETURN) {
                                // display label에서 줄넘김막기위한 구문
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.DOWN) {
                                focusMove.call(this, queIdx, 1);
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.UP) {
                                focusMove.call(this, queIdx, -1);
                                U.stopEvent(e);
                            }
                        },
                        'focus': function focus(queIdx, e) {
                            //console.log(e);
                            U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
                        },
                        'blur': function blur(queIdx, e) {
                            blurLabel.call(this, queIdx);
                            U.stopEvent(e);
                        },
                        'selectChange': function selectChange(queIdx, e) {
                            setSelected.call(this, queIdx, { value: this.queue[queIdx].$select.val() }, true);
                        }
                    };

                    return function (queIdx) {
                        var item = this.queue[queIdx];
                        var data = {};

                        if (!item.$display) {
                            /// 템플릿에 전달할 오브젝트 선언
                            data.instanceId = this.instanceId;
                            data.id = item.id;
                            data.name = item.name;
                            data.theme = item.theme;
                            data.tabIndex = item.tabIndex;
                            data.multiple = item.multiple;
                            data.reset = item.reset;

                            data.label = getLabel.call(this, queIdx);
                            data.formSize = function () {
                                return item.size ? "input-" + item.size : "";
                            }();

                            item.$display = jQuery(AUTOCOMPLETE.tmpl.get.call(this, "autocompleteDisplay", data, item.columnKeys));
                            item.$displayTable = item.$display.find('[data-els="display-table"]');
                            item.$displayLabel = item.$display.find('[data-ax5autocomplete-display="label"]');

                            if (item.$target.find("select").get(0)) {
                                item.$select = item.$target.find("select");
                                item.$select.attr("tabindex", "-1").attr("class", "form-control " + data.formSize);

                                if (data.name) {
                                    item.$select.attr("name", "name");
                                }
                                item.$select.attr("multiple", "multiple");
                            } else {
                                item.$select = jQuery(AUTOCOMPLETE.tmpl.get.call(this, "formSelect", data, item.columnKeys));
                                item.$target.append(item.$select);
                            }

                            item.$target.append(item.$display);

                            alignAutocompleteDisplay.call(this);
                        } else {
                            item.$displayLabel.html(getLabel.call(this, queIdx));

                            alignAutocompleteDisplay.call(this);
                        }

                        item.$display.unbind('click.ax5autocomplete').bind('click.ax5autocomplete', autocompleteEvent.click.bind(this, queIdx));

                        // autocomplete 태그에 대한 이벤트 감시


                        item.$displayLabel.unbind("focus.ax5autocomplete").bind("focus.ax5autocomplete", autocompleteEvent.focus.bind(this, queIdx)).unbind("blur.ax5autocomplete").bind("blur.ax5autocomplete", autocompleteEvent.blur.bind(this, queIdx)).unbind('keyup.ax5autocomplete').bind('keyup.ax5autocomplete', autocompleteEvent.keyUp.bind(this, queIdx)).unbind("keydown.ax5autocomplete").bind("keydown.ax5autocomplete", autocompleteEvent.keyDown.bind(this, queIdx));

                        // select 태그에 대한 change 이벤트 감시

                        item.$select.unbind('change.ax5autocomplete').bind('change.ax5autocomplete', autocompleteEvent.selectChange.bind(this, queIdx));

                        data = null;
                        item = null;
                        queIdx = null;
                        return this;
                    };
                }();

                var autocompleteConfig = {},
                    queIdx;

                item = jQuery.extend(true, autocompleteConfig, cfg, item);
                if (!item.target) {
                    console.log(ax5.info.getError("ax5autocomplete", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5autocomplete-id");
                if (!item.id) {
                    item.id = 'ax5autocomplete-' + ax5.getGuid();
                    item.$target.data("data-ax5autocomplete-id", item.id);
                }
                item.name = item.$target.attr("data-ax5autocomplete");

                item.options = [];
                item.selected = [];

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-ax5autocomplete-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindAutocompleteTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindAutocompleteTarget.call(this, queIdx);
                }

                autocompleteConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * open the optionBox of autocomplete
             * @method ax5autocomplete.open
             * @param {(String|Number|Element)} boundID
             * @param {Number} [tryCount]
             * @returns {ax5autocomplete}
             */
            this.open = function () {

                return function (boundID, tryCount) {
                    this.waitOptionsCallback = null;

                    /**
                     * open autocomplete from the outside
                     */
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    var item = this.queue[queIdx];
                    var data = {},
                        focusTop,
                        selectedOptionEl;

                    if (item.$display.attr("disabled")) return this;

                    if (this.openTimer) clearTimeout(this.openTimer);
                    if (this.activeautocompleteOptionGroup) {
                        if (this.activeautocompleteQueueIndex == queIdx) {
                            return this;
                        }

                        if (tryCount > 2) return this;
                        this.close();
                        this.openTimer = setTimeout(function () {
                            this.open(queIdx, (tryCount || 0) + 1);
                        }.bind(this), cfg.animateTime);

                        return this;
                    }

                    item.optionFocusIndex = -1; // optionGroup이 열리면 포커스 인덱스 초기화 -1로
                    if (item.selected && item.selected.length > 0) {
                        item.optionSelectedIndex = item.selected[0]["@findex"];
                    }

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5autocomplete-option-group-" + item.size;
                    data.multiple = item.multiple;

                    data.lang = item.lang;
                    item.$display.attr("data-autocomplete-option-group-opened", "true");

                    data.waitOptions = true;
                    data.options = [];

                    this.activeautocompleteOptionGroup = jQuery(AUTOCOMPLETE.tmpl.get.call(this, "optionGroup", data, item.columnKeys));
                    this.activeautocompleteOptionGroup.find('[data-els="content"]').html(jQuery(AUTOCOMPLETE.tmpl.get.call(this, "options", data, item.columnKeys)));
                    this.activeautocompleteQueueIndex = queIdx;

                    alignAutocompleteOptionGroup.call(this, "append"); // alignAutocompleteOptionGroup 에서 body append
                    jQuery(window).bind("resize.ax5autocomplete-" + this.instanceId, function () {
                        alignAutocompleteOptionGroup.call(this);
                    }.bind(this));

                    if (item.selected && item.selected.length > 0) {
                        selectedOptionEl = this.activeautocompleteOptionGroup.find('[data-option-index="' + item.selected[0]["@index"] + '"]');
                        if (selectedOptionEl.get(0)) {
                            focusTop = selectedOptionEl.position().top - this.activeautocompleteOptionGroup.height() / 3;
                            this.activeautocompleteOptionGroup.find('[data-els="content"]').stop().animate({ scrollTop: focusTop }, item.animateTime, 'swing', function () {});
                        }
                    }

                    jQuery(window).bind("keyup.ax5autocomplete-" + this.instanceId, function (e) {
                        e = e || window.event;
                        onBodyKeyup.call(this, e);
                        U.stopEvent(e);
                    }.bind(this));

                    jQuery(window).bind("click.ax5autocomplete-" + this.instanceId, function (e) {
                        e = e || window.event;
                        onBodyClick.call(this, e);
                        U.stopEvent(e);
                    }.bind(this));

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "open",
                        item: item
                    });

                    data = null;
                    focusTop = null;
                    selectedOptionEl = null;
                    return this;
                };
            }();

            /**
             * @method ax5autocomplete.setValue
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _value
             * @return {ax5autocomplete}
             * @example
             * ```js
             * myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), {value:"test", text:"test"});
             * myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), [{value:"test1", text:"test1"}, {value:"test2", text:"test2"}]);
             * myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), null);
             * ```
             */
            this.setValue = function (_boundID, _value) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }

                this.queue[queIdx].selected = [];
                clearSelected.call(this, queIdx);
                if (U.isArray(_value)) {
                    var _values = U.map(_value, function () {
                        return { value: this };
                    });
                    setSelected.call(this, queIdx, _values, true, { noStateChange: true });
                } else if (U.isObject(_value)) {
                    console.log(_value);
                    setSelected.call(this, queIdx, { value: _value }, true, { noStateChange: true });
                }
                blurLabel.call(this, queIdx);

                return this;
            };

            /**
             * @method ax5autocomplete.setText
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _text
             * @returns {ax5autocomplete}
             * @example
             * ```js
             * myAutocomplete.setText($('[data-ax5autocomplete="autocomplete1"]'), "string");
             * myAutocomplete.setText($('[data-ax5autocomplete="autocomplete1"]'), ["substring", "search"]);
             * ```
             */
            this.setText = function (_boundID, _text) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }
                this.queue[queIdx].selected = [];
                clearSelected.call(this, queIdx);
                setSelected.call(this, queIdx, _text, true, { noStateChange: true });
                blurLabel.call(this, queIdx);

                return this;
            };

            /**
             * @method ax5autocomplete.getSelectedOption
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {Array}
             */
            this.getSelectedOption = function (_boundID) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }
                return U.deepCopy(this.queue[queIdx].selected);
            };

            /**
             * @method ax5autocomplete.close
             * @returns {ax5autocomplete}
             */
            this.close = function (item) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activeautocompleteOptionGroup) return this;

                item = this.queue[this.activeautocompleteQueueIndex];
                item.optionFocusIndex = -1;
                item.$display.removeAttr("data-autocomplete-option-group-opened").trigger("focus");

                this.activeautocompleteOptionGroup.addClass("destroy");

                jQuery(window).unbind("resize.ax5autocomplete-" + this.instanceId).unbind("click.ax5autocomplete-" + this.instanceId).unbind("keyup.ax5autocomplete-" + this.instanceId);

                this.closeTimer = setTimeout(function () {
                    if (this.activeautocompleteOptionGroup) this.activeautocompleteOptionGroup.remove();
                    this.activeautocompleteOptionGroup = null;
                    this.activeautocompleteQueueIndex = -1;

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "close"
                    });
                }.bind(this), cfg.animateTime);
                this.waitOptionsCallback = null;
                return this;
            };

            /**
             * @method ax5autocomplete.blur
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5autocomplete}
             */
            this.blur = function (_boundID) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }

                blurLabel.call(this, queIdx);
                return this;
            };

            /**
             * @method ax5autocomplete.enable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5autocomplete}
             */
            this.enable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);
                this.queue[queIdx].$display.removeAttr("disabled");
                this.queue[queIdx].$input.removeAttr("disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "enable"
                });

                return this;
            };

            /**
             * @method ax5autocomplete.disable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5autocomplete}
             */
            this.disable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);
                this.queue[queIdx].$display.attr("disabled", "disabled");
                this.queue[queIdx].$input.attr("disabled", "disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "disable"
                });

                return this;
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    this.init();
                }
            }.apply(this, arguments);
        };
        return ax5autocomplete;
    }());

    AUTOCOMPLETE = ax5.ui.autocomplete;
})();

/**
 * autocomplete jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5autocomplete
 * @param {String} methodName
 * @param [arguments]
 * @param [arguments]
 * @example
 * ```html
 * <div data-ax5autocomplete="ax1" data-ax5autocomplete-config='{
 *  multiple: true,
 *  editable: true,
 *  size: "",
 *  theme:""
 *  }'></div>
 * <script>
 * jQuery('[data-ax5autocomplete="ax1"]').ax5autocomplete();
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("getSelectedOption");
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("setValue", {value:"test", text:"test"});
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("enable");
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("disable");
 * </script>
 * ```
 */
ax5.ui.autocomplete_instance = new ax5.ui.autocomplete();
jQuery.fn.ax5autocomplete = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.autocomplete_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.autocomplete_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.autocomplete_instance.setValue(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "setText":
                    return ax5.ui.autocomplete_instance.setText(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "getSelectedOption":
                    return ax5.ui.autocomplete_instance.getSelectedOption(this);
                    break;
                case "enable":
                    return ax5.ui.autocomplete_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.autocomplete_instance.disable(this);
                    break;
                case "blur":
                    return ax5.ui.autocomplete_instance.blur(this);
                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.autocomplete_instance.bind(config);
            });
        }
        return this;
    };
}();
// ax5.ui.autocomplete.tmpl
(function () {
    var AUTOCOMPLETE = ax5.ui.autocomplete;
    var U = ax5.util;

    var optionGroup = function optionGroup(columnKeys) {
        return '\n<div class="ax5autocomplete-option-group {{theme}} {{size}}" data-ax5autocomplete-option-group="{{id}}">\n    <div class="ax-autocomplete-body">\n        <div class="ax-autocomplete-option-group-content" data-els="content"></div>\n    </div>\n    <div class="ax-autocomplete-arrow"></div> \n</div>\n';
    };

    var autocompleteDisplay = function autocompleteDisplay(columnKeys) {
        return '\n<div class="form-control {{formSize}} ax5autocomplete-display {{theme}}" \ndata-ax5autocomplete-display="{{id}}" data-ax5autocomplete-instance="{{instanceId}}">\n    <div class="ax5autocomplete-display-table" data-els="display-table">\n        <div data-ax5autocomplete-display="label-holder"> \n        <a {{^tabIndex}}href="#ax5autocomplete-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}\n        data-ax5autocomplete-display="label"\n        contentEditable="true"\n        spellcheck="false">{{{label}}}</a>\n        </div>\n        <div data-ax5autocomplete-display="addon"> \n            {{#multiple}}{{#reset}}\n            <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>\n            {{/reset}}{{/multiple}}\n        </div>\n    </div>\n</a>\n';
    };

    var formSelect = function formSelect(columnKeys) {
        return '\n<select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" multiple="multiple"></select>\n';
    };

    var formSelectOptions = function formSelectOptions(columnKeys) {
        return '\n{{#selected}}\n<option value="{{' + columnKeys.optionValue + '}}" selected="true">{{' + columnKeys.optionText + '}}</option>\n{{/selected}}\n';
    };

    var options = function options(columnKeys) {
        return '\n{{#waitOptions}}\n    <div class="ax-autocomplete-option-item">\n            <div class="ax-autocomplete-option-item-holder">\n                <span class="ax-autocomplete-option-item-cell ax-autocomplete-option-item-label">\n                    {{{lang.loading}}}\n                </span>\n            </div>\n        </div>\n{{/waitOptions}}\n{{^waitOptions}}\n    {{#options}}\n        {{^hide}}\n        <div class="ax-autocomplete-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{' + columnKeys.optionValue + '}}" {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n            <div class="ax-autocomplete-option-item-holder">\n                <span class="ax-autocomplete-option-item-cell ax-autocomplete-option-item-label">{{' + columnKeys.optionText + '}}</span>\n            </div>\n        </div>\n        {{/hide}}\n    {{/options}}\n    {{^options}}\n        <div class="ax-autocomplete-option-item">\n            <div class="ax-autocomplete-option-item-holder">\n                <span class="ax-autocomplete-option-item-cell ax-autocomplete-option-item-label">\n                    {{{lang.noOptions}}}\n                </span>\n            </div>\n        </div>\n    {{/options}}\n{{/waitOptions}}\n';
    };

    var label = function label(columnKeys) {
        return '{{#selected}}<div tabindex="-1" data-ax5autocomplete-selected-label="{{@i}}" data-ax5autocomplete-selected-text="{{text}}"><div data-ax5autocomplete-remove="true" data-ax5autocomplete-remove-index="{{@i}}">{{{removeIcon}}}</div><span>{{text}}</span></div>{{/selected}}';
    };

    AUTOCOMPLETE.tmpl = {
        "autocompleteDisplay": autocompleteDisplay,
        "formSelect": formSelect,
        "formSelectOptions": formSelectOptions,
        "optionGroup": optionGroup,
        "options": options,
        "label": label,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(AUTOCOMPLETE.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
// ax5.ui.autocomplete.util
(function () {

    var AUTOCOMPLETE = ax5.ui.autocomplete;
    var U = ax5.util;

    var nodeTypeProcessor = {
        '1': function _(queIdx, node, editable) {
            var cfg = this.config;
            var textNode = node;

            if ($(node).find("span").get(0)) {
                textNode = $(node).find("span").get(0);
            }

            var text = (textNode.textContent || textNode.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            var selectedIndex, option;

            if (item.selected && item.selected.length > 0) {
                if (node.getAttribute("data-ax5autocomplete-selected-text") == text) {
                    selectedIndex = node.getAttribute("data-ax5autocomplete-selected-label");
                    option = item.selected[selectedIndex];
                    return {
                        selectedIndex: {
                            index: option["@index"],
                            value: option[cfg.columnKeys.optionValue]
                        }
                    };
                } else {
                    selectedIndex = node.getAttribute("data-ax5autocomplete-selected-label");
                    option = item.selected[selectedIndex];
                    return {
                        removeSelectedIndex: {
                            index: option["@index"],
                            value: option[cfg.columnKeys.optionValue]
                        }
                    };
                }
            }
        },
        '3': function _(queIdx, node, editable) {
            var cfg = this.config;
            var text = (node.textContent || node.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            if (text != "") {
                if (editable) {
                    return text;
                } else {
                    var $option;
                    if (item.optionFocusIndex > -1) $option = this.activeautocompleteOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                    if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                        return {
                            optionIndex: {
                                gindex: $option.attr("data-option-group-index"),
                                index: $option.attr("data-option-index")
                            }
                        };
                    } else {
                        return item.editable ? text : undefined;
                    }
                }
            } else {
                return undefined;
            }
        }
    };

    AUTOCOMPLETE.util = {
        nodeTypeProcessor: nodeTypeProcessor
    };
})();