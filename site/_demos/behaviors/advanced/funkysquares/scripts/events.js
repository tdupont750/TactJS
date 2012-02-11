(function ($) {
    if (!$ || !$.types) {
        throw 'Initialization Error: Events requires Core.';
    }
	if ($.fn.events) {
        throw 'Initialization Error: Events has already been defined.';
    }
	
    /**
     * @private
     * @class Generically reads/writes maps for object types on DOM elements.
     */
	var DomCollectionHelper = $.types.define(function() {
		var _collection = null;
	
		var updateElementMap = function(elem, name, key, type, create) {
			var collection = elem[key];
			if (!collection) {
				if (create !== true) {
					return null;
				}
				collection = {};
				elem[key] = collection;
			}
			var item = collection[name];
			if (!item) {
				if (create !== true) {
					return null;
				}
				item = new type();
				collection[name] = item;
			}
			return item;
		};
		
		var self = {
			load : function(els, name, key, type, create) {
				_collection = [];
				els.each(function() {
					var item = updateElementMap(this, name, key, type, create);
					if (item) {
						_collection.push(item);
					}
				});
			},
			getCollection : function() {
				return _collection;
			},
			invokeCollection : function(method, args) {
				for(var i=0; i<_collection.length; i++) {
					var item = _collection[i];
					item [method].apply(item , args);
				}
			}
		};
		
		return self;
	});

    $.types.ns('Tact');
	
    /**
     * @class
     * @description Handles Events
     * @constructor
     */
    Tact.Event = $.types.define(function () {
        var _delegates = [];

        var self = {
            /**
            * @description Add a callback delegate.
            * @param {function} delegate
            */
            subscribe: function (delegate) {
                var i = _delegates.indexOf(delegate);
                if (i < 0) {
                    _delegates.push(delegate);
                }
            },
            /**
            * @description Remove a callback delegate.
            * @param {function} delegate
            */
            unsubscribe: function (delegate) {
				var i = _delegates.indexOf(delegate);
                if (i < 0) {
                    try {
                        for (var x = 0; x < _delegates.length; x++) {
                            if (_delegates[x].toString() == delegate.toString()) {
                                i = x;
                            }
                        }
                    } catch (ex) { /* IE8 fails*/ }
                }
                if (i >= 0) {
                    _delegates.splice(i, 1);
                }

            },
            /**
            * @description Fire event, invoking all registered delegates.
            */
            fire: function () {
                for (var i = 0; i < _delegates.length; i++) {
                    if (_delegates[i].apply(this, arguments) === false) {
                        return false;
                    }
                }
                return true;
            },
            /**
			* @description Returns the count of subscription.
			* @returns {number}
			*/
            count: function () {
                return _delegates.length;
            }
        };

        return self;
    });
		
	/**
     * @class
     * @description Handles a collection of elements and manages events stored on their DOM elements.
     * @constructor
     * @param {jQuery} els
     * @param {string} name
     */
    Tact.EventCollection = $.types.define(function(els, name) {
		var _els = els;
		var _name = name;
		var _dch = new DomCollectionHelper();
		
		var getDch = function(create) {
			_dch.load(_els, _name, 'tactEvents', Tact.Event, create);
			return _dch;
		};
		
		var self = {
            /**
             * @description
             * @param {number} index
             * @returns {Tact.Event}
             */
			getByIndex: function(index) {
				var events = getDch().getCollection();
				return events.length > index ? events[index] : null;
			},
			/**
             * @description 
             * @param {function} delegate
             * @returns {Tact.EventCollection}
			 */
            subscribe: function(delegate) {
				getDch(true).invokeCollection('subscribe', [delegate]);
				return self;
			},
			/**
             * @description 
             * @param {function} delegate
             * @returns {Tact.EventCollection}
             */
            unsubscribe: function(delegate) {
				getDch().invokeCollection('unsubscribe', [delegate]);
				return self;
			},
			/**
             * @description 
             * @returns {Tact.EventCollection}
             */
            fire: function() {
				getDch().invokeCollection('fire', arguments);
				return self;
			},
			/**
             * @description 
             * @returns {number}
             */
            maxCount: function() {
				var events = getDch().getCollection();
				var maxCount = 0;
				for(var i=0; i<events.length; i++) {
					var c = events[i].count();
					if (c > maxCount) {
						maxCount = c;
					}
				}
				return maxCount;
			}
		};
		
		return self;
	});
	
	/**
	* @description Gets an event that is bound to an element.
	* @param {string} eventName
	* @returns {Tact.EventCollection}
	*/
	$.fn.events = function(eventName) {
		return new Tact.EventCollection(this, eventName);
	};
    /**
	* @description 
	* @param {string} eventName
	* @param {function} delegate
	* @returns {jQuery}
	*/
	$.fn.eventSubscribe = function (eventName, delegate) {
        var events = new Tact.EventCollection(this, eventName);
		events.subscribe(delegate);
        return this;
    };
    /**
	* @description 
	* @param {string} eventName
	* @param {function} delegate
	* @returns {jQuery}
	*/
	$.fn.eventUnsubscribe = function (eventName, delegate) {
        var events = new Tact.EventCollection(this, eventName);
		events.unsubscribe(delegate);
        return this;
    };
    /**
	* @description 
	* @param {string} eventName
	* @param {function} delegate
	* @returns {jQuery}
	*/
	$.fn.eventFire = function (eventName) {
        var events = new Tact.EventCollection(this, eventName);
		var args = Array.prototype.slice.call(arguments).slice(1);
		events.fire.apply(events, args);
        return this;
    };
    /**
	* @description 
	* @param {string} eventName
	* @returns {number}
	*/
	$.fn.eventMaxCount = function (eventName) {
        var events = new Tact.EventCollection(this, eventName);
		return events.maxCount();
    };
	
	/**
     * @class
     * @description Handles a queue.
	 * @constructor
     */
    Tact.Queue = $.types.define(function () {
        var _queueStack = [];
		
        var self = {
            /**
			* @description Pushes a function into the queue.
			* @param {function} delegate
			*/
			push: function (delegate) {
                _queueStack.push(delegate);
            },
			/**
			* @description Pops and invokes first function in the queue.
			* @param {function} delegate (Optional)
			* @param {mixed} args
			*/
            pop: function (args) {
                var delegate = _queueStack.shift();
                if ($.isFunction(delegate))
                    delegate(args);
            },
            /**
			* @description Returns the length of the queue.
			* @returns {number}
			*/
            count: function () {
                return _queueStack.length;
            }
        };
		
        return self;
    });
	
    /**
     * @class
     * @description Handles a collection of elements and manages queues stored on their DOM elements.
     * @constructor
     * @param {jQuery} els
     * @param {string} name
     */
	Tact.QueueCollection = $.types.define(function(els, name) {
		var _els = els;
		var _name = name;
		var _dch = new DomCollectionHelper();
		
		var getDch = function(create) {
			_dch.load(_els, _name, 'tactQueues', Tact.Queue, create);
			return _dch;
		};
		
		var self = {
			/**
             * @description
             * @param {number} index
             * @returns {Tact.Queue}
             */
            getByIndex: function(index) {
				var events = getDch().getCollection();
				return events.length > index ? events[index] : null;
			},
			/**
             * @description 
             * @param {function} delegate
             * @returns {Tact.QueueCollection}
             */
            push: function(delegate) {
				getDch(true).invokeCollection('push', [delegate]);
				return self;
			},
			/**
             * @description 
             * @param {array} args
             * @returns {Tact.QueueCollection}
             */
            pop: function(args) {
				getDch().invokeCollection('pop', [args]);
				return self;
			},
			/**
             * @description 
             * @returns {number}
             */
            maxCount: function() {
				var queues = getDch().getCollection();
				var maxCount = 0;
				for(var i=0; i<queues.length; i++) {
					var c = queues[i].count();
					if (c > maxCount) {
						maxCount = c;
					}
				}
				return maxCount;
			}
		};
		
		return self;
	});
	
	/**
	* @description Gets a a queue that is bound to an element.
	* @param {string} queueName
	* @returns {Tact.QueueCollection}
	*/
	$.fn.queues = function(queueName) {
		return new Tact.QueueCollection(this, queueName);
	};
	/**
	* @description 
	* @param {string} queueName
	* @param {function} delegate
	* @returns {jQuery}
	*/
	$.fn.queuePush = function (queueName, delegate) {
        var queues = new Tact.QueueCollection(this, queueName);
		queues.push(delegate);
        return this;
    };
	/**
	* @description 
	* @param {string} queueName
	* @param {function} delegate
	* @returns {jQuery}
	*/
	$.fn.queuePop = function (queueName, args) {
        var queues = new Tact.QueueCollection(this, queueName);
		queues.pop(args);
        return this;
    };
	/**
	* @description 
	* @param {string} queueName
	* @returns {number}
	*/
	$.fn.queueMaxCount = function (queueName) {
        var queues = new Tact.QueueCollection(this, queueName);
		return queues.maxCount();
    };

})(jQuery);