(function ($) {
    $.types.ns('Pong2.Lib.Game');
    Pong2.Lib.Game.Entity = $.types.define(function (h, w) {
        var _height = h;
        var _width = w;
        var self = {
            height: _height,
            width: _width,
            position: new Pong2.Lib.Util.Position()
        };
        return self;
    });
})(jQuery);