// Docs.Eventable.Toggler :: Toggles visibility of first child elements. Fires an event on toggle
(function ($) {
    $.types.ns('Docs.Demos.Eventable');
    Docs.Demos.Eventable.Toggler = $.types.define(function () {
        var _context;
        var self = {
            init: function (context) {
                _context = context;                
                if ($(_context).domdata().behaviorsEager)
                    self.toggle();
            },
            toggle: function () {
                $(_context).children().toggleClass("toggle-off toggle-on");
                $(_context).events("onToggle").fire();
            }
        };
        return self;
    });
})(jQuery);