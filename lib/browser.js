"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactRouter = require("react-router");

var _jsonmlToReactElement = _interopRequireDefault(require("jsonml-to-react-element"));

var _utils = _interopRequireDefault(require("jsonml.js/lib/utils"));

var _VideoPlayer = _interopRequireDefault(require("./VideoPlayer"));

var _ImagePreview = _interopRequireDefault(require("./ImagePreview"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function isHeading(node) {
  return /h[1-6]/i.test(_utils["default"].getTagName(node));
}

function isZhCN(pathname) {
  return /-cn\/?$/.test(pathname);
}

function makeSureComonentsLink(pathname) {
  var pathSnippets = pathname.split('#');

  if (pathSnippets[0].indexOf('/components') > -1 && !pathSnippets[0].endsWith('/')) {
    pathSnippets[0] = "".concat(pathSnippets[0], "/");
  }

  return pathSnippets.join('#');
}

function toZhCNPathname(pathname) {
  var pathSnippets = pathname.split('#');
  pathSnippets[0] = "".concat(pathSnippets[0].replace(/\/$/, ''), "-cn");
  return makeSureComonentsLink(pathSnippets.join('#'));
}

function generateSluggedId(children) {
  var headingText = children.map(function (node) {
    if (_utils["default"].isElement(node)) {
      if (_utils["default"].hasAttributes(node)) {
        return node[2] || '';
      }

      return node[1] || '';
    }

    return node;
  }).join('');
  var sluggedId = headingText.trim().replace(/\s+/g, '-');
  return sluggedId;
} // export default doesn't work


module.exports = function (_, props) {
  return {
    converters: [[function (node) {
      return _utils["default"].isElement(node) && isHeading(node);
    }, function (node, index) {
      var children = _utils["default"].getChildren(node);

      var sluggedId = generateSluggedId(children);
      var hash = sluggedId.replace(/[?.]$/g, '');
      return _react["default"].createElement(_utils["default"].getTagName(node), _objectSpread({
        key: index,
        id: sluggedId
      }, _utils["default"].getAttributes(node)), [_react["default"].createElement("span", {
        key: "title"
      }, children.map(function (child) {
        return (0, _jsonmlToReactElement["default"])(child);
      })), _react["default"].createElement("a", {
        href: "#".concat(hash),
        className: "anchor",
        key: "anchor"
      }, "#")]);
    }], [function (node) {
      return _utils["default"].isElement(node) && _utils["default"].getTagName(node) === 'video';
    }, function (node, index) {
      return _react["default"].createElement(_VideoPlayer["default"], {
        video: _utils["default"].getAttributes(node),
        key: index
      });
    }], [function (node) {
      return _utils["default"].isElement(node) && _utils["default"].getTagName(node) === 'a' && !(_utils["default"].getAttributes(node)["class"] || _utils["default"].getAttributes(node).href && _utils["default"].getAttributes(node).href.indexOf('http') === 0 || /^#/.test(_utils["default"].getAttributes(node).href));
    }, function (node, index) {
      var _JsonML$getAttributes = _utils["default"].getAttributes(node),
          href = _JsonML$getAttributes.href;

      return _react["default"].createElement(_reactRouter.Link, {
        to: isZhCN(props.location.pathname) ? toZhCNPathname(href) : makeSureComonentsLink(href),
        key: index
      }, (0, _jsonmlToReactElement["default"])(_utils["default"].getChildren(node)[0]));
    }], [function (node) {
      return _utils["default"].isElement(node) && _utils["default"].getTagName(node) === 'p' && _utils["default"].getTagName(_utils["default"].getChildren(node)[0]) === 'img' && /preview-img/gi.test(_utils["default"].getAttributes(_utils["default"].getChildren(node)[0])["class"]);
    }, function (node, index) {
      var imgs = _utils["default"].getChildren(node).filter(function (img) {
        return _utils["default"].isElement(img) && Object.keys(_utils["default"].getAttributes(img)).length > 0;
      }).map(function (img) {
        return _utils["default"].getAttributes(img);
      });

      return _react["default"].createElement(_ImagePreview["default"], {
        imgs: imgs,
        key: index
      });
    }]]
  };
};