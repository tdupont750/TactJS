(function ($) {
    $.types.ns('Pong2.Lib.Game');
    Pong2.Lib.Game.Paddle = $.types.extend(Pong2.Lib.Game.Entity, function (height, width) {
        var self = {
            moveTo: function (newX, newY) {
                var newPosition = new Pong2.Lib.Util.Position(newX, newY);
                this.movement.setPosition(this.position, newPosition);
            },
            detectCollision: function (entity) {
                var collision = false;
                var entityTop = entity.position.getY();
                var entityBottom = (entity.position.getY() + entity.height);
                var thisTop = this.position.getY();
                var thisBottom = (this.position.getY() + this.height);
                if ((entityTop > thisTop && entityBottom < thisBottom) || (entityTop < thisTop && entityBottom > thisTop) || (entityBottom > thisBottom && entityTop < thisBottom)) {
                    collision = true;
                }
                return collision;
            },
            movement: new Pong2.Lib.Util.Move()
        };
        return self;
    });
})(jQuery);
