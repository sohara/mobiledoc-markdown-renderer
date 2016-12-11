;(function() {
var loader, define, requireModule, require, requirejs;
var global = this;

(function() {
  'use strict';

  // Save off the original values of these globals, so we can restore them if someone asks us to
  var oldGlobals = {
    loader: loader,
    define: define,
    requireModule: requireModule,
    require: require,
    requirejs: requirejs
  };

  loader = {
    noConflict: function(aliases) {
      var oldName, newName;

      for (oldName in aliases) {
        if (aliases.hasOwnProperty(oldName)) {
          if (oldGlobals.hasOwnProperty(oldName)) {
            newName = aliases[oldName];

            global[newName] = global[oldName];
            global[oldName] = oldGlobals[oldName];
          }
        }
      }
    }
  };

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var registry = {};
  var seen = {};
  var FAILED = false;
  var LOADED = true;

  var uuid = 0;

  function unsupportedModule(length) {
    throw new Error('an unsupported module was defined, expected `define(name, deps, module)` instead got: `' +
                    length + '` arguments to define`');
  }

  var defaultDeps = ['require', 'exports', 'module'];

  function Module(name, deps, callback) {
    this.id        = uuid++;
    this.name      = name;
    this.deps      = !deps.length && callback.length ? defaultDeps : deps;
    this.module    = { exports: {} };
    this.callback  = callback;
    this.state     = undefined;
    this._require  = undefined;
    this.finalized = false;
    this.hasExportsAsDep = false;
  }

  Module.prototype.makeDefaultExport = function() {
    var exports = this.module.exports;
    if (exports !== null &&
        (typeof exports === 'object' || typeof exports === 'function') &&
          exports['default'] === undefined) {
      exports['default'] = exports;
    }
  };

  Module.prototype.exports = function(reifiedDeps) {
    if (this.finalized) {
      return this.module.exports;
    } else {
      if (loader.wrapModules) {
        this.callback = loader.wrapModules(this.name, this.callback);
      }
      var result = this.callback.apply(this, reifiedDeps);
      if (!(this.hasExportsAsDep && result === undefined)) {
        this.module.exports = result;
      }
      this.makeDefaultExport();
      this.finalized = true;
      return this.module.exports;
    }
  };

  Module.prototype.unsee = function() {
    this.finalized = false;
    this.state = undefined;
    this.module = { exports: {}};
  };

  Module.prototype.reify = function() {
    var deps = this.deps;
    var length = deps.length;
    var reified = new Array(length);
    var dep;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        this.hasExportsAsDep = true;
        reified[i] = this.module.exports;
      } else if (dep === 'require') {
        reified[i] = this.makeRequire();
      } else if (dep === 'module') {
        reified[i] = this.module;
      } else {
        reified[i] = findModule(resolve(dep, this.name), this.name).module.exports;
      }
    }

    return reified;
  };

  Module.prototype.makeRequire = function() {
    var name = this.name;

    return this._require || (this._require = function(dep) {
      return require(resolve(dep, name));
    });
  };

  Module.prototype.build = function() {
    if (this.state === FAILED) { return; }
    this.state = FAILED;
    this.exports(this.reify());
    this.state = LOADED;
  };

  define = function(name, deps, callback) {
    if (arguments.length < 2) {
      unsupportedModule(arguments.length);
    }

    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }

    registry[name] = new Module(name, deps, callback);
  };

  // we don't support all of AMD
  // define.amd = {};
  // we will support petals...
  define.petal = { };

  function Alias(path) {
    this.name = path;
  }

  define.alias = function(path) {
    return new Alias(path);
  };

  function missingModule(name, referrer) {
    throw new Error('Could not find module `' + name + '` imported from `' + referrer + '`');
  }

  requirejs = require = requireModule = function(name) {
    return findModule(name, '(require)').module.exports;
  };

  function findModule(name, referrer) {
    var mod = registry[name] || registry[name + '/index'];

    while (mod && mod.callback instanceof Alias) {
      name = mod.callback.name;
      mod = registry[name];
    }

    if (!mod) { missingModule(name, referrer); }

    mod.build();
    return mod;
  }

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') {
        if (parentBase.length === 0) {
          throw new Error('Cannot access parent module of root');
        }
        parentBase.pop();
      } else if (part === '.') {
        continue;
      } else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.unsee = function(moduleName) {
    findModule(moduleName, '(unsee)').unsee();
  };

  requirejs.clear = function() {
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = {};
  };
})();

