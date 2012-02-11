// Pong1.UI.Paddle :: A Pong Paddle controlled by either an AI or player.
(function ($) {
    $.types.ns('Pong2.UI.Paddle');
    Pong2.UI.Paddle = $.types.define(function () {
        var _context;
        var _field;
        var _config = {
            controllable: false,
            animationSpeed: 2,
            side: ''
        };
        var _entity;

        var _onMovement = function () {
            $(_context).css('marginTop', _entity.position.getY() + "px");
        };

        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                _entity = new Pong2.Lib.Game.Paddle($(_context).outerHeight(), $(_context).outerWidth());
                _entity.movement.setTick(_config.animationSpeed);
                _entity.movement.onMove.subscribe(_onMovement);
            },
            activate: function (offsetTop, context) {
                if (_config.controllable) {
                    $(context).mousemove(function (e) {
                        var mouseY = (e.pageY - (_entity.height / 2)) - offsetTop;
                        var newX = _entity.position.getX();
                        var newY;
                        if (mouseY < (_field.height - _entity.height) && mouseY >= 0) {
                            newY = mouseY;
                        } else {
                            if (mouseY < 0) {
                                newY = 0;
                            } else {
                                newY = _field.height - _entity.height;
                            }
                        }
                        _entity.moveTo(newX, newY);
                    });
                }
            },
            deactivate: function () {
                if (_config.controllable) {
                    $(_field).unbind('mousemove');
                }
            },
            setField: function (field) {
                _field = field;
            },
            center: function () {                
                _entity.moveTo((_field.width - _entity.width) / 2, (_field.height - _entity.height) / 2);
            },
            checkCollision: function (direction, ball) {
                if (direction == _config.side) {
                    if (_entity.detectCollision(ball)) {
                        _config.side == 'left' ? $(_context).parent().broadcast('moveRight') : $(_context).parent().broadcast('moveLeft');
                    } else {
                        $(_context).parents('.court').msg('resetField').msg('tallyScore', _config.side);
                    }
                }
            }
        };
        return self;
    });
})(jQuery);