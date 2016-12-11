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