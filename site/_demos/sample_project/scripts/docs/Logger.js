// Docs.Logger :: Hooks onto unit tests and writes their results to the element.

(function ($) {
    $.types.ns('Docs');
    Docs.Logger = $.types.define(function () {
        var _context;
        var _data;
        var _log;
        var onLogWrite = function (msg) {
            _log = _log + msg + '\n';
            return false;
        };
        var self = {
            init: function (context, config) {
                _context = context;
                _data = config;
                _log = '';
            },
            runTests: function () {
                _log = '';
                $.log.onWrite.subscribe(onLogWrite);
                $.testing.runAll();
                $.log.onWrite.unsubscribe(onLogWrite);
                $(_context).val(_log);
            }
        };
        return self;
    });
})(jQuery);