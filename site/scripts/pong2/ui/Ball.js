// Pong1.UI.Ball :: A Pong Ball.
(function ($) {
    $.types.ns('Pong2.UI.Ball');
    Pong2.UI.Ball = $.types.define(function () {
        var _context;
        var _config = {
            speed: 1600,
            animationSpeed: 10
        };
        var _field;
        var _entity;
        var _lastMove;

        var _randomFromTo = function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        };

        var _getNewPosition = function (right, speed) {
            var newX;
            var thisSpeed;
            right ? newX = (_field.width - (_entity.width * 2)) : newX = _entity.width;            
            speed ? thisSpeed = speed : thisSpeed = _config.speed;
            _entity.moveTo(newX, _randomFromTo(0, _field.height), thisSpeed);
        };

        var _onMovement = function () {
            $(_context).css('marginTop', _entity.position.getY() + "px");
            $(_context).css('marginLeft', _entity.position.getX() + "px");
        };

        var _onMovementComplete = function () {
            _lastMove == 'right' ? $(_context).parent().broadcast('checkCollision', 'right', _entity) : $(_context).parent().broadcast('checkCollision', 'left', _entity)
        };

        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                //initialize objects
                _entity = new Pong2.Lib.Game.Ball($(_context).outerHeight(), $(_context).outerWidth());
                _entity.movement.setTick(_config.animationSpeed);
                _entity.movement.onMove.subscribe(_onMovement);
                _entity.movement.onMoveComplete.subscribe(_onMovementComplete);
            },
            setField: function (field) {
                _field = field
            },
            center: function () {                
                _entity.moveTo((_field.width - _entity.width) / 2, (_field.height - _entity.height) / 2);
            },
            serve: function () {
                if (!_lastMove) {
                    var coin = _randomFromTo(1, 2);
                    coin == 1 ? _lastMove = 'right' : _lastMove = 'left';
                }
                _lastMove == 'right' ? self.moveLeft(_config.speed / 2) : self.moveRight(_config.speed / 2);
            },
            moveRight: function (speed) {
                _lastMove = 'right';
                _getNewPosition(true, speed);                
            },
            moveLeft: function (speed) {
                _lastMove = 'left';
                _getNewPosition(false, speed);                
            }
        };
        return self;
    });
})(jQuery);