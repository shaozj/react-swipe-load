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

    _this.onWindowResize = function () {
      clearTimeout(_this.timer);
      _this.timer = setTimeout(function () {
        // 重新获取win显示区高度
        _this._windowHeight = document.documentElement.clientHeight;
        _this.autoLoad();
      }, 150);
    };

    _this.onWinScroll = function () {
      var scrollTop = _this._scrollNode.scrollTop; // 滚动距离
      var scrollHeight = _this._scrollNode.scrollHeight; // 滚动内容高度
      var winHeight = _this._windowHeight; // 窗口高度
      // 上拉加载
      if (_this.props.onBottomLoad && !_this.loading && _this.state.bottomState != 'noMoreData' && scrollTop + winHeight > scrollHeight - _this.props.bottomThreshold) {
        _this.loadBottom();
      }
    };

    _this.onTouchstart = function (e) {
      if (_this.loading) {
        return;
      }
      var touch = e.changedTouches[0];
      _this._startY = touch.clientY;
    };

    _this.onTouchmove = function (e) {
      if (_this.loading) {
        return;
      }
      var scrollTop = _this._scrollNode.scrollTop; // 滚动距离
      var touch = e.changedTouches[0];
      var curY = touch.clientY;
      var diffY = curY - _this._startY;
      var absY = Math.abs(diffY);

      // 去除动画, 为了可以得到下来位移 this._offsetY, 不因为动画而只移动元素高度
      _this._topNode.style.transition = '';
      _this._topNode.style.WebkitTransition = '';
      _this._topNode.style.MozTransition = '';

      // 下拉刷新
      if (diffY > 0 && scrollTop <= 0 && _this.props.onTopRefresh) {
        e.preventDefault();
        if (absY <= _this.props.topThreshold) {
          _this._offsetY = absY;
          _this.setState({ topState: 'pull' });
        }
        // 指定距离 < 下拉距离 < 指定距离*2
        else if (absY > _this.props.topThreshold && absY <= _this.props.topThreshold * 2) {
            _this._offsetY = _this.props.topThreshold + (absY - _this.props.topThreshold) * 0.5;
            _this.setState({ topState: 'update' });
          }
          // 下拉距离 > 指定距离*2
          else {
              _this._offsetY = _this.props.topThreshold + _this.props.topThreshold * 0.5 + (absY - _this.props.topThreshold * 2) * 0.2;
            }

        _this.setState({ topDomHeight: _this._offsetY });
      }
    };

    _this.onTouchend = function (e) {
      if (_this.loading) {
        return;
      }
      var scrollTop = _this._scrollNode.scrollTop; // 滚动距离
      var touch = e.changedTouches[0];
      var curY = touch.clientY;
      var diffY = curY - _this._startY;
      var absY = Math.abs(diffY);

      if (absY > 0) {
        _this._place = 'top';
      } else {
        _this._place = 'bottom';
      }

      // 下拉刷新
      if (diffY > 0 && scrollTop <= 0 && _this.props.onTopRefresh) {
        // 动画
        _this._topNode.style.transition = 'all 300ms';
        _this._topNode.style.WebkitTransition = 'all 300ms';
        _this._topNode.style.MozTransition = 'all 300ms';

        if (absY > _this.props.topThreshold) {
          var topDomHeight = _this._topNode.children[0] && _this._topNode.children[0].clientHeight + 'px' || 0;
          _this.setState({ topState: 'loading', topDomHeight: topDomHeight });
          _this.loading = true;
          _this.props.onTopRefresh(_this);
        } else {
          var _topDomHeight = 0;
          _this.setState({ topDomHeight: _topDomHeight });
        }
      }
    };

    _this.state = {
      topState: 'normal', // 'normal', 'pull', 'update', 'loading'
      bottomState: _this.props.noMoreData ? 'normal' : 'pull', // 'normal', 'pull', 'loading', 'noMoreData'
      topDomHeight: 0 // 顶部下拉刷新节点的高度
    };
    return _this;
  }

  _createClass(SwipeLoad, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._scrollNode = document.body; // 写死滚动区域为 body
      this._topNode = this.refs.topNode;
      this._bottomNode = this.refs.bottomNode;
      var scrollNode = this._scrollNode;

      // 获取win显示区高度
      this._windowHeight = document.documentElement.clientHeight;

      this.autoLoad();

      // 监听窗口调整
      (0, _event.on)(window, 'resize', this.onWindowResize);

      // 监听触摸事件
      (0, _event.on)(scrollNode, 'touchstart', this.onTouchstart);
      (0, _event.on)(scrollNode, 'touchmove', this.onTouchmove);
      (0, _event.on)(scrollNode, 'touchend', this.onTouchend);

      // 监听 scroll 事件，在 touch 事件中处理“上拉加载更多”不合理，在页面滚动到底部时可能不会触发加载
      (0, _event.on)(window, 'scroll', this.onWinScroll);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var scrollNode = this._scrollNode;

      (0, _event.off)(scrollNode, 'touchstart', this.onTouchstart);
      (0, _event.off)(scrollNode, 'touchmove', this.onTouchmove);
      (0, _event.off)(scrollNode, 'touchend', this.onTouchend);
      (0, _event.off)(window, 'scroll', this.onWinScroll);
    }

    // 监听窗口滚动事件，加载更多

  }, {
    key: 'loadBottom',


    // 上拉加载更多
    value: function loadBottom() {
      this._place = 'bottom';
      this.loading = true;
      this.setState({ bottomState: 'loading' });
      this.props.onBottomLoad && this.props.onBottomLoad(this);
    }

    // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据

  }, {
    key: 'autoLoad',
    value: function autoLoad() {
      // 滚动内容高度
      var scrollContentHeight = this._scrollNode.scrollHeight;
      if (this.props.onBottomLoad && this.props.autoLoad) {
        if (scrollContentHeight - this.props.bottomThreshold <= this._windowHeight) {
          this.loadBottom();
        }
      }
    }

    // 重置，下拉刷新后，需要重置状态

  }, {
    key: 'reset',
    value: function reset(_ref) {
      var _ref$noMoreData = _ref.noMoreData,
          noMoreData = _ref$noMoreData === undefined ? false : _ref$noMoreData;

      if (this._place === 'top') {
        var topDomHeight = 0;
        this.setState({ topDomHeight: topDomHeight });
      } else if (this._place === 'bottom') {
        this.setState({ bottomState: 'pull' });
      }
      if (noMoreData) {
        this.setState({ bottomState: 'noMoreData' });
      } else {
        this.setState({ bottomState: 'pull' });
      }
      this.loading = false;
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
  autoLoad: _propTypes2.default.bool, // 数据不足一屏时是否自定加载
  noMoreData: _propTypes2.default.bool // 是否没有更多数据了
};

SwipeLoad.defaultProps = {
  autoLoad: true,
  topThreshold: 50,
  bottomThreshold: 30,
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
    noMoreData: _react2.default.createElement(
      'div',
      null,
      '\u6CA1\u6709\u66F4\u591A\u5185\u5BB9\u4E86'
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
  },
  noMoreData: false
};

SwipeLoad.displayName = 'SwipeLoad';

exports.default = SwipeLoad;
module.exports = exports['default'];