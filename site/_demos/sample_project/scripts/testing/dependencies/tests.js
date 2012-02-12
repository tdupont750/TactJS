$.types.ns('Tact.DI');

Tact.DI.A = $.types.define(function() {
    var _a;
    var self = {
        b : new Tact.Dependency('b'),
        setA : function(a) { _a = a; },
        getA : function() { return _a; }
    };
    return self;
});

Tact.DI.B = $.types.define(function() {
    var _b;
    var self = { 
        c : new Tact.Dependency('c'),
        setB : function(b) { _b = b; },
        getB : function() { return _b; }
    };
    return self;
});

Tact.DI.C = $.types.define(function() {
    var _c;
    var self = {
        setC : function(c) { _c = c; },
        getC : function() { return _c; }
    };
    return self;
});

// Resolve
$.ioc.register('a', Tact.DI.A);
$.ioc.register('b', Tact.DI.B);
$.ioc.register('c', Tact.DI.C);

Tact.DI.D = $.types.define(function() {
    var _d;
    var self = {
        e : new Tact.Dependency('e'),
        setD : function(d) { _d = d; },
        getD : function() { return _d; }
    };
    return self;
});

Tact.DI.E = $.types.define(function() {
    var _e;
    var self = {
        d : new Tact.Dependency('d'),
        setE : function(e) { _e = e; },
        getE : function() { return _e; }
    };
    return self;
});

// Circular
$.ioc.register('d', Tact.DI.D);
$.ioc.register('e', Tact.DI.E);

// Singleton
$.ioc.register('f', Tact.DI.A, true);

$.testing.register('Dependencies', {
    'Resolve' : function() {
        var a = $.ioc.resolve('a');
        $.assert.notNull(a);
        $.assert.isTrue(a.is(Tact.DI.A));
        $.assert.notNull(a.b);
        $.assert.isTrue(a.b.is(Tact.DI.B));
        $.assert.notNull(a.b.c);
        $.assert.isTrue(a.b.c.is(Tact.DI.C));
    },
    'Circular' : function() {
        var d = $.ioc.resolve('d');
        $.assert.notNull(d);
        $.assert.isTrue(d.is(Tact.DI.D));
        $.assert.notNull(d.e);
        $.assert.isTrue(d.e.is(Tact.DI.E));
        $.assert.notNull(d.e.d);
        $.assert.isTrue(d.e.d.is(Tact.DI.D));
        $.assert.isTrue(d === d.e.d);
    },
    'Singleton' : function() {
        var f1 = $.ioc.resolve('f');
        $.assert.notNull(f1);
        $.assert.isTrue(f1.is(Tact.DI.A));
        var f2 = $.ioc.resolve('f');
        $.assert.notNull(f2);
        $.assert.isTrue(f2.is(Tact.DI.A));
        $.assert.isTrue(f1 === f2);
    }
});