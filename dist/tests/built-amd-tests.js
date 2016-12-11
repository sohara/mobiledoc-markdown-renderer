QUnit.module('JSHint - tests/jshint/cards');
QUnit.test('tests/jshint/cards/image.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/cards/image.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint');
QUnit.test('tests/jshint/index.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/index.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint');
QUnit.test('tests/jshint/renderer-factory.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/renderer-factory.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/renderers');
QUnit.test('tests/jshint/renderers/0-2.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/renderers/0-2.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/renderers');
QUnit.test('tests/jshint/renderers/0-3.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/renderers/0-3.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/renderers');
QUnit.test('tests/jshint/unit/renderers/0-2-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/renderers/0-2-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/renderers');
QUnit.test('tests/jshint/unit/renderers/0-3-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/renderers/0-3-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/utils');
QUnit.test('tests/jshint/utils/dom.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/utils/dom.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/utils');
QUnit.test('tests/jshint/utils/marker-types.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/utils/marker-types.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/utils');
QUnit.test('tests/jshint/utils/render-type.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/utils/render-type.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/utils');
QUnit.test('tests/jshint/utils/section-types.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/utils/section-types.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/utils');
QUnit.test('tests/jshint/utils/tag-names.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/utils/tag-names.js should pass jshint.'); 
});

define('tests/unit/renderers/0-2-test', ['exports', 'mobiledoc-markdown-renderer', 'mobiledoc-markdown-renderer/cards/image', 'mobiledoc-markdown-renderer/utils/section-types'], function (exports, _mobiledocMarkdownRenderer, _mobiledocMarkdownRendererCardsImage, _mobiledocMarkdownRendererUtilsSectionTypes) {
  /* global QUnit */
  'use strict';

  var _QUnit = QUnit;
  var test = _QUnit.test;
  var _module = _QUnit.module;

  var MOBILEDOC_VERSION = '0.2.0';
  var dataUri = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

  var renderer = undefined;
  _module('Unit: Mobiledoc Markdown Renderer - 0.2', {
    beforeEach: function beforeEach() {
      renderer = new _mobiledocMarkdownRenderer['default']();
    }
  });

  test('renders an empty mobiledoc', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [] // sections
      ]
    };

    var _renderer$render = renderer.render(mobiledoc);

    var rendered = _renderer$render.result;

    assert.equal(rendered, '', 'output is empty');
  });

  test('renders a mobiledoc without markups', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[[], 0, 'hello world']]]]]
    };

    var _renderer$render2 = renderer.render(mobiledoc);

    var rendered = _renderer$render2.result;

    assert.equal(rendered, 'hello world\n');
  });

  test('renders a mobiledoc with simple (no attributes) markup', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[// markups
      ['B']], [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[[0], 1, 'hello world']]]]]
    };

    var _renderer$render3 = renderer.render(mobiledoc);

    var rendered = _renderer$render3.result;

    assert.equal(rendered, '**hello world**\n');
  });

  test('renders a mobiledoc with complex (has attributes) markup', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[// markers
      ['A', ['href', 'http://google.com']]], [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[[0], 1, 'hello world']]]]]
    };

    var _renderer$render4 = renderer.render(mobiledoc);

    var rendered = _renderer$render4.result;

    assert.equal(rendered, '[hello world](http://google.com)\n');
  });

  test('renders a mobiledoc with multiple markups in a section', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[// markers
      ['B'], ['I']], [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[[0], 0, 'hello '], // b
      [[1], 0, 'brave '], // b+i
      [[], 1, 'new '], // close i
      [[], 1, 'world'] // close b
      ]]]]
    };

    var _renderer$render5 = renderer.render(mobiledoc);

    var rendered = _renderer$render5.result;

    assert.equal(rendered, '**hello *brave new *world**\n');
  });

  test('renders a mobiledoc with image section', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.IMAGE_SECTION_TYPE, dataUri]]]
    };

    var _renderer$render6 = renderer.render(mobiledoc);

    var rendered = _renderer$render6.result;

    assert.equal(rendered, '![](' + dataUri + ')');
  });

  test('renders a mobiledoc with built-in image card', function (assert) {
    assert.expect(1);
    var cardName = _mobiledocMarkdownRendererCardsImage['default'].name;
    var payload = { src: dataUri };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, cardName, payload]]]
    };

    var _renderer$render7 = renderer.render(mobiledoc);

    var rendered = _renderer$render7.result;

    assert.equal(rendered, '![](' + dataUri + ')');
  });

  test('render mobiledoc with list section and list items', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], [[_mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE, 'ul', [[[[], 0, 'first item']], [[[], 0, 'second item']]]]]]
    };

    var _renderer$render8 = renderer.render(mobiledoc);

    var rendered = _renderer$render8.result;

    assert.equal(rendered, '* first item\n* second item\n');
  });

  test('renders a mobiledoc with card section', function (assert) {
    assert.expect(6);

    var cardName = 'title-card';
    var expectedPayload = {};
    var expectedOptions = {};
    var titleCard = {
      name: cardName,
      type: 'markdown',
      render: function render(_ref) {
        var env = _ref.env;
        var payload = _ref.payload;
        var options = _ref.options;

        assert.deepEqual(payload, expectedPayload, 'correct payload');
        assert.deepEqual(options, expectedOptions, 'correct options');
        assert.equal(env.name, cardName, 'correct name');
        assert.ok(!env.isInEditor, 'isInEditor correct');
        assert.ok(!!env.onTeardown, 'has onTeardown hook');

        return 'Howdy friend';
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, cardName, expectedPayload]]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [titleCard], cardOptions: expectedOptions });

    var _renderer$render9 = renderer.render(mobiledoc);

    var rendered = _renderer$render9.result;

    assert.equal(rendered, 'Howdy friend');
  });

  test('throws when given invalid card type', function (assert) {
    var card = {
      name: 'bad',
      type: 'other',
      render: function render() {}
    };
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    }, // jshint ignore:line
    /Card "bad" must be of type "markdown"/);
  });

  test('throws when given card without `render`', function (assert) {
    var card = {
      name: 'bad',
      type: 'markdown',
      render: undefined
    };
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    }, // jshint ignore:line
    /Card "bad" must define.*render/);
  });

  test('throws if card render returns invalid result', function (assert) {
    var card = {
      name: 'bad',
      type: 'markdown',
      render: function render() {
        return Object.create(null);
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, card.name]] // sections
      ]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Card "bad" must render markdown/);
  });

  test('card may render nothing', function (assert) {
    var card = {
      name: 'ok',
      type: 'markdown',
      render: function render() {}
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, card.name]]]
    };

    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    renderer.render(mobiledoc);

    assert.ok(true, 'No error thrown');
  });

  test('rendering nested mobiledocs in cards', function (assert) {
    var cards = [{
      name: 'nested-card',
      type: 'markdown',
      render: function render(_ref2) {
        var payload = _ref2.payload;

        var _renderer$render10 = renderer.render(payload.mobiledoc);

        var rendered = _renderer$render10.result;

        return rendered;
      }
    }];

    var innerMobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[[], 0, 'hello world']]]]]
    };

    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 'nested-card', { mobiledoc: innerMobiledoc }]]]
    };

    renderer = new _mobiledocMarkdownRenderer['default']({ cards: cards });

    var _renderer$render11 = renderer.render(mobiledoc);

    var rendered = _renderer$render11.result;

    assert.equal(rendered, 'hello world\n');
  });

  test('rendering unknown card without unknownCardHandler throws', function (assert) {
    var cardName = 'missing-card';
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, cardName]]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [], unknownCardHandler: undefined });

    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Card "missing-card" not found.*no unknownCardHandler/);
  });

  test('rendering unknown card uses unknownCardHandler', function (assert) {
    assert.expect(5);

    var cardName = 'missing-card';
    var expectedPayload = {};
    var cardOptions = {};
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [// sections
      [_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, cardName, expectedPayload]]]
    };
    var unknownCardHandler = function unknownCardHandler(_ref3) {
      var env = _ref3.env;
      var payload = _ref3.payload;
      var options = _ref3.options;

      assert.equal(env.name, cardName, 'correct name');
      assert.ok(!env.isInEditor, 'correct isInEditor');
      assert.ok(!!env.onTeardown, 'onTeardown hook exists');

      assert.deepEqual(payload, expectedPayload, 'correct payload');
      assert.deepEqual(options, cardOptions, 'correct options');
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [], unknownCardHandler: unknownCardHandler, cardOptions: cardOptions });
    renderer.render(mobiledoc);
  });

  test('throws if given an object of cards', function (assert) {
    var cards = {};
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ cards: cards });
    }, // jshint ignore: line
    new RegExp('`cards` must be passed as an array'));
  });

  test('teardown hook calls registered teardown methods', function (assert) {
    var didTeardown = undefined;
    var card = {
      name: 'hasteardown',
      type: 'markdown',
      render: function render(_ref4) {
        var env = _ref4.env;

        env.onTeardown(function () {
          return didTeardown = true;
        });
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], // markers
      [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, card.name]] // sections
      ]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [card] });

    var _renderer$render12 = renderer.render(mobiledoc);

    var teardown = _renderer$render12.teardown;

    assert.ok(!didTeardown, 'precond - no teardown yet');

    teardown();

    assert.ok(didTeardown, 'teardown hook called');
  });

  test('throws when given an unexpected mobiledoc version', function (assert) {
    var mobiledoc = {
      version: '0.1.0',
      sections: [[], []]
    };
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Unexpected Mobiledoc version.*0.1.0/);

    mobiledoc.version = '0.2.1';
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Unexpected Mobiledoc version.*0.2.1/);
  });

  test('XSS: unexpected markup and list section tag names are not renderered', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[], [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'script', [[[], 0, 'alert("markup section XSS")']]], [_mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE, 'script', [[[[], 0, 'alert("list section XSS")']]]]]]
    };

    var _renderer$render13 = renderer.render(mobiledoc);

    var result = _renderer$render13.result;

    assert.ok(result.indexOf('script') === -1, 'no script tag rendered');
  });

  test('XSS: unexpected markup types are not rendered', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[['b'], // valid
      ['em'], // valid
      ['script'] // invalid
      ], [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'p', [[[0], 0, 'bold text'], [[1, 2], 3, 'alert("markup XSS")'], [[], 0, 'plain text']]]]]
    };

    var _renderer$render14 = renderer.render(mobiledoc);

    var result = _renderer$render14.result;

    assert.ok(result.indexOf('script') === -1, 'no script tag rendered');
  });
});
define('tests/unit/renderers/0-3-test', ['exports', 'mobiledoc-markdown-renderer', 'mobiledoc-markdown-renderer/cards/image', 'mobiledoc-markdown-renderer/utils/section-types', 'mobiledoc-markdown-renderer/utils/marker-types'], function (exports, _mobiledocMarkdownRenderer, _mobiledocMarkdownRendererCardsImage, _mobiledocMarkdownRendererUtilsSectionTypes, _mobiledocMarkdownRendererUtilsMarkerTypes) {
  /* global QUnit */
  'use strict';

  var _QUnit = QUnit;
  var test = _QUnit.test;
  var _module = _QUnit.module;

  var MOBILEDOC_VERSION = '0.3.0';
  var dataUri = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

  var renderer = undefined;
  _module('Unit: Mobiledoc Markdown Renderer - 0.3', {
    beforeEach: function beforeEach() {
      renderer = new _mobiledocMarkdownRenderer['default']();
    }
  });

  test('renders an empty mobiledoc', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: []
    };

    var _renderer$render = renderer.render(mobiledoc);

    var rendered = _renderer$render.result;

    assert.equal(rendered, '', 'output is empty');
  });

  test('renders a mobiledoc without markups', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 0, 'hello world']]]]
    };

    var _renderer$render2 = renderer.render(mobiledoc);

    var rendered = _renderer$render2.result;

    assert.equal(rendered, 'hello world\n');
  });

  test('renders a mobiledoc with simple (no attributes) markup', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['B']],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [0], 1, 'hello world']]]]
    };

    var _renderer$render3 = renderer.render(mobiledoc);

    var rendered = _renderer$render3.result;

    assert.equal(rendered, '**hello world**\n');
  });

  test('renders a mobiledoc with complex (has attributes) markup', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['A', ['href', 'http://google.com']]],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [0], 1, 'hello world']]]]
    };

    var _renderer$render4 = renderer.render(mobiledoc);

    var rendered = _renderer$render4.result;

    assert.equal(rendered, '[hello world](http://google.com)\n');
  });

  test('renders a mobiledoc with multiple markups in a section', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['B'], ['I']],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [0], 0, 'hello '], // b
      [_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [1], 0, 'brave '], // b+i
      [_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 1, 'new '], // close i
      [_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 1, 'world'] // close b
      ]]]
    };

    var _renderer$render5 = renderer.render(mobiledoc);

    var rendered = _renderer$render5.result;

    assert.equal(rendered, '**hello *brave new *world**\n');
  });

  test('renders a mobiledoc with image section', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.IMAGE_SECTION_TYPE, dataUri]]
    };

    var _renderer$render6 = renderer.render(mobiledoc);

    var rendered = _renderer$render6.result;

    assert.equal(rendered, '![](' + dataUri + ')');
  });

  test('renders a mobiledoc with built-in image card', function (assert) {
    assert.expect(1);
    var cardName = _mobiledocMarkdownRendererCardsImage['default'].name;
    var payload = { src: dataUri };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [[cardName, payload]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };

    var _renderer$render7 = renderer.render(mobiledoc);

    var rendered = _renderer$render7.result;

    assert.equal(rendered, '![](' + dataUri + ')');
  });

  test('render mobiledoc with list section and list items', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE, 'ul', [[[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 0, 'first item']], [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 0, 'second item']]]]]
    };

    var _renderer$render8 = renderer.render(mobiledoc);

    var rendered = _renderer$render8.result;

    assert.equal(rendered, '* first item\n* second item\n');
  });

  test('renders a mobiledoc with card section', function (assert) {
    assert.expect(6);

    var cardName = 'title-card';
    var expectedPayload = {};
    var expectedOptions = {};
    var titleCard = {
      name: cardName,
      type: 'markdown',
      render: function render(_ref) {
        var env = _ref.env;
        var payload = _ref.payload;
        var options = _ref.options;

        assert.deepEqual(payload, expectedPayload, 'correct payload');
        assert.deepEqual(options, expectedOptions, 'correct options');
        assert.equal(env.name, cardName, 'correct name');
        assert.ok(!env.isInEditor, 'isInEditor correct');
        assert.ok(!!env.onTeardown, 'has onTeardown hook');

        return 'Howdy friend';
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [[cardName, expectedPayload]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [titleCard], cardOptions: expectedOptions });

    var _renderer$render9 = renderer.render(mobiledoc);

    var rendered = _renderer$render9.result;

    assert.equal(rendered, 'Howdy friend');
  });

  test('throws when given invalid card type', function (assert) {
    var card = {
      name: 'bad',
      type: 'other',
      render: function render() {}
    };
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    }, // jshint ignore:line
    /Card "bad" must be of type "markdown"/);
  });

  test('throws when given card without `render`', function (assert) {
    var card = {
      name: 'bad',
      type: 'markdown',
      render: undefined
    };
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    }, // jshint ignore:line
    /Card "bad" must define.*render/);
  });

  test('throws if card render returns invalid result', function (assert) {
    var card = {
      name: 'bad',
      type: 'markdown',
      render: function render() {
        return Object.create(null);
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [[card.name]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Card "bad" must render markdown/);
  });

  test('card may render nothing', function (assert) {
    var card = {
      name: 'ok',
      type: 'markdown',
      render: function render() {}
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [[card.name]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };

    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [card] });
    renderer.render(mobiledoc);

    assert.ok(true, 'No error thrown');
  });

  test('rendering nested mobiledocs in cards', function (assert) {
    var cards = [{
      name: 'nested-card',
      type: 'markdown',
      render: function render(_ref2) {
        var payload = _ref2.payload;

        var _renderer$render10 = renderer.render(payload.mobiledoc);

        var rendered = _renderer$render10.result;

        return rendered;
      }
    }];

    var innerMobiledoc = {
      version: MOBILEDOC_VERSION,
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 0, 'hello world']]]]
    };

    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [['nested-card', { mobiledoc: innerMobiledoc }]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };

    renderer = new _mobiledocMarkdownRenderer['default']({ cards: cards });

    var _renderer$render11 = renderer.render(mobiledoc);

    var rendered = _renderer$render11.result;

    assert.equal(rendered, 'hello world\n');
  });

  test('rendering unknown card without unknownCardHandler throws', function (assert) {
    var cardName = 'missing-card';
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [[cardName]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [], unknownCardHandler: undefined });

    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Card "missing-card" not found.*no unknownCardHandler/);
  });

  test('rendering unknown card uses unknownCardHandler', function (assert) {
    assert.expect(5);

    var cardName = 'missing-card';
    var expectedPayload = {};
    var cardOptions = {};
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [[cardName, expectedPayload]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };
    var unknownCardHandler = function unknownCardHandler(_ref3) {
      var env = _ref3.env;
      var payload = _ref3.payload;
      var options = _ref3.options;

      assert.equal(env.name, cardName, 'correct name');
      assert.ok(!env.isInEditor, 'correct isInEditor');
      assert.ok(!!env.onTeardown, 'onTeardown hook exists');

      assert.deepEqual(payload, expectedPayload, 'correct payload');
      assert.deepEqual(options, cardOptions, 'correct options');
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [], unknownCardHandler: unknownCardHandler, cardOptions: cardOptions });
    renderer.render(mobiledoc);
  });

  test('throws if given an object of cards', function (assert) {
    var cards = {};
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ cards: cards });
    }, // jshint ignore: line
    new RegExp('`cards` must be passed as an array'));
  });

  test('teardown hook calls registered teardown methods', function (assert) {
    var didTeardown = undefined;
    var card = {
      name: 'hasteardown',
      type: 'markdown',
      render: function render(_ref4) {
        var env = _ref4.env;

        env.onTeardown(function () {
          return didTeardown = true;
        });
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [[card.name]],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE, 0]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ cards: [card] });

    var _renderer$render12 = renderer.render(mobiledoc);

    var teardown = _renderer$render12.teardown;

    assert.ok(!didTeardown, 'precond - no teardown yet');

    teardown();

    assert.ok(didTeardown, 'teardown hook called');
  });

  test('throws when given an unexpected mobiledoc version', function (assert) {
    var mobiledoc = {
      version: '0.1.0',
      atoms: [],
      cards: [],
      markups: [],
      sections: []
    };
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Unexpected Mobiledoc version.*0.1.0/);

    mobiledoc.version = '0.2.1';
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Unexpected Mobiledoc version.*0.2.1/);
  });

  test('XSS: unexpected markup and list section tag names are not renderered', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'script', [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 0, 'alert("markup section XSS")']]], [_mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE, 'script', [[[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 0, 'alert("list section XSS")']]]]]
    };

    var _renderer$render13 = renderer.render(mobiledoc);

    var result = _renderer$render13.result;

    assert.ok(result.indexOf('script') === -1, 'no script tag rendered');
  });

  test('XSS: unexpected markup types are not rendered', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['b'], // valid
      ['em'], // valid
      ['script'] // invalid
      ],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'p', [[_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [0], 0, 'bold text'], [_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [1, 2], 3, 'alert("markup XSS")'], [_mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE, [], 0, 'plain text']]]]
    };

    var _renderer$render14 = renderer.render(mobiledoc);

    var result = _renderer$render14.result;

    assert.ok(result.indexOf('script') === -1, 'no script tag rendered');
  });

  test('renders a mobiledoc with atom', function (assert) {
    var atomName = 'hello-atom';
    var atom = {
      name: atomName,
      type: 'markdown',
      render: function render(_ref5) {
        var value = _ref5.value;

        return 'Hello ' + value;
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [['hello-atom', 'Bob', { id: 42 }]],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.ATOM_MARKER_TYPE, [], 0, 0]]]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ atoms: [atom] });

    var _renderer$render15 = renderer.render(mobiledoc);

    var rendered = _renderer$render15.result;

    assert.equal(rendered, 'Hello Bob\n');
  });

  test('throws when given atom with invalid type', function (assert) {
    var atom = {
      name: 'bad',
      type: 'other',
      render: function render() {}
    };
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ atoms: [atom] });
    }, // jshint ignore:line
    /Atom "bad" must be type "markdown"/);
  });

  test('throws when given atom without `render`', function (assert) {
    var atom = {
      name: 'bad',
      type: 'markdown',
      render: undefined
    };
    assert.throws(function () {
      new _mobiledocMarkdownRenderer['default']({ atoms: [atom] });
    }, // jshint ignore:line
    /Atom "bad" must define.*render/);
  });

  test('throws if atom render returns invalid result', function (assert) {
    var atom = {
      name: 'bad',
      type: 'markdown',
      render: function render() {
        return Object.create(null);
      }
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [['bad', 'Bob', { id: 42 }]],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.ATOM_MARKER_TYPE, [], 0, 0]]]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ atoms: [atom] });
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Atom "bad" must render markdown/);
  });

  test('atom may render nothing', function (assert) {
    var atom = {
      name: 'ok',
      type: 'markdown',
      render: function render() {}
    };
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [['ok', 'Bob', { id: 42 }]],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.ATOM_MARKER_TYPE, [], 0, 0]]]]
    };

    renderer = new _mobiledocMarkdownRenderer['default']({ atoms: [atom] });
    renderer.render(mobiledoc);

    assert.ok(true, 'No error thrown');
  });

  test('throws when rendering unknown atom without unknownAtomHandler', function (assert) {
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [['missing-atom', 'Bob', { id: 42 }]],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.ATOM_MARKER_TYPE, [], 0, 0]]]]
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ atoms: [], unknownAtomHandler: undefined });
    assert.throws(function () {
      return renderer.render(mobiledoc);
    }, /Atom "missing-atom" not found.*no unknownAtomHandler/);
  });

  test('rendering unknown atom uses unknownAtomHandler', function (assert) {
    assert.expect(4);

    var atomName = 'missing-atom';
    var expectedPayload = { id: 42 };
    var cardOptions = {};
    var mobiledoc = {
      version: MOBILEDOC_VERSION,
      atoms: [['missing-atom', 'Bob', { id: 42 }]],
      cards: [],
      markups: [],
      sections: [[_mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE, 'P', [[_mobiledocMarkdownRendererUtilsMarkerTypes.ATOM_MARKER_TYPE, [], 0, 0]]]]
    };
    var unknownAtomHandler = function unknownAtomHandler(_ref6) {
      var env = _ref6.env;
      var payload = _ref6.payload;
      var options = _ref6.options;

      assert.equal(env.name, atomName, 'correct name');
      assert.ok(!!env.onTeardown, 'onTeardown hook exists');

      assert.deepEqual(payload, expectedPayload, 'correct payload');
      assert.deepEqual(options, cardOptions, 'correct options');
    };
    renderer = new _mobiledocMarkdownRenderer['default']({ atoms: [], unknownAtomHandler: unknownAtomHandler, cardOptions: cardOptions });
    renderer.render(mobiledoc);
  });
});