'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import SwipeLoad from './index';
import './index.test.less';

const mockData = [
  {
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-09-14/c47d007485407d06fa4b84b10da3627d.jpg'
  }
];

const mockData2 = [
  {
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
  },{
    text: '测试数据测试数据测试数据',
    img: 'http://ykimg.alicdn.com/develop/image/2017-06-15/bccb7d17a4b1dbd378469be59ed4383d.jpg'
  }
];

class Test extends React.Component {

  onBottomLoad = () => {
    console.log('on bottom load');  // eslint-disable-line
  }

  render() {
    const porps = {
      onBottomLoad: this.onBottomLoad
    };

    return  <SwipeLoad {...porps}>
              {
                mockData.map((item, index) => (
                  <div className="item" key={index} href="#">
                    <h3>{item.text + '  ' +  index}</h3>
                    <img src={item.img} alt="" />
                  </div>
                ))
              }
            </SwipeLoad>;
  }
}

ReactDOM.render(<Test />, document.getElementById('app'));
