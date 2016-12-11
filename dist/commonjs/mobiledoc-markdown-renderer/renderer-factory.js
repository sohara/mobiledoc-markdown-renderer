'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _renderers02 = require('./renderers/0-2');

var _renderers03 = require('./renderers/0-3');

var _utilsRenderType = require('./utils/render-type');

function validateCards(cards) {
  if (!Array.isArray(cards)) {
    throw new Error('`cards` must be passed as an array');
  }
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.type !== _utilsRenderType['default']) {
      throw new Error('Card "' + card.name + '" must be of type "' + _utilsRenderType['default'] + '", was "' + card.type + '"');
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
    if (atom.type !== _utilsRenderType['default']) {
      throw new Error('Atom "' + atom.name + '" must be type "' + _utilsRenderType['default'] + '", was "' + atom.type + '"');
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
        case _renderers02.MOBILEDOC_VERSION:
        case undefined:
        case null:
          return new _renderers02['default'](mobiledoc, this.state).render();
        case _renderers03.MOBILEDOC_VERSION:
          return new _renderers03['default'](mobiledoc, this.state).render();
        default:
          throw new Error('Unexpected Mobiledoc version "' + version + '"');
      }
    }
  }]);

  return RendererFactory;
})();

exports['default'] = RendererFactory;