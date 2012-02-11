// Pong1.UI.Court :: Controlls and coordinates the various pieces of the Pong court
(function ($) {
    $.types.ns('Pong2.UI.Court');
    Pong2.UI.Court = $.types.define(function () {
        var _context;
        var _config;
        var _field, _ball, _paddle1, _paddle2;
        var _player1Score = 0;
        var _player2Score = 0;
        var _fieldObj;

        var _resetField = function () {
            $(_context).broadcast('center');
            _field.click(function () {
                _ball.msg('serve');
                $(this).unbind('click');
            });
        };

        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                //initialize pieces.
                _field = $('.pongField', _context);
                _ball = $('.pongBall', _context);
                _paddle1 = $('.pongPaddle.js-player1', _context);
                _paddle2 = $('.pongPaddle.js-player2', _context);
                _paddle1.css('float', 'left');
                _paddle2.css('float', 'right');

                _fieldObj = new Pong2.Lib.Game.Field(_field.height(), _field.width());

                $('.pongPaddle', _context).msg('setField', _fieldObj);
                _ball.msg('setField', _fieldObj);
                setTimeout(function () {
                    _resetField();
                }, 100);
            },
            resetField: function () {
                _resetField();
            },
            tallyScore: function (direction) {
                if (direction == 'right') {
                    _player1Score++;
                    $(_context).broadcast('update', 'player1', _player1Score.toString());
                } else {
                    _player2Score++;
                    $(_context).broadcast('update', 'player2', _player2Score.toString());
                }
            }
        };
        return self;
    });
})(jQuery);