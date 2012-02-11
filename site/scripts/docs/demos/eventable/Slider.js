// Docs.Eventable.Slider :: Slides the element a specified number of pixels left or right. Fires events for it's actions.
(function ($) {
    $.types.ns('Docs.Demos.Eventable');
    Docs.Demos.Eventable.Slider = $.types.define(function () {
        var _context;
        var _data;
        var _slideDistance;
        var _slideTime;
        var self = {
            init: function (context) {
                _context = context;
                _data = $(_context).domdata();
                _slideDistance = (_data.slideDistance ? _data.slideDistance : 100);
                _slideTime = (_data.slideTime ? _data.slideTime : 1000);                
            },
            slideRight: function () {
                $(_context).animate({ marginLeft: '+=' + _slideDistance + 'px' }, _slideTime, function () { $(_context).events("onSlideRight").fire(); });
            },
            slideLeft: function () {
                $(_context).animate({ marginLeft: '-=' + _slideDistance + 'px' }, _slideTime, function () { $(_context).events("onSlideLeft").fire(); });                
            }
        };
        return self;
    });
})(jQuery);