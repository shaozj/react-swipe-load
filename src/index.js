'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { on, off } from './event';
import './index.less';

class SwipeLoad extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topState: 'normal', // 'normal', 'pull', 'update', 'loading'
      bottomState: this.props.noMoreData ? 'normal' : 'pull', // 'normal', 'pull', 'loading', 'noMoreData'
      topDomHeight: 0 // 顶部下拉刷新节点的高度
    };
  }

  componentDidMount() {
    this._scrollNode = document.body; // 写死滚动区域为 body
    this._topNode = this.refs.topNode;
    this._bottomNode = this.refs.bottomNode;
    const scrollNode = this._scrollNode;

    // 获取win显示区高度
    this._windowHeight = document.documentElement.clientHeight;

    this.autoLoad();

    // 监听窗口调整
    on(window, 'resize', this.onWindowResize);

    // 监听触摸事件
    on(scrollNode, 'touchstart', this.onTouchstart);
    on(scrollNode, 'touchmove', this.onTouchmove);
    on(scrollNode, 'touchend', this.onTouchend);

    // 监听 scroll 事件，在 touch 事件中处理“上拉加载更多”不合理，在页面滚动到底部时可能不会触发加载
    on(window, 'scroll', this.onWinScroll);
  }

  componentWillUnmount() {
    const scrollNode = this._scrollNode;

    off(scrollNode, 'touchstart', this.onTouchstart);
    off(scrollNode, 'touchmove', this.onTouchmove);
    off(scrollNode, 'touchend', this.onTouchend);
    off(window, 'scroll', this.onWinScroll);
  }

  onWindowResize = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // 重新获取win显示区高度
      this._windowHeight = document.documentElement.clientHeight;
      this.autoLoad();
    }, 150);
  }

  // 监听窗口滚动事件，加载更多
  onWinScroll = () => {
    const scrollTop = this._scrollNode.scrollTop; // 滚动距离
    const scrollHeight = this._scrollNode.scrollHeight; // 滚动内容高度
    const winHeight = this._windowHeight; // 窗口高度
    // 上拉加载
    if (this.props.onBottomLoad &&
      !this.loading &&
      this.state.bottomState != 'noMoreData' &&
      (scrollTop + winHeight) > (scrollHeight - this.props.bottomThreshold))
    {
      this.loadBottom();
    }
  }

  onTouchstart = (e) => {
    if (this.loading) {
      return;
    }
    const touch = e.changedTouches[0];
    this._startY = touch.clientY;
  }

  onTouchmove = (e) => {
    if (this.loading) {
      return;
    }
    const scrollTop = this._scrollNode.scrollTop; // 滚动距离
    const touch = e.changedTouches[0];
    const curY = touch.clientY;
    const diffY = curY - this._startY;
    const absY = Math.abs(diffY);

    // 去除动画, 为了可以得到下来位移 this._offsetY, 不因为动画而只移动元素高度
    this._topNode.style.transition = '';
    this._topNode.style.WebkitTransition = '';
    this._topNode.style.MozTransition = '';

    // 下拉刷新
    if (diffY > 0 && scrollTop <= 0 && this.props.onTopRefresh) {
      e.preventDefault();
      if(absY <= this.props.topThreshold){
        this._offsetY = absY;
        this.setState({ topState: 'pull' });
      }
      // 指定距离 < 下拉距离 < 指定距离*2
      else if(absY > this.props.topThreshold && absY <= this.props.topThreshold * 2){
        this._offsetY = this.props.topThreshold + (absY - this.props.topThreshold) * 0.5;
        this.setState({ topState: 'update' });
      }
      // 下拉距离 > 指定距离*2
      else{
        this._offsetY = this.props.topThreshold + this.props.topThreshold * 0.5 + (absY - this.props.topThreshold * 2) * 0.2;
      }

      this.setState({ topDomHeight: this._offsetY });
    }
  }

  onTouchend = (e) => {
    if (this.loading) {
      return;
    }
    const scrollTop = this._scrollNode.scrollTop; // 滚动距离
    const touch = e.changedTouches[0];
    const curY = touch.clientY;
    const diffY = curY - this._startY;
    const absY = Math.abs(diffY);

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

      if(absY > this.props.topThreshold) {
        const topDomHeight = this._topNode.children[0] && this._topNode.children[0].clientHeight + 'px' || 0;
        this.setState({ topState: 'loading', topDomHeight });
        this.loading = true;
        this.props.onTopRefresh(this);
      } else {
        const topDomHeight = 0;
        this.setState({ topDomHeight });
      }
    }
  }

  // 上拉加载更多
  loadBottom() {
    this._place = 'bottom';
    this.loading = true;
    this.setState({ bottomState: 'loading' });
    this.props.onBottomLoad && this.props.onBottomLoad(this);
  }

  // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据
  autoLoad() {
    // 滚动内容高度
    const scrollContentHeight = this._scrollNode.scrollHeight;
    if(this.props.onBottomLoad && this.props.autoLoad) {
      if((scrollContentHeight - this.props.bottomThreshold) <= this._windowHeight) {
        this.loadBottom();
      }
    }
  }

  // 重置，下拉刷新后，需要重置状态
  reset({ noMoreData = false }) {
    if (this._place === 'top') {
      const topDomHeight = 0;
      this.setState({ topDomHeight });
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

  render() {
    const { topState, bottomState, topDomHeight } = this.state;
    const { children, topNode, bottomNode } = this.props;

    return (
      <div className="uniform-cpnt-SwipeLoad" ref="swipeLoadRoot">
        <div ref="topNode" className="sl-top-node" style={{ height: topDomHeight }}>
          { topNode[topState] }
        </div>
        {children}
        <div ref="bottomNode" className="sl-bottom-node">
          { bottomNode[bottomState] }
        </div>
      </div>
    );
  }
}

SwipeLoad.propTypes = {
  onTopRefresh: PropTypes.func, // 下拉刷新回调函数
  onBottomLoad: PropTypes.func, // 上拉加载回调函数
  topThreshold: PropTypes.number,  // 顶部下拉刷新的阈值距离
  bottomThreshold : PropTypes.number, // 底部提前加载的阈值距离
  topNode: PropTypes.object, // 页面顶部插入的节点，在不同状态下展示不同内容
  bottomNode: PropTypes.object, // 页面底部插入的节点
  autoLoad: PropTypes.bool, // 数据不足一屏时是否自定加载
  noMoreData: PropTypes.bool // 是否没有更多数据了
};

SwipeLoad.defaultProps = {
  autoLoad: true,
  topThreshold: 50,
  bottomThreshold: 30,
  bottomNode: {
    normal: '',
    pull: <div>↑上拉加载更多</div>,
    loading: <div>上拉加载中...</div>,
    noMoreData: <div>没有更多内容了</div>
  },
  topNode: {
    normal: '',
    pull: <div>↓下拉刷新</div>,
    update: <div>↑释放更新</div>,
    loading: <div>加载中...</div>
  },
  noMoreData: false
};

SwipeLoad.displayName = 'SwipeLoad';

export default SwipeLoad;
