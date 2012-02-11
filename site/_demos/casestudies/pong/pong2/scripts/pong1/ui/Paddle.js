// Pong1.UI.Paddle :: A Pong Paddle controlled by either an AI or player.
(function ($) {
    $.types.ns('Pong1.UI.Paddle');
    Pong1.UI.Paddle = $.types.define(function () {
        var _context;
        var _field;
        var _config = {
            controllable: false
        };
        var _boundY;

        var _checkBoundY = function (value) {
            var newPositionY = value;
            (newPositionY > _boundY) ? (newPositionY = _boundY) : ((newPositionY < 0) ? newPositionY = 0 : newPositionY = newPositionY);
            return newPositionY;
        };

        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                _field = $(_context).parents('.pongField');
                _boundY = ($(_field).height() - $(_context).outerHeight());
            },
            activate: function () {
                if (_config.controllable) {
                    $(_field).mousemove(function (e) {
                        var y = (e.pageY - ($(_context).outerHeight() / 2)) - $(_field).offset().top;
                        $(_context).css('margin-top', _checkBoundY(y) + 'px');
                    });
                }
            },
            deactivate: function () {
                if (_config.controllable)
                    $(_field).unbind('mousemove');
            }
        };
        return self;
    });
})(jQuery);