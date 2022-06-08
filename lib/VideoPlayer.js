"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = VideoPlayer;

var _react = _interopRequireDefault(require("react"));

var _reactSublimeVideo = _interopRequireDefault(require("react-sublime-video"));

function VideoPlayer(_ref) {
  var video = _ref.video;
  var alt = video.alt,
      description = video.description,
      src = video.src;
  var videoClassName = video["class"];
  return _react["default"].createElement("div", {
    className: "preview-image-box ".concat(videoClassName)
  }, _react["default"].createElement("div", {
    className: 'preview-image-wrapper'
  }, _react["default"].createElement(_reactSublimeVideo["default"], {
    src: src,
    type: "video/mp4",
    loop: true
  })), _react["default"].createElement("div", {
    className: "preview-image-title"
  }, alt), _react["default"].createElement("div", {
    className: "preview-image-description",
    dangerouslySetInnerHTML: {
      __html: description
    }
  }));
}