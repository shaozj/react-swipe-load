'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

class SwipeLoad extends React.Component {
  componentDidMount() {
    const bottomNode = this.refs.bottomNode;
    // 计算底部提前加载距离
    if(!!bottomNode && !this.props.threshold) {
      // 默认滑到加载区2/3处时加载
      this._threshold = Math.floor(bottomNode.scrollHeight * 1/3);
    } else {
      this._threshold = this.props.threshold;
    }

    // 获取文档高度
    this._scrollContentHeight = document.body.scrollHeight;
    // 获取win显示区高度
    this._windowHeight = document.documentElement.clientHeight;

    this.autoLoad();
  }

  // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据
  autoLoad() {
    if(this.props.onBottomLoad && this.props.autoLoad) {
      if((this._scrollContentHeight - this._threshold) <= this._windowHeight) {
        this.loadDown();
      }
    }
  }

  // 加载底部更多内容
  loadDown() {
    this.props.onBottomLoad && this.props.onBottomLoad();
  }

  render() {
    const { children, onBottomLoad, bottomNode } = this.props;

    return (
      <div className="uniform-cpnt-SwipeLoad">
        {children}
        <div ref="bottomNode" className="sl-bottom-node">
        { // 如果需要底部加载，提前在下方插入 dom
          onBottomLoad ? bottomNode['pulling'] : '' // 上拉阶段
        }
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
  bottomNode: {
    pulling: <div>↑上拉加载更多</div>,
    loading: <div>上拉加载中...</div>,
    noData: <div>没有更多了</div>
  }
};

SwipeLoad.displayName = 'SwipeLoad';

export default SwipeLoad;
