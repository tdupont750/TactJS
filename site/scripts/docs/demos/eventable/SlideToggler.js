// Docs.Eventable.SlideToggler :: Slides the element a specified number of pixels left or right and then toggles the first children.
(function ($) {
    if (!Docs.Demos.Eventable.Toggler) {
        throw 'Initialization Error: Docs.Demos.Eventable.slideToggler requires Docs.Demos.Eventable.Toggler';
    }
    if (!Docs.Demos.Eventable.Slider) {
        throw 'Initialization Error: Docs.Demos.Eventable.slideToggler requires Docs.Demos.Eventable.Slider';
    }
    $.types.ns('Docs.Demos.Eventable');
    Docs.Demos.Eventable.SlideToggler = $.types.define(function () {
        var _context;
        var _lastSlideRight;

        var toggleElement = function () {
            $(_context).msg('toggle');
        };
        var setEvents = function () {
            $(_context).eventUnsubscribe('onSlideRight', toggleElement);
            $(_context).eventUnsubscribe('onSlideLeft', toggleElement);
            $(_context).eventSubscribe('onSlideRight', toggleElement);
            $(_context).eventSubscribe('onSlideLeft', toggleElement);
        };

        var self = {
            init: function (context) {
                _context = context;
                _lastSlideRight = false;
            },
            slideToggle: function () {
                setEvents();
                if (_lastSlideRight) {
                    $(_context).msg('slideLeft');
                    _lastSlideRight = false;
                } else {
                    $(_context).msg('slideRight');
                    _lastSlideRight = true;
                }
            }
        };
        return self;
    });
})(jQuery);