// Presentation.Impress.Transform :: Provides a uniform way to express css3 transforms/transitions on an element.
(function ($) {
    $.types.ns('Presentation.Impress');
    Presentation.Impress.Transform = $.types.define(function () {
        var _context;
        var _config;
        var _helpers = new Tact.Dependency('IImpressHelper');
        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                _helpers = _helpers.resolve();
            }
        };
        return self;
    });
})(jQuery);