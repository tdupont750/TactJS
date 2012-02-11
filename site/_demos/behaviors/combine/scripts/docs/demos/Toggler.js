// Docs.Toggler :: Toggles visibility of first child elements
(function ($) {
    $.types.ns('Docs.Demos');
    Docs.Demos.Toggler = $.types.define(function () {
        var _context;
        var _config;
        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                if (_config.behaviorsEager)
                    self.toggle();
            },
            toggle: function () {
                $(_context).children().toggleClass("toggle-off toggle-on");
            }
        };
        return self;
    });
})(jQuery);