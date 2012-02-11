// Docs.LeftSlider :: Slides the element a specified number of pixels left.
(function ($) {
    $.types.ns('Docs.Demos');
    Docs.Demos.LeftSlider = $.types.define(function () {
        var _context;
        var _data;
        var _slideDistance;
        var _slideTime;
        var self = {
            init: function (context) {
                _context = context;
                _data = $(_context).domdata(false, 'leftslider');
                _slideDistance = (_data.slideDistance ? _data.slideDistance : 100);
                _slideTime = (_data.slideTime ? _data.slideTime : 1000);
            },
            slideLeft: function () {
                $(_context).animate({ marginLeft: '-=' + _slideDistance + 'px' }, _slideTime);
            }
        };
        return self;
    });
})(jQuery);