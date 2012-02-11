(function ($) {
    if (!$) {
        throw 'Initialization Error: TactJS requires jQuery';
    }
    if ($.types) {
        throw 'Initialization Error: TactJS has already been defined.';
    }

    var extend = function (target, optional, required) {
        for (var p in required) {
            target[p] = required[p];
        }
        for (var p in optional) {
            if (!target[p]) {
                wrap(target, optional, p);
            }
        }
    };

    var wrap = function (target, source, property) {
        Object.defineProperty(target, property, {
            get: function () {
                return source[property];
            },
            set: function (value) {
                source[property] = value;
            }
        });
    };

    /**
    * TactJS Core - Adds polymorphic object orientation for closures to jQuery
    */
    $.types = {
        /**
        * @description Define a class.
        * @param {function} declaration
        * @return {function} Class constructor.
        */
        define: function (declaration) {
            var classDeclaration = function () {
                var instance = declaration.apply(this, arguments);
                extend(instance, null, {
                    constructor: classDeclaration,
                    is: function (type) {
                        return $.types.is(instance, type);
                    }
                });
                return instance;
            };
            return classDeclaration;
        },
        /**
        * @description Define a singleton.
        * @param {function} declaration
        * @return {function} Singleton instance of class definition.
        */
        defineAsSingleton: function (declaration) {
            var type = $.types.define(declaration);
            return new type();
        },
        /**
        * @description Define a class that inherits from a superclass.
        * @param {function} superclass
        * @param {function} declaration
        * @return {function} Child class constructor.
        */
        extend: function (superclass, declaration) {
            var classDeclaration = function () {
                var childInstance = declaration.apply(this, arguments);
                var superInstance = superclass.apply(this, arguments);
                extend(childInstance, superInstance, {
                    superclass: superInstance,
                    constructor: classDeclaration,
                    is: function (type) {
                        return $.types.is(childInstance, type);
                    }
                });
                return childInstance;
            };
            return classDeclaration;
        },
        /**
        * @description Define a singleton that inherits from a superclass.
        * @param {function} superclass
        * @param {function} declaration
        * @return {object} Singleton instance of class extension.
        */
        extendAsSingleton: function (superclass, declaration) {
            var type = $.types.extend(superclass, declaration);
            return new type();
        },
        /**
        * @description Type checks an object.
        * @param {object} object
        * @param {function} type
        * @returns {boolean} True if object is derivative of type.
        */
        is: function (object, type) {
            var t = object;
            do {
                if (t.constructor === type) {
                    return true;
                }
                t = t.superclass;
            } while (t);
            return false;
        },
        /**
        * @description Defines namespaces for object delcaration.
        * @param {string} namespace
        */
        ns: function (namespace) {
            var d = namespace.split(".");
            var o = window;
            for (var j = 0; j < d.length; j++) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
    };

    var cloneObject = function (source) {
        var clone = {};
        for (var p in source) {
            clone[p] = $.types.clone(source[p]);
        }
        return clone;
    };

    var cloneArray = function (source, shallow) {
        var clone = [];
        for (var i = 0; i < source.length; i++) {
            clone[i] = shallow === true ? source[i] : $.types.clone(source[i]);
        }
        return clone;
    };

    /**
    * TactJS Utilities - Adds helpful utility methods.
    */
    $.utilities = {
        /**
        * @description Clone an object or array.
        * @param {object} source
        * @returns {object} Clone of source.
        */
        clone: function (source) {
            if (!source || typeof source != 'object') {
                return source;
            } else if ($.isArray(source)) {
                return cloneArray(source);
            } else {
                return cloneObject(source);
            }
        },
        /**
        * @description Creates a delegate that preserves scope.
        * @param {function} fn
        * @param {object} scope
        * @returns {function} delegate
        */
        createDelegate: function (fn, scope) {
            return function () {
                fn.apply(scope, arguments);
            };
        }
    };
	
	// ------------- RANDOM PATCHES -------------

    if (!$.isArray) {
        $.isArray = Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        };
    }
	
    $.url = function() {
		function l(a) {
			for (var b = "", c = 0, f = 0, d = 0; c < a.length;) {
				f = a.charCodeAt(c);
				if (f < 128) {
					b += String.fromCharCode(f);
					c++
				} else if (f > 191 && f < 224) {
					d = a.charCodeAt(c + 1);
					b += String.fromCharCode((f & 31) << 6 | d & 63);
					c += 2
				} else {
					d = a.charCodeAt(c + 1);
					c3 = a.charCodeAt(c + 2);
					b += String.fromCharCode((f & 15) << 12 | (d & 63) << 6 | c3 & 63);
					c += 3
				}
			}
			return b
		}
		function m(a, b) {
			var c = {}, f = {
				"true" : true,
				"false" : false,
				"null" : null
			};
			$.each(a.replace(/\+/g, " ").split("&"), function(d, j) {
					var e = j.split("=");
					d = k(e[0]);
					j = c;
					var i = 0, g = d.split("]["), h = g.length - 1;
					if (/\[/.test(g[0]) && /\]$/.test(g[h])) {
						g[h] = g[h].replace(/\]$/, "");
						g = g.shift().split("[").concat(g);
						h = g.length - 1
					} else
						h = 0;
					if (e.length === 2) {
						e = k(e[1]);
						if (b)
							e = e && !isNaN(e) ? +e : e === "undefined"
								? undefined
								: f[e] !== undefined ? f[e] : e;
						if (h)
							for (; i <= h; i++) {
								d = g[i] === "" ? j.length : g[i];
								j = j[d] = i < h
									? j[d] || (g[i + 1] && isNaN(g[i + 1]) ? {} : [])
									: e
							}
						else if ($.isArray(c[d]))
							c[d].push(e);
						else
							c[d] = c[d] !== undefined ? [c[d], e] : e
					} else if (d)
						c[d] = b ? undefined : ""
				});
			return c
		}
		function n(a) {
			a = a || window.location;
			var b = ["source", "protocol", "authority", "userInfo", "user", "password", "host",
				"port", "relative", "path", "directory", "file", "query", "anchor"];
			a = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
				.exec(a);
			for (var c = {}, f = b.length; f--;)
				c[b[f]] = a[f] || "";
			if (c.query)
				c.params = m(c.query, true);
			return c
		}
		function o(a) {
			if (a.source)
				return encodeURI(a.source);
			var b = [];
			if (a.protocol)
				if (a.protocol == "file")
					b.push("file:///");
				else
					a.protocol == "mailto" ? b.push("mailto:") : b.push(a.protocol + "://");
			if (a.authority)
				b.push(a.authority);
			else {
				if (a.userInfo)
					b.push(a.userInfo + "@");
				else if (a.user) {
					b.push(a.user);
					a.password && b.push(":" + a.password);
					b.push("@")
				}
				if (a.host) {
					b.push(a.host);
					a.port && b.push(":" + a.port)
				}
			}
			if (a.path)
				b.push(a.path);
			else {
				a.directory && b.push(a.directory);
				a.file && b.push(a.file)
			}
			if (a.query)
				b.push("?" + a.query);
			else
				a.params && b.push("?" + $.param(a.params));
			a.anchor && b.push("#" + a.anchor);
			return b.join("")
		}
		function p(a) {
			return encodeURIComponent(a)
		}
		function k(a) {
			a = a || window.location.toString();
			return l(unescape(a.replace(/\+/g, " ")))
		}
		return {
			encode : p,
			decode : k,
			parse : n,
			build : o
		}
	}();

	if (!Array.prototype.indexOf) {  
		Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {  
			"use strict";  
			if (this == null) {  
				throw new TypeError();  
			}  
			var t = Object(this);  
			var len = t.length >>> 0;  
			if (len === 0) {  
				return -1;  
			}  
			var n = 0;  
			if (arguments.length > 0) {  
				n = Number(arguments[1]);  
				if (n != n) { // shortcut for verifying if it's NaN  
					n = 0;  
				} else if (n != 0 && n != Infinity && n != -Infinity) {  
					n = (n > 0 || -1) * Math.floor(Math.abs(n));  
				}  
			}  
			if (n >= len) {  
				return -1;  
			}  
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
			for (; k < len; k++) {  
				if (k in t && t[k] === searchElement) {  
					return k;  
				}  
			}  
			return -1;  
		}
    }

    Array.prototype.clean = function (deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    }

})(jQuery);