// Docs.HTMLEncode. Converts a section of HTML to encoded text and renders the result to the DOM.
(function ($) {
    $.types.ns('Docs');
    Docs.HTMLEncode = $.types.define(function () {
        var _context;
        var _config;
        var self = {
            init: function (context) {
                _context = context;
                this.encode();
            },
            encode: function () {
                $(_context).html($('<div/>').text($(_context).html()).html());
            },
            decode: function () {
                $(_context).html($('<div/>').html($(_context).html()).text());
            }
        };
        return self;
    });
})(jQuery);