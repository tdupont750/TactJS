$.testing.register('Testing', {
    'Are Equal' : function () {
        $.assert.areEqual('Equal', 'Equal');
        try {
            $.assert.areEqual(1, 2);
            $.assert.fail('Expected Exception');
        } catch (ex) { }
    },
    'Not Equal' : function() {
        $.assert.notEqual('Yes', 'No');
        try {
            $.assert.notEqual(true, true);
            $.assert.fail('Expected Exception');
        } catch (ex) { }
    },
    'Is True' : function() {
        $.assert.isTrue(true);
        try {
            $.assert.isTrue(false);
            $.assert.fail('Expected Exception');
        } catch (ex) { }
    },
    'Is False' : function() {
        $.assert.isFalse(false);
        try {
            $.assert.isFalse(true);
            $.assert.fail('Expected Exception');
        } catch (ex) { }
    },
    'Is Null' : function() {
        $.assert.isNull(null);
        try {
            $.assert.isNull(/notnull/);
            $.assert.fail('Expected Exception');
        } catch (ex) { }
    },
    'Not Null' : function() {
        $.assert.notNull(5);
        try {
            $.assert.notNull();
            $.assert.fail('Expected Exception');
        } catch (ex) { }
    }
});