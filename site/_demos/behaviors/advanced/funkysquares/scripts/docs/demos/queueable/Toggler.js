// Docs.Queueable.Toggler :: Toggles visibility of first child elements. Fires an event on toggle, and unqueues.
(function ($) {
    $.types.ns('Docs.Demos.Queueable');
    Docs.Demos.Queueable.Toggler = $.types.define(function () {
        var _context;
        var _config;
        var _toggleClass;
        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).domdata();
                _toggleClass = (_config.toggleClass ? _config.toggleClass : "toggle-off toggle-on");
                if (_config.behaviorsEager)
                    self.toggle();
            },
            toggle: function () {
                $(_context).children().toggleClass(_toggleClass);
                $(_context).eventFire("onToggle").unqueue();
            }
        };
        return self;
    });
})(jQuery);