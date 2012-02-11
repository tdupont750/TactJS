(function ($) {
    if (!$ || !$.types) {
        throw 'Initialization Error: Behaviors requires Core.';
    }
    if (!$.fn.events) {
        throw 'Initialization Error: Behaviors requires Events';
    }
    if (!$.livequery) {
        throw 'Initialization Error: Behaviors requires jQuery.LiveQuery.';
    }

    /**
    * TactJS Behaviors - Adds declarative behavior to jQuery
    */


    /**
    * @description Constants
    * @member {string} lazyBhvr - name of the attribute indicating a lazy-loaded behavior
    * @member {string} eagerBhvr - name of the attribute indicating a behavior loaded on page load
    * @member {string} bhvrQueue - name of the queue attribute added to an element when it is instantiated.
    */
    var lazyBhvr = 'data-behaviors-lazy';
    var eagerBhvr = 'data-behaviors-eager';
    var bhvrQueue = 'BehaviorQueue';

    $.behaviors = {
        /**
        * @description Returns a collection manager that provides an interface to access behavior functionality.
        * @param {HTMLElement} elem
        */
        parse: function (elem) {
            var typeDef = $.behaviors.getTypes(elem);
            var isEager = $.behaviors.isEager(elem);

            if ($(elem).attr(eagerBhvr)) {
                isEager = true;
            }

            if (typeDef) {
                var types = typeDef.split(' ');

                for (var i = 0; i < types.length; i++) {
                    var type = types[i];
                    var wrapper = new BehaviorWrapper(type, elem);
                    var newCollection = new Tact.BehaviorCollection(elem);
                    if (!elem.behaviors)
                        elem.behaviors = newCollection;
                    if (!elem[bhvrQueue]) {
                        elem[bhvrQueue] = new Tact.Queue();
                    }
                    elem.behaviors.addBehavior(type, wrapper);

                    if (isEager)
                        elem.behaviors.touchBehavior(type);
                }
            }
        },
        /**
        * @description ensures behaviors and returns the behavior instances in the elements behavior collection.
        * @param {HTMLElement} elem
        * @returns {array}
        */
        allFrom: function (elem) {
            $.behaviors.ensure(elem);
            try {
                return elem.behaviors.allFrom()
            } catch (ex) { return []; }
        },
        /**
        * @description parses all behaviors on an element.
        * @param {HTMLElement} elem
        */
        ensure: function (elem) {
            if (!elem.behaviors && ($(elem).attr(lazyBhvr) || $(elem).attr(eagerBhvr))) {
                $.behaviors.parse(elem);
            }
        },
        /**
        * @description gets types of behaviors delared on an element in either the eager or lazy attribute
        * @param {HTMLElement} elem
        */
        getTypes: function (elem) {
            var typeDef;
            if ($(elem).attr(lazyBhvr)) {
                typeDef = $(elem).attr(lazyBhvr);
            } else if ($(elem).attr(eagerBhvr)) {
                typeDef = $(elem).attr(eagerBhvr);
            }
            return typeDef;
        },
        /**
        * @description returns a boolean indicating if the behavior is eager or not.
        * @param {HTMLElement} elem
        */
        isEager: function (elem) {
            var isEager = false;
            if ($(elem).attr(eagerBhvr))
                isEager = true;
            return isEager;
        },
        /**
        * @description invokes the named function on a behavior instance with parameters.
        * @param {HTMLElement} el
        * @param {string} cmd
        */
        msg: function (el, cmd) {
            if (cmd) {
                msgArgs = cmd.slice(1);
                cmd = cmd[0];
                el.each(function () {
                    var elem = this;
                    var all = $.behaviors.allFrom(elem);
                    for (behavior in all) {
                        try {
                            all[behavior].getInstance(function (instance) {
                                if (cmd in instance && $.isFunction(instance[cmd])) {
                                    instance[cmd].apply(elem, msgArgs);
                                }
                            });
                        } catch (ex) { /*do nothing*/ }
                    }
                });
            }
        },
        /**
        * @description Calls msg on all child elements with behaviors.
        * @param {HTMLElement} el
        * @param {string} cmd
        */
        broadcast: function (el, cmd) {
            el.each(function () {
                $('*[' + lazyBhvr + '],*[' + eagerBhvr + ']', this).andSelf().each(function () {
                    $.behaviors.msg($(this), cmd);
                });
            });
        }
    };

    /**
    * @private
    * @class
    * @description Wraps and initializes behaviors
    * @constructor
    * @param {string} typeName
    * @param {object} container
    */
    var BehaviorWrapper = function (typeName, container) {
        var _typeName = typeName;
        var _container = container;
        var _instance = null;
        var _awake = false;
        /**
        * @description invokes bootloader to find a script if necessary and initializes the behavior then calls onInstantiate.
        * @param {function} onInstantiate
        */
        var wakeUp = function (onInstantiate) {
            $.bootloader.requireByType(_typeName, function () {
                _instance = eval('new ' + _typeName + '()');
                _awake = true;
                if ('init' in _instance && $.isFunction(_instance['init'])) {
                    _instance.init(_container); //, $(_container).domdata("data-", false));
                }                
                if ($.isFunction(onInstantiate)) {
                    onInstantiate(_instance);
                }
            });
        };

        var self = {
            /**
            * @description calls wakeUp if this behavior hasn't been initialized. Provides a window for onInstantiate method.
            * @param {function} onInstantiate
            */
            getInstance: function (onInstantiate) {
                if (!_awake) {
                    wakeUp(onInstantiate);
                } else {
                    onInstantiate(_instance);
                }
            },
            /**
            * @description calls wakeUp() if this behavior hasn't been initialized. Does not provide a window for onInstantiate method.
            */
            touch: function () {
                if (!_awake) {
                    wakeUp();
                }
            }
        };

        return self;
    };

    $.types.ns('Tact');

    /**
    * @class
    * @description Collection class for behaviors that provides an interface to access behavior functionality.
    * @constructor
    * @param {object} container
    */
    Tact.BehaviorCollection = $.types.define(function (container) {
        var _behaviors = new Array();
        var _container = container;

        var self = {
            /**
            * @description
            * @param {string} type
            * @param {object} instance
            */
            addBehavior: function (type, instance) {
                _behaviors[type] = instance;
            },
            /**
            * @description
            * @param {string} type
            */
            touchBehavior: function (type) {
                _behaviors[type].touch();
            },
            /**
            * @description
            * @returns {array}
            */
            allFrom: function () {
                return _behaviors;
            }
        };

        return self;
    });

    /**
    * @class
    * @description Provides an explicit interface for interacting with behaviors.
    * @constructor
    * @param {jQuery} els
    */
    Tact.BehaviorManager = $.types.define(function (els) {
        var _els = els;

        var self = {
            /**
            * @description Invokes specified method on behaviors attached to elements in the collection.
            * @param {string} cmd
            * @returns {Tact.BehaviorManager}
            */
            msg: function (cmd) {
                _els.msg(cmd);
                return self;
            },
            /**
            * @description Invokes specified method on behaviors attached to elements, or their children, in the collection.
            * @param {string} cmd
            * @returns {Tact.BehaviorManager}
            */
            broadcast: function (cmd) {
                _els.broadcast(cmd);
                return self;
            },
            /**
            * @description Queues a call to the specified method on behaviors attached to elements, in the collection.
            * @param {string} cmd
            * @returns {Tact.BehaviorManager}
            */
            enqueueMsg: function (cmd) {
                _els.enqueueMsg(cmd);
                return self;
            },
            /**
            * @description Queues a call to the specified method on behaviors attached to elements, or their children, in the collection.
            * @param {string} cmd
            * @returns {Tact.BehaviorManager}
            */
            enqueueBroadcast: function (cmd) {
                _els.enqueueBroadcast(cmd);
                return self;
            },
            /**
            * @description Pops and invokes the next queue msg or broadcast for behaviors associated with the given element.
            * @returns {Tact.BehaviorManager}
            */
            unqueue: function () {
                _els.unqueue();
                return self;
            },
            /**
            * @description Gets the length of the queue.
            * @returns {number}
            */
            queueLength: function (cmd) {
                return _els.queueLength(cmd);
            }
        };

        return self;
    });

    /**
    * @description
    * @returns {Tact.BehaviorManager}
    */
    $.fn.behaviors = function () {
        return new Tact.BehaviorManager(this);
    };
    /**
    * @description Invokes specified method on behaviors attached to elements in the collection.
    * @param {string} cmd
    * @returns {jQuery}
    */
    $.fn.msg = function (cmd) {
        args = Array.prototype.slice.call(arguments);
        $.behaviors.msg(this, args);
        return this;
    };
    /**
    * @description Invokes specified method on behaviors attached to elements, or their children, in the collection.
    * @param {string} cmd
    * @returns {jQuery}
    */
    $.fn.broadcast = function (cmd) {
        args = Array.prototype.slice.call(arguments);
        $.behaviors.broadcast(this, args);
        return this;
    };
    /**
    * @description Queues a call to the specified method on behaviors attached to elements, in the collection.
    * @param {string} cmd
    * @returns {jQuery}
    */
    $.fn.enqueueMsg = function (cmd) {
        var els = $(this);
        this.queuePush(bhvrQueue, function () { els.msg(cmd) });
        return this;
    };
    /**
    * @description Queues a call to the specified method on behaviors attached to elements, or their children, in the collection.
    * @param {string} cmd
    * @returns {jQuery}
    */
    $.fn.enqueueBroadcast = function (cmd) {
        var els = $(this);
        this.queuePush(bhvrQueue, function () { els.broadcast(cmd) });
        return this;
    };
    /**
    * @description Pops and invokes the next queue msg or broadcast for behaviors associated with the given element.
    * @returns {jQuery}
    */
    $.fn.unqueue = function (args) {
        this.queuePop(bhvrQueue, args);
        return this;
    };
    /**
    * @description Gets the length of the queue.
    * @returns {number}
    */
    $.fn.behaviorQueueLength = function () {
        return this.queueMaxCount(bhvrQueue);
    };

    // Initialize
    (function () {
        $.livequery.registerPlugin('html');
        $('*[' + eagerBhvr + ']').livequery(function () {
            $.behaviors.parse(this);
        });
    })();

})(jQuery);