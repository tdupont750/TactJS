$.types.ns('Tact.Behaviors');

Tact.Behaviors.Tester = $.types.define(function () {
    var _el;
    var _config;
    var _msg = 'Testing';

    var self = {
        init: function (el, config) {
            _el = el;
            _config = config || {};
        },
        setMsg: function () {
            $(_el).text(_msg);
        },
        getMsg: function () {
            return _msg;
        },
        fireEvent: function(){
            $(_el).events("onFireEvent").fire();
        }
    };

    return self;
});


$.testing.register('Behaviors', {
    'Apply': function () {
        $('body').append('<span id="test-attribute" data-behaviors-eager="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        var jEl = $('#test-attribute');
        try {
            var el = jEl[0];
            $.behaviors.ensure(el);
            $.assert.notNull(el.behaviors);
            var behaviorInstance;
            $.behaviors.allFrom(el)["Tact.Behaviors.Tester"].getInstance(function (instance) { behaviorInstance = instance; });
            $.assert.areEqual('Testing', behaviorInstance.getMsg());
        } catch (ex) {
            throw ex;
        } finally {
            jEl.remove();
        }
    },
    'Message': function () {
        $('body').append('<span id="test-attribute" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        var jEl = $('#test-attribute');
        try {
            jEl.msg('setMsg');
            $.assert.areEqual('Testing', jEl.text());
        } catch (ex) {
            throw ex;
        } finally {
            jEl.remove();
        }
    },
    'Broadcast': function () {
        $('body').append('<div class="test-attribute"></div>');
        $('.test-attribute').append('<span id="test-attribute1" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        $('.test-attribute').append('<span id="test-attribute2" data-behaviors-eager="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        $('.test-attribute').append('<span id="test-attribute3" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        var jEl = $('.test-attribute');
        try {
            jEl.broadcast('setMsg');
            $.assert.areEqual('Testing', $('#test-attribute1').text());
            $.assert.areEqual('Testing', $('#test-attribute2').text());
            $.assert.areEqual('Testing', $('#test-attribute3').text());
        } catch (ex) {
            throw ex;
        } finally {
            jEl.remove();
        }
    },
    'Message Queue': function () {
        $('body').append('<span id="test-attribute" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        $('body').append('<div class="test-attribute"></div>');
        $('.test-attribute').append('<span id="test-attribute1" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        $('.test-attribute').append('<span id="test-attribute2" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        $('.test-attribute').append('<span id="test-attribute3" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        var jEl = $('#test-attribute');
        var el = jEl[0];
        var jEl2 = $('.test-attribute');
        var el2 = jEl2[0];
        try {
            jEl.enqueueMsg('setMsg').enqueueMsg('setMsg');
            $.assert.areEqual('2', jEl.behaviorQueueLength());
            jEl.unqueue();
            $.assert.areEqual('Testing', $('#test-attribute').text());
            $.assert.areEqual('1', jEl.behaviorQueueLength());            
            jEl2.enqueueBroadcast('setMsg');
            $.assert.areEqual('1', jEl2.behaviorQueueLength());
            jEl2.unqueue();
            $.assert.areEqual('Testing', $('#test-attribute1').text());
            $.assert.areEqual('Testing', $('#test-attribute2').text());
            $.assert.areEqual('Testing', $('#test-attribute3').text());
        } catch (ex) {
            throw ex;
        } finally {
            jEl.remove();
            jEl2.remove();
        }
    },
    'Events': function () {
        $('body').append('<span id="test-attribute" data-behaviors-lazy="Tact.Behaviors.Tester" style="display:none">Hello world</span>');
        var jEl = $('#test-attribute');
        try {
            var handler = function () { eventData = "Testing"; };
            var eventData;
            jEl.events("onFireEvent").subscribe(handler);
            jEl.msg('fireEvent');
            $.assert.areEqual('Testing', eventData);
            eventData = "not";
            jEl.events('onFireEvent').unsubscribe(handler);
            jEl.msg('fireEvent');
            $.assert.notEqual('Testing', eventData);
        } catch (ex) {
            throw ex;
        } finally {
            jEl.remove();
        }
    }
});
