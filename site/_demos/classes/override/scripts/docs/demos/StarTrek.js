// an object which returns the name of the captain in Star Trek : The Original Series, and extends Star Trek : Enterprise
(function ($) {
    $.types.ns("Docs.Demos");
    Docs.Demos.StarTrek = $.types.extend(Docs.Demos.Enterprise, function () {

        var self = {
            captain: function () {
                return "James T. Kirk";
            },
            previousCaptain: function () {
                return self.superclass.captain();
            }
        };

        return self;
    });
})(jQuery);