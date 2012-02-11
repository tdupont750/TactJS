(function ($) {
    $.types.ns('Docs');
    Docs.ContentLoader = $.types.define(function () {
        var _context;
        var _config;
        var _contentEmpty = function (string) {
            return string.split(' ').join('').length <= 1;
        }
        var _loadContent = function (onLoaded) {
            if (_contentEmpty($(_context).html())) {
                $.ajax({
                    url: _config.content,
                    type: 'GET',
                    success: function (response) {
                        $(_context).html(response);
                        //$.livequery.play();
                        if (typeof onLoaded === 'function')
                            onLoaded();
                    },
                    failure: function (response) {
                        $(_context).html(response);
                        if (typeof onLoaded === 'function')
                            onLoaded();
                    }
                });
            } else if (typeof onLoaded === 'function') {
                onLoaded();
            }
        };

        var self = {
            init: function (context, config) {
                _context = context;
                _config = $(_context).data();
                if (_config.load) {
                    self.load();
                }
            },
            load: function (onLoaded) {
                _loadContent(onLoaded);
            }
        };
        return self;
    });
})(jQuery);