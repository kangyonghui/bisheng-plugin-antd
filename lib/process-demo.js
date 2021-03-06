"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var fs = require('fs');

var path = require('path');

var JsonML = require('jsonml.js/lib/utils');

var Prism = require('prismjs');

var nunjucks = require('nunjucks');

var postcss = require('postcss');

var _require = require('sylvanas'),
    parseText = _require.parseText;

var pxtoremPlugin = require('postcss-pxtorem');

require('prismjs/components/prism-jsx');

require('prismjs/components/prism-tsx');

nunjucks.configure({
  autoescape: false
});

var transformer = require('bisheng-plugin-react/lib/transformer');

var tmpl = fs.readFileSync(path.join(__dirname, 'template.html')).toString();
var watchLoader = path.join(__dirname, './loader/watch');

function isStyleTag(node) {
  return node && JsonML.getTagName(node) === 'style';
}

function getCode(node) {
  return JsonML.getChildren(JsonML.getChildren(node)[0])[0];
}

function getChineseIntroStart(contentChildren) {
  return contentChildren.findIndex(function (node) {
    return JsonML.getTagName(node) === 'h2' && JsonML.getChildren(node)[0] === 'zh-CN';
  });
}

function getEnglishIntroStart(contentChildren) {
  return contentChildren.findIndex(function (node) {
    return JsonML.getTagName(node) === 'h2' && JsonML.getChildren(node)[0] === 'en-US';
  });
}

function getCodeIndex(contentChildren) {
  return contentChildren.findIndex(function (node) {
    return JsonML.getTagName(node) === 'pre' && ['jsx', 'tsx'].includes(JsonML.getAttributes(node).lang);
  });
}

function getCorrespondingTSX(filename) {
  return path.join(process.cwd(), filename.replace(/\.md$/i, '.tsx'));
}

function getSourceCodeObject(contentChildren, codeIndex) {
  if (codeIndex > -1) {
    return {
      isES6: true,
      code: getCode(contentChildren[codeIndex]),
      lang: JsonML.getAttributes(contentChildren[codeIndex]).lang
    };
  }

  return {
    isTS: true
  };
}

function getStyleNode(contentChildren) {
  return contentChildren.filter(function (node) {
    return isStyleTag(node) || JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'css';
  })[0];
}

function getHighlightCodes(_ref) {
  var code = _ref.code,
      lang = _ref.lang;
  var codes = {};
  codes[lang] = Prism.highlight(code, Prism.languages[lang]);

  if (lang === 'tsx') {
    codes = _objectSpread({}, codes, {}, getHighlightCodes({
      code: parseText(code),
      lang: 'jsx'
    }));
  }

  return codes;
}

module.exports = function (_ref2) {
  var markdownData = _ref2.markdownData,
      isBuild = _ref2.isBuild,
      noPreview = _ref2.noPreview,
      babelConfig = _ref2.babelConfig,
      pxtorem = _ref2.pxtorem,
      injectProvider = _ref2.injectProvider;
  var meta = markdownData.meta;
  meta.id = meta.filename.replace(/\.md$/, '').replace(/\//g, '-'); // Should throw debugging demo while publish.

  if (isBuild && meta.debug) {
    return {
      meta: {}
    };
  } // Update content of demo.


  var contentChildren = JsonML.getChildren(markdownData.content);
  var chineseIntroStart = getChineseIntroStart(contentChildren);
  var englishIntroStart = getEnglishIntroStart(contentChildren);
  var codeIndex = getCodeIndex(contentChildren);
  var introEnd = codeIndex === -1 ? contentChildren.length : codeIndex;

  if (chineseIntroStart > -1
  /* equal to englishIntroStart > -1 */
  ) {
      markdownData.content = {
        'zh-CN': contentChildren.slice(chineseIntroStart + 1, englishIntroStart),
        'en-US': contentChildren.slice(englishIntroStart + 1, introEnd)
      };
    } else {
    markdownData.content = contentChildren.slice(0, introEnd);
  }

  var sourceCodeObject = getSourceCodeObject(contentChildren, codeIndex);

  if (sourceCodeObject.isES6) {
    markdownData.highlightedCode = contentChildren[codeIndex].slice(0, 2);
    markdownData.highlightedCodes = getHighlightCodes(sourceCodeObject);

    if (!noPreview) {
      markdownData.preview = {
        __BISHENG_EMBEDED_CODE: true,
        code: transformer(sourceCodeObject.code, babelConfig)
      };
    }
  } else {
    // TODO: use loader's `this.dependencies` to watch
    var requireString = "require('!!babel!".concat(watchLoader, "!").concat(getCorrespondingTSX(meta.filename), "')");
    markdownData.highlightedCode = {
      __BISHENG_EMBEDED_CODE: true,
      code: "".concat(requireString, ".highlightedCode")
    };
    markdownData.preview = {
      __BISHENG_EMBEDED_CODE: true,
      code: "".concat(requireString, ".preview")
    };
  } // Add style node to markdown data.


  var styleNode = getStyleNode(contentChildren);

  if (isStyleTag(styleNode)) {
    markdownData.style = JsonML.getChildren(styleNode)[0];
  } else if (styleNode) {
    var styleTag = contentChildren.filter(isStyleTag)[0];
    var originalStyle = getCode(styleNode) + (styleTag ? JsonML.getChildren(styleTag)[0] : '');

    if (pxtorem) {
      originalStyle = postcss(pxtoremPlugin({
        rootValue: 50,
        propList: ['*']
      })).process(originalStyle).css;
    }

    markdownData.style = originalStyle;
    markdownData.highlightedStyle = JsonML.getAttributes(styleNode).highlighted;
  }

  if (meta.iframe) {
    var html = nunjucks.renderString(tmpl, {
      id: meta.id,
      style: markdownData.style,
      script: markdownData.preview.code,
      reactRouter: meta.reactRouter === 'react-router' ? 'react-router@3.2.1/umd/ReactRouter' : meta.reactRouter === 'react-router-dom' ? 'react-router-dom@4/umd/react-router-dom' : false,
      injectProvider: !!injectProvider
    });
    var fileName = "demo-".concat(Math.random(), ".html");
    fs.writeFile(path.join(process.cwd(), '_site', fileName), html, function () {});
    markdownData.src = path.join('/', fileName);
  }

  return markdownData;
};