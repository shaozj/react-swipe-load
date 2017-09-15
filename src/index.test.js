'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactSwipeLoad from './index';

class Test extends React.Component {
  render() {
    return <ReactSwipeLoad />;
  }
}

ReactDOM.render(<Test />, document.getElementById('app'));
