// Presentation.Impress.Canvas :: Toggles visibility of first child elements
(function ($) {
    $.types.ns('Presentation.Impress');
    Presentation.Impress.Canvas = $.types.define(function () {
        var _context;
        var _canvas;
        var _config;
        var _helpers = new Tact.Dependency('IImpressHelper');
        var _supported = false;
        var _last;
        var _current = {
            translate: { x: 0, y: 0, z: 0 },
            rotate: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        };
        var _stepTargetData;
        var _currentStep;
        var _startingStep = 0;
        var _highestStep = 0;
        var _lowestStep = 0;

        var _checkSupport = function () {
            var ua = navigator.userAgent.toLowerCase();
            _supported = (_helpers.pfx("perspective") != null) && (ua.search(/(iphone)|(ipod)|(ipad)|(android)/) == -1);
        };

        var _initialize = function () {
            window.addEventListener("hashchange", function () {
                $(_canvas).broadcast("showStepID", getElementFromUrl());
            }, false);
            document.addEventListener("keydown", function (event) {
                if (event.keyCode == 9 || (event.keyCode >= 32 && event.keyCode <= 34) || (event.keyCode >= 37 && event.keyCode <= 40)) {
                    var next = $(_currentStep).data().stepNumber;
                    switch (event.keyCode) {
                        case 33: ; // pg up
                        case 37: ; // left
                        case 38:   // up
                            next = next - 1;
                            next = next >= _lowestStep ? $(_context).broadcast("showStepNumber", next) : $(_context).broadcast("showStepNumber", _highestStep);
                            break;
                        case 9: ; // tab
                        case 32: ; // space
                        case 34: ; // pg down
                        case 39: ; // right
                        case 40:   // down
                            next = next + 1;
                            next = next <= _highestStep ? $(_context).broadcast("showStepNumber", next) : $(_context).broadcast("showStepNumber", _lowestStep);
                            break;
                    }
                    event.preventDefault();
                }
            }, false);

            _helpers.css(document.body, {
                height: "100%",
                overflow: "hidden"
            });

            var props = {
                position: "absolute",
                transformOrigin: "top left",
                transition: "all 1s ease-in-out",
                transformStyle: "preserve-3d"
            }

            _helpers.css($(_context)[0], props);
            _helpers.css($(_context)[0], {
                top: "50%",
                left: "50%",
                perspective: "1000px"
            });
            _helpers.css($(_canvas)[0], props);

            //find last step number
            $("*[data-step-number]", _canvas).each(function () {
                var stepNumber = $(this).data().stepNumber;
                if (_lowestStep >= stepNumber) {
                    _lowestStep = stepNumber;
                }
                if (_highestStep <= stepNumber) {
                    _highestStep = stepNumber;
                }
            });

            // START
            $(_canvas).broadcast("setCanvas", _context);
            setTimeout(function () {
                getElementFromUrl() ? $(_canvas).broadcast("showStepID", getElementFromUrl()) : $(_canvas).broadcast("showStepNumber", _startingStep);
            }, 100);

        };
        var getElementFromUrl = function () {
            // get id from url # by removing `#` or `#/` from the beginning
            return window.location.hash.replace(/^#\/?/, "");
        }

        var _getTargetData = function (step) {
            return {
                rotate: {
                    x: -parseInt(step.rotate.x, 10),
                    y: -parseInt(step.rotate.y, 10),
                    z: -parseInt(step.rotate.z, 10)
                },
                scale: {
                    x: 1 / parseFloat(step.scale.x),
                    y: 1 / parseFloat(step.scale.y),
                    z: 1 / parseFloat(step.scale.z)
                },
                translate: {
                    x: -step.translate.x,
                    y: -step.translate.y,
                    z: -step.translate.z
                }
            };
        };

        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                _canvas = $('.' + _config.canvasClass, _context);
                _helpers = _helpers.resolve();
                _checkSupport();
                _startingStep = _config.startStep;
                if (_supported) {
                    setTimeout(function () { _initialize(); }, 500);
                } else {
                    $(_context).addClass(_config.notSupportedClass);
                }
            },
            doTransition: function () {
                var zoomin = _stepTargetData.scale.x < _last.scale.x;
                var _perspective = {
                    perspective: _current.scale.x * 1000 + "px",
                    transform: _helpers.scale(_stepTargetData.scale),
                    transitionDelay: (zoomin ? "500ms" : "0ms")
                };
                var _transform = {
                    transform: _helpers.rotate(_stepTargetData.rotate, true) + _helpers.translate(_stepTargetData.translate),
                    transitionDelay: (zoomin ? "500ms" : "0ms")
                };
                _helpers.css($(_context)[0], _perspective);
                _helpers.css($(_canvas)[0], _transform);
            },
            setCurrentStep: function (elem, step) {
                _last = _current;
                _currentStep = elem;
                _current = step;
                _stepTargetData = _getTargetData(step);
                $(_context).attr("class", "step-" + _currentStep.id);
            }
        };
        return self;
    });

    Presentation.Impress.Helpers = $.types.define(function () {

        var _style = document.createElement('dummy').style,
            _prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            _memory = {};

        var self = {
            pfx: function (prop) {
                if (typeof _memory[prop] === "undefined") {
                    var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props = (prop + ' ' + _prefixes.join(ucProp + ' ') + ucProp).split(' ');

                    _memory[prop] = null;
                    for (var i in props) {
                        if (_style[props[i]] !== undefined) {
                            _memory[prop] = props[i];
                            break;
                        }
                    }
                }
                return _memory[prop];
            },
            arrayify: function (a) {
                return [].slice.call(a);
            },
            translate: function (t) {
                return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
            },
            rotate: function (r, revert) {
                var rX = " rotateX(" + r.x + "deg) ",
                    rY = " rotateY(" + r.y + "deg) ",
                    rZ = " rotateZ(" + r.z + "deg) ";

                return revert ? rZ + rY + rX : rX + rY + rZ;
            },
            scale: function (s) {
                return " scaleX(" + s.x + ") scaleY(" + s.y + ") scaleZ(" + s.z + ") ";
            },
            css: function (el, props) {
                var key, pkey;
                for (key in props) {
                    if (props.hasOwnProperty(key)) {
                        pkey = self.pfx(key);
                        if (pkey != null) {
                            el.style[pkey] = props[key];
                        }
                    }
                }
                return el;
            }
        };
        return self;

    });
    $.ioc.register('IImpressHelper', Presentation.Impress.Helpers);

})(jQuery);