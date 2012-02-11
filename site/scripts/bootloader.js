//configuration
var _scriptsRoot = "Scripts/";
var _bootstrap = "core.js";

//jQuery plugins
(function ($) {
    if (!$ || !$.types) {
        throw 'Initialization Error: BootLoader requires Core.';
    }
    if ($.bootloader) {
        throw 'Initialization Error: BootLoader has already been defined.';
    }


    $.types.ns('Tact');

    $.bootloader = function () {
        var _loadListeners = [];
        var _allowCache = true;

        var determineSeedValue = function () {
            if (!_allowCache)
                return (new Date()).getTime().toString();

            var seedValue = null;
            $('script').each(function () {
                if ($(this).attr('src') && $(this).attr('src').toLowerCase().indexOf(_bootstrap) >= 0) {
                    var scriptUri = new ScriptUri($(this).attr('src'));
                    seedValue = scriptUri.seedValue();
                }
            });

            return seedValue;
        };

        var maskSrc = function (src) {
            return (src.indexOf('~') == 0) ? src.substring(1) : src;
        };
        var maskSrcForFetch = function (src) {
            var uri = Uri(src);
            uri.params('v', determineSeedValue());

            return uri.toString();
        };

        var referenced = function (src) {
            var masked = maskSrc(src).toLowerCase();
            var found = false;

            $('script').each(function () {
                if ($(this).attr('src') && $(this).attr('src').toLowerCase().indexOf(masked) >= 0) {
                    found = true;
                }
            });

            return found;
        };

        var addListenerFor = function (path, onLoaded) {
            if (_loadListeners[path] == null)
                _loadListeners[path] = [];           
            _loadListeners[path][_loadListeners[path].length] = onLoaded;
        };

        var fireAllListenersFor = function (path) {
            if (_loadListeners[path]) {
                for (var i = 0; i < _loadListeners[path].length; i++) {
                    if ($.isFunction(_loadListeners[path][i])) _loadListeners[path][i]();
                }
            }
        };

        var getTypeByString = function (typeString) {
            var parts = typeString.split('.');

            var current = window;

            for (var i = 0; i < parts.length; i++) {
                if (!current[parts[i]])
                    return null;

                current = current[parts[i]];
            }

            return current;
        };

        var self = {
            requireByType: function (typeName, onLoaded) {
                if (getTypeByString(typeName) != null) {
                    onLoaded();
                }
                else {
                    var requirePath = _scriptsRoot + typeName.replace(/(\.)/g, '/') + '.js';
                    self.require(requirePath, onLoaded);
                }
            },
            require: function (src, onLoaded) {
                if ($.isFunction(onLoaded))
                    addListenerFor(src, onLoaded);

                if (referenced(src)) {
                    return;
                }

                var script = document.createElement('script');
                script.src = maskSrcForFetch(src);
                script.async = true;
                script.type = 'text/javascript';
                var head = document.getElementsByTagName('head')[0];
                if (!head) {
                    head = document.body.parentNode.appendChild(document.createElement('head'));
                }

                if (script.readyState) { // Ensure IE9 only fires once
                    script.onreadystatechange = function () {
                        if (script.readyState == 'complete' || script.readyState == 'loaded') { // Fire for all versions of IE
                            fireAllListenersFor(src);
                        }
                    }
                } else {
                    script.onload = function () {
                        fireAllListenersFor(src);
                    }
                }

                head.appendChild(script);
            },
            caching: function (allowCache) {
                _allowCache = allowCache;
            }
        };

        return self;
    } ();

    var Uri = function (uriString) {
        var _parsed = $.url.parse(uriString);

        return {
            pieces: function () {
                return _parsed;
            },
            params: function (key, val) {
                if (!_parsed.params)
                    _parsed.params = {};

                if (arguments.length == 0)
                    return _parsed.params;

                if (arguments.length > 1) {
                    //set flow
                    _parsed.params[key] = val;
                }
                else {
                    //get flow
                    return _parsed.params[key];
                }
            },

            toString: function () {
                //wipe source
                _parsed.source = null;
                return $.url.build(_parsed);
            }
        };
    };

    var ScriptUri = function (uriString) {
        var _baseUri = Uri(uriString);

        return {
            seedValue: function () {
                return _baseUri.params('v');
            }
        };
    };

})(jQuery);