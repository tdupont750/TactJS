// Docs.Lib.Cat :: A Cat class that requires Docs.Lib.Pet. Demonstrates dependencies.

(function ($) {
    $.types.ns('Docs.Demos.Lib');
    Docs.Demos.Lib.Cat = $.types.extend(Docs.Demos.Lib.Pet, function (name) {
        var _speak = "Meow";
        var self = {
            box: new Tact.Dependency('IBox'),
            speak: function () {
                return name + " says: " + _speak;
            },
            doBusiness: function (a) {
                self.box.poop();
            }
        };
        return self;
    });
    $.ioc.register('ICat', Docs.Demos.Lib.Cat);

    // declaration in a separate file is forgone since this is only used with Cat.
    Docs.Demos.Lib.LitterBox = $.types.define(function () {
        var _isStinky = false;
        var self = {
            poop: function () {
                _isStinky = true;
            },
            clean: function () {
                _isStinky = false;
            },
            isStinky: function () {
                return _isStinky;
            }
        };
        return self;
    });    
    $.ioc.register('IBox', Docs.Demos.Lib.LitterBox);
})(jQuery);

