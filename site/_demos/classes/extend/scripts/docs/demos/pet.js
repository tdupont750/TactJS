// A simple Pet object
(function ($) {
    // Define a namespace
    $.types.ns("Docs.Demos");
    // Define the Pet class.
    Docs.Demos.Pet = $.types.define(function (name) {
        // Private Members
        var _name = name
        var _walkCount = 0;

        // Public Members
        var self = {
            walk: function () {
                _walkCount++;
                return _name
                    + " has been walked "
                    + _walkCount
                    + " time(s) today.";
            },
            name: function () {
                return _name;
            }
        };
        return self;
    });
})(jQuery);