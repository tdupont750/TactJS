(function($) {
	if (!$ || !$.types) {
	    throw 'Initialization Error: Dependencies requires Core.';
	}
	if ($.ioc) {
		throw 'Initialization Error: Dependencies has already been defined.';
	}

	var _serviceMap = {};

	var instantiate = function (alias, stack, args) {
		if (stack[alias]) {
			return stack[alias];
		}

		var service = _serviceMap[alias];
		if (!service) {
			return null;
		}

		if (typeof service.singleton === 'object') {
			return service.singleton;
		}

		var instance = new service.type(args);
		stack[alias] = instance;

		for (var p in instance) {
			var o = instance[p];
			if (typeof o.is === 'function' && o.is(Tact.Dependency)) {
				instance[p] = o.resolve(stack);
			}
		}

		if (service.singleton === true) {
			service.singleton = instance;
		}

		stack[alias] = null;
		return instance;
	};

	/**
	 * TactJS Dependencies - Adds dependency injection to jQuery.
	 */
	$.ioc = {
		/**
		 * @description Registers a type with the container.
		 * @param {string} alias
		 * @param {function} type
		 * @param {boolean} singleton (Optional)
		 */
		register : function(alias, type, singleton) {
			_serviceMap[alias] = {
				type : type,
				singleton : singleton
			};
		},
		/**
		 * @description Resolve a type by alias
		 * @param {string} alias
		 * @return {Object} Instance of request type.
		 */
		resolve : function(alias, args) {
			return instantiate(alias, {}, args);
		}
	};

    $.types.ns('Tact');

	/**
	 * @class Represents A Dependency
	 * @constructor
	 * @param {string} alias
	 */
	Tact.Dependency = $.types.define(function(alias) {
			var _alias = alias;
			var _instance = null;

			var self = {
				/**
				 * @description Resolves dependency, automatically invoked during parent resolution.
				 */
				resolve : function(stack) {
					if (!_instance) {
						_instance = instantiate(_alias, stack || {});
					}
					return _instance;
				}
			};

			return self;
		});

})(jQuery);
