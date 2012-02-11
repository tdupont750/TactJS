// Pong1.UI.Updatable :: Updates it's html value if the passed key matches config.
(function ($) {
    $.types.ns('Pong1.UI.Updatable');
    Pong1.UI.Updatable = $.types.define(function () {
        var _context;
        var _config = {
            key: ''
        };
        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
            },
            update: function (key, message) {
                if(key == _config.key)
                    $(_context).html(message);
            }
        };
        return self;
    });
})(jQuery);