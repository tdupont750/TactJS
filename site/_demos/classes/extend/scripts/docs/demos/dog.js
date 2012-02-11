// a Dog object which extends Docs.Demos.Pet
(function ($) {
    // Define a namespace
    $.types.ns("Docs.Demos");
    // Define the Dog class.
    Docs.Demos.Dog = $.types.extend(Docs.Demos.Pet, function (name) {
        // Private Members
        var _speak = "Woof!";

        // Public Members
        var self = {
            speak: function () {
                return self.superclass.name() + " says " + _speak;
            }
        };
        return self;
    });
})(jQuery);