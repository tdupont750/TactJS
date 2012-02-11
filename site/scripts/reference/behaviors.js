// http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
// http://docs.jquery.com/Plugins/livequery
// http://www.terrainformatica.com/2010/11/behaviors-simple-jquery-extension/

(function($) {
	if (!$ || !$.joo) {
		throw 'Initialization Error: Behaviors require Core.';
	}
	if (!$.livequery) {
		throw 'Initialization Error: Behaviors require LiveQuery.';
	}
	if ($.behaviors) {
		throw 'Initialization Error: Behaviors has already been defined.';
	}

    
	var _behaviorMap = {};

	var applyBehaviors = function() {
		var names = this.getAttribute('behavior').split(',');

		for (var i = 0; i < names.length; i++) {
			applyBehavior(this, names[i].trim());
		}
	};

	var getConfig = function(el, name) {
		var jEl = $(el);
		var config = jEl.attr('config-' + name) || jEl.attr('config');
		if (config && config.charAt(0) == '{' && config.charAt(config.length - 1) == '}') {
			config = eval('(' + config + ')');
		}
		return config;
	};

	var getByName = function(name) {
		for (var n in _behaviorMap) {
			if (n == name) {
				return _behaviorMap[n];
			}
		}
	};

	var applyBehavior = function(el, name) {
		if (el.behaviors && el.behaviors[name]) {
			return; // Behavior already loaded.
		}

		var behavior = getByName(name);
		if (!behavior) {
			return; // Behavior not found.
		}

		var config = getConfig(el, name);
		var instance = new behavior();
		instance.init(el, config);

		if (!el.behaviors) {
			el.behaviors = {};
		}
		el.behaviors[name] = instance;
	};

	/**
	 * TactJS Behaviors - Adds declarative behaviors for UI elements to jQuery.
	 */
	$.behaviors = {
		/**
		 * @description Register a Behavior.
		 * @param {string} name
		 * @param {function} behavior
		 */
		register : function(name, behavior) {
			_behaviorMap[name] = behavior;
		},
		/**
		 * @description Register a global selector to apply Behaviors.
		 * @param {string} selector
		 * @param {array} names
		 */
		selector : function(selector, names) {
			if (typeof names == 'string') {
				names = [names];
			}
			$(selector).livequery(function() {
					for (var i = 0; i < names.length; i++) {
						applyBehavior(this, names[i]);
					}
				});
		},
		/**
		 * @description Applies behaviors to a DOM element.
		 * @param {HtmlElement} el
		 */
		applyBehaviors : function(el) {
			applyBehaviors.call(el);
        }
	};

	$('[behavior]').each(applyBehaviors).livequery(applyBehaviors);

})(jQuery);