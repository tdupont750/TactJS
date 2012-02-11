
(function ($) {
    $.types.ns('Docs');
    Docs.SectionSelector = $.types.define(function () {
        var _el;
        var _config;
        var _links;
        var onClick = function (e) {
            var id = $(e.target).data('section');
            if (!id)
                id = $(e.target).parent().data('section');
            $(".section").hide();
            if (_config.loadContent) {
                $('#' + id).msg("load", function () { $('#' + id).show(); });
            } else {
                $('#' + id).show();
            }
            window.location.hash = "/" + id;
        };
        var _getIdFromUrl = function () {
            // get id from url # by removing `#` or `#/` from the beginning
            return window.location.hash.replace(/^#\/?/, "");
        }
        var self = {
            init: function (el) {
                _el = el;
                _config = $(_el).data();
                _links = $(_el).find('li').children('span');
                _links.unbind();
                _links.click(onClick);
                self.selectSection(_getIdFromUrl());
            },
            selectSection: function (id) {
                var sectionID = id;
                var sectionFound = false;
                _links.each(function () {
                    if ($(this).parent('li').data("section") == sectionID) {
                        $(this).click();
                        sectionFound = true;
                    }
                });
                if (sectionFound) {
                    $(_el).parent().prev("h3").children("a").click();
                }
            }
        };

        return self;
    });
})(jQuery);