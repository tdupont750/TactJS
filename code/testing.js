(function($) {
    if (!$ || !$.types) {
        throw 'Initialization Error: Testing requires Core.';
    }
    if ($.testing) {
        throw 'Initialization Error: Testing has already been defined.';
    }
    
    var _testMap = {};
    
    /**
     * TactJS Testing
     * Adds unit testing capabilities to jQuery
     */
    $.testing = {
        /**
         * @description Register a test fixture.
         * @param {string} fixture
         * @param {object} tests
         */
        register : function(fixture, tests) {
            _testMap[fixture] = tests;
        },
        /**
         * @description Run all test fixtures.
         */
        runAll : function() {
            for(var f in _testMap) {
                $.testing.runFixture(f);
            }
        },
        /**
         * @description Run a specific test fixture.
         * @param {string} fixture
         */
        runFixture : function(fixture) {
            $.log.write(fixture);
            $.log.write('  Begin');

            var pass = 0;
            var fail = 0;
            for(var t in _testMap[fixture]) {
                if ($.testing.runMethod(fixture, t)) {
                    pass++;
                } else {
                    fail++; 
                }
            }
            
            $.log.write('  Complete');
            $.log.write('    Passed: ' + pass);
            $.log.write('    Failed: ' + fail);
        },
        /**
         * @description Run a specific test in a fixture.
         * @param {string} fixture
         * @param {string} name
         */
        runMethod : function (fixture, name) {
            try {
                $.log.write('    ' + name);
                _testMap[fixture][name]();
                return true;
            } catch (ex) {
                $.log.write('      Failed: ' + ex);
                return false;
            }
        }
    };
    
    /**
     * Unit testing assertions for TactJS Testing
     */
    $.assert = {
        /**
         * Assert value is true.
         * @param {boolean} value
         */
        isTrue : function(value) {
            if (!value) {
                throw 'Not True: Expected true, but was "' + value + '"';
            }
        },
        /**
         * Assert value is false.
         * @param {boolean} value
         */
        isFalse : function(value) {
            if (value) {
                throw 'Not False: Expected false, but was "' + value + '"';
            }
        },
        /**
         * Assert value is null.
         * @param {mixed} value
         */
        isNull : function(value) {
            if (value) {
                throw 'Not Null: Expected null, but was "' + value + '"';
            }
        },
        /**
         * Assert value is not null.
         * @param {mixed} value
         */
        notNull : function(value) {
            if (!value) {
                throw 'Is Null: Expected not null, but was null';
            }
        },
        /**
         * Assert values are equal.
         * @param {mixed} expected
         * @param {mixed} actual
         * @param {boolean} exact (Optional)
         */
        areEqual : function(expected, actual, exact) {
            if (exact) {
                if (expected !== actual) {
                    throw 'Not Exactly Equal: Expected "' + expected + '", but was "' + actual + '"';
                }
            } else {
                if (expected != actual) {
                    throw 'Not Equal: Expected "' + expected + '", but was "' + actual + '"';
                }
            }
        },
        /**
         * Assert values are not equal.
         * @param {mixed} expected
         * @param {mixed} actual
         * @param {boolean} exact (Optional)
         */
        notEqual : function(expected, actual, exact) {
            if (exact) {
                if (expected === actual) {
                    throw 'Exactly Equal: Expected "' + expected + '", and was "' + actual + '"';
                }
            } else {
                if (expected == actual) {
                    throw 'Equal: Expected "' + expected + '", and was "' + actual + '"';
                }
            }
        },
        /**
         * Assert a failure.
         * @param {string} msg
         */
        fail : function(msg) {
            throw 'Failure Asserted: ' + msg;
        }
    };
    
})(jQuery);