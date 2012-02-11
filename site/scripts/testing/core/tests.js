$.types.ns('Tact.Core');

Tact.Core.A = $.types.define(function() {
		var _a = 'AAA';

		var self = {
			getA : function() {
				return _a;
			}
		};

		return self;
	});

Tact.Core.B = $.types.extend(Tact.Core.A, function() {
		var _b = 'BBB';

		var self = {
			getB : function() {
				return _b;
			}
		};

		return self;
	});

Tact.Core.C = $.types.extend(Tact.Core.B, function() {
		var _a = 'aaa';
		var _c = 'CCC';

		var self = {
			getA : function() {
				return _a;
			},
			getC : function() {
				return self.superclass.getA() + self.superclass.getB() + _c;
			}
		};

		return self;
	});

Tact.Core.D = $.types.define(function() {
		var self = {
			a : 1,
			increment : function() {
				self.a++;
			}
		};

		return self;
	});

Tact.Core.E = $.types.extend(Tact.Core.D, function() {
		var self = {
			decrement : function() {
				self.a--;
			}
		};

		return self;
	});

$.testing.register('Core', {
		'Define Class' : function() {
			var a = new Tact.Core.A();

			$.assert.isTrue(a.is(Tact.Core.A));
			$.assert.isFalse(a.is(Tact.Core.B));
			$.assert.isFalse(a.is(Tact.Core.C));

			$.assert.areEqual('AAA', a.getA());
		},
		'Extend Class' : function() {
			var b = new Tact.Core.B();

			$.assert.isTrue(b.is(Tact.Core.A));
			$.assert.isTrue(b.is(Tact.Core.B));
			$.assert.isFalse(b.is(Tact.Core.C));

			$.assert.areEqual('AAA', b.getA());
			$.assert.areEqual('BBB', b.getB());
		},
		'Override Class' : function() {
			var c = new Tact.Core.C();

			$.assert.isTrue(c.is(Tact.Core.A));
			$.assert.isTrue(c.is(Tact.Core.B));
			$.assert.isTrue(c.is(Tact.Core.C));

			$.assert.areEqual('aaa', c.getA());
			$.assert.areEqual('BBB', c.getB());
			$.assert.areEqual('AAABBBCCC', c.getC());
		},
		'Property Reference' : function() {
			var e = new Tact.Core.E();

			$.assert.areEqual(1, e.a);
			$.assert.areEqual(1, e.superclass.a);
			e.increment();
			$.assert.areEqual(2, e.a);
			$.assert.areEqual(2, e.superclass.a);
			e.decrement();
			$.assert.areEqual(1, e.a);
			$.assert.areEqual(1, e.superclass.a);
			e.a = 3;
			$.assert.areEqual(3, e.a);
			$.assert.areEqual(3, e.superclass.a);

			e.a = function() {
				return 'success';
			};
			$.assert.areEqual('success', e.a());
			$.assert.areEqual('success', e.superclass.a());
            
            delete e.a;
            $.assert.notNull(e.a);
            $.assert.notNull(e.superclass.a);
            
		}
	});