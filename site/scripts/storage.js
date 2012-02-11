(function($) {
	if (!$ || !$.types) {
		throw 'Initialization Error: Storage requires Core.';
	}
	if (!JSON) {
        throw 'Initialization Error: Storage requires JSON2 plugin.';
    }
    if ($.storage) {
		throw 'Initialization Error: Storage has already been defined.';
	}
    
    /**
     * @class Wraps a storage mechanism
     * @constructor
     * @param {object} store
     */
    Tact.Storage = $.types.define(function(store) {
        var _store = store;
        
        var self = {
            /**
             * @description Gets an item by key.
             * @param {string} key
             * @return {string}
             */
	        getItem : function(key) {
	            return _store.getItem(key);
	        },
	        /**
             * @description Gets an object by key.
             * @param {string} key
             * @return {object}
             */
            getObject : function(key) {
	            var value = _store.getItem(key);
	            return value ? JSON.parse(value) : null;
	        },
            /**
             * @description Sets an item by key.
             * @param {string} key
             * @param {string} value
             */
	        setItem : function(key, value) {
	            _store.setItem(key, value);
	        },
	        /**
             * @description Sets an object by key.
             * @param {string} key
             * @param {object} object
             */
            setObject : function(key, object) {
	            var value = JSON.stringify(object);
	            _store.setItem(key, value);
	        },
            /**
             * @description Removes an item from storage.
             * @param {string} key
             * @param {boolean} doGet (Optional)
             * @return {string}
             */
	        removeItem : function(key, doGet) {
	            var value = doGet ? _store.getItem(key) : null;
	            _store.removeItem(key);
	            return value;
	        },
	        /**
             * @description Removes an object from storage.
             * @param {string} key
             * @param {boolean} doGet (Optional)
             * @return {object}
             */
            removeObject : function(key, doGet) {
	            var object = doGet ? self.getObject(key) : null;
	            _store.removeItem(key);
	            return object;
	        },
            /**
             * @description Clears the storage.
             */
	        clear : function() {
	            _store.clear();
	        }
	    };
        
        return self;
    });
    
	var localStorage = new Tact.Storage(window.localStorage);
	
	/**
	 * TactJS Storage - Simplifies using client side storage with jQuery
	 */
	$.storage = {
		/**
         * @property Defeault storage mechanism.
         * @type Tact.Storage
         */
        default : localStorage,
        /**
         * @property Local storage mechanism.
         * @type Tact.Storage
         */
        local : localStorage,
        /**
         * @property Session storage mechanism.
         * @type Tact.Storage
         */
        session : new Tact.Storage(window.sessionStorage)
    };

})(jQuery);