define('mobiledoc-markdown-renderer/cards/image', ['exports', 'mobiledoc-markdown-renderer/utils/render-type'], function (exports, _mobiledocMarkdownRendererUtilsRenderType) {
  'use strict';

  exports['default'] = {
    name: 'image-card',
    type: _mobiledocMarkdownRendererUtilsRenderType['default'],
    render: function render(_ref) {
      var env = _ref.env;
      var options = _ref.options;
      var payload = _ref.payload;

      if (payload.src) {
        return '![](' + payload.src + ')';
      }
    }
  };
});
define('mobiledoc-markdown-renderer', ['exports', 'mobiledoc-markdown-renderer/renderer-factory', 'mobiledoc-markdown-renderer/utils/render-type'], function (exports, _mobiledocMarkdownRendererRendererFactory, _mobiledocMarkdownRendererUtilsRenderType) {
  'use strict';

  exports.registerGlobal = registerGlobal;

  function registerGlobal(window) {
    window.MobiledocMarkdownRenderer = _mobiledocMarkdownRendererRendererFactory['default'];
  }

  exports.RENDER_TYPE = _mobiledocMarkdownRendererUtilsRenderType['default'];
  exports['default'] = _mobiledocMarkdownRendererRendererFactory['default'];
});
define('mobiledoc-markdown-renderer/renderer-factory', ['exports', 'mobiledoc-markdown-renderer/renderers/0-2', 'mobiledoc-markdown-renderer/renderers/0-3', 'mobiledoc-markdown-renderer/utils/render-type'], function (exports, _mobiledocMarkdownRendererRenderers02, _mobiledocMarkdownRendererRenderers03, _mobiledocMarkdownRendererUtilsRenderType) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function validateCards(cards) {
    if (!Array.isArray(cards)) {
      throw new Error('`cards` must be passed as an array');
    }
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.type !== _mobiledocMarkdownRendererUtilsRenderType['default']) {
        throw new Error('Card "' + card.name + '" must be of type "' + _mobiledocMarkdownRendererUtilsRenderType['default'] + '", was "' + card.type + '"');
      }
      if (!card.render) {
        throw new Error('Card "' + card.name + '" must define `render`');
      }
    }
  }

  function validateAtoms(atoms) {
    if (!Array.isArray(atoms)) {
      throw new Error('`atoms` must be passed as an array');
    }
    for (var i = 0; i < atoms.length; i++) {
      var atom = atoms[i];
      if (atom.type !== _mobiledocMarkdownRendererUtilsRenderType['default']) {
        throw new Error('Atom "' + atom.name + '" must be type "' + _mobiledocMarkdownRendererUtilsRenderType['default'] + '", was "' + atom.type + '"');
      }
      if (!atom.render) {
        throw new Error('Atom "' + atom.name + '" must define `render`');
      }
    }
  }

  var RendererFactory = (function () {
    function RendererFactory() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var cards = _ref.cards;
      var atoms = _ref.atoms;
      var cardOptions = _ref.cardOptions;
      var unknownCardHandler = _ref.unknownCardHandler;
      var unknownAtomHandler = _ref.unknownAtomHandler;
      var sectionElementRenderer = _ref.sectionElementRenderer;

      _classCallCheck(this, RendererFactory);

      cards = cards || [];
      validateCards(cards);
      atoms = atoms || [];
      validateAtoms(atoms);
      cardOptions = cardOptions || {};

      this.state = {
        cards: cards,
        atoms: atoms,
        cardOptions: cardOptions,
        unknownCardHandler: unknownCardHandler,
        unknownAtomHandler: unknownAtomHandler,
        sectionElementRenderer: sectionElementRenderer
      };
    }

    _createClass(RendererFactory, [{
      key: 'render',
      value: function render(mobiledoc) {
        var version = mobiledoc.version;

        switch (version) {
          case _mobiledocMarkdownRendererRenderers02.MOBILEDOC_VERSION:
          case undefined:
          case null:
            return new _mobiledocMarkdownRendererRenderers02['default'](mobiledoc, this.state).render();
          case _mobiledocMarkdownRendererRenderers03.MOBILEDOC_VERSION:
            return new _mobiledocMarkdownRendererRenderers03['default'](mobiledoc, this.state).render();
          default:
            throw new Error('Unexpected Mobiledoc version "' + version + '"');
        }
      }
    }]);

    return RendererFactory;
  })();

  exports['default'] = RendererFactory;
});
define('mobiledoc-markdown-renderer/renderers/0-2', ['exports', 'mobiledoc-markdown-renderer/utils/dom', 'mobiledoc-markdown-renderer/cards/image', 'mobiledoc-markdown-renderer/utils/render-type', 'mobiledoc-markdown-renderer/utils/section-types', 'mobiledoc-markdown-renderer/utils/tag-names'], function (exports, _mobiledocMarkdownRendererUtilsDom, _mobiledocMarkdownRendererCardsImage, _mobiledocMarkdownRendererUtilsRenderType, _mobiledocMarkdownRendererUtilsSectionTypes, _mobiledocMarkdownRendererUtilsTagNames) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var MOBILEDOC_VERSION = '0.2.0';

  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  /**
   * runtime Markdown renderer
   * renders a mobiledoc to Markdown (string)
   *
   * input: mobiledoc
   * output: Markdown (string)
   */

  function createElementFromMarkerType() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? ['', []] : arguments[0];

    var _ref2 = _slicedToArray(_ref, 2);

    var tagName = _ref2[0];
    var attributes = _ref2[1];

    var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)(tagName);
    attributes = attributes || [];

    for (var i = 0, l = attributes.length; i < l; i = i + 2) {
      var propName = attributes[i],
          propValue = attributes[i + 1];
      (0, _mobiledocMarkdownRendererUtilsDom.setAttribute)(element, propName, propValue);
    }
    return element;
  }

  function validateVersion(version) {
    if (version !== MOBILEDOC_VERSION) {
      throw new Error('Unexpected Mobiledoc version "' + version + '"');
    }
  }

  var Renderer = (function () {
    function Renderer(mobiledoc, state) {
      _classCallCheck(this, Renderer);

      var cards = state.cards;
      var cardOptions = state.cardOptions;
      var unknownCardHandler = state.unknownCardHandler;
      var version = mobiledoc.version;
      var sectionData = mobiledoc.sections;

      validateVersion(version);

      var _sectionData = _slicedToArray(sectionData, 2);

      var markerTypes = _sectionData[0];
      var sections = _sectionData[1];

      this.root = (0, _mobiledocMarkdownRendererUtilsDom.createDocumentFragment)();
      this.markerTypes = markerTypes;
      this.sections = sections;
      this.cards = cards;
      this.cardOptions = cardOptions;
      this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;

      this._teardownCallbacks = [];
    }

    _createClass(Renderer, [{
      key: 'render',
      value: function render() {
        var _this = this;

        this.sections.forEach(function (section) {
          var rendered = _this.renderSection(section);
          if (rendered) {
            (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(_this.root, rendered);
          }
        });

        return { result: this.root.toString(), teardown: function teardown() {
            return _this.teardown();
          } };
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        for (var i = 0; i < this._teardownCallbacks.length; i++) {
          this._teardownCallbacks[i]();
        }
      }
    }, {
      key: 'renderSection',
      value: function renderSection(section) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
            return this.renderMarkupSection(section);
          case _mobiledocMarkdownRendererUtilsSectionTypes.IMAGE_SECTION_TYPE:
            return this.renderImageSection(section);
          case _mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE:
            return this.renderListSection(section);
          case _mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE:
            return this.renderCardSection(section);
          default:
            throw new Error('Renderer cannot render type "' + type + '"');
        }
      }
    }, {
      key: 'renderListSection',
      value: function renderListSection(_ref3) {
        var _this2 = this;

        var _ref32 = _slicedToArray(_ref3, 3);

        var type = _ref32[0];
        var tagName = _ref32[1];
        var items = _ref32[2];

        if (!(0, _mobiledocMarkdownRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE)) {
          return;
        }
        var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)(tagName);
        if (tagName.toLowerCase() === 'ol') {
          for (var i = 0; i < items.length; i++) {
            var li = items[i];
            (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(element, this.renderListItem(li, i + 1));
          }
        } else {
          items.forEach(function (li) {
            (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(element, _this2.renderListItem(li));
          });
        }
        return element;
      }
    }, {
      key: 'renderListItem',
      value: function renderListItem(markers) {
        var position = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)('li');
        if (position !== null) {
          (0, _mobiledocMarkdownRendererUtilsDom.setAttribute)(element, 'position', position);
        }
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: 'renderImageSection',
      value: function renderImageSection(_ref4) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var type = _ref42[0];
        var url = _ref42[1];

        var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)('img');
        (0, _mobiledocMarkdownRendererUtilsDom.setAttribute)(element, 'src', url);
        return element;
      }
    }, {
      key: 'findCard',
      value: function findCard(name) {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].name === name) {
            return this.cards[i];
          }
        }
        if (name === _mobiledocMarkdownRendererCardsImage['default'].name) {
          return _mobiledocMarkdownRendererCardsImage['default'];
        }
        return this._createUnknownCard(name);
      }
    }, {
      key: '_createUnknownCard',
      value: function _createUnknownCard(name) {
        return {
          name: name,
          type: _mobiledocMarkdownRendererUtilsRenderType['default'],
          render: this.unknownCardHandler
        };
      }
    }, {
      key: 'renderCardSection',
      value: function renderCardSection(_ref5) {
        var _ref52 = _slicedToArray(_ref5, 3);

        var type = _ref52[0];
        var name = _ref52[1];
        var payload = _ref52[2];

        var card = this.findCard(name);

        var cardWrapper = this._createCardElement();
        var cardArg = this._createCardArgument(card, payload);
        var rendered = card.render(cardArg);

        this._validateCardRender(rendered, card.name);

        if (rendered) {
          (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(cardWrapper, rendered);
        }

        return cardWrapper;
      }
    }, {
      key: '_registerTeardownCallback',
      value: function _registerTeardownCallback(callback) {
        this._teardownCallbacks.push(callback);
      }
    }, {
      key: '_createCardArgument',
      value: function _createCardArgument(card) {
        var _this3 = this;

        var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var env = {
          name: card.name,
          isInEditor: false,
          onTeardown: function onTeardown(callback) {
            return _this3._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, payload: payload };
      }
    }, {
      key: '_validateCardRender',
      value: function _validateCardRender(rendered, cardName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Card "' + cardName + '" must render ' + _mobiledocMarkdownRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_createCardElement',
      value: function _createCardElement() {
        return (0, _mobiledocMarkdownRendererUtilsDom.createElement)('div');
      }
    }, {
      key: 'renderMarkupSection',
      value: function renderMarkupSection(_ref6) {
        var _ref62 = _slicedToArray(_ref6, 3);

        var type = _ref62[0];
        var tagName = _ref62[1];
        var markers = _ref62[2];

        if (!(0, _mobiledocMarkdownRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE)) {
          return;
        }
        var renderer = _mobiledocMarkdownRendererUtilsDom.createElement;
        var element = renderer(tagName);
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: '_renderMarkersOnElement',
      value: function _renderMarkersOnElement(element, markers) {
        var elements = [element];
        var currentElement = element;

        for (var i = 0, l = markers.length; i < l; i++) {
          var marker = markers[i];

          var _marker = _slicedToArray(marker, 3);

          var openTypes = _marker[0];
          var closeCount = _marker[1];
          var text = _marker[2];

          for (var j = 0, m = openTypes.length; j < m; j++) {
            var markerType = this.markerTypes[openTypes[j]];

            var _markerType = _slicedToArray(markerType, 1);

            var tagName = _markerType[0];

            if ((0, _mobiledocMarkdownRendererUtilsTagNames.isValidMarkerType)(tagName)) {
              var openedElement = createElementFromMarkerType(markerType);
              (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(currentElement, openedElement);
              elements.push(openedElement);
              currentElement = openedElement;
            } else {
              closeCount--;
            }
          }

          (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(currentElement, (0, _mobiledocMarkdownRendererUtilsDom.createTextNode)(text));

          for (var j = 0, m = closeCount; j < m; j++) {
            elements.pop();
            currentElement = elements[elements.length - 1];
          }
        }
      }
    }, {
      key: '_defaultUnknownCardHandler',
      get: function get() {
        return function (_ref7) {
          var name = _ref7.env.name;

          throw new Error('Card "' + name + '" not found but no unknownCardHandler was registered');
        };
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;
});
define('mobiledoc-markdown-renderer/renderers/0-3', ['exports', 'mobiledoc-markdown-renderer/utils/dom', 'mobiledoc-markdown-renderer/cards/image', 'mobiledoc-markdown-renderer/utils/render-type', 'mobiledoc-markdown-renderer/utils/section-types', 'mobiledoc-markdown-renderer/utils/tag-names', 'mobiledoc-markdown-renderer/utils/marker-types'], function (exports, _mobiledocMarkdownRendererUtilsDom, _mobiledocMarkdownRendererCardsImage, _mobiledocMarkdownRendererUtilsRenderType, _mobiledocMarkdownRendererUtilsSectionTypes, _mobiledocMarkdownRendererUtilsTagNames, _mobiledocMarkdownRendererUtilsMarkerTypes) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var MOBILEDOC_VERSION = '0.3.0';

  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  /**
   * runtime Markdown renderer
   * renders a mobiledoc to Markdown (string)
   *
   * input: mobiledoc
   * output: Markdown (string)
   */

  function createElementFromMarkerType() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? ['', []] : arguments[0];

    var _ref2 = _slicedToArray(_ref, 2);

    var tagName = _ref2[0];
    var attributes = _ref2[1];

    var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)(tagName);
    attributes = attributes || [];

    for (var i = 0, l = attributes.length; i < l; i = i + 2) {
      var propName = attributes[i],
          propValue = attributes[i + 1];
      (0, _mobiledocMarkdownRendererUtilsDom.setAttribute)(element, propName, propValue);
    }
    return element;
  }

  function validateVersion(version) {
    if (version !== MOBILEDOC_VERSION) {
      throw new Error('Unexpected Mobiledoc version "' + version + '"');
    }
  }

  var Renderer = (function () {
    function Renderer(mobiledoc, state) {
      _classCallCheck(this, Renderer);

      var cards = state.cards;
      var cardOptions = state.cardOptions;
      var atoms = state.atoms;
      var unknownCardHandler = state.unknownCardHandler;
      var unknownAtomHandler = state.unknownAtomHandler;
      var version = mobiledoc.version;
      var sections = mobiledoc.sections;
      var atomTypes = mobiledoc.atoms;
      var cardTypes = mobiledoc.cards;
      var markerTypes = mobiledoc.markups;

      validateVersion(version);

      this.root = (0, _mobiledocMarkdownRendererUtilsDom.createDocumentFragment)();
      this.sections = sections;
      this.atomTypes = atomTypes;
      this.cardTypes = cardTypes;
      this.markerTypes = markerTypes;
      this.cards = cards;
      this.atoms = atoms;
      this.cardOptions = cardOptions;
      this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;
      this.unknownAtomHandler = unknownAtomHandler || this._defaultUnknownAtomHandler;

      this._teardownCallbacks = [];
    }

    _createClass(Renderer, [{
      key: 'render',
      value: function render() {
        var _this = this;

        this.sections.forEach(function (section) {
          var rendered = _this.renderSection(section);
          if (rendered) {
            (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(_this.root, rendered);
          }
        });

        return { result: this.root.toString(), teardown: function teardown() {
            return _this.teardown();
          } };
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        for (var i = 0; i < this._teardownCallbacks.length; i++) {
          this._teardownCallbacks[i]();
        }
      }
    }, {
      key: 'renderSection',
      value: function renderSection(section) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
            return this.renderMarkupSection(section);
          case _mobiledocMarkdownRendererUtilsSectionTypes.IMAGE_SECTION_TYPE:
            return this.renderImageSection(section);
          case _mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE:
            return this.renderListSection(section);
          case _mobiledocMarkdownRendererUtilsSectionTypes.CARD_SECTION_TYPE:
            return this.renderCardSection(section);
          default:
            throw new Error('Renderer cannot render type "' + type + '"');
        }
      }
    }, {
      key: 'renderListSection',
      value: function renderListSection(_ref3) {
        var _this2 = this;

        var _ref32 = _slicedToArray(_ref3, 3);

        var type = _ref32[0];
        var tagName = _ref32[1];
        var items = _ref32[2];

        if (!(0, _mobiledocMarkdownRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE)) {
          return;
        }
        var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)(tagName);
        if (tagName.toLowerCase() === 'ol') {
          for (var i = 0; i < items.length; i++) {
            var li = items[i];
            (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(element, this.renderListItem(li, i + 1));
          }
        } else {
          items.forEach(function (li) {
            (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(element, _this2.renderListItem(li));
          });
        }
        return element;
      }
    }, {
      key: 'renderListItem',
      value: function renderListItem(markers) {
        var position = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)('li');
        if (position !== null) {
          (0, _mobiledocMarkdownRendererUtilsDom.setAttribute)(element, 'position', position);
        }
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: 'renderImageSection',
      value: function renderImageSection(_ref4) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var type = _ref42[0];
        var url = _ref42[1];

        var element = (0, _mobiledocMarkdownRendererUtilsDom.createElement)('img');
        (0, _mobiledocMarkdownRendererUtilsDom.setAttribute)(element, 'src', url);
        return element;
      }
    }, {
      key: 'findCard',
      value: function findCard(name) {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].name === name) {
            return this.cards[i];
          }
        }
        if (name === _mobiledocMarkdownRendererCardsImage['default'].name) {
          return _mobiledocMarkdownRendererCardsImage['default'];
        }
        return this._createUnknownCard(name);
      }
    }, {
      key: '_findCardByIndex',
      value: function _findCardByIndex(index) {
        var cardType = this.cardTypes[index];
        if (!cardType) {
          throw new Error('No card definition found at index ' + index);
        }

        var _cardType = _slicedToArray(cardType, 2);

        var name = _cardType[0];
        var payload = _cardType[1];

        var card = this.findCard(name);

        return {
          card: card,
          payload: payload
        };
      }
    }, {
      key: '_createUnknownCard',
      value: function _createUnknownCard(name) {
        return {
          name: name,
          type: _mobiledocMarkdownRendererUtilsRenderType['default'],
          render: this.unknownCardHandler
        };
      }
    }, {
      key: 'renderCardSection',
      value: function renderCardSection(_ref5) {
        var _ref52 = _slicedToArray(_ref5, 2);

        var type = _ref52[0];
        var index = _ref52[1];

        var _findCardByIndex2 = this._findCardByIndex(index);

        var card = _findCardByIndex2.card;
        var payload = _findCardByIndex2.payload;

        var cardWrapper = this._createCardElement();
        var cardArg = this._createCardArgument(card, payload);
        var rendered = card.render(cardArg);

        this._validateCardRender(rendered, card.name);

        if (rendered) {
          (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(cardWrapper, rendered);
        }

        return cardWrapper;
      }
    }, {
      key: '_registerTeardownCallback',
      value: function _registerTeardownCallback(callback) {
        this._teardownCallbacks.push(callback);
      }
    }, {
      key: '_createCardArgument',
      value: function _createCardArgument(card) {
        var _this3 = this;

        var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var env = {
          name: card.name,
          isInEditor: false,
          onTeardown: function onTeardown(callback) {
            return _this3._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, payload: payload };
      }
    }, {
      key: '_validateCardRender',
      value: function _validateCardRender(rendered, cardName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Card "' + cardName + '" must render ' + _mobiledocMarkdownRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_createCardElement',
      value: function _createCardElement() {
        return (0, _mobiledocMarkdownRendererUtilsDom.createElement)('div');
      }
    }, {
      key: 'renderMarkupSection',
      value: function renderMarkupSection(_ref6) {
        var _ref62 = _slicedToArray(_ref6, 3);

        var type = _ref62[0];
        var tagName = _ref62[1];
        var markers = _ref62[2];

        if (!(0, _mobiledocMarkdownRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE)) {
          return;
        }
        var renderer = _mobiledocMarkdownRendererUtilsDom.createElement;
        var element = renderer(tagName);
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: 'findAtom',
      value: function findAtom(name) {
        for (var i = 0; i < this.atoms.length; i++) {
          if (this.atoms[i].name === name) {
            return this.atoms[i];
          }
        }
        return this._createUnknownAtom(name);
      }
    }, {
      key: '_createUnknownAtom',
      value: function _createUnknownAtom(name) {
        return {
          name: name,
          type: _mobiledocMarkdownRendererUtilsRenderType['default'],
          render: this.unknownAtomHandler
        };
      }
    }, {
      key: '_createAtomArgument',
      value: function _createAtomArgument(atom, value, payload) {
        var _this4 = this;

        var env = {
          name: atom.name,
          onTeardown: function onTeardown(callback) {
            return _this4._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, value: value, payload: payload };
      }
    }, {
      key: '_validateAtomRender',
      value: function _validateAtomRender(rendered, atomName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Atom "' + atomName + '" must render ' + _mobiledocMarkdownRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_findAtomByIndex',
      value: function _findAtomByIndex(index) {
        var atomType = this.atomTypes[index];
        if (!atomType) {
          throw new Error('No atom definition found at index ' + index);
        }

        var _atomType = _slicedToArray(atomType, 3);

        var name = _atomType[0];
        var value = _atomType[1];
        var payload = _atomType[2];

        var atom = this.findAtom(name);

        return {
          atom: atom,
          value: value,
          payload: payload
        };
      }
    }, {
      key: '_renderAtom',
      value: function _renderAtom(index) {
        var _findAtomByIndex2 = this._findAtomByIndex(index);

        var atom = _findAtomByIndex2.atom;
        var value = _findAtomByIndex2.value;
        var payload = _findAtomByIndex2.payload;

        var atomArg = this._createAtomArgument(atom, value, payload);
        var rendered = atom.render(atomArg);

        this._validateAtomRender(rendered, atom.name);

        return rendered || (0, _mobiledocMarkdownRendererUtilsDom.createTextNode)('');
      }
    }, {
      key: '_renderMarkersOnElement',
      value: function _renderMarkersOnElement(element, markers) {
        var elements = [element];
        var currentElement = element;

        for (var i = 0, l = markers.length; i < l; i++) {
          var marker = markers[i];

          var _marker = _slicedToArray(marker, 4);

          var type = _marker[0];
          var openTypes = _marker[1];
          var closeCount = _marker[2];
          var value = _marker[3];

          for (var j = 0, m = openTypes.length; j < m; j++) {
            var markerType = this.markerTypes[openTypes[j]];

            var _markerType = _slicedToArray(markerType, 1);

            var tagName = _markerType[0];

            if ((0, _mobiledocMarkdownRendererUtilsTagNames.isValidMarkerType)(tagName)) {
              var openedElement = createElementFromMarkerType(markerType);
              (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(currentElement, openedElement);
              elements.push(openedElement);
              currentElement = openedElement;
            } else {
              closeCount--;
            }
          }

          switch (type) {
            case _mobiledocMarkdownRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE:
              (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(currentElement, (0, _mobiledocMarkdownRendererUtilsDom.createTextNode)(value));
              break;
            case _mobiledocMarkdownRendererUtilsMarkerTypes.ATOM_MARKER_TYPE:
              (0, _mobiledocMarkdownRendererUtilsDom.appendChild)(currentElement, this._renderAtom(value));
              break;
            default:
              throw new Error('Unknown markup type (' + type + ')');
          }

          for (var j = 0, m = closeCount; j < m; j++) {
            elements.pop();
            currentElement = elements[elements.length - 1];
          }
        }
      }
    }, {
      key: '_defaultUnknownCardHandler',
      get: function get() {
        return function (_ref7) {
          var name = _ref7.env.name;

          throw new Error('Card "' + name + '" not found but no unknownCardHandler was registered');
        };
      }
    }, {
      key: '_defaultUnknownAtomHandler',
      get: function get() {
        return function (_ref8) {
          var name = _ref8.env.name;

          throw new Error('Atom "' + name + '" not found but no unknownAtomHandler was registered');
        };
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;
});
define('mobiledoc-markdown-renderer/utils/dom', ['exports'], function (exports) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.createElement = createElement;
  exports.appendChild = appendChild;
  exports.createTextNode = createTextNode;
  exports.setAttribute = setAttribute;
  exports.createDocumentFragment = createDocumentFragment;
  exports.normalizeTagName = normalizeTagName;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Element = (function () {
    function Element(tagName) {
      _classCallCheck(this, Element);

      this.tagName = tagName.toLowerCase();
      this.childNodes = [];
      this.attributes = [];
    }

    _createClass(Element, [{
      key: 'appendChild',
      value: function appendChild(element) {
        this.childNodes.push(element);
      }
    }, {
      key: 'setAttribute',
      value: function setAttribute(propName, propValue) {
        this.attributes.push(propName, propValue);
      }
    }, {
      key: 'toString',
      value: function toString() {

        var markdown = '';

        // opening tags
        switch (this.tagName.toLowerCase()) {
          case 'b':
          case 'strong':
            markdown += '**';
            break;
          case 'i':
          case 'em':
            markdown += '*';
            break;
          case 's':
            markdown += '~~';
            break;
          case 'h1':
            markdown += '# ';
            break;
          case 'h2':
            markdown += '## ';
            break;
          case 'h3':
            markdown += '### ';
            break;
          case 'h4':
            markdown += '#### ';
            break;
          case 'a':
            markdown += '[';
            break;
          case 'img':
            markdown += '![';
            break;
          case 'li':
            if (this.attributes.indexOf('position') !== -1) {
              var positionIndex = this.attributes.indexOf('position') + 1;
              var position = this.attributes[positionIndex];
              markdown += position + '. ';
            } else {
              markdown += '* ';
            }
            break;
          case 'blockquote':
            markdown += '> ';
            break;
        }

        // child nodes
        for (var i = 0; i < this.childNodes.length; i++) {
          markdown += this.childNodes[i].toString();
        }

        // closing tags
        switch (this.tagName.toLowerCase()) {
          case 'b':
          case 'strong':
            markdown += '**';
            break;
          case 'i':
          case 'em':
            markdown += '*';
            break;
          case 's':
            markdown += '~~';
            break;
          case 'a':
            markdown += ']';
            if (this.attributes.indexOf('href') !== -1) {
              var urlIndex = this.attributes.indexOf('href') + 1;
              markdown += '(' + this.attributes[urlIndex] + ')';
            }
            break;
          case 'img':
            markdown += ']';
            if (this.attributes.indexOf('src') !== -1) {
              var srcIndex = this.attributes.indexOf('src') + 1;
              markdown += '(' + this.attributes[srcIndex] + ')';
            }
            break;
          case 'li':
            markdown += '\n';
            break;
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'p':
          case 'blockquote':
            markdown += '\n\n';
            break;
        }

        return markdown;
      }
    }]);

    return Element;
  })();

  var TextNode = (function () {
    function TextNode(value) {
      _classCallCheck(this, TextNode);

      this.value = value;
    }

    _createClass(TextNode, [{
      key: 'toString',
      value: function toString() {
        return this.value;
      }
    }]);

    return TextNode;
  })();

  function createElement(tagName) {
    return new Element(tagName);
  }

  function appendChild(target, child) {
    target.appendChild(child);
  }

  function createTextNode(text) {
    return new TextNode(text);
  }

  function setAttribute(element, propName, propValue) {
    element.setAttribute(propName, propValue);
  }

  function createDocumentFragment() {
    return createElement('div');
  }

  function normalizeTagName(name) {
    return name.toLowerCase();
  }
});
define("mobiledoc-markdown-renderer/utils/marker-types", ["exports"], function (exports) {
  "use strict";

  var MARKUP_MARKER_TYPE = 0;
  exports.MARKUP_MARKER_TYPE = MARKUP_MARKER_TYPE;
  var ATOM_MARKER_TYPE = 1;
  exports.ATOM_MARKER_TYPE = ATOM_MARKER_TYPE;
});
define('mobiledoc-markdown-renderer/utils/render-type', ['exports'], function (exports) {
  'use strict';

  exports['default'] = 'markdown';
});
define("mobiledoc-markdown-renderer/utils/section-types", ["exports"], function (exports) {
  "use strict";

  var MARKUP_SECTION_TYPE = 1;
  exports.MARKUP_SECTION_TYPE = MARKUP_SECTION_TYPE;
  var IMAGE_SECTION_TYPE = 2;
  exports.IMAGE_SECTION_TYPE = IMAGE_SECTION_TYPE;
  var LIST_SECTION_TYPE = 3;
  exports.LIST_SECTION_TYPE = LIST_SECTION_TYPE;
  var CARD_SECTION_TYPE = 10;
  exports.CARD_SECTION_TYPE = CARD_SECTION_TYPE;
});
define('mobiledoc-markdown-renderer/utils/tag-names', ['exports', 'mobiledoc-markdown-renderer/utils/section-types', 'mobiledoc-markdown-renderer/utils/dom'], function (exports, _mobiledocMarkdownRendererUtilsSectionTypes, _mobiledocMarkdownRendererUtilsDom) {
  'use strict';

  exports.isValidSectionTagName = isValidSectionTagName;
  exports.isValidMarkerType = isValidMarkerType;

  var MARKUP_SECTION_TAG_NAMES = ['p', 'h1', 'h2', 'h3', 'blockquote', 'pull-quote'].map(_mobiledocMarkdownRendererUtilsDom.normalizeTagName);

  var LIST_SECTION_TAG_NAMES = ['ul', 'ol'].map(_mobiledocMarkdownRendererUtilsDom.normalizeTagName);

  var MARKUP_TYPES = ['b', 'i', 'strong', 'em', 'a', 'u', 'sub', 'sup', 's'].map(_mobiledocMarkdownRendererUtilsDom.normalizeTagName);

  function contains(array, item) {
    return array.indexOf(item) !== -1;
  }

  function isValidSectionTagName(tagName, sectionType) {
    tagName = (0, _mobiledocMarkdownRendererUtilsDom.normalizeTagName)(tagName);

    switch (sectionType) {
      case _mobiledocMarkdownRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
        return contains(MARKUP_SECTION_TAG_NAMES, tagName);
      case _mobiledocMarkdownRendererUtilsSectionTypes.LIST_SECTION_TYPE:
        return contains(LIST_SECTION_TAG_NAMES, tagName);
      default:
        throw new Error('Cannot validate tagName for unknown section type "' + sectionType + '"');
    }
  }

  function isValidMarkerType(type) {
    type = (0, _mobiledocMarkdownRendererUtilsDom.normalizeTagName)(type);
    return contains(MARKUP_TYPES, type);
  }
});
require("mobiledoc-markdown-renderer")["registerGlobal"](window, document);
})();
//# sourceMappingURL=mobiledoc-markdown-renderer.map