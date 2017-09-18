# ReactSwipeLoad

Support down swipe refresh & up swipe load more data.

## Introduction

### Develop

Depends on [silki](https://www.npmjs.com/package/silki)  

`npm install silki` or `npm install silki -g`

## How to use

see `src/index.test.js`

```javascript
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import SwipeLoad from './index';
import './index.test.less';

const mockData1 = [
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

  constructor(props) {
    super(props);

    this.state = {
      mockData: mockData1
    };
  }

  onBottomLoad = (SwipeLoad) => {
    console.log('on bottom load');  // eslint-disable-line
    setTimeout(() => {
      const mockData = mockData1.concat(mockData2);
      this.setState({ mockData });
      SwipeLoad.reset({ noMoreData : true });
    }, 500);
  }

  onTopRefresh = (SwipeLoad) => {
    console.log('on top refresh'); // eslint-disable-line
    // location.reload();
    setTimeout(() => SwipeLoad.reset({}), 1500);
  }

  render() {
    const { mockData } = this.state;
    const props = {
      onBottomLoad: this.onBottomLoad,
      onTopRefresh: this.onTopRefresh
    };

    return  <SwipeLoad {...props}>
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

```
