/*
 * ax5ui-kernel - v0.0.1 
 * 2015-12-09 
 */

// 필수 Ployfill 확장 구문
(function(){
    'use strict';
    
	var root = this,
        re_trim = /^\s*|\s*$/g;

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = (function() {
			var hwp = Object.prototype.hasOwnProperty,
                hdeb = !({ toString: null }).propertyIsEnumerable('toString'),
				de = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				del = de.length;

			return function(obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) throw new TypeError('type err');
				var r = [], prop, i;
				for (prop in obj) if (hwp.call(obj, prop)) r.push(prop);
				if (hdeb) {
					for (i = 0; i < del; i++) if (hwp.call(obj, de[i])) r.push(de[i]);
				}
				return r;
			};
		}());
	}

	// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
	// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (fun /*, thisp */) {
			if (this === void 0 || this === null) { throw TypeError(); }
			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function") { throw TypeError(); }
			var thisp = arguments[1], i;
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
			if (typeof this !== 'function') { throw TypeError("function"); }
			var slice = [].slice,
				args = slice.call(arguments, 1),
				self = this,
				bound = function () {
					return self.apply(this instanceof nop ? this : o,
						args.concat(slice.call(arguments)));
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
		if(!document.createStyleSheet) return;
		var style = document.createStyleSheet(),
			select = function (selector, maxCount) {
				var
					all = document.all,
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
	}());

	if (!String.prototype.trim) {
		(function() {
			String.prototype.trim = function() {
				return this.replace(re_trim, '');
			};
		})();
	}

	if (!window.JSON) {
		window.JSON = {
			parse: function (sJSON) { return (new Function('', 'return ' + sJSON))(); },
			stringify:(function(){
				var r = /["]/g, f;
				return f = function(vContent){
					var result, i, j;
					switch( result = typeof vContent ){
					case'string':return '"' + vContent.replace( r, '\\"' ) + '"';
					case'number':case'boolean':return vContent.toString();
					case'undefined':return 'undefined';
					case'function':return '""';
					case'object':
						if(!vContent) return 'null';
						result = '';
						if(vContent.splice){
							for(i = 0, j = vContent.length ; i < j ; i++) result += ',' + f(vContent[i]);
							return '[' + result.substr(1) + ']';
						}else{
							for(i in vContent) if(vContent.hasOwnProperty(i) && vContent[i] !== undefined && typeof vContent[i] != 'function') result += ',"'+i+'":' + f(vContent[i]);
							return '{' + result.substr(1) + '}';
						}
					}
				};
			})()
		};
	}

	// Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
	// Make it safe to do console.log() always.
	(function(con) {
		var prop, method;
		var empty = {};
		var dummy = function() {};
		var properties = 'memory'.split(',');
		var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
		'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
		'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
		while (prop = properties.pop()) con[prop] = con[prop] || empty;
		while (method = methods.pop()) con[method] = con[method] || dummy;
	})(root.console = root.console || {}); // Using `this` for web workers.

}.call(this));

// ax5 선언
(function() {
  'use strict';

  // root of function
  var root = this, win = window, doc = document, docElem = document.documentElement,

    re_dot = /\./,
    re_int = /[-|+]?[\D]/gi,
    re_not_num = /\D/gi,
    re_money_split = new RegExp('([0-9])([0-9][0-9][0-9][,.])'),
    re_amp = /&/g,
    re_eq = /=/,
    re_class_name_split = /[ ]+/g,

    /** @namespace {Object} ax5 */
    ax5 = {}, info, U, dom;

  /**
   * guid
   * @member {Number} ax5.guid
   */
  ax5.guid = 1;
  /**
   * ax5.guid를 구하고 증가시킵니다.
   * @method ax5.get_guid
   * @returns {Number} guid
   */
  ax5.get_guid = function() {return ax5.guid++;};

  /**
   * 상수모음
   * @namespace ax5.info
   */
  ax5.info = info = (function() {
    /**
     * ax5 version
     * @member {String} ax5.info.version
     */
    var version = "0.0.1";
    /**
     * ax5 library path
     * @member {String} ax5.info.base_url
     */
    var base_url = "";
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
    var onerror = function() {
      console.error(U.to_array(arguments).join(":"));
    };

    /**
     * event keyCodes
     * @member {Object} ax5.info.event_keys
     * @example
     * ```
     * {
		 * 	BACKSPACE: 8, TAB: 9,
		 * 	RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
		 * 	HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
		 * }
     * ```
     */
    var event_keys = {
      BACKSPACE: 8, TAB: 9,
      RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
      HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
    };

    var week_names = [
      {label: "SUN"},
      {label: "MON"},
      {label: "TUE"},
      {label: "WED"},
      {label: "THU"},
      {label: "FRI"},
      {label: "SAT"}
    ];

    /**
     * 사용자 브라우저 식별용 오브젝트
     * @member {Object} ax5.info.browser
     * @example
     * ```
     * console.log( ax5.info.browser );
     * //Object {name: "chrome", version: "39.0.2171.71", mobile: false}
     * ```
     */
    var browser = (function(ua, mobile, browserName, match, browser, browserVersion) {
      ua = navigator.userAgent.toLowerCase(), mobile = (ua.search(/mobile/g) != -1), browserName, match, browser, browserVersion;

      if (ua.search(/iphone/g) != -1) {
        return {name: "iphone", version: 0, mobile: true}
      }
      else if (ua.search(/ipad/g) != -1) {
        return {name: "ipad", version: 0, mobile: true}
      }
      else if (ua.search(/android/g) != -1) {
        match = /(android)[ \/]([\w.]+)/.exec(ua) || [];
        browserVersion = (match[2] || "0");
        return {name: "android", version: browserVersion, mobile: mobile}
      }
      else {
        browserName = "";
        match = /(opr)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
        browser = (match[1] || "");
        browserVersion = (match[2] || "0");

        if (browser == "msie") browser = "ie";
        return {
          name: browser,
          version: browserVersion,
          mobile: mobile
        }
      }
      ua = null, mobile = null, browserName = null, match = null, browser = null, browserVersion = null;
    })();
    /**
     * 브라우저 여부
     * @member {Boolean} ax5.info.is_browser
     */
    var is_browser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && win.document);
    /**
     * 브라우저에 따른 마우스 휠 이벤트이름
     * @member {Object} ax5.info.wheel_enm
     */
    var wheel_enm = ((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel");

    /**
     * 첫번째 자리수 동사 - (필요한것이 없을때 : 4, 실행오류 : 5)
     * 두번째 자리수 목적어 - 문자열 0, 숫자 1, 배열 2, 오브젝트 3, 함수 4, DOM 5, 파일 6, 기타 7
     * 세번째 자리수 옵션
     * @member {Object} ax5.info.error_msg
     */
    var error_msg = {
      "single-uploader": {
        "460": "업로드할 파일이 없습니다.",
        "461": "업로드된 파일이 없습니다."
      }
    };

    /**
     * 현재 페이지의 Url 정보를 리턴합니다.
     * @method ax5.info.url_util
     * @returns {Object}
     * @example
     * ```
     * console.log( ax5.util.to_json( ax5.util.url_util() ) );
     * {
		 *	"base_url": "http://ax5:2018",
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
    function url_util(url, urls) {
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
      url.base_url = U.left(url.href, "?").replace(url.pathname, "");
      return url;
    }

    /**
     * ax5 error를 반환합니다.
     * @method ax5.info.get_error
     * @returns {Object}
     * @example
     * ```
     * if(!this.selected_file){
		 *      if (cfg.on_event) {
		 *      	var that = {
		 *      		action: "error",
		 *      		error: ax5.info.get_error("single-uploader", "460", "upload")
		 *      	};
		 *      	cfg.on_event.call(that, that);
		 *      }
		 *      return this;
		 * }
     * ```
     */
    function get_error(class_name, error_code, method_name) {
      if (info.error_msg && info.error_msg[class_name]) {
        return {
          class_name: class_name,
          error_code: error_code,
          method_name: method_name,
          msg: info.error_msg[class_name][error_code]
        };
      }
      else {
        return {class_name: class_name, error_code: error_code, method_name: method_name};
      }
    }

    return {
      error_msg: error_msg,
      version: version,
      base_url: base_url,
      onerror: onerror,
      event_keys: event_keys,
      week_names: week_names,
      browser: browser,
      is_browser: is_browser,
      wheel_enm: wheel_enm,
      url_util: url_util,
      get_error: get_error
    };
  })();

  /**
   * Refer to this by {@link ax5}.
   * @namespace ax5.util
   */
  ax5['util'] = U = (function() {
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
      if (is_nothing(O)) return [];
      var key, i = 0, l = O.length,
        isObj = l === undefined || typeof O === "function";
      if (isObj) {
        for (key in O) {
          if (typeof O[key] != "undefined")
            if (_fn.call(O[key], key, O[key]) === false) break;
        }
      }
      else {
        for (; i < l;) {
          if (typeof O[i] != "undefined")
            if (_fn.call(O[i], i, O[i++]) === false) break;
        }
      }
      return O;
    }

    // In addition to using the http://underscorejs.org : map, reduce, reduce_right, find
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
      if (is_nothing(O)) return [];
      var key, i = 0, l = O.length, results = [], fn_result;
      if (is_object(O)) {
        for (key in O) {
          if (typeof O[key] != "undefined") {
            fn_result = undefined;
            if ((fn_result = _fn.call(O[key], key, O[key])) === false) break;
            else results.push(fn_result);
          }
        }
      }
      else {
        for (; i < l;) {
          if (typeof O[i] != "undefined") {
            fn_result = undefined;
            if ((fn_result = _fn.call(O[i], i, O[i++])) === false) break;
            else results.push(fn_result);
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
      if (is_nothing(O)) return -1;
      var key, i = 0, l = O.length;
      if (is_object(O)) {
        for (key in O) {
          if (typeof O[key] != "undefined" && is_function(_fn) && _fn.call(O[key], key, O[key])) {
            return key;
            break;
          }
          else if (O[key] == _fn) {
            return key;
            break;
          }
        }
      }
      else {
        for (; i < l;) {
          if (typeof O[i] != "undefined" && is_function(_fn) && _fn.call(O[i], i, O[i])) {
            return i;
            break;
          }
          else if (O[i] == _fn) {
            return i;
            break;
          }
          i++;
        }
      }
      return -1;
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
      var i, l, token_item;
      if (is_array(O)) {
        i = 0, l = O.length, token_item = O[i];
        for (; i < l - 1;) {
          if (typeof O[i] != "undefined") {
            if (( token_item = _fn.call(root, token_item, O[++i]) ) === false) break;
          }
        }
        return token_item;
      }
      else if (is_object(O)) {
        for (i in O) {
          if (typeof O[i] != "undefined") {
            if (( token_item = _fn.call(root, token_item, O[i]) ) === false) break;
          }
        }
        return token_item;
      }
      else {
        console.error("argument error : ax5.util.reduce - use Array or Object");
        return null;
      }
    }

    /**
     * 배열의 오른쪽에서 왼쪽으로 연산을 진행하는데 수행한 결과가 오른쪽 값으로 반영되어 최종 오른쪽 값을 반환합니다.
     * @method ax5.util.reduce_right
     * @param {Array} O
     * @param {Function} _fn
     * @returns {Alltypes}
     * @example
     * ```js
     * var aarray = [5,4,3,2,1];
     * result = ax5.util.reduce_right( aarray, function(p, n){
		 *    console.log( n );
		 *    return p * n;
		 * });
     * console.log(result, aarray);
     * 120 [5, 4, 3, 2, 1]
     * ```
     */
    function reduce_right(O, _fn) {
      var i = O.length - 1, token_item = O[i];
      for (; i > 0;) {
        if (typeof O[i] != "undefined") {
          if (( token_item = _fn.call(root, token_item, O[--i]) ) === false) break;
        }
      }
      return token_item;
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
     * console.log( ax5.util.to_json(result) );
     * // [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
     * ```
     */
    function filter(O, _fn) {
      if (is_nothing(O)) return [];
      var k, i = 0, l = O.length, results = [], fn_result;
      if (is_object(O)) {
        for (k in O) {
          if (typeof O[k] != "undefined") {
            if (fn_result = _fn.call(O[k], k, O[k])) results.push(O[k]);
          }
        }
      }
      else {
        for (; i < l;) {
          if (typeof O[i] != "undefined") {
            if (fn_result = _fn.call(O[i], i, O[i])) results.push(O[i]);
            i++;
          }
        }
      }
      return results;
    }

    /**
     * Object를 JSONString 으로 반환합니다.
     * @method ax5.util.to_json
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
     * console.log( ax.to_json(myObject) );
     * ```
     */
    function to_json(O) {
      var json_string = "";
      if (ax5.util.is_array(O)) {
        var i = 0, l = O.length;
        json_string += "[";
        for (; i < l; i++) {
          if (i > 0) json_string += ",";
          json_string += to_json(O[i]);
        }
        json_string += "]";
      }
      else if (ax5.util.is_object(O)) {
        json_string += "{";
        var json_object_body = [];
        each(O, function(key, value) {
          json_object_body.push('"' + key + '": ' + to_json(value));
        });
        json_string += json_object_body.join(", ");
        json_string += "}";
      }
      else if (ax5.util.is_string(O)) {
        json_string = '"' + O + '"';
      }
      else if (ax5.util.is_number(O)) {
        json_string = O;
      }
      else if (ax5.util.is_undefined(O)) {
        json_string = "undefined";
      }
      else if (ax5.util.is_function(O)) {
        json_string = '"{Function}"';
      }
      return json_string;
    }

    /**
     * 관용의 JSON Parser
     * @method ax5.util.parse_json
     * @param {String} JSONString
     * @param {Boolean} [force] - 강제 적용 여부 (json 문자열 검사를 무시하고 오브젝트 변환을 시도합니다.)
     * @returns {Object}
     * @example
     * ```
     * console.log(ax5.util.parse_json('{"a":1}'));
     * // Object {a: 1}
     * console.log(ax5.util.parse_json("{'a':1, 'b':'b'}"));
     * // Object {a: 1, b: "b"}
     * console.log(ax5.util.parse_json("{'a':1, 'b':function(){return 1;}}", true));
     * // Object {a: 1, b: function}
     * console.log(ax5.util.parse_json("{a:1}"));
     * // Object {a: 1}
     * console.log(ax5.util.parse_json("[1,2,3]"));
     * // [1, 2, 3]
     * console.log(ax5.util.parse_json("['1','2','3']"));
     * // ["1", "2", "3"]
     * console.log(ax5.util.parse_json("[{'a':'99'},'2','3']"));
     * // [Object, "2", "3"]
     * ```
     */
    function parse_json(str, force) {
      if (force || (re_is_json).test(str)) {
        try {
          return (new Function('', 'return ' + str))();
        } catch (e) {
          return {error: 500, msg: 'syntax error'};
        }
      }
      else {
        return {error: 500, msg: 'syntax error'};
      }
    }

    /**
     * 타겟 오브젝트의 키를 대상 오브젝트의 키만큼 확장합니다.
     * @method ax5.util.extend
     * @param {Object} O - 타겟 오브젝트
     * @param {Object} _O - 대상 오브젝트
     * @param {Boolean} [overwrite=false] - 덮어쓰기 여부
     * @returns {Object} extened Object
     * @example
     * ```js
     * var axf = ax5.util;
     * var obja = {a:1};
     * axf.extend(obja, {b:2});
     * axf.extend(obja, {a:2});
     * axf.extend(obja, {a:2}, true);
     * ```
     */
    function extend(O, _O, overwrite) {
      if (typeof O !== "object" && typeof O !== "function") O = {};
      if (typeof _O === "string") O = _O;
      else {
        if (overwrite === true) {
          for (var k in _O) O[k] = _O[k];
        }
        else {
          for (var k in _O) if (typeof O[k] === "undefined") O[k] = _O[k];
        }
      }
      return O;
    }

    /**
     * 타겟 오브젝트의 키를 대상 오브젝트의 키만큼 확장합니다. (깊숙히)
     * @method ax5.util.extend_all
     * @param {Object} O - 타겟 오브젝트
     * @param {Object} _O - 대상 오브젝트
     * @param {Boolean} [overwrite=false] - 덮어쓰기 여부
     * @returns {Object} extened Object
     * @example
     * ```
     * var aa = {a:1, b:{a:1, b:2}};
     * ax5.util.extend_all(aa, {b:{a:2, c:3}});
     * // {"a": 1, "b": {"a": 1, "b": 2, "c": 3}}
     * // 덮어쓰지 않음.
     * ax5.util.extend_all(aa, {b:{a:2, c:3}}, true);
     * // {"a": 1, "b": {"a": 2, "b": 2, "c": 3}}
     * // 덮어씀.
     * ```
     */
    function extend_all(O, _O, overwrite) {
      if (typeof O !== "object" && typeof O !== "function") O = {};
      if (typeof _O === "string") O = _O;
      else {
        for (var k in _O) {
          if (typeof O[k] === "undefined") {
            O[k] = _O[k];
          }
          else if (Object.prototype.toString.call(O[k]) == "[object Object]")
          {
            // 키값이 오브젝트인 경우.
            O[k] = extend_all(O[k], _O[k], overwrite);
          }
          else {
            if (overwrite === true) {
              O[k] = _O[k];
            }
          }
        }
      }
      return O;
    }

    /**
     * 타겟 오브젝트를 복제하여 참조를 다르게 합니다.
     * @method ax5.util.clone
     * @param {Object} O - 타겟 오브젝트
     * @returns {Object} clone Object
     * @example
     * ```js
     * var axf = ax5.util;
     * var obja = {a:1};
     * var objb = axf.clone( obja );
     * obja.a = 3; // 원본 오브젝트 수정
     * console.log(obja, objb);
     * // Object {a: 3} Object {a: 1}
     * ```
     */
    function clone(O) {
      return extend({}, O);
    }

    /**
     * 인자의 타입을 반환합니다.
     * @method ax5.util.get_type
     * @param {Object|Array|String|Number|Element|Etc} O
     * @returns {String} window|element|object|array|function|string|number|undefined|nodelist
     * @example
     * ```js
     * var axf = ax5.util;
     * var a = 11;
     * var b = "11";
     * console.log( axf.get_type(a) );
     * console.log( axf.get_type(b) );
     * ```
     */
    function get_type(O) {
      var typeName;
      if (O != null && O == O.window) {
        typeName = "window";
      }
      else if (!!(O && O.nodeType == 1)) {
        typeName = "element";
      }
      else if (!!(O && O.nodeType == 11)) {
        typeName = "fragment";
      }
      else if (typeof O === "undefined") {
        typeName = "undefined";
      }
      else if (_toString.call(O) == "[object Object]") {
        typeName = "object";
      }
      else if (_toString.call(O) == "[object Array]") {
        typeName = "array";
      }
      else if (_toString.call(O) == "[object String]") {
        typeName = "string";
      }
      else if (_toString.call(O) == "[object Number]") {
        typeName = "number";
      }
      else if (_toString.call(O) == "[object NodeList]") {
        typeName = "nodelist";
      }
      else if (typeof O === "function") {
        typeName = "function";
      }
      return typeName;
    }

    /**
     * 오브젝트가 window 인지 판단합니다.
     * @method ax5.util.is_window
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_window(O) {
      return O != null && O == O.window;
    }

    /**
     * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
     * @method ax5.util.is_element
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_element(O) {
      return !!(O && (O.nodeType == 1 || O.nodeType == 11));
    }

    /**
     * 오브젝트가 Object인지 판단합니다.
     * @method ax5.util.is_object
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_object(O) {
      return _toString.call(O) == "[object Object]";
    }

    /**
     * 오브젝트가 Array인지 판단합니다.
     * @method ax5.util.is_array
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_array(O) {
      return _toString.call(O) == "[object Array]";
    }

    /**
     * 오브젝트가 Function인지 판단합니다.
     * @method ax5.util.is_function
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_function(O) {
      return typeof O === "function";
    }

    /**
     * 오브젝트가 String인지 판단합니다.
     * @method ax5.util.is_string
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_string(O) {
      return _toString.call(O) == "[object String]";
    }

    /**
     * 오브젝트가 Number인지 판단합니다.
     * @method ax5.util.is_number
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_number(O) {
      return _toString.call(O) == "[object Number]";
    }

    /**
     * 오브젝트가 NodeList인지 판단합니다.
     * @method ax5.util.is_nodelist
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_nodelist(O) {
      return (_toString.call(O) == "[object NodeList]" || (O && O[0] && O[0].nodeType == 1));
    }

    /**
     * 오브젝트가 undefined인지 판단합니다.
     * @method ax5.util.is_undefined
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_undefined(O) {
      return typeof O === "undefined";
    }

    /**
     * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
     * @method ax5.util.is_nothing
     * @param {Object} O
     * @returns {Boolean}
     */
    function is_nothing(O) {
      return (typeof O === "undefined" || O === null || O === "");
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
      if (is_object(O)) {
        var keys = Object.keys(O);
        var item = {};
        item[keys[0]] = O[keys[0]];
        return item;
      }
      else if (is_array(O)) {
        return O[0];
      }
      else {
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
      if (is_object(O)) {
        var keys = Object.keys(O);
        var item = {};
        item[keys[keys.length - 1]] = O[keys[keys.length - 1]];
        return item;
      }
      else if (is_array(O)) {
        return O[O.length - 1];
      }
      else {
        console.error("ax5.util.object.last", "argument type error");
        return undefined;
      }
    }

    /**
     * 쿠키를 설정합니다.
     * @method ax5.util.set_cookie
     * @param {String} cname - 쿠키이름
     * @param {String} cvalue - 쿠키값
     * @param {Number} [exdays] - 쿠키 유지일수
     * @param {Object} [opts] - path, domain 설정 옵션
     * @example
     * ```js
     * ax5.util.set_cookie("jslib", "AX5");
     * ax5.util.set_cookie("jslib", "AX5", 3);
     * ax5.util.set_cookie("jslib", "AX5", 3, {path:"/", domain:".axisj.com"});
     * ```
     */
    function set_cookie(cn, cv, exdays, opts) {
      var expire;
      if (typeof exdays === "number") {
        expire = new Date();
        expire.setDate(expire.getDate() + exdays);
      }
      opts = opts || {};
      return (doc.cookie = [
        escape(cn), '=', escape(cv),
        expire ? "; expires=" + expire.toUTCString() : "", // use expires attribute, max-age is not supported by IE
        opts.path ? "; path=" + opts.path : "",
        opts.domain ? "; domain=" + opts.domain : "",
        opts.secure ? "; secure" : ""
      ].join(""));
    }

    /**
     * 쿠키를 가져옵니다.
     * @method ax5.util.get_cookie
     * @param {String} cname
     * @returns {String} cookie value
     * @example
     * ```js
     * ax5.util.get_cookie("jslib");
     * ```
     */
    function get_cookie(cname) {
      var name = cname + "=";
      var ca = doc.cookie.split(';'), i = 0, l = ca.length;
      for (; i < l; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
      }
      return "";
    }

    /**
     * ax5 require
     * @method ax5.util.require
     * @param {Array} mods - load modules
     * @param {Function} callBack - 로드 성공시 호출함수
     * @param {Function} [errorBack] - 로드 실패시 호출함수
     * @example
     * ```js
     * ax5.info.base_url = "../src/";
     * ax5.util.require(["ax5_class_sample.js"], function(){
		 * 	alert("ok");
		 * });
     * ```
     */
    // RequireJS 2.1.15 소스코드 참고
    function require(mods, callBack, errorBack) {
      var
        head = doc.head || doc.getElementsByTagName("head")[0],
        readyRegExp = info.is_browser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/,
        loadCount = mods.length, loadErrors = [], loaded_src = {}, onloadTimer, onerrorTimer, returned = false,
        scripts = dom.get("script[src]"), styles = dom.get("style[href]"),
        onload = function() {
          if (loadCount < 1 && loadErrors.length == 0 && !returned) {
            if (callBack) callBack({});
            returned = true;
          }
        },
        onerror = function() {
          if (loadCount < 1 && loadErrors.length > 0 && !returned) {
            console.error(loadErrors);
            if (errorBack) errorBack({
              type: "loadFail",
              list: loadErrors
            });
            returned = true;
          }
        };

      // 로드해야 할 모듈들을 doc.head에 삽입하고 로드가 성공여부를 리턴합니다.
      for (var i = 0, l = mods.length; i < l; i++) {
        var src = mods[i], type = right(src, "."), hasPlugin = false,
          plugin, plugin_src = info.base_url + src, attr_nm = (type === "js") ? "src" : "href",
          plug_load, plug_err, s = scripts.length;

        while (s--) {
          if (scripts[s].getAttribute(attr_nm) === plugin_src) {
            hasPlugin = true;
            break;
          }
        }

        if (hasPlugin) {

          loadCount--;
          onload();

        }
        else {

          plugin = (type === "js") ?
            dom.create("script", {type: "text/javascript", src: plugin_src, "data-src": plugin_src}) :
            dom.create("link", {rel: "stylesheet", type: "text/css", href: plugin_src});

          plug_load = function(e, plugin_src) {
            if (e && ( e.type === 'load' || readyRegExp.test((e.currentTarget || e.srcElement).readyState) )) {
              if (!loaded_src[plugin_src]) loadCount--;
              if (onloadTimer) clearTimeout(onloadTimer);
              onloadTimer = setTimeout(onload, 1);
            }
          },
            plug_err = function(e) {
              loadCount--;
              loadErrors.push({
                src: info.base_url + src, error: e
              });
              if (onerrorTimer) clearTimeout(onerrorTimer);
              onerrorTimer = setTimeout(onerror, 1);
            };

          ax5.xhr({
            url: plugin_src, contentType: "",
            res: function(response, status) {
              var time_id, hasPlugin = false, scripts = dom.get("script[src]"), s = scripts.length;
              while (s--) {
                if (scripts[s].getAttribute(attr_nm) === plugin_src) {
                  hasPlugin = true;
                  break;
                }
              }

              if (!hasPlugin) head.appendChild(plugin);
              plugin.onload = function(e) {
                plug_load(e, plugin_src);
                if (time_id) clearTimeout(time_id);
              };
              time_id = setTimeout(function() {
                plug_load({type: "load"}, plugin_src);
              }, 500);
            },
            error: function() {
              plug_err(this);
            }
          });
        }
      }
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
      win.alert(to_json(O));
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
      if (is_string(pos)) {
        return (str.indexOf(pos) > -1) ? str.substr(0, str.indexOf(pos)) : str;
      }
      else if (is_number(pos)) {
        return str.substr(0, pos);
      }
      else {
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
      if (is_string(pos)) {
        return (str.lastIndexOf(pos) > -1) ? str.substr(str.lastIndexOf(pos) + 1) : str;
      }
      else if (is_number(pos)) {
        return str.substr(str.length - pos);
      }
      else {
        return "";
      }
    }

    /**
     * css형 문자열이나 특수문자가 포함된 문자열을 카멜케이스로 바꾸어 반환합니다.
     * @method ax5.util.camel_case
     * @param {String} str
     * @returns {String}
     * @example
     * ```js
     * ax5.util.camel_case("inner-width");
     * ax5.util.camel_case("inner_width");
     * // innerWidth
     * ```
     */
    function camel_case(str) {
      return str.replace(re_ms, "ms-").replace(re_snake_case, function(all, letter) {
        return letter.toUpperCase();
      });
    }

    /**
     * css형 문자열이나 카멜케이스문자열을 스네이크 케이스 문자열로 바꾸어 반환합니다.
     * @method ax5.util.snake_case
     * @param {String} str
     * @returns {String}
     * @example
     * ```js
     * ax5.util.snake_case("innerWidth");
     * ax5.util.snake_case("inner-Width");
     * ax5.util.snake_case("inner_width");
     * // inner-width
     * ```
     */
    function snake_case(str) {
      return camel_case(str).replace(re_camel_case, function(all, letter) {
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
      var result, pair = ('' + str).split(re_dot), isMinus = (Number(pair[0]) < 0 || pair[0] == "-0"), returnValue = 0.0;
      pair[0] = pair[0].replace(re_int, "");
      if (pair[1]) {
        pair[1] = pair[1].replace(re_not_num, "");
        returnValue = Number(pair[0] + "." + pair[1]) || 0;
      }
      else {
        returnValue = Number(pair[0]) || 0;
      }
      result = (isMinus) ? -returnValue : returnValue;

      each(cond, function(k, c) {
        if (k == "round") {
          if (is_number(c)) {
            if (c < 0) {
              result = +(Math.round(result + "e-" + Math.abs(c)) + "e+" + Math.abs(c));
            }
            else {
              result = +(Math.round(result + "e+" + c) + "e-" + c);
            }
          }
          else {
            result = Math.round(result);
          }
        }
        if (k == "floor") {
          result = Math.floor(result);
        }
        if (k == "ceil") {
          result = Math.ceil(result);
        }
        else if (k == "money") {
          result = (function(val) {
            var txtNumber = '' + val;
            if (isNaN(txtNumber) || txtNumber == "") {
              return "";
            }
            else {
              var arrNumber = txtNumber.split('.');
              arrNumber[0] += '.';
              do {
                arrNumber[0] = arrNumber[0].replace(re_money_split, '$1,$2');
              } while (re_money_split.test(arrNumber[0]));
              if (arrNumber.length > 1) {
                return arrNumber.join('');
              }
              else {
                return arrNumber[0].split('.')[0];
              }
            }
          })(result);
        }
        else if (k == "abs") {
          result = Math.abs(Number(result));
        }
        else if (k == "byte") {
          result = (function(val) {
            val = Number(result);
            var n_unit = "KB";
            var myByte = val / 1024;
            if (myByte / 1024 > 1) {
              n_unit = "MB";
              myByte = myByte / 1024;
            }
            if (myByte / 1024 > 1) {
              n_unit = "GB";
              myByte = myByte / 1024;
            }
            return number(myByte, {round: 1}) + n_unit;
          })(result);
        }
      });

      return result;
    }

    /**
     * 배열 비슷한 오브젝트를 배열로 변환해줍니다.
     * @method ax5.util.to_array
     * @param {Object|Elements|Arguments} O
     * @returns {Array}
     * @example
     * ```js
     * ax5.util.to_array(arguments);
     * //
     * ```
     */
    function to_array(O) {
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
      }
      else {
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
      if (is_string(O) && typeof cond !== "undefined" && cond == "param") {
        return O;
      }
      else if ((is_string(O) && typeof cond !== "undefined" && cond == "object") || (is_string(O) && typeof cond === "undefined")) {
        p = {};
        each(O.split(re_amp), function() {
          var item = this.split(re_eq);
          p[item[0]] = item[1];
        });
        return p;
      }
      else {
        p = [];
        each(O, function(k, v) {
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

    /**
     * webGl context 에 적용할 셰이더를 셰이더 스크립트로 부터 변환합니다.
     * @method ax5.util.get_shader
     * @param {WebGLRenderingContext} gl
     * @param {script|String|Array} script
     * @param {String} [typ] - x-shader/x-fragment|x-shader/x-vertex
     * @returns {shader}
     */
    function get_shader(gl, script, typ) {
      if (!script) {
        return null;
      }

      var str = "", s, shader;
      if (is_string(script) || is_array(script)) {
        str = [].concat(script).join('');
        if (typ == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (typ == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
          return null;
        }
      }
      else {
        s = script.firstChild;
        while (s) {
          if (s.nodeType == 3) {
            str += s.textContent;
          }
          s = s.nextSibling;
        }
        if (script.type == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (script.type == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
          return null;
        }
      }

      gl.shaderSource(shader, str);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    var requestAnimFrame = (function() {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    function request_ani_frame(o) {
      requestAnimFrame(o);
    }

    function local_date(yy, mm, dd, hh, mi, ss) {
      var utc_d, local_d;
      local_d = new Date();
      if (typeof hh === "undefined") hh = 23;
      if (typeof mi === "undefined") mi = 59;
      utc_d = new Date(Date.UTC(yy, mm, dd || 1, hh, mi, ss || 0));

      if (mm == 0 && dd == 1 && utc_d.getUTCHours() + (utc_d.getTimezoneOffset() / 60) < 0) {
        utc_d.setUTCHours(0);
      }
      else {
        utc_d.setUTCHours(utc_d.getUTCHours() + (utc_d.getTimezoneOffset() / 60));
      }
      return utc_d;
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
     * ax5.util.date((new Date()), {add:{d:10}, return:'yyyy/mm/dd'}); // "2015/07/01"
     * ax5.util.date('1919-03-01', {add:{d:10}, return:'yyyy/mm/dd'}); // "1919/03/11"
     * ```
     */
    function date(d, cond) {
      var yy, mm, dd, hh, mi,
        aDateTime, aTimes, aTime, aDate,
        utc_d, local_d,
        va;

      if (is_string(d)) {
        if (d.length == 0) {
          d = new Date();
        }
        else if (d.length > 15) {
          aDateTime = d.split(/ /g), aTimes, aTime,
            aDate = aDateTime[0].split(/\D/g),
            yy = aDate[0];
          mm = parseFloat(aDate[1]);
          dd = parseFloat(aDate[2]);
          aTime = aDateTime[1] || "09:00";
          aTimes = aTime.left(5).split(":");
          hh = parseFloat(aTimes[0]);
          mi = parseFloat(aTimes[1]);
          if (aTime.right(2) === "AM" || aTime.right(2) === "PM") hh += 12;
          d = local_date(yy, mm - 1, dd, hh, mi);
        }
        else if (d.length == 14) {
          va = d.replace(/\D/g, "");
          d = local_date(va.substr(0, 4), va.substr(4, 2) - 1, number(va.substr(6, 2)), number(va.substr(8, 2)), number(va.substr(10, 2)), number(va.substr(12, 2)));
        }
        else if (d.length > 7) {
          va = d.replace(/\D/g, "");
          d = local_date(va.substr(0, 4), va.substr(4, 2) - 1, number(va.substr(6, 2)));
        }
        else if (d.length > 4) {
          va = d.replace(/\D/g, "");
          d = local_date(va.substr(0, 4), va.substr(4, 2) - 1, 1);
        }
        else if (d.length > 2) {
          va = d.replace(/\D/g, "");
          return local_date(va.substr(0, 4), va.substr(4, 2) - 1, 1);
        }
        else {
          d = new Date();
        }
      }

      if (typeof cond === "undefined") {
        return d;
      }
      else {
        if (cond["add"]) {
          d = (function(_d, opts) {
            var
              yy, mm, dd, mxdd,
              DyMilli = ((1000 * 60) * 60) * 24;

            if (typeof opts["d"] !== "undefined") {
              _d.setTime(_d.getTime() + (opts["d"] * DyMilli));
            }
            else if (typeof opts["m"] !== "undefined") {
              yy = _d.getFullYear();
              mm = _d.getMonth();
              dd = _d.getDate();
              yy = yy + parseInt(opts["m"] / 12);
              mm += opts["m"] % 12;
              mxdd = days_of_month(yy, mm);
              if (mxdd < dd) dd = mxdd;
              _d = new Date(yy, mm, dd, 12);
            }
            else if (typeof opts["y"] !== "undefined") {
              _d.setTime(_d.getTime() + ((opts["y"] * 365) * DyMilli));
            }
            else {
              _d.setTime(_d.getTime() + (opts["y"] * DyMilli));
            }
            return _d;
          })(new Date(d), cond["add"]);
        }
        if (cond["return"]) {
          return (function() {
            var fStr = cond["return"], nY, nM, nD, nH, nMM, nS, nDW;

            nY = d.getUTCFullYear();
            nM = set_digit(d.getMonth() + 1, 2);
            nD = set_digit(d.getDate(), 2);
            nH = set_digit(d.getHours(), 2);
            nMM = set_digit(d.getMinutes(), 2);
            nS = set_digit(d.getSeconds(), 2);
            nDW = d.getDay();

            var yre = /[^y]*(yyyy)[^y]*/gi;
            yre.exec(fStr);
            var regY = RegExp.$1;
            var mre = /[^m]*(mm)[^m]*/gi;
            mre.exec(fStr);
            var regM = RegExp.$1;
            var dre = /[^d]*(dd)[^d]*/gi;
            dre.exec(fStr);
            var regD = RegExp.$1;
            var hre = /[^h]*(hh)[^h]*/gi;
            hre.exec(fStr);
            var regH = RegExp.$1;
            var mire = /[^m]*(mi)[^i]*/gi;
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
            if (regM === "mm") {
              if (regM.length == 1) nM = (d.getMonth() + 1);
              fStr = fStr.replace(regM, nM);
            }
            if (regD === "dd") {
              if (regD.length == 1) nD = d.getDate();
              fStr = fStr.replace(regD, nD);
            }
            if (regH === "hh") {
              fStr = fStr.replace(regH, nH);
            }
            if (regMI === "mi") {
              fStr = fStr.replace(regMI, nMM);
            }
            if (regS === "ss") {
              fStr = fStr.replace(regS, nS);
            }
            if (regDW == "dw") {
              fStr = fStr.replace(regDW, info.week_names[nDW].label);
            }
            return fStr;
          })();
        }
        else {
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
     */
    function dday(d, cond) {
      var memory_day = date(d), DyMilli = ((1000 * 60) * 60) * 24, today = new Date(), diffnum, this_year_memory_day;

      function get_day_time(_d) {
        return Math.floor(_d.getTime() / DyMilli) * DyMilli;
      }

      if (typeof cond === "undefined") {
        diffnum = number((( get_day_time(memory_day) - get_day_time(today) ) / DyMilli), {floor: true});
        return diffnum;
      }

      else {
        diffnum = number((( get_day_time(memory_day) - get_day_time(today) ) / DyMilli), {floor: true});
        if (cond["today"]) {
          today = date(cond.today);
          diffnum = number((( get_day_time(memory_day) - get_day_time(today) ) / DyMilli), {floor: true});
        }
        if (cond["this_year"]) {
          this_year_memory_day = new Date(today.getFullYear(), memory_day.getMonth(), memory_day.getDate());
          diffnum = number((( get_day_time(this_year_memory_day) - get_day_time(today) ) / DyMilli), {floor: true});
          if (diffnum < 0) {
            this_year_memory_day = new Date(today.getFullYear() + 1, memory_day.getMonth(), memory_day.getDate());
            diffnum = number((( get_day_time(this_year_memory_day) - get_day_time(today) ) / DyMilli), {floor: true});
          }
          if (cond["age"]) {
            diffnum = this_year_memory_day.getFullYear() - memory_day.getFullYear();
          }
        }

        return diffnum;
      }
    }

    /**
     * 인자인 날짜가 몇년 몇월의 몇번째 주차인지 반환합니다.
     * @method ax5.util.weeks_of_month
     * @param {String|Data} d
     * @returns {Object}
     * @example
     * ```js
     * ax5.util.weeks_of_month("2015-10-01"); // {year: 2015, month: 9, count: 5}
     * ax5.util.weeks_of_month("2015-09-19"); // {year: 2015, month: 9, count: 3}
     * ```
     */
    function weeks_of_month(d) {
      var my_date = date(d);
      //s_of_month = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      //s_of_month.getDay()
      //console.log(s_of_month.getDay(), my_date.getDay());
      //console.log(parseInt(my_date.getDate() / 7 + 1));
      return {
        year: my_date.getFullYear(),
        month: my_date.getMonth() + 1,
        count: parseInt(my_date.getDate() / 7 + 1)
      };
    }

    /**
     * 원하는 횟수 만큼 자릿수 맞춤 문자열을 포함한 문자열을 반환합니다.
     * @method ax5.util.set_digit
     * @param {String|Number} num
     * @param {Number} length
     * @param {String} [padder=0]
     * @param {Number} [radix]
     * @returns {String}
     */
    function set_digit(num, length, padder, radix) {
      var s = num.toString(radix || 10);
      return times((padder || '0'), (length - s.length)) + s;
    }

    function times(s, count) { return count < 1 ? '' : new Array(count + 1).join(s); }

    /**
     * 년월에 맞는 날자수를 반환합니다.
     * @method ax5.util.days_of_month
     * @param {Number} y
     * @param {Number} m
     * @returns {Number}
     */
    function days_of_month(y, m) {
      if (m == 3 || m == 5 || m == 8 || m == 10) {
        return 30;
      }
      else if (m == 1) {
        return (((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0)) ? 29 : 28;
      }
      else {
        return 31;
      }
    }

    return {
      alert: alert,
      each: each,
      map: map,
      search: search,
      reduce: reduce,
      reduce_right: reduce_right,
      filter: filter,
      to_json: to_json,
      parse_json: parse_json,
      extend: extend,
      extend_all: extend_all,
      clone: clone,
      first: first,
      last: last,
      left: left,
      right: right,
      get_type: get_type,
      is_window: is_window,
      is_element: is_element,
      is_object: is_object,
      is_array: is_array,
      is_function: is_function,
      is_string: is_string,
      is_number: is_number,
      is_nodelist: is_nodelist,
      is_undefined: is_undefined,
      is_nothing: is_nothing,
      set_cookie: set_cookie,
      get_cookie: get_cookie,
      require: require,
      camel_case: camel_case,
      snake_case: snake_case,
      number: number,
      to_array: to_array,
      merge: merge,
      param: param,
      error: error,
      get_shader: get_shader,
      request_ani_frame: request_ani_frame,
      date: date,
      dday: dday,
      set_digit: set_digit,
      times: times,
      days_of_month: days_of_month,
      weeks_of_month: weeks_of_month
    }
  })();

  if (typeof module === "object" && module && 'exports' in module) {
    module.exports = ax5; // commonJS
  }
  else {
    root.ax5 = ax5;
    if (typeof define === "function" && define.amd) define("_ax5", [], function() {
      return ax5;
    }); // requireJS
  }

}).call(this);

/**
 * @class ax5.ui.root
 * @classdesc ax5 ui class 코어 클래스 모든 클래스의 공통 함수를 가지고 있습니다.
 * @version v0.0.1
 * @author tom@axisj.com
 * @logs
 * 2014-12-12 tom : 시작
 * @example
 * ```
 * var myui = new ax5.ui.root();
 * ```
 */
ax5.ui = (function (core) {

	function ax_ui() {
		// 클래스 인스턴스 초기화
		this.main = (function(){
			this.config = {};
			this.name = "root";
		}).apply(this, arguments);

		/**
		 * 클래스의 속성 정의 메소드 속성 확장후에 내부에 init 함수를 호출합니다.
		 * @method ax5.ui.root.set_config
		 * @param {Object} config - 클래스 속성값
		 * @param {Boolean} [call_init=true] - init 함수 호출 여부
		 * @returns {ax5.ui.ax_ui}
		 * @example
		 * ```
		 * var myui = new ax5.ui.root();
		 * myui.set_config({
		 * 	id:"abcd"
		 * });
		 * ```
		 */
		this.set_config = function (cfg, call_init) {
			core.util.extend_all(this.config, cfg, true);
			if (typeof call_init == "undefined" || call_init === true) {
				this.init();
			}
			return this;
		};
		this.init = function () {
			console.log(this.config);
		};

		this.bind_window_resize = function(callBack){

			setTimeout((function(){
				ax5.dom.resize((function(){
					if(this.bind_window_resize__) clearTimeout(this.bind_window_resize__);
					this.bind_window_resize__ = setTimeout((function(){
						callBack.call(this);
					}).bind(this), 10);
				}).bind(this));
			}).bind(this), 100);

		};

		this.stop_event = function(e){
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
			return false;
		}
	}

	return {
		root: ax_ui
	}
})(ax5);