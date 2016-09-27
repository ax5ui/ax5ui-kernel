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
            return _toString.call(O) == "[object NodeList]" || O && O[0] && O[0].nodeType == 1;
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