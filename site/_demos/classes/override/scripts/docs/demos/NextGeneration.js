// an object which returns the name of the captain in Star Trek : The Next Generation, and extends Star Trek : The Original Series
(function ($) {
    $.types.ns("Docs.Demos");
    Docs.Demos.NextGeneration = $.types.extend(Docs.Demos.StarTrek, function () {

        var self = {
            captain: function () {
                return "Jean-Luc Picard";
            },
            previousCaptain: function () {
                return self.superclass.captain();
            },
            previousPreviousCaptain: function () {
                return self.superclass.superclass.captain();
            }
        };

        return self;
    });
})(jQuery);