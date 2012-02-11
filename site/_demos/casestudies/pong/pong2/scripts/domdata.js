(function ($) {
    if (!$ || !$.types) {
        throw 'Initialization Error: DOMData requires Core.';
    }
    if ($.domdata) {
        throw 'Initialization Error: DOMData has already been defined.';
    }

    // This is taken from private jQuery methods: var rbrace
    var rbrace = /^(?:\{.*\}|\[.*\])$/;
    
    // This is taken from private jQuery methods: function dataAttr( elem, key, data )
    function getValue(data) {
	    if ( typeof data === "string" ) {
            try {
                data = data === "true" ? true :
                data === "false" ? false :
                data === "null" ? null :
                jQuery.isNumeric( data ) ? parseFloat( data ) :
                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                    data;
            } catch( e ) {
                $.log.write('DOMData Parse Error: ' + e);
            }
        } else {
            data = undefined;
        }
	
	    return data;
	}
    
    var addOrAppend = function (map, key, value) {
        if (key == '') {
            if (!map.length) {
                map.length = 0;
            }
            key = map.length;
            map.length++;
        }
        if (map[key]) {
            if ($.isArray(map[key])) {
                map[key].push(value)
            } else {
                map[key] = [map[key], value];
            }
        } else {
            map[key] = value;
        }
    };

    //removes "-"s and makes the first letter after each "-" uppercase per HTML data spec.
    var cleanName = function (name) {
        var cn = new Array();
        cn = name.toLowerCase().split('-').clean('-').clean('');
        var cleaned = cn[0];
        for (var x = 1; x < cn.length; x++) {//first "word" is lowercase
            cleaned += cn[x].charAt(0).toUpperCase() + cn[x].slice(1);
        }
        return cleaned;
    };

    var readData = function (els, attrPrefix) {
        var regex = new RegExp('^' + attrPrefix, 'i');
        var result = {};
        els.each(function () {
            for (var i = 0; i < this.attributes.length; i++) {
                var name = this.attributes[i].name;
                var match = regex.exec(name);
                if (match) {
                    var key = cleanName(name.substr(match[0].length));
                    var value = getValue(this.attributes[i].value);
                    addOrAppend(result, key, value);
                }
            }
        });
        return result;
    };

    /**
    * Adds ability to read data from DOM elements to jQuery.
    */
    $.domdata = {
        /**
        * @description Reads data from DOM element.
        * @param {HtmlElement} elem
        * @param {mixed} recursionLevel (Optional, defaults to false) May be boolean or number.
        * @param {string} attrPrefix (Optional, defaults to "data-")
        * @returns {object}
        */
        read: function (elem, recursionLevel, attrPrefix) {
            var el = $(elem);
            recursionLevel = recursionLevel || false;
            attrPrefix = attrPrefix || 'data-';
            
            if (recursionLevel === true) {
                el = el.find('*').andSelf();
            } else if (typeof recursionLevel == 'number') {
                for(var i=0; i<recursionLevel; i++) {
                    el = el.children().andSelf();
                }
            }
            
            return readData(el, attrPrefix);
        }
    };

    $.fn.extend({
        /**
        * @description Reads data from DOM element.
        * @param {mixed} recursionLevel (Optional, defaults to false) May be boolean or number.
        * @param {string} attrPrefix (Optional, defaults to "data-")
        * @returns {object}
        */
        domdata: function (recursionLevel, attrPrefix) {
            return $.domdata.read(this, recursionLevel, attrPrefix);
        }
    });
})(jQuery);