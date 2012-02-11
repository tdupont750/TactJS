(function ($) {
    $.types.ns('Pong2.Lib.Util');
    Pong2.Lib.Util.Position = $.types.define(function (x, y) {
        var _x = x;
        var _y = y;
        var self = {
            getX: function () {
                return _x;
            },
            getY: function () {
                return _y;
            },
            setX: function (x) {
                _x = x;
            },
            setY: function (y) {
                _y = y;
            }
        };
        return self;
    });
})(jQuery);