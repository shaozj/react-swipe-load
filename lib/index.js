'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _event = require('./event');

require('./index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SwipeLoad = function (_React$Component) {
  _inherits(SwipeLoad, _React$Component);

  function SwipeLoad(props) {
    _classCallCheck(this, SwipeLoad);

    var _this = _possibleConstructorReturn(this, (SwipeLoad.__proto__ || Object.getPrototypeOf(SwipeLoad)).call(this, props));

    _this.state = {
      topState: 'normal', // 'normal', 'pull', 'update', 'loading'
      bottomState: 'normal', // 'normal', 'pull', 'loading', 'noData'
      topDomHeight: 0 // 顶部下拉刷新节点的高度
    };
    return _this;
  }

  _createClass(SwipeLoad, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this._scrollNode = document.body; // 写死滚动区域为 body
      this._topNode = this.refs.topNode;
      this._bottomNode = this.refs.bottomNode;
      var scrollNode = this._scrollNode;

      // 获取win显示区高度
      this._windowHeight = document.documentElement.clientHeight;

      this.autoLoad();

      // 监听窗口调整
      (0, _event.on)(window, 'resize', function () {
        clearTimeout(_this2.timer);
        _this2.timer = setTimeout(function () {
          // 重新获取win显示区高度
          _this2._windowHeight = document.documentElement.clientHeight;
          _this2.autoLoad();
        }, 150);
      });

      // 监听触摸事件
      (0, _event.on)(scrollNode, 'touchstart', function (e) {
        if (!_this2.loading) {
          _this2.onTouchstart(e);
        }
      });

      (0, _event.on)(scrollNode, 'touchmove', function (e) {
        if (!_this2.loading) {
          _this2.onTouchmove(e);
        }
      });

      (0, _event.on)(scrollNode, 'touchend', function (e) {
        if (!_this2.loading) {
          _this2.onTouchend(e);
        }
      });
    }
  }, {
    key: 'onTouchstart',
    value: function onTouchstart(e) {
      var touch = e.changedTouches[0];
      this._startY = touch.clientY;
      // 滚动内容高度，不放在 onTouchmove 中计算，提高性能
      this._scrollHeight = this._scrollNode.scrollHeight;
    }
  }, {
    key: 'onTouchmove',
    value: function onTouchmove(e) {
      var scrollTop = this._scrollNode.scrollTop; // 滚动距离
      var scrollHeight = this._scrollHeight; // 滚动内容高度
      var winHeight = this._windowHeight; // 窗口高度
      var touch = e.changedTouches[0];
      var curY = touch.clientY;
      var diffY = curY - this._startY;
      var absY = Math.abs(diffY);

      // 去除动画, 为了可以得到下来位移 this._offsetY, 不因为动画而只移动元素高度
      this._topNode.style.transition = '';
      this._topNode.style.WebkitTransition = '';
      this._topNode.style.MozTransition = '';

      // 下拉刷新
      if (diffY > 0 && scrollTop <= 0 && this.props.onTopRefresh) {
        e.preventDefault();
        if (absY <= this.props.topThreshold) {
          this._offsetY = absY;
          this.setState({ topState: 'pull' });
        }
        // 指定距离 < 下拉距离 < 指定距离*2
        else if (absY > this.props.topThreshold && absY <= this.props.topThreshold * 2) {
            this._offsetY = this.props.topThreshold + (absY - this.props.topThreshold) * 0.5;
            this.setState({ topState: 'update' });
          }
          // 下拉距离 > 指定距离*2
          else {
              this._offsetY = this.props.topThreshold + this.props.topThreshold * 0.5 + (absY - this.props.topThreshold * 2) * 0.2;
            }

        this.setState({ topDomHeight: this._offsetY });
      }
    }
  }, {
    key: 'onTouchend',
    value: function onTouchend(e) {
      var scrollTop = this._scrollNode.scrollTop; // 滚动距离
      var scrollHeight = this._scrollHeight; // 滚动内容高度
      var winHeight = this._windowHeight; // 窗口高度
      var touch = e.changedTouches[0];
      var curY = touch.clientY;
      var diffY = curY - this._startY;
      var absY = Math.abs(diffY);

      if (absY > 0) {
        this._place = 'top';
      } else {
        this._place = 'bottom';
      }

      // 下拉刷新
      if (diffY > 0 && scrollTop <= 0 && this.props.onTopRefresh) {
        // 动画
        this._topNode.style.transition = 'all 300ms';
        this._topNode.style.WebkitTransition = 'all 300ms';
        this._topNode.style.MozTransition = 'all 300ms';

        if (absY > this.props.topThreshold) {
          var topDomHeight = this._topNode.children[0] && this._topNode.children[0].clientHeight + 'px' || 0;
          this.setState({ topState: 'loading', topDomHeight: topDomHeight });
          this.loading = true;
          this.props.onTopRefresh(this);
        } else {
          var _topDomHeight = 0;
          this.setState({ topDomHeight: _topDomHeight });
        }
      }
    }

    // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据

  }, {
    key: 'autoLoad',
    value: function autoLoad() {
      // 滚动内容高度
      var scrollContentHeight = this._scrollNode.scrollHeight;
      if (this.props.onBottomLoad && this.props.autoLoad) {
        if (scrollContentHeight - this.props.bottomThreshold <= this._windowHeight) {
          this.loadDown();
        }
      }
    }

    // 加载底部更多内容

  }, {
    key: 'loadDown',
    value: function loadDown() {
      this.props.onBottomLoad && this.props.onBottomLoad();
    }

    // 重置，下拉刷新后，需要重置状态

  }, {
    key: 'reset',
    value: function reset() {
      this.loading = false;
      if (this._place = 'top') {
        var topDomHeight = 0;
        this.setState({ topDomHeight: topDomHeight });
      } else {}
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          topState = _state.topState,
          bottomState = _state.bottomState,
          topDomHeight = _state.topDomHeight;
      var _props = this.props,
          children = _props.children,
          topNode = _props.topNode,
          bottomNode = _props.bottomNode;


      return _react2.default.createElement(
        'div',
        { className: 'uniform-cpnt-SwipeLoad', ref: 'swipeLoadRoot' },
        _react2.default.createElement(
          'div',
          { ref: 'topNode', className: 'sl-top-node', style: { height: topDomHeight } },
          topNode[topState]
        ),
        children,
        _react2.default.createElement(
          'div',
          { ref: 'bottomNode', className: 'sl-bottom-node' },
          bottomNode[bottomState]
        )
      );
    }
  }]);

  return SwipeLoad;
}(_react2.default.Component);

SwipeLoad.propTypes = {
  onTopRefresh: _propTypes2.default.func, // 下拉刷新回调函数
  onBottomLoad: _propTypes2.default.func, // 上拉加载回调函数
  topThreshold: _propTypes2.default.number, // 顶部下拉刷新的阈值距离
  bottomThreshold: _propTypes2.default.number, // 底部提前加载的阈值距离
  topNode: _propTypes2.default.object, // 页面顶部插入的节点，在不同状态下展示不同内容
  bottomNode: _propTypes2.default.object, // 页面底部插入的节点
  autoLoad: _propTypes2.default.bool // 数据不足一屏时是否自定加载
};

SwipeLoad.defaultProps = {
  autoLoad: true,
  topThreshold: 50,
  bottomThreshold: 10,
  bottomNode: {
    normal: '',
    pull: _react2.default.createElement(
      'div',
      null,
      '\u2191\u4E0A\u62C9\u52A0\u8F7D\u66F4\u591A'
    ),
    loading: _react2.default.createElement(
      'div',
      null,
      '\u4E0A\u62C9\u52A0\u8F7D\u4E2D...'
    ),
    noData: _react2.default.createElement(
      'div',
      null,
      '\u6CA1\u6709\u66F4\u591A\u4E86'
    )
  },
  topNode: {
    normal: '',
    pull: _react2.default.createElement(
      'div',
      null,
      '\u2193\u4E0B\u62C9\u5237\u65B0'
    ),
    update: _react2.default.createElement(
      'div',
      null,
      '\u2191\u91CA\u653E\u66F4\u65B0'
    ),
    loading: _react2.default.createElement(
      'div',
      null,
      '\u52A0\u8F7D\u4E2D...'
    )
  }
};

SwipeLoad.displayName = 'SwipeLoad';

exports.default = SwipeLoad;
module.exports = exports['default'];