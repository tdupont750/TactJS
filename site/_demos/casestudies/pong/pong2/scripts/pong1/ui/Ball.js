// Pong1.UI.Ball :: A Pong Ball.
(function ($) {
    $.types.ns('Pong1.UI.Ball');
    Pong1.UI.Ball = $.types.define(function () {
        var _context;
        var _field;
        var _config = {
            speed: 3000,
            initialDirection: 'right',
            direction: 'right'
        };

        var _randomFromTo = function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        };

        var _moveBall = function (speed) {
            var targetY = _randomFromTo(0, 300);
            var targetX;
            _config.direction == 'left' ? targetX = 9 : targetX = 381;
            var thisSpeed;
            speed ? thisSpeed = speed : thisSpeed = _config.speed;
                        
            $(_context).animate({ marginTop: targetY, marginLeft: targetX }, thisSpeed, 'linear', function () { self.volley() });
        };

        var _detectCollision = function () {
            var collision = false;
            var ballBoundTop, ballBoundBottom;
            var paddleBoundTop, paddleBoundBottom;
            var paddle;
            _config.direction == 'right' ? paddle = $('.pongPaddle:last', _field) : paddle = $('.pongPaddle:first', _field);
            ballBoundTop = $(_context).offset().top;
            ballBoundBottom = $(_context).outerHeight() + ballBoundTop;

            paddleBoundTop = paddle.offset().top;
            paddleBoundBottom = paddle.outerHeight() + paddleBoundTop;

            if ((ballBoundTop > paddleBoundTop && ballBoundBottom < paddleBoundBottom) || (ballBoundBottom > paddleBoundTop && ballBoundTop < paddleBoundTop) || (ballBoundTop < paddleBoundBottom && ballBoundBottom > paddleBoundBottom)) {
                collision = true;
            }
            return collision;
        };
        var _checkBoundX = function (value) {
            var newPositionX = value;
            (newPositionX > _boundX) ? (newPositionX = _boundX) : ((newPositionX < 0) ? newPositionX = 0 : newPositionX = newPositionX);
            return newPositionX;
        };
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
            },
            serve: function () {
                var direction = _config.direction ? _config.direction : _config.initialDirection;
                _config.direction = direction;
                _moveBall(_config.speed / 2);
            },
            volley: function () {
                //check for collision.
                var collision = _detectCollision();
                if (collision) {
                    //change direction.
                    _config.direction == 'left' ? _config.direction = 'right' : _config.direction = 'left';
                    //move ball
                    _moveBall();
                } else {
                    //reset board and tally score
                    $(_context).parents('.court').msg('resetField').msg('tallyScore', _config.direction);
                    //change direction.
                    _config.direction == 'left' ? _config.direction = 'right' : _config.direction = 'left';
                }
            }
        };
        return self;
    });
})(jQuery);