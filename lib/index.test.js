'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

require('./index.test.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mockData = [{
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
}];

var mockData2 = [{
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
}, {
  text: '测试数据测试数据测试数据',
  img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
}];

var Test = function (_React$Component) {
  _inherits(Test, _React$Component);

  function Test() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Test);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Test.__proto__ || Object.getPrototypeOf(Test)).call.apply(_ref, [this].concat(args))), _this), _this.onBottomLoad = function (SwipeLoad) {
      console.log('on bottom load'); // eslint-disable-line
      SwipeLoad.reset();
    }, _this.onTopRefresh = function (SwipeLoad) {
      console.log('on top refresh'); // eslint-disable-line
      // location.reload();
      setTimeout(function () {
        return SwipeLoad.reset();
      }, 1500);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Test, [{
    key: 'render',
    value: function render() {
      var porps = {
        onBottomLoad: this.onBottomLoad,
        onTopRefresh: this.onTopRefresh
      };

      return _react2.default.createElement(
        _index2.default,
        porps,
        mockData.map(function (item, index) {
          return _react2.default.createElement(
            'div',
            { className: 'item', key: index, href: '#' },
            _react2.default.createElement(
              'h3',
              null,
              item.text + '  ' + index
            ),
            _react2.default.createElement('img', { src: item.img, alt: '' })
          );
        })
      );
    }
  }]);

  return Test;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(Test, null), document.getElementById('app'));