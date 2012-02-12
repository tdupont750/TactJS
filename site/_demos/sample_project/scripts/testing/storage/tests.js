$.testing.register('Storage', {
    'Items' : function () {
        var key = 'ItemKey';
        var a = 'Hello World';
        $.storage.local.setItem(key, a);
        var b = $.storage.local.getItem(key);
        $.assert.areEqual(a, b);
        var c = $.storage.local.removeItem(key, true);
        $.assert.areEqual(a, c);
    },
    'Objects' : function() {
        var key = 'ObjectKey';
        var a = {
            a: [true],
            n: 1,
            s: 'Hello World'
        };
        $.storage.local.setObject(key, a);
        var b = $.storage.local.getObject(key);
        $.assert.areEqual(a.a.length, b.a.length);
        $.assert.areEqual(a.n, b.n);
        $.assert.areEqual(a.s, b.s);
        var c = $.storage.local.removeObject(key, true);
        $.assert.areEqual(a.a.length, c.a.length);
        $.assert.areEqual(a.n, c.n);
        $.assert.areEqual(a.s, c.s);
    }
});