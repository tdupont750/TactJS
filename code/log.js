//jQuery plugins
(function ($) {
    if (!$ || !$.types) {
        throw 'Initialization Error: Log requires Core';
    }
	if (!Tact || !Tact.Event) {
        throw 'Initialization Error: Log requires Events';
    }
    if ($.log) {
        throw 'Initialization Error: Log has already been defined.';
    }

    /**
    * TactJS Log - Adds logging to jQuery
    */
    $.log = {
        /**
        * @description Log a message.
        * @param {string} msg
        */
        write: function (msg) {
            if ($.log.onWrite.fire(msg) === false) {
                return;
            }
            if (console && console.log) {
                console.log(msg);
            } else {
                alert(msg);
            }
        },
        /**
        * @property Event that fires when a log is written.
        * @type Tact.Event
        */
        onWrite: new Tact.Event()
    };

})(jQuery);