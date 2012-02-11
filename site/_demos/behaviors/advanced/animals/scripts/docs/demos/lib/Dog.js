// Docs.Lib.Dog :: A Dog class that requires Docs.Lib.Dog. Demonstrates class extensions.

(function ($) {
    $.types.ns('Docs.Demos.Lib');
    Docs.Demos.Lib.Dog = $.types.extend(Docs.Demos.Lib.Pet, function (name) {
        var _speak = "Woof";
        var self = {
            speak: function () {
                return name + " says: " + _speak;
            }
        };
        return self;
    });
})(jQuery);