(function ($) {
    $.types.ns('Pong2.Lib.Util');
    Pong2.Lib.Util.Move = $.types.define(function () {
        var _tick = 10; //milliseconds per cycle

        var _move = function (position, changeX, changeY, ticksRemaining) {
            position.setX(position.getX() + changeX);
            position.setY(position.getY() + changeY);
            self.onMove.fire();
            if (ticksRemaining > 0) {
                ticksRemaining = ticksRemaining - 1;
                setTimeout(function () {
                    _move(position, changeX, changeY, ticksRemaining);
                }, _tick);
            } else {
                self.onMoveComplete.fire();
            }
        };

        var self = {
            changePosition: function (position, newPosition, duration) {
                var totalTicks = Math.floor(duration / _tick);
                var originalX = position.getX();
                var originalY = position.getY();

                changePerTickX = (newPosition.getX() - originalX) / totalTicks;
                changePerTickY = (newPosition.getY() - originalY) / totalTicks;

                _move(position, changePerTickX, changePerTickY, totalTicks);
            },
            setPosition: function (position, newPosition) {
                position.setX(newPosition.getX());
                position.setY(newPosition.getY());
                self.onMove.fire();
            },
            setTick: function (tick) {
                _tick = tick;
            },
            onMove: new Tact.Event(),
            onMoveComplete: new Tact.Event()
        };
        return self;
    });
})(jQuery);