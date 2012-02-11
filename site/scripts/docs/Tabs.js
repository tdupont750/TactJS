// Docs.tabs :: Jquery UI Tabs

(function ($) {
    $.types.ns('Docs');
    Docs.Tabs = $.types.define(function () {
        var _context;
        var self = {
            init: function (context) {
                if (context != undefined) {
                    _context = context;
                    _config = $(_context).data();
                    if (_config.goToUrl) {
                        _config.select = function (event, ui) {
                            var url = $.data(ui.tab, 'load.tabs');
                            if (url) {
                                location.href = url;
                                return false;
                            }
                            return true;
                        };
                    }
                    $(_context).tabs(_config).show();
                }
            }
        };
        return self;
    });
})(jQuery);