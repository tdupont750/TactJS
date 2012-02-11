(function ($) {
    $.types.ns('Pong2.Lib.Game');
    Pong2.Lib.Game.Ball = $.types.extend(Pong2.Lib.Game.Entity, function (height, width) {        
        var self = {
            moveTo: function (newX, newY, duration) {
                var newPosition = new Pong2.Lib.Util.Position(newX, newY);
                duration ? this.movement.changePosition(this.position, newPosition, duration) : this.movement.setPosition(this.position, newPosition);
            },
            movement: new Pong2.Lib.Util.Move()           
        };
        return self;
    });
})(jQuery);
