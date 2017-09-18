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
      bottomState: 'normal', // 'normal', 'pull', 'loading', 'noData'
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
    on(window, 'resize', () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 重新获取win显示区高度
        this._windowHeight = document.documentElement.clientHeight;
        this.autoLoad();
      }, 150);
    });

    // 监听触摸事件
    on(scrollNode, 'touchstart', e => {
      if (!this.loading) {
        this.onTouchstart(e);
      }
    });

    on(scrollNode, 'touchmove', e => {
      if (!this.loading) {
        this.onTouchmove(e);
      }
    });

    on(scrollNode, 'touchend', e => {
      if (!this.loading) {
        this.onTouchend(e);
      }
    });
  }

  onTouchstart(e) {
    const touch = e.changedTouches[0];
    this._startY = touch.clientY;
    // 滚动内容高度，不放在 onTouchmove 中计算，提高性能
    this._scrollHeight = this._scrollNode.scrollHeight;
  }

  onTouchmove(e) {
    const scrollTop = this._scrollNode.scrollTop; // 滚动距离
    const scrollHeight = this._scrollHeight; // 滚动内容高度
    const winHeight = this._windowHeight; // 窗口高度
    const touch = e.changedTouches[0];
    const curY = touch.clientY;
    const diffY = curY - this._startY;
    const absY = Math.abs(diffY);

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

  onTouchend(e) {
    const scrollTop = this._scrollNode.scrollTop; // 滚动距离
    const scrollHeight = this._scrollHeight; // 滚动内容高度
    const winHeight = this._windowHeight; // 窗口高度
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
        on(this._topNode, 'transitionend webkitTransitionEnd mozTransitionEnd', () => {
          this.setState({ topState: 'normal' });
        });
      }
    }
  }

  // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据
  autoLoad() {
    // 滚动内容高度
    const scrollContentHeight = this._scrollNode.scrollHeight;
    if(this.props.onBottomLoad && this.props.autoLoad) {
      if((scrollContentHeight - this.props.bottomThreshold) <= this._windowHeight) {
        this.loadDown();
      }
    }
  }

  // 加载底部更多内容
  loadDown() {
    this.props.onBottomLoad && this.props.onBottomLoad();
  }

  // 重置，下拉刷新后，需要重置状态
  reset() {
    this.loading = false;
    if (this._place = 'top') {
      const topDomHeight = 0;
      this.setState({ topDomHeight });
      on(this._topNode, 'transitionend webkitTransitionEnd mozTransitionEnd', () => {
        this.setState({ topState: 'normal' });
        // 去除动画
        this._topNode.style.transition = '';
        this._topNode.style.WebkitTransition = '';
        this._topNode.style.MozTransition = '';
      });
    } else {

    }
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
  autoLoad: PropTypes.bool // 数据不足一屏时是否自定加载
};

SwipeLoad.defaultProps = {
  autoLoad: true,
  topThreshold: 50,
  bottomThreshold: 10,
  bottomNode: {
    normal: '',
    pull: <div>↑上拉加载更多</div>,
    loading: <div>上拉加载中...</div>,
    noData: <div>没有更多了</div>
  },
  topNode: {
    normal: '',
    pull: <div>↓下拉刷新</div>,
    update: <div>↑释放更新</div>,
    loading: <div>加载中...</div>
  }
};

SwipeLoad.displayName = 'SwipeLoad';

export default SwipeLoad;
