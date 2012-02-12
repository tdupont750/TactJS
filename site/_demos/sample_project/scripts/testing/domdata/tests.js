$.testing.register('Data', {
	'Read Data' : function() {
		$('body').append('<div id="test-attribute" style="display:none" data-a="A"><span data-b="B"></span><span data-c="C"></span></div>');
		var el = $('#test-attribute');
		try {
			var data = el.domdata();
			$.assert.areEqual('object', typeof data);
			$.assert.areEqual('A', data.a);
            $.assert.isNull(data.b);
            $.assert.isNull(data.c);
		} catch (ex) {
			throw ex;
		} finally {
            el.remove();
        }
	}, 'Read Recursive' : function() {
        $('body').append('<div id="test-attribute" style="display:none" data-a="A"><span data-b="B"></span><span data-c="C"></span><div><span data-d="D"></div></div>');
        var el = $('#test-attribute');
        try {
            var data = el.domdata(1);
            $.assert.areEqual('object', typeof data);
            $.assert.areEqual('A', data.a);
            $.assert.areEqual('B', data.b);
            $.assert.areEqual('C', data.c);
            $.assert.isNull(data.d);
        } catch (ex) {
            throw ex;
        } finally {
            el.remove();
        }
    }, 'Read Object' : function() {
        $('body').append('<div id="test-attribute" style="display:none" data-stuff=\'{"n":1,"b":true}\'></div>');
        var el = $('#test-attribute');
        try {
            var data = el.domdata(1);
            $.assert.areEqual('object', typeof data);
            $.assert.areEqual('object', typeof data.stuff);
            $.assert.areEqual(1, data.stuff.n, true);
            $.assert.areEqual(true, data.stuff.b, true);
        } catch (ex) {
            throw ex;
        } finally {
            el.remove();
        }
    }
});