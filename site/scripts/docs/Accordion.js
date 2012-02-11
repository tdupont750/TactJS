// Docs.tabs :: Jquery UI Accordion

(function ($) {
    $.types.ns('Docs');
    Docs.Accordion = $.types.define(function () {
        var _context;
        var _data;
        var initializeAccordion = function () {
            $(_context).accordion({
                autoHeight: _data.autoHeight,
                navigation: _data.navigation,
                collapsible: _data.collapsible
            });
        }
        var self = {
            init: function (context) {
                if (context != undefined) {
                    _context = context;
                    _data = $(_context).data();
                    initializeAccordion();
                }
            }
        };
        return self;
    });
})(jQuery);