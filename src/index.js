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
      bottomState: 'normal' // 'normal', 'pull', 'loading', 'noData'
    };
  }

  componentDidMount() {
    this._scrollNode = document.body; // 写死滚动区域为 body
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

    on(scrollNode, 'touchmode', e => {
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

  onTouchstart() {

  }

  onTouchmove() {

  }

  onTouchend() {

  }

  // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据
  autoLoad() {
    // 滚动内容高度
    const scrollContentHeight = this._scrollNode.scrollHeight;
    if(this.props.onBottomLoad && this.props.autoLoad) {
      if((scrollContentHeight - this._threshold) <= this._windowHeight) {
        this.loadDown();
      }
    }
  }

  // 加载底部更多内容
  loadDown() {
    this.props.onBottomLoad && this.props.onBottomLoad();
  }

  render() {
    const { topState, bottomState } = this.state;
    const { children, topNode, bottomNode } = this.props;

    return (
      <div className="uniform-cpnt-SwipeLoad" ref="swipeLoadRoot">
        <div ref="topNode" className="sl-top-node">
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
  threshold: PropTypes.number, // 底部提前加载的距离
  topNode: PropTypes.object, // 页面顶部插入的节点，在不同状态下展示不同内容
  bottomNode: PropTypes.object, // 页面底部插入的节点
  autoLoad: PropTypes.bool // 数据不足一屏时是否自定加载
};

SwipeLoad.defaultProps = {
  autoLoad: true,
  threshold: 10,
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
