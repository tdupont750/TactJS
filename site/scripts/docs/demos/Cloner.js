// TestSpace.Cloner :: Clones a given element and updates it's ID (and any instances of the ID in the block) to be unique.

(function ($) {
    $.fn.outerHtml = function () { return $("<div>").append($(this).clone()).html(); }
    $.types.ns('Docs.Demos');
    Docs.Demos.Cloner = $.types.define(function () {
        var _context;
        var self = {
            init: function (context, config) {
                _context = context;
            },
            clone: function (targetId) {                
                var newCloneID = (targetId + ((new Date()).getTime().toString()));                
                if ($('#' + newCloneID).length > 0) {
                    setTimeout(function(){newCloneID = (targetId + ((new Date()).getTime().toString()));}, 10);
                }
                var reg = new RegExp(targetId, "g");
                var clone = $("#" + targetId).clone();
                $(_context).append($(clone).outerHtml().replace(reg, newCloneID));
            }
        };
        return self;
    });
})(jQuery);

