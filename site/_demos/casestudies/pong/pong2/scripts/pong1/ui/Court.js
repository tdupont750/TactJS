// Pong1.UI.Court :: Controlls and coordinates the various pieces of the Pong court
(function ($) {
    $.types.ns('Pong1.UI.Court');
    Pong1.UI.Court = $.types.define(function () {
        var _context;
        var _config;
        var _field, _ball, _paddle1, _paddle2;
        var _fieldHeight, _fieldWidth, _ballHeight, _ballWidth, _paddle1Height, _paddle1Width, _paddle2Height, _paddle2Width;
        var _player1Score = 0;
        var _player2Score = 0;

        var _getDimensions = function () {
            _fieldHeight ? _fieldHeight = _fieldHeight : _fieldHeight = _field.height();
            _fieldWidth ? _fieldWidth = _fieldWidth : _fieldWidth = _field.width();
            _ballHeight ? _ballHeight = _ballHeight : _ballHeight = _ball.outerHeight();
            _ballWidth ? _ballWidth = _ballWidth : _ballWidth = _ball.outerWidth();
            _paddle1Height ? _paddle1Height = _paddle1Height : _paddle1Height = _paddle1.outerHeight();
            _paddle1Width ? _paddle1Width = _paddle1Width : _paddle1Width = _paddle1.outerWidth();
            _paddle2Height ? _paddle2Height = _paddle2Height : _paddle2Height = _paddle2.outerHeight();
            _paddle2Width ? _paddle2Width = _paddle2Width : _paddle2Width = _paddle2.outerWidth();
        };
        var _centerBallOnCourt = function () {
            var yCoordinate = (_fieldHeight / 2) - (_ballHeight / 2);
            var xCoordinate = (_fieldWidth / 2) - (_ballWidth / 2);

            _ball.css('margin-left', xCoordinate + 'px');
            _ball.css('margin-top', yCoordinate + 'px');
        };
        var _centerPaddles = function () {
            var yCoordinate1 = (_fieldHeight / 2) - (_paddle1Height / 2);
            var yCoordinate2 = (_fieldHeight / 2) - (_paddle2Height / 2);

            _paddle1.css('margin-top', yCoordinate1 + "px");
            _paddle2.css('margin-top', yCoordinate2 + "px");
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
                _ball.css('position', 'absolute');
                self.resetField();
            },
            resetField: function () {
                _getDimensions();
                _centerBallOnCourt();
                _centerPaddles();
                _field.click(function () {
                    _ball.msg('serve');
                    $(this).unbind('click');
                });
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