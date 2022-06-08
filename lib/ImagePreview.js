"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _modal = _interopRequireDefault(require("antd/lib/modal"));

var _carousel = _interopRequireDefault(require("antd/lib/carousel"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function isGood(className) {
  return /\bgood\b/i.test(className);
}

function isBad(className) {
  return /\bbad\b/i.test(className);
}

function isInline(className) {
  return /\binline\b/i.test(className);
}

function PreviewImageBox(_ref) {
  var cover = _ref.cover,
      coverMeta = _ref.coverMeta,
      imgs = _ref.imgs,
      style = _ref.style,
      previewVisible = _ref.previewVisible,
      comparable = _ref.comparable,
      onClick = _ref.onClick,
      onCancel = _ref.onCancel;
  var onlyOneImg = comparable || imgs.length === 1;
  var imageWrapperClassName = (0, _classnames["default"])('preview-image-wrapper', {
    good: coverMeta.isGood,
    bad: coverMeta.isBad
  });
  return _react["default"].createElement("div", {
    className: "preview-image-box",
    style: style
  }, _react["default"].createElement("div", {
    onClick: onClick,
    className: imageWrapperClassName
  }, _react["default"].createElement("img", {
    className: coverMeta.className,
    src: coverMeta.src,
    alt: coverMeta.alt
  })), _react["default"].createElement("div", {
    className: "preview-image-title"
  }, coverMeta.alt), _react["default"].createElement("div", {
    className: "preview-image-description",
    dangerouslySetInnerHTML: {
      __html: coverMeta.description
    }
  }), _react["default"].createElement(_modal["default"], {
    className: "image-modal",
    width: 960,
    visible: previewVisible,
    title: null,
    footer: null,
    onCancel: onCancel
  }, _react["default"].createElement(_carousel["default"], {
    className: "".concat(onlyOneImg ? 'image-modal-single' : ''),
    draggable: !onlyOneImg,
    adaptiveHeight: true
  }, comparable ? cover : imgs), _react["default"].createElement("div", {
    className: "preview-image-title"
  }, coverMeta.alt)));
}

var ImagePreview =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(ImagePreview, _React$Component);

  function ImagePreview(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ImagePreview);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ImagePreview).call(this, props));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleCancel", function () {
      _this.setState({
        leftVisible: false,
        rightVisible: false
      });
    });
    _this.state = {
      leftVisible: false,
      rightVisible: false
    };
    _this.handleLeftClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this), 'left');
    _this.handleRightClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this), 'right');
    return _this;
  }

  (0, _createClass2["default"])(ImagePreview, [{
    key: "handleClick",
    value: function handleClick(side) {
      this.setState((0, _defineProperty2["default"])({}, "".concat(side, "Visible"), true));
    }
  }, {
    key: "render",
    value: function render() {
      var imgs = this.props.imgs;
      var imgsMeta = imgs.map(function (img) {
        var alt = img.alt,
            description = img.description,
            src = img.src;
        var imgClassName = img["class"];
        return {
          className: imgClassName,
          alt: alt,
          description: description,
          src: src,
          isGood: isGood(imgClassName),
          isBad: isBad(imgClassName),
          inline: isInline(imgClassName)
        };
      });
      var imagesList = imgsMeta.map(function (meta, index) {
        var metaCopy = _objectSpread({}, meta);

        delete metaCopy.description;
        delete metaCopy.isGood;
        delete metaCopy.isBad;
        return _react["default"].createElement("div", {
          key: index
        }, _react["default"].createElement("div", {
          className: "image-modal-container"
        }, _react["default"].createElement("img", (0, _extends2["default"])({}, metaCopy, {
          alt: meta.alt
        }))));
      });
      var comparable = imgs.length === 2 && (imgsMeta[0].isGood || imgsMeta[0].isBad || imgsMeta[0].inline) && (imgsMeta[1].isGood || imgsMeta[1].isBad || imgsMeta[1].inline);
      var style = comparable ? {
        width: '50%'
      } : null;
      var hasCarousel = imgs.length > 1 && !comparable;
      var previewClassName = (0, _classnames["default"])({
        'preview-image-boxes': true,
        clearfix: true,
        'preview-image-boxes-compare': comparable,
        'preview-image-boxes-with-carousel': hasCarousel
      });
      return _react["default"].createElement("div", {
        className: previewClassName
      }, _react["default"].createElement(PreviewImageBox, {
        style: style,
        comparable: comparable,
        previewVisible: this.state.leftVisible,
        cover: imagesList[0],
        coverMeta: imgsMeta[0],
        imgs: imagesList,
        onClick: this.handleLeftClick,
        onCancel: this.handleCancel
      }), comparable && _react["default"].createElement(PreviewImageBox, {
        style: style,
        comparable: true,
        previewVisible: this.state.rightVisible,
        cover: imagesList[1],
        coverMeta: imgsMeta[1],
        imgs: imagesList,
        onClick: this.handleRightClick,
        onCancel: this.handleCancel
      }));
    }
  }]);
  return ImagePreview;
}(_react["default"].Component);

exports["default"] = ImagePreview;