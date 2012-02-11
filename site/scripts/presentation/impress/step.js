// Presentation.Impress.Step :: A step in an impress presentation
(function ($) {
    $.types.ns('Presentation.Impress');
    Presentation.Impress.Step = $.types.define(function () {
        var _context;
        var _config;
        var _canvas;
        var _stepNumber;
        var _transform;
        var _helpers = new Tact.Dependency('IImpressHelper');
        var _step;

        var _getStepData = function () {
            _step = {
                translate: {
                    x: _config.x || 0,
                    y: _config.y || 0,
                    z: _config.z || 0
                },
                rotate: {
                    x: _config.rotateX || 0,
                    y: _config.rotateY || 0,
                    z: _config.rotateZ || _config.rotate || 0
                },
                scale: {
                    x: _config.scaleX || _config.scale || 1,
                    y: _config.scaleY || _config.scale || 1,
                    z: _config.scaleZ || 1
                }
            };
        };

        var _showStep = function () {
            window.scrollTo(0, 0);
            // `#/step-id` is used instead of `#step-id` to prevent default browser
            // scrolling to element in hash
            window.location.hash = "#/" + (_context.id ? _context.id : "step-" + _stepID);
            $(_canvas).msg("setCurrentStep", _context, _step).msg("doTransition");
            $(_context).addClass("active");
        };
        var _hideStep = function () {
            $(_context).removeClass("active");
        };

        var self = {
            init: function (context) {
                _context = context;
                _config = $(_context).data();
                _helpers = _helpers.resolve();
                _getStepData();
                _stepNumber = _config.stepNumber;
                _transform = {
                    position: "absolute",
                    transform: "translate(-50%,-50%)" + _helpers.translate(_step.translate) + _helpers.rotate(_step.rotate) + _helpers.scale(_step.scale),
                    transformStyle: "preserve-3d"
                };
                _helpers.css($(_context)[0], _transform);
                if (!_context.id) {
                    _context.id = "step-" + _config.stepNumber;
                }
            },
            sendStepDataTo: function (target, cmd) {
                $(target).msg(cmd, _step);
            },
            showStepNumber: function (num) {
                if (_stepNumber == num) {
                    _showStep();
                } else {
                    _hideStep();
                }
            },
            showStepID: function (id) {
                if (_context.id == id) {
                    _showStep();
                } else {
                    _hideStep();
                }
            },
            showThisStep: function () {
                _showStep();
            },
            hideThisStep: function () {
                _hideStep();
            },
            setCanvas: function (elem) {
                _canvas = elem;
            }
        };
        return self;
    });
})(jQuery